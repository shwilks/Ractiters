
RacTiter.RacPlot.prototype.load_lineplot = function(
  titerdata, 
  ag_sequences,
  ordering
  ) {

  // Show options divs
  this.srgroupdiv.style.display = "block";
  this.optionsdiv.style.display = "block";

  // Store titer data
  this.titerdata = titerdata;

  // Fetch all serum groups
  this.sr_name = titerdata.map(x => x.sr_name);
  this.sr_groups = titerdata.map(x => x.sr_group);
  this.sr_group_cols = titerdata.map(x => x.sr_group_cols);
  this.ag_name = titerdata.map(x => x.ag_name);
  this.ag_cols = titerdata.map(x => x.ag_col);
  
  this.set_sr_names = [...new Set(this.sr_name)];
  this.set_sr_name_groups = this.set_sr_names.map(x => this.sr_groups[this.sr_name.indexOf(x)]);

  this.set_sr_groups = ordering.sr_groups;
  this.set_sr_group_cols = this.set_sr_groups.map(x => this.sr_group_cols[this.sr_groups.indexOf(x)]);

  this.set_ag_names = ordering.ags;
  this.set_ag_cols = this.set_ag_names.map(x => this.ag_cols[this.ag_name.indexOf(x)]);

  // Set serum group selections
  this.sr_group_selections = [];


  // Populate serum groups selector
  this.set_sr_groups.map((sr_group, i) => {

    let sr_group_box = document.createElement("div");
    sr_group_box.innerHTML = sr_group;
    sr_group_box.style.borderLeft = "solid 14px "+this.set_sr_group_cols[i];
    sr_group_box.style.paddingLeft = "8px";
    sr_group_box.style.marginBottom = "2px";
    sr_group_box.style.cursor = "pointer";

    // For toggling selections
    sr_group_box.addEventListener("mouseup", e => {
      
      let sr_group = e.target.innerHTML;
      if (this.sr_group_selections.indexOf(sr_group) == -1) {
        this.sr_group_selections.push(sr_group);
      } else {
        this.sr_group_selections = this.sr_group_selections.filter(x => x !== sr_group);
      }
      this.updateSrGroupSelections();
      this.updatePlot();
      
    });

    this.srgroupdiv.appendChild(
      sr_group_box
    );

  });

  // Update the plot
  this.updatePlot();

};

RacTiter.RacPlot.prototype.updateSrGroupSelections = function() {

  this.set_sr_groups.map((x, i) => {

    if (this.sr_group_selections.indexOf(x) == -1) {
      this.srgroupdiv.children[i].style.backgroundColor = "transparent";
    } else {
      this.srgroupdiv.children[i].style.backgroundColor = "#eeeeee";
    }

  });

  // Update selections
  if (this.sr_group_selections.length == 0) {
    this.selections = this.set_sr_names;
  } else {
    this.selections = this.set_sr_names.filter((x, i) => this.sr_group_selections.indexOf(this.set_sr_name_groups[i]) !== -1);
  }

  // Fire selection event
  this.onSelectSr();

};

RacTiter.RacPlot.prototype.updatePlot = function() {

  // Set configuration
  let config = {
    displayModeBar: false
  };

  // Filter included data
  let included_data;
  if (this.selections === undefined) {
    included_data = this.titerdata.slice();
  } else {
    included_data = this.titerdata.filter(x => this.selections.indexOf(x.sr_name) !== -1);
  }
  let included_ags = [...new Set(included_data.map(x => x.ag_name))];
  let included_sr = [...new Set(included_data.map(x => x.sr_name))];
  
  // Filter on antigens titrated against all selected groups
  if (this.only_common_ags) {
    if (this.selections !== undefined) {
      if (this.sr_group_selections.length > 0) {
        let included_ags_n_sr_groups = included_ags.map(ag_name => {
          let datasubset = included_data.filter(x => x.ag_name == ag_name);
          let ag_sr_groups = [...new Set(datasubset.map(x => x.sr_group))];
          return(ag_sr_groups.length);
        });
        included_ags = included_ags.filter((x, i) => included_ags_n_sr_groups[i] == this.sr_group_selections.length);
        included_data = included_data.filter(x => included_ags.indexOf(x.ag_name) !== -1);
      }
    } else {
      // let included_ags_n_sr = included_ags.map(ag_name => {
      //   let datasubset = included_data.filter(x => x.ag_name == ag_name);
      //   let ag_sr_names = [...new Set(datasubset.map(x => x.sr_name))];
      //   return(ag_sr_names.length);
      // });
      // included_ags = included_ags.filter((x, i) => included_ags_n_sr[i] == this.selections.length);
      // included_data = included_data.filter(x => included_ags.indexOf(x.ag_name) !== -1);
    }
  }

  // Reorder included antigens
  included_ags = this.set_ag_names.filter(x => included_ags.indexOf(x) !== -1);

  // Resize plot width
  this.plotdiv.style.width = (100 + 24*included_ags.length)+"px";

  // Set axis labels
  let yrange;
  let yvals;
  let ylabels;

  yrange = [0, 16];
  yvals = [];
  ylabels = [];
  for (var i = yrange[0]; i <= yrange[1]; i++) {
    yvals.push(i);
    ylabels.push((Math.pow(2, i)*10).toFixed(0));
  }
  ylabels[yvals.indexOf(0)] = "<20";


  // Set layout
  let layout = {
    xaxis: {
      title: {
        text: 'Antigen',
        standoff: 2000,
        font: {
          family: 'sans-serif',
          size: 18,
          color: '#7f7f7f'
        }
      },
      zeroline: false,
      fixedrange: true,
      linecolor: '#cccccc',
      categoryorder: "array",
      categoryarray: included_ags,
      automargin: false,
      tickangle: 90,
      range: [-0.5, included_ags.length - 0.5]
    },
    yaxis: {
      title: {
        text: 'Titer',
        font: {
          family: 'sans-serif',
          size: 18,
          color: '#7f7f7f'
        }
      },
      zeroline: false,
      fixedrange: true,
      linecolor: '#cccccc',
      tickmode: 'array',
      tickvals: yvals,
      ticktext: ylabels,
      range: [yrange[0]-0.5, yrange[1]+0.5]
    },
    margin: {
      l: 80,
      b: 180,
      r: 20,
      t: 40
    }
  };

  // Create traces
  let data = included_sr.map(sr_name => {
    
    // Work out opacity
    let opacity;
    let opacityhex;
    let opacityhex_ci;
    if (this.highlight === undefined) {
      opacity = 0.6;
      opacityhex = "66";
      opacityhex_ci = "22";
    } else {
      if (this.highlight.indexOf(sr_name) !== -1) {
        opacity = 1;
        opacityhex = "FF";
        opacityhex_ci = "44";
      } else {
        opacity = 0.1;
        opacityhex = "22";
        opacityhex_ci = "09";
      }
    }

    let serum_data = included_data.filter(x => x.sr_name == sr_name);
    serum_data.sort((a, b) => included_ags.indexOf(a.ag_name) - included_ags.indexOf(b.ag_name));

    let ag_names = serum_data.map(x => x.ag_name);
    let lessthans = serum_data.map(x => x.titer !== undefined && x.titer.substring(0,1) == "<");
    let fillcols = serum_data.map((x, i) => !lessthans[i] ? x.sr_col : "transparent");
    let outlinecols = serum_data.map((x, i) => !lessthans[i] ? "transparent" : x.sr_col);
    
    let logtiters;
    if (this.impute_nds) {
      logtiters = serum_data.map(x => x.imputed_logtiter);
    } else {
      logtiters = serum_data.map(x => x.logtiter);
    }
    if (this.remove_individual_effects) {
      logtiters = logtiters.map(x => x - serum_data[0].sr_individual_effect);
    }

    let linetrace = {
      x: ag_names,
      y: logtiters,
      sr_name: serum_data[0].sr_name,
      name: serum_data[0].sr_name + " (" + serum_data[0].sr_group + ")",
      hoverinfo: "name",
      mode: "lines+markers",
      type: "scatter",
      marker: {
        color: fillcols,
        opacity: opacity,
        line: {
          color: outlinecols,
          width: 2
        }
      },
      line: {
        color: RacTiter.Utils.SetOpacity(serum_data[0].sr_col, opacityhex)
      },
      showlegend: false
    };

    if (serum_data[0].logtiter_upper !== undefined) {

      let logtiters_lower;
      let logtiters_upper;

      switch(this.titertype) {
        case "no_ie":     logtiters_upper = serum_data.map(x => x.logtiter_upper_no_ie);     break;
        case "no_ie_gmt": logtiters_upper = serum_data.map(x => x.logtiter_upper_no_ie_gmt); break;
        default:          logtiters_upper = serum_data.map(x => x.logtiter_upper);           break;
      }

      switch(this.titertype) {
        case "no_ie":     logtiters_lower = serum_data.map(x => x.logtiter_lower_no_ie);     break;
        case "no_ie_gmt": logtiters_lower = serum_data.map(x => x.logtiter_lower_no_ie_gmt); break;
        default:          logtiters_lower = serum_data.map(x => x.logtiter_lower);           break;
      }

      let citrace_lower = {
        x: ag_names,
        y: logtiters_lower,
        name: serum_data[0].sr_name,
        hoverinfo: "none",
        type: "scatter",
        line: {
          color: "transparent"
        },
        showlegend: false
      }

      let citrace_upper = {
        x: ag_names,
        y: logtiters_upper,
        name: serum_data[0].sr_name,
        hoverinfo: "none",
        fill: "tonexty",
        fillcolor: RacTiter.Utils.SetOpacity(serum_data[0].sr_col, opacityhex_ci),
        type: "scatter",
        line: {
          color: "transparent"
        },
        showlegend: false
      }

      return([citrace_lower, citrace_upper, linetrace]);

    } else {

      return([linetrace]);

    }


  })

  // Flatten the data traces
  data = data.flat(1);

  // Add colored lines for the axis labels
  let ag_lines = included_ags.map(ag_name => {
    
    return({
      x: [ag_name, ag_name],
      y: [yrange[0]-0.5, yrange[0]-0.2],
      mode: "lines",
      name: "annotation",
      hoverinfo: "none",
      line: {
        color: this.set_ag_cols[this.set_ag_names.indexOf(ag_name)]+"AA",
        width: 24
      },
      showlegend: false
    })

  });

  Plotly.newPlot(this.plotdiv, data.concat(ag_lines), layout, config);
  this.setEvents();

}

RacTiter.RacPlot.prototype.selectSera = function(selections, fire_handler = true) {

  this.selections = selections;
  this.updatePlot();
  if (fire_handler) this.onSelectSr();

}

RacTiter.RacPlot.prototype.highlightSera = function(highlight, fire_handler = true) {

  this.highlight = highlight;
  this.updatePlot();
  if (fire_handler) this.onHighlightSr();

}

RacTiter.RacPlot.prototype.dehighlightSera = function() {

  this.highlight = undefined;
  this.updatePlot();

}

RacTiter.RacPlot.prototype.setEvents = function() {

  // Set a click event handler
  this.plotdiv.on('plotly_click', data => {
    this.highlightSera([data.points[0].data.sr_name]);
  });

  // Add click on background event listener
  this.plotdiv.on('plotly_doubleclick', () => {
    this.dehighlightSera();
  });

}

RacTiter.Utils = {};
RacTiter.Utils.SetOpacity = function(x, opacity) {

  if (x !== undefined && x !== "transparent") {
    x = x.substring(0, 7) + opacity
  }
  return(x);

};

RacTiter.RacPlot.prototype.onHighlightSr = function() {};
RacTiter.RacPlot.prototype.onSelectSr = function() {};

