
#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
RacTiter <- function(
    titerdata,
    ag_order,
    ag_sequences = NULL,
    mode = "lineplot",
    width = NULL,
    height = NULL,
    elementId = NULL
  ) {

  # Process data
  titerdata <- dplyr::filter(titerdata, !is.na(logtiter))
  titerdata$ag_col <- gplots::col2hex(titerdata$ag_col)
  titerdata$sr_col <- gplots::col2hex(titerdata$sr_col)
  titerdata$ag_group_cols <- gplots::col2hex(titerdata$ag_group_cols)
  titerdata$sr_group_cols <- gplots::col2hex(titerdata$sr_group_cols)

  # forward options using x
  x = list(
    titerdata = jsonlite::toJSON(titerdata),
    ag_sequences = ag_sequences,
    mode = mode,
    ordering = list(
      ags = ag_order,
      sr_groups = levels(droplevels(titerdata$sr_group))
    )
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'RacTiter',
    x,
    width = width,
    height = height,
    package = 'Ractiters',
    elementId = elementId
  )

}

#' Shiny bindings for RacTiter
#'
#' Output and render functions for using RacTiter within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a RacTiter
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name RacTiter-shiny
#'
#' @export
RacTiterOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'RacTiter', width, height, package = 'Ractiters')
}

#' @rdname RacTiter-shiny
#' @export
renderRacTiter <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, RacTiterOutput, env, quoted = TRUE)
}
