
# Function to export a viewer widget instance as a plot to the testoutput folder
# it also replaces library paths in each file to match library paths in the
# package to help with debugging
export.plot.test <- function(widget, filename, widgetname = "RacTiter") {

  rootdir <- testthat::test_path("../testoutput/plots")
  testfile <- file.path(normalizePath(rootdir), filename)

  htmlwidgets::saveWidget(
    widget,
    file          = testfile,
    selfcontained = FALSE,
    libdir        = ".lib"
  )

  unlink(
    file.path(rootdir, paste0(".lib/", widgetname, "-1.0.0")),
    recursive = T
  )

  plotdata <- readLines(testfile)
  if (widgetname == "RacTiter") {
    plotdata <- gsub(
      pattern     = paste0(".lib/", widgetname, "-1.0.0/"),
      replacement = paste0("../../../inst/htmlwidgets/", widgetname, "/lib/"),
      x           = plotdata,
      fixed       = TRUE
    )
  } else {
    plotdata <- gsub(
      pattern     = paste0(".lib/", widgetname, "-1.0.0/"),
      replacement = paste0("../../../inst/htmlwidgets/"),
      x           = plotdata,
      fixed       = TRUE
    )
  }
  writeLines(plotdata, testfile)

  # Add a test to check plot was outputted correctly
  testthat::expect_true(file.exists(testfile))

}
