
library(Racmacs)
library(tidyverse)
library(testthat)

test_that("Clearing test output", {
  testoutput_dir <- test_path(file.path("..", "testoutput"))
  unlink(testoutput_dir, recursive = T)
  dir.create(testoutput_dir, showWarnings = FALSE)
  plots_output_dir <- file.path(testoutput_dir, "plots")
  dir.create(plots_output_dir, showWarnings = FALSE)
  expect_equal(length(list.files(plots_output_dir)), 0)
})

# Read in data
map <- read.acmap("../../publications/in review/duke-sars2-cartography-paper/resubmission/data/maps/map_full_no_outliers.ace")

# Collapse serum groups
srGroups(map) <- forcats::fct_collapse(
  srGroups(map),
  "B.1.617.2" = c("B.1.617.2", "B.1.617.2 (AY.12)", "B.1.617.2 (AY.7.1)", "B.1.617.2 new")
)

mapdata <- covutils::long_map_list_info(list(monte = map))

# Calculate individual effects
mapdata %>% covutils::longinfo_estimate_individual_effects() -> mapdata

mapdata %>%
  distinct(
    ag_name, ag_col, ag_group_cols
  ) -> ag_info

mapdata %>%
  distinct(
    sr_group, sr_col, sr_group_cols
  ) -> sr_info

mapdata %>%
  group_by(
    sr_group, ag_name
  ) %>%
  acutils::summarise_gmt(
    dilution_stepsize = 0
  ) %>%
  rename(
    logtiter = gmt,
    logtiter_upper = gmt_upper,
    logtiter_lower = gmt_lower
  ) %>%
  mutate(
    sr_name = as.character(sr_group)
  ) %>%
  left_join(ag_info, by = "ag_name") %>%
  left_join(sr_info, by = "sr_group") -> mapdata_summary

# Impute nd titers
impute_titers <- function(titers) titertools:::impute_gmt_titers(titertools::gmt(titers, ci_method = "quap"), titers)
mapdata %>%
  group_by(
    sr_group, ag_name
  ) %>%
  group_modify(
    ~ .x %>%
      mutate(
        imputed_titer = titer %>%
          Racmacs:::reactivity_adjust_titers(-sr_individual_effect) %>%
          impute_titers() %>%
          Racmacs:::reactivity_adjust_titers(sr_individual_effect)
      )
  ) %>%
  mutate(
    imputed_logtiter = acutils::log_titers(imputed_titer, unique(dilution_stepsize))
  ) %>%
  ungroup() -> mapdata

test_that("plotting titers", {

  export.plot.test(
    RacTiter(mapdata, ag_order = agNames(map)),
    "sr_titers.html"
  )

})

test_that("plotting sr group averages", {

  export.plot.test(
    RacTiter(mapdata_summary, ag_order = agNames(map)),
    "sr_group_titers.html"
  )

})

test_that("plotting sr group averages", {

  export.plot.test(
    RacTiter(
      titerdata = mapdata,
      ag_order = agNames(map),
      ag_sequences = list(
        positions = colnames(agSequences(map)),
        sequences = agSequences(map)
      ),
      mode = "scatterplot"
    ),
    "rac_scatterplot.html"
  )

})


