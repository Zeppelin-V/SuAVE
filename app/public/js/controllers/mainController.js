function MainController()
{
// bind event listeners to button clicks //
	var that = this;
	google.charts.load("current", {packages:['corechart', 'geochart']});

	var chart;

	// Wait for the chart to finish drawing before calling the getImageURI() method.
	$(document).on('click', '#download', function(){
		//window.open(chart.getImageURI(), 'Download');
		window.open(chart.getImageURI(), "_blank")
	});

  $(document).on('click', '#comment', function(){
		var graphPara = document.getElementById('pivot_window').contentWindow.graphPara;

		if(graphPara.view == "bucket"){
			chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
			var dat = [];
			dat.push([graphPara.x, "Count"]);

			for(var i = 0; i <graphPara.xData.length; i++){
				dat.push(graphPara.xData[i]);
			}

			google.charts.setOnLoadCallback(drawChart);
			function drawChart() {
				var data = google.visualization.arrayToDataTable(dat);

				var view = new google.visualization.DataView(data);
				view.setColumns([0, 1,
												 { calc: "stringify",
													 sourceColumn: 1,
													 type: "string",
													 role: "annotation" }]);

				var options = {
					width: 450,
					height: 300,
					bar: {groupWidth: "95%"},
					legend: { position: "none" },
					hAxis: {
	        	direction:1,
	        	slantedText:true,
	        	slantedTextAngle:30
	    		}
				};
				chart.draw(view, options);
			}
		}else if(graphPara.view == "crosstab"){
			chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));

			var dat = [];
			dat.push(["ID", graphPara.x, graphPara.y, "Paras", "Count"]);
			var xLabels = [];
			var yLabels = [];
			for(var i = 0; i < graphPara.xSize; i++){
				for(var j = 0; j < graphPara.ySize; j++ ){
					var cell = graphPara.yData[j+graphPara.ySize*i];
					if(cell[2] != 0){
						dat.push([cell[2].toString(), i+1, j+1, cell[0]+" vs "+cell[1], cell[2]])
					}

				}
			}

			for(var i = 0; i < graphPara.ySize; i++){
				var temp = {};
				temp.v = i+1;
				temp.f = graphPara.yData[i][1];
				yLabels.push(temp);
			}

			for(var i = 0; i < graphPara.xSize; i++){
				var temp = {};
				temp.v = i+1;
				temp.f = graphPara.yData[i*graphPara.ySize][0];
				xLabels.push(temp);
			}

			google.charts.setOnLoadCallback(drawSeriesChart);

			function drawSeriesChart() {

	      var data = google.visualization.arrayToDataTable(dat);

	      var options = {
					width: 450,
					height: 300,
					sizeAxis: {minValue: 1, maxSize: 15},
					bar: {groupWidth: "95%"},
					legend: { position: "none" },
	        //hAxis: {title: graphPara.x, maxValue: graphPara.xSize, format: '0'},
	        //vAxis: {title: graphPara.y, maxValue: graphPara.ySize, format: '0'}
					hAxis: {
						viewWindow:{min:0, max:  graphPara.xSize+1},
						ticks:  xLabels,
						direction:1,
						slantedText:true,
						slantedTextAngle:30 },
					vAxis: {
						viewWindow:{min:0, max:  graphPara.ySize+1},
						ticks:  yLabels}
	      };

				chart.draw(data, options);
    	}
		}else if(graphPara.view == "grid"){
			chart = new google.visualization.Histogram(document.getElementById('chart_div'));

			var dat = [];
			dat.push(["-", "-"]);
			var height = Math.floor(graphPara.gSize/10);
			var left = graphPara.gSize%10;

			for(var i = 0; i < height; i++){
				for(var j = 0; j < 10; j++){
					dat.push([(i*10+j).toString(), j+Math.random()]);
				}
			}

			if(left > 0){
				for(var i = 0; i < left; i++){
					dat.push([(height*10+i).toString(), i+Math.random()]);
				}
			}

			google.charts.setOnLoadCallback(drawChart);
			function drawChart() {
				var data = google.visualization.arrayToDataTable(dat);

				var options = {
          title: graphPara.x,
					width: 450,
					height: 300,
					histogram: { bucketSize: 1},
          legend: 'none'
        };

				chart.draw(data, options);
			}

		}else if(graphPara.view == "map") {


			var dat = graphPara.mData;
			dat.unshift(["Latitude", "Longitude"]);

			google.charts.setOnLoadCallback(drawRegionsMap);
      function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(dat);

        var options = {};

        chart = new google.visualization.GeoChart(document.getElementById('chart_div'));

        chart.draw(data, options);
      }
		}else{
			chart = new google.visualization.PieChart(document.getElementById('chart_div'));

			google.charts.setOnLoadCallback(drawChart);
      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['SuAVE', 'Version'],
          ['SuAVE',     1]
        ]);

        var options = {
          title: graphPara.x
        };

        chart.draw(data, options);
			}
		}



    //var PARA = document.getElementById('pivot_window').contentWindow.PARA;
    //console.log(JSON.stringify(PARA));
    /*
    $.ajax({
      url: "/getScreenshotByPara",
      type: "GET",
      data: {"url" : url, "para": PARA},
      success: function(data){
        //callback(data);
      },
      error: function(jqXHR){
        console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
      }
    });*/
  });
}
