
theme_acplot <- function() {
  ggplot2::theme(
    axis.text.x = ggplot2::element_text(angle = 90, hjust = 1, vjust = 0.5),
    panel.background = ggplot2::element_rect(fill = "white"),
    panel.border = ggplot2::element_rect(fill = NA, colour = "grey80"),
    panel.grid.major = ggplot2::element_line(colour = "grey95"),
    panel.grid.minor = ggplot2::element_blank()
  )
}
