
removeSrEffects <- function(titers, impute_nd_titers = TRUE) {

  # Calculate serum effects
  sr_effects_fit <- titertools::estimate_sr_effects(titers)
  sr_effects_matrix <- matrix(
    sr_effects_fit[sprintf("sr_effects[%s]", seq_len(ncol(titers))), "estimate"],
    nrow = nrow(titers),
    ncol = ncol(titers),
    byrow = T
  )

  # Remove serum effects from titers
  titers[] <- Racmacs:::reactivity_adjust_titers(
    titers,
    -sr_effects_matrix
  )

  # Impute the < titers
  if (impute_nd_titers) {
    titers <- do.call(cbind, apply(titers, 2, impute_titers, simplify = F))
  }

  # Return the titers
  titers

}

srIndividualEffects <- function(map) {

  # Get unique serum groups
  sr_groups <- unique(sort(srGroups(map)))

  # Fit results
  result <- lapply(sr_groups, function(sr_group_subset) {

    # Get the serum subset
    sr_subset <- srGroups(map) == sr_group_subset

    # Perform the fit
    fit <- titertools::estimate_sr_effects(
      titers = titerTable(map)[, sr_subset, drop = FALSE]
    )

    # Get serum effect
    sr_effects <- fit[sprintf("sr_effects[%s]", seq_along(which(sr_subset))), , drop = F]
    rownames(sr_effects) <- srNames(map)[sr_subset]

    # Get antigen GMTs
    ag_gmts <- fit[sprintf("ag_means[%s]", seq_along(agNames(map))), , drop = F]
    rownames(ag_gmts) <- agNames(map)

    # Return the results
    list(
      sr_effects = sr_effects,
      ag_gmts = ag_gmts,
      sigma = fit["sd",]
    )

  })

  # Name and return output
  names(result) <- sr_groups
  result

}

