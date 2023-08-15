
log2foldchange <- function(x) {

  xabs <- abs(x)
  foldchange <- 2^xabs
  foldchange[x < 0] <- -foldchange[x < 0]
  as.character(round(foldchange, 1))

}

foldchange <- function(x) {

  xabs <- abs(x)
  foldchange <- 2^xabs
  foldchange[x < 0] <- -foldchange[x < 0]
  as.character(round(foldchange, 1))

}

scale_x_titer <- function(
    xmin = NULL,
    xmax = NULL,
    ...
) {

  scale_x_continuous(
    breaks = function(x) {
      if (is.null(xmin)) xmin <- ceiling(min(x))
      if (is.null(xmax)) xmax <- floor(max(x))
      xmin:xmax
    },
    labels = function(x) {
      output <- 2^x*10
      # output[x == logthreshold] <- threshold
      output
    },
    minor_breaks = NULL
  )

}

scale_y_titer <- function(
    ymin = NULL,
    ymax = NULL,
    ...
) {

  scale_y_continuous(
    breaks = function(x) {
      if (is.null(ymin)) ymin <- ceiling(min(x))
      if (is.null(ymax)) ymax <- floor(max(x))
      ymin:ymax
    },
    labels = function(x) {
      output <- 2^x*10
      # output[x == logthreshold] <- threshold
      output
    },
    minor_breaks = NULL,
    ...
  )

}
