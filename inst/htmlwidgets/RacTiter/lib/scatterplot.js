
RacTiter.RacPlot.prototype.load_scatterplot = function(
  titerdata, 
  ag_sequences,
  ordering
  ) {

  // Store titer data
  this.titerdata = titerdata;
  this.ag_sequences = ag_sequences;

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
  this.ag_name_box1 = document.createElement("div");
  this.ag_name_box2 = document.createElement("div");
  this.ag_name_box1.style.display = "inline-block";
  this.ag_name_box2.style.display = "inline-block";
  this.ag_name_box1.style.marginRight = "20px";
  this.ag_name_box2.style.marginRight = "20px";
  this.agdiv.appendChild(this.ag_name_box1);
  this.agdiv.appendChild(this.ag_name_box2);

  this.agdivs = [this.ag_name_box1, this.ag_name_box2];
  this.ag_name_selections = [];

  this.set_ag_names.map((ag_name, i) => {  

    let ag_name_box = document.createElement("div");
    ag_name_box.innerHTML = ag_name;
    ag_name_box.style.borderLeft = "solid 14px "+this.set_ag_cols[i];
    ag_name_box.style.paddingLeft = "8px";
    ag_name_box.style.marginBottom = "2px";
    ag_name_box.style.cursor = "pointer";  
    
    // For toggling selections
    ag_name_box.addEventListener("mouseup", e => {
      
      let ag_name = e.target.innerHTML;
      this.ag_name_selections[0] = ag_name;
      this.updateAgSelections();
      this.updateScatterPlot();
      this.updateSequenceComparison();
      
    });  

    this.agdivs[0].appendChild(ag_name_box);  

  });

  this.set_ag_names.map((ag_name, i) => {  

    let ag_name_box = document.createElement("div");
    ag_name_box.innerHTML = ag_name;
    ag_name_box.style.borderLeft = "solid 14px "+this.set_ag_cols[i];
    ag_name_box.style.paddingLeft = "8px";
    ag_name_box.style.marginBottom = "2px";
    ag_name_box.style.cursor = "pointer";  
    
    // For toggling selections
    ag_name_box.addEventListener("mouseup", e => {
      
      let ag_name = e.target.innerHTML;
      this.ag_name_selections[1] = ag_name;
      this.updateAgSelections();
      this.updateScatterPlot();
  	  this.updateSequenceComparison();
      
    });  

    this.agdivs[1].appendChild(ag_name_box);  

  });

  // Update the plot
  this.updateScatterPlot();

};

RacTiter.RacPlot.prototype.updateSequenceComparison = function() {

	if (this.ag_name_selections[0] === undefined | 
	  this.ag_name_selections[1] === undefined) {
	  return(null);
	}

	let ag1seq = this.ag_sequences.sequences[this.set_ag_names.indexOf(this.ag_name_selections[0])];
	let ag2seq = this.ag_sequences.sequences[this.set_ag_names.indexOf(this.ag_name_selections[1])];

	let seq_pos_row = document.createElement("tr");
	let ag1_row = document.createElement("tr");
	let ag2_row = document.createElement("tr");

	let create_cell = function(){
		let cell = document.createElement("td");
		cell.style.border = "solid 1px #cccccc";
		cell.style.padding = "0";
		return(cell);
	}

	let ag1_name_cell = create_cell();
	let ag2_name_cell = create_cell();

	let ag1_name = document.createElement("div");
	let ag2_name = document.createElement("div");

	ag1_name.style.padding = "4px";
	ag2_name.style.padding = "4px";
	ag1_name.style.paddingRight = "8px";
	ag2_name.style.paddingRight = "8px";

	ag1_name.style.borderRight = "solid 8px "+this.set_ag_cols[this.set_ag_names.indexOf(this.ag_name_selections[0])];
	ag2_name.style.borderRight = "solid 8px "+this.set_ag_cols[this.set_ag_names.indexOf(this.ag_name_selections[1])];

	ag1_name.innerHTML = this.ag_name_selections[0];
	ag2_name.innerHTML = this.ag_name_selections[1];

	ag1_name_cell.appendChild(ag1_name);
	ag2_name_cell.appendChild(ag2_name);

	seq_pos_row.appendChild(create_cell())
	ag1_row.appendChild(ag1_name_cell);
	ag2_row.appendChild(ag2_name_cell);

	for (var i=0; i<ag1seq.length; i++) {

		if (ag1seq[i] !== ag2seq[i]) {

			let pos_cell = create_cell();
			let ag1_cell = create_cell();
			let ag2_cell = create_cell();
			seq_pos_row.appendChild(pos_cell);
			ag1_row.appendChild(ag1_cell);
			ag2_row.appendChild(ag2_cell);

			let pos_div = document.createElement("div");
			let ag1_div = document.createElement("div");
			let ag2_div = document.createElement("div");
			pos_cell.appendChild(pos_div);

			pos_div.style.width = "12px";
			pos_div.style.padding = "4px";
			pos_div.style.paddingTop = "14px";
			pos_div.style.paddingBottom = "8px";
			pos_div.style.float = "left";
			pos_div.style.textAlign = "center";
			pos_div.style.writingMode = "vertical-rl";

			ag1_cell.style.textAlign = "center";
			ag2_cell.style.textAlign = "center";

			ag1_cell.style.padding = "4px";
			ag2_cell.style.padding = "4px";

			pos_div.innerHTML = this.ag_sequences.positions[i];
			ag1_cell.innerHTML = ag1seq[i];
			ag2_cell.innerHTML = ag2seq[i];

		}

	}

	let seq_table = document.createElement("table");
	seq_table.style.borderCollapse = "collapse";
	seq_table.style.marginTop = "40px";
	seq_table.appendChild(seq_pos_row);
	seq_table.appendChild(ag1_row);
	seq_table.appendChild(ag2_row);

	this.seqdiv.innerHTML = "";
	this.seqdiv.appendChild(seq_table);

}

RacTiter.RacPlot.prototype.updateScatterPlot = function() {

  if (this.ag_name_selections[0] === undefined | 
  	this.ag_name_selections[1] === undefined) {
  	return(null);
  }

  // Filter included data
  included_data = this.titerdata.filter(x => x.ag_name == this.ag_name_selections[0] || x.ag_name == this.ag_name_selections[1]);
  included_sr_groups = [...new Set(included_data.map(x => x.sr_group))];

  // Reorder included sera groups
  included_sr_groups.sort((a, b) => {
  	return(this.set_sr_groups.indexOf(a) - this.set_sr_groups.indexOf(b));
  });

  // Set limits
  let xmin = -1;
  let ymin = -1;
  let xmax = 15;
  let ymax = 15;

  // Set configuration
  let config = {
    displayModeBar: false
  };

  let tickvals = Array(xmax + 2).fill(0).map((x, i) => i-1);
  let ticktext = tickvals.map(i => (Math.pow(2, i)*10).toFixed(0));

  // Set layout
  let layout = {
  	grid: {
	  rows: 1,
	  pattern: 'coupled'
	},
    yaxis: {
      title: {
        text: this.ag_name_selections[1],
        font: {
          family: 'sans-serif',
          size: 12,
          color: '#7f7f7f'
        }
      },
      zeroline: false,
      fixedrange: true,
      linecolor: 'transparent',
      tickmode: 'array',
      tickvals: tickvals,
      ticktext: ticktext,
      tickfont: {size: 9},
      range: [ymin - 0.5, ymax + 0.5]
    },
    margin: {
      l: 50,
      b: 50,
      r: 40,
      t: 30
    }
  };

  // Generate trace for each serum group
  let data = [];
  let annotations = [];
  let axisnum = 0;
  included_sr_groups.map((sr_group, i) => {

	  // Filter by serum group
	  srgroup_data = included_data.filter(x => x.sr_group == sr_group);
	  let included_sr = [...new Set(srgroup_data.map(x => x.sr_name))];

	  let x = included_sr.map(sr_name => {
	  	let titerdata = srgroup_data.filter(x => x.sr_name == sr_name && x.ag_name == this.ag_name_selections[0]);
	  	if (titerdata.length == 0) return(null);
	  	else                       return(titerdata[0].logtiter);
	  });
	  
	  let y = included_sr.map(sr_name => {
	  	let titerdata = srgroup_data.filter(x => x.sr_name == sr_name && x.ag_name == this.ag_name_selections[1]);
	  	if (titerdata.length == 0) return(null);
	  	else                       return(titerdata[0].logtiter);
	  });

	  // Check we have some non-null values to plot
	  if (x.filter(x => x !== null).length == 0 ||
	  	y.filter(x => x !== null).length == 0) {
	  	return(null);
	  }

	  // Add x axis
	  axisnum++;
	  let axisname = "xaxis"+axisnum;
	  layout[axisname] = {
	    title: {
	      text: this.ag_name_selections[0],
	      font: {
	        family: 'sans-serif',
	        size: 12,
	        color: '#7f7f7f'
	      }
	    },
	    zeroline: false,
	    fixedrange: true,
	    linecolor: 'transparent',
	    automargin: false,
	    tickangle: 90,
	    tickmode: 'array',
	    tickvals: tickvals,
	    ticktext: ticktext,
	    tickfont: {size: 9},
	    range: [xmin - 0.5, xmax + 0.5]
	  }

	  // Create x = y line
	  var xyline = {
		x: [xmin, xmax],
		y: [ymin, ymax],
		xaxis: 'x'+axisnum,
		yaxis: 'y',
		mode: 'lines',
		type: 'scatter',
		showlegend: false,
		line: {
		  color: "#cccccc",
		  dash: "dash",
		  width: 1
		}
	  };
	  data.push(xyline);

	  // Create border
	  let padding = 0.5;
	  var border = {
		x: [xmin-padding, xmax+padding, xmax+padding, xmin-padding, xmin-padding],
		y: [ymin-padding, ymin-padding, ymax+padding, ymax+padding, ymin-padding],
		xaxis: 'x'+axisnum,
		yaxis: 'y',
		mode: 'lines',
		type: 'scatter',
		showlegend: false,
		line: {
		  color: "#eeeeee",
		  width: 4
		}
	  };
	  data.push(border);

	  // Create traces
	  var scatterpoints = {
		x: x,
		y: y,
		xaxis: 'x'+axisnum,
		yaxis: 'y',
		mode: 'markers',
		type: 'scatter',
		showlegend: false,
		hoverinfo: "text",
		hovertext: included_sr,
		marker: {
		  color: this.set_sr_group_cols[
		    this.set_sr_groups.indexOf(sr_group)
		  ],
		  opacity: 0.5,
		  size: 6
		}
	  };
	  data.push(scatterpoints);

	  // Add annotation
	  annotations.push({
	  	xref: 'x'+axisnum,
	    yref: 'y',
	    x: xmin,
	    y: ymax + padding,
	    xanchor: 'left',
	    yanchor: 'bottom',
	    text: sr_group,
	    showarrow: false
	  });

  });

  // Add annotations
  layout.annotations = annotations;

  // Resize plot
  layout.grid.columns = axisnum;
  this.plotdiv.style.height = "280px";
  this.plotdiv.style.width = (90 + 200*axisnum - 20)+"px";

  // Update the new plot
  Plotly.newPlot(this.plotdiv, data, layout, config);


}


RacTiter.RacPlot.prototype.updateAgSelections = function() {
  	
	for (var i=0; i<2; i++) {

	  this.set_ag_names.map((x, j) => {

	    if (x == this.ag_name_selections[i]) {
	      this.agdivs[i].children[j].style.backgroundColor = "#eeeeee";
	    } else {
	      this.agdivs[i].children[j].style.backgroundColor = "transparent";
	    }

	  });

	}

};



