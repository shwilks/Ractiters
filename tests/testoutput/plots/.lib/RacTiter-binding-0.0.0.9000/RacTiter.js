
HTMLWidgets.widget({

  name: 'RacTiter',

  type: 'output',

  factory: function(el, width, height) {

    // Create an empty viewer object
    var plot = new RacTiter.RacPlot(el);

    return {

      renderValue: function(x) {

        // var titerdata = JSON.parse(x.titerdata);
        plot.load(
          x.titerdata,
          x.ag_sequences,
          x.ordering,
          x.mode
        );

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
