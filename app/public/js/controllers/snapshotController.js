function SnapshotController()
{
  // bind event listeners to button clicks //
  	var that = this;
    var graphPara;

    //load google chart
    google.charts.load("current", {packages:['corechart', 'geochart']});


    $("#add-comments").on("click", function(){
      var newComment = $("#newComment").val();
      if(newComment.length > 0){
        $.ajax({
          url: "/addCommentById",
          type: "POST",
          data: {"id" : PARA._id, "comment": newComment},
          success: function(output){
            $("#newComment").val("");
            $("#panel-comments").html("");

            that.displayComments(output);
          },
          error: function(jqXHR){
            console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
          }
        });
      }
    });

    $("#share-snapshot").on("click", function(){
  		$("#share-link").append(location.href);

  	});

    $("#show-snapshot").on("click", function(){
      window.open(window.location+'/../../main/file='+snapshotPara.user+"_"+snapshotPara.file+'.csv'+
        "&views="+views+"&view="+PARA.view+"&id="+PARA._id);
    });

    $("#show-about").on("click", function(){
      window.open(window.location+'/../../surveys/'+snapshotPara.user+"_"+snapshotPara.file+'about.html');
    });

    //get view options for the survey
    this.getViews = function(){
      $.ajax({
        url: "/getViewOptionsByName",
        type: "GET",
        data: {"file" : snapshotPara.file, "user": snapshotPara.user},
        success: function(data){
          views = data;
        },
        error: function(jqXHR){
          console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
      });
    };

    //get the comments associated with the survey
    this.getComments = function(id){
      $.ajax({
        url: "/getCommentsById",
        type: "GET",
        data: {"id" : id},
        success: function(data){
          comments = data;
          console.log(comments);

          if(comments.length > 0) that.displayComments(comments);
        },
        error: function(jqXHR){
          console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
      });
    };

    this.displayComments = function(comments){
      if(!$("#comments-table").length){
        $("#para-panel").after(
          '<div class="row">'+
          '<div class="col-xs-8 col-xs-offset-2">'+
          '<div class="panel panel-info">'+
          '<div id="comments-table" style="text-align: center;" class="panel-body">'+
          '<table class="table table-striped table-hover">'+
          '<tbody id="panel-comments"></tbody>'+
          '</table></div></div></div></div>'
        )
        $('#comments-table').css('max-height',$(window).height()*0.2);
      }

      for(var i = 0; i < comments.length; i++){
        $("#panel-comments").append("<tr >");
        $("#panel-comments").append("<td width='7%'>"+(i+1)+"</td>");
        $("#panel-comments").append("<td>"+comments[i].content+"</td>");
        $("#panel-comments").append("<td width='20%'>"+comments[i].date+"</td>");
        $("#panel-comments").append("</tr>");
      }
    };

    //get the paramters by the para Id
    this.getPara = function(id){
      $.ajax({
        url: "/getParaById",
        type: "GET",
        data: {"id" : id},
        success: function(data){
          PARA = data;
          that.displayPara();
          console.log(data);
        },
        error: function(jqXHR){
          console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
      });
    };

    this.displayPara = function(){
      $('#para-table').css('max-height',$(window).height()*0.2);

      if(PARA.y_axis){
        $("#panel-para").append("<tr>");
        $("#panel-para").append("<td>X axis: "+PARA.x_axis+"<br>Y axis: "+PARA.y_axis+"</td>");
        $("#panel-para").append("</tr>");
      }else{
        $("#panel-para").append("<tr>");
        $("#panel-para").append("<td><h4>Category: </h4>"+PARA.x_axis+"</td>");
        $("#panel-para").append("</tr>");
      }

      if(PARA.string_filters){
        $("#panel-para").append("<tr>");
        $("#panel-para").append("<h4>String filters:</h4>");
        for(var i = 0; i < PARA.string_filters.length; i++){
          var filter = PARA.string_filters[i];
          if(i>0){
            $("#panel-para").append("<br>"+filter.facet+"(");
          }else{
            $("#panel-para").append(filter.facet+"(");
          }

          $("#panel-para").append(filter.value[0]);
          for(var j =1; j < filter.value.length; j++){
            $("#panel-para").append(", "+filter.value[j]);
          }
          $("#panel-para").append(")");

        }
        $("#panel-para").append("</tr>");
      }

      if(PARA.num_filters){
        $("#panel-para").append("<tr>");
        $("#panel-para").append("<h4>Numeric filters:</h4>");
        for(var i = 0; i < PARA.num_filters.length; i++){
          var filter = PARA.num_filters[i];
          if(i>0){
            $("#panel-para").append("<br>"+filter.facet+"(");
          }else{
            $("#panel-para").append(filter.facet+"(");
          }
          $("#panel-para").append(filter.selectedMin+" to "+filter.selectedMax);
          $("#panel-para").append(")");

        }
        $("#panel-para").append("</tr>");
      }
    };

    //get graphic paras by id
    this.getSnapshotPara = function(id){
      $.ajax({
        url: "/getSnapshotById",
        type: "GET",
        data: {"id" : id},
        success: function(data){
          snapshotPara = data;

          that.getViews();
          that.getComments(id);
          google.charts.setOnLoadCallback(that.getGraph);
          $(".panel-title").append("File: "+data.file+" User: "+data.user);
        },
        error: function(jqXHR){
          console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
      });
    };

    //show the google chart
    this.getGraph = function(){
      var width = $(window).height()*0.45*0.9;
      var height = $(window).height()*0.3*0.9;


      graphPara = JSON.parse(snapshotPara.graph_para);

      //According to the PARA, draw charts
  		if(graphPara.view == "bucket"){
  			var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
  			var dat = [];
  			dat.push([graphPara.x, "Count"]);

  			for(var i = 0; i <graphPara.xData.length; i++){
  				dat.push(graphPara.xData[i]);
  			}

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
        google.charts.setOnLoadCallback(drawChart);
  		}else if(graphPara.view == "crosstab"){
  			var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));

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


  			function drawSeriesChart() {

  	      var data = google.visualization.arrayToDataTable(dat);

  	      var options = {
  					width: 450,
  					height: 300,
  					sizeAxis: {minValue: 1, maxSize: 15},
  					bar: {groupWidth: "95%"},
  					legend: { position: "none"},
            //chartArea: {width: '70%', height: '70%', left: '10%', right: '10%'},
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
        google.charts.setOnLoadCallback(drawSeriesChart);
  		}else if(graphPara.view == "grid"){
  			var chart = new google.visualization.Histogram(document.getElementById('chart_div'));

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
        google.charts.setOnLoadCallback(drawChart);
  		}else if(graphPara.view == "map") {


  			var dat = graphPara.mData;
  			dat.unshift(["Latitude", "Longitude"]);

        function drawRegionsMap() {

          var data = google.visualization.arrayToDataTable(dat);

          var options = {};

          var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));

          chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawRegionsMap);
  		}else{
  			var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

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
        google.charts.setOnLoadCallback(drawChart);
  		}
    };


}
