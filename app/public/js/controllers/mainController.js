function MainController()
{
// bind event listeners to button clicks //
	var that = this;
	var graphPara;
	var comments;
	$('#modal-loading').modal('toggle');
	google.charts.load("current", {packages:['corechart', 'geochart']});
	var chart;

	// bind event listeners to button clicks //
		$('#retrieve-password-submit').click(function(){ $('#get-credentials-form').submit();});
		$('#login-form #forgot-password').click(function(){
			$('#cancel').html('Cancel');
			$('#retrieve-password-submit').show();
			$('#get-credentials').modal('show');
		});

	// automatically toggle focus between the email modal window and the login form //
		$('#get-credentials').on('shown', function(){ $('#email-tf').focus(); });
		$('#get-credentials').on('hidden', function(){ $('#user-tf').focus(); });

	this.checkLogin = function(){
		$("#comment-template").html("");
		if(document.cookie.indexOf("pass") > 0 || remember == false){
			$("#comment-template").append(
				'<div id="new-block">'+
	  			'<div id="comment-part" class="form-group label-floating">'+
	    			'<label for="newComment" class="control-label">Add new comment:</label>'+
	    			'<textarea id="newComment" style="width:100%;" class="form-control"></textarea>'+
	  			'</div>'+
					'<button id="add-comments" type="button" class="btn btn-raised btn-info">Add</button>'+
				'</div>');
		}else{
			$("#comment-template").append(
					'<div class="col-xs-6 col-xs-offset-2">'+
						'<div class="row">'+
							'<div class="col-xs-6 col-xs-offset-3">'+
								'<button id="login" data-toggle="modal" data-target="#login-dialog" type="button" class="btn btn-raised btn-danger">Login to comment</button>'+
							'</div>'+
						'</div>'
			);
		}
	};

	var displayComments = function(data){
		for(var i = 0; i < data.length; i++){
			var dateString = data[i].date.replace(/T/, ' ').replace(/\..+/, '');
			$("#comments-body").append("<tr>"+
																"<td class='comment-num'>"+(i+1)+"</td>"+
																"<td class='comment-user'>"+data[i].user+"</td>"+
																"<td class='comment-content'>"+data[i].content+"</td>"+
																"<td class='comment-date'>"+data[i].date+"</td>"+
																"</tr>");
		}
	};

	var getComments = function(){
		$.ajax({
			url: "/getCommentsByParameters",
			type: "GET",
			data: {"para": PARA},
			success: function(output){
				displayComments(output);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	};

	$("#copy-link").on("click", function(){
		document.querySelector('#share-link').select();
		document.execCommand('copy');
	});

	$("#share").on("click", function(){
		graphPara = document.getElementById('pivot_window').contentWindow.graphPara;
		PARA = document.getElementById('pivot_window').contentWindow.PARA;
		$("#share-link").html("");
		if(PARA.string_filters.length == 0) PARA.string_filters = "None";
		if(PARA.num_filters.length == 0) PARA.num_filters = "None";

		$.ajax({
			url: "/getParaIdByParamters",
			type: "GET",
			data: {"user": user, "file": file, "para": PARA,
				"graphPara":JSON.stringify(graphPara)},
			success: function(output){
				var pathArray = location.href.split( '/' );
				$("#share-link").append("http://"+pathArray[2]+"/snapshot/"+output);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});

	$(document).on("click", "#add-comments", function(){

		var newComment = $("#newComment").val();
		if(newComment.length > 0){
			var tempUser;

			if(remember == true){
				tempUser = document.cookie.substring(document.cookie.indexOf("user=")+5,
					document.cookie.indexOf('pass=')-2);
			}else{
				tempUser = replyUser;
			}

			if(PARA.string_filters.length == 0) PARA.string_filters = "None";
			if(PARA.num_filters.length == 0) PARA.num_filters = "None";

			$.ajax({
				url: "/addCommentByParameters",
				type: "POST",
				data: {"user": user,
				 	"file": file, "para": PARA,
					"comment": newComment, "graphPara":JSON.stringify(graphPara),
					"replyUser": tempUser},
				success: function(output){
					$("#newComment").val("");
					$("#comments-body").html("");

					displayComments(output);
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}
	});

	// Wait for the chart to finish drawing before calling the getImageURI() method.
	$(document).on('click', '#download', function(){
		//window.open(chart.getImageURI(), 'Download');
		window.open(chart.getImageURI(), "_blank")
	});

	$(document).on('click', '#toggle-filter', function(){
		$("#comments-body").html("");
		if($('#toggle-filter').text() == 'See all comments'){
			$('#toggle-filter').text('Less')
			var para = {};
			para.file = PARA.file;
			para.user = PARA.user;
			para.view = PARA.view;
			para.x_axis = PARA.x_axis;
			para.y_axis = PARA.y_axis;
			console.log(para);
			$.ajax({
				url: "/getCommentsByParametersWithoutFilters",
				type: "GET",
				data: {"para": para},
				success: function(output){
					displayComments(output);
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}else{
			$('#toggle-filter').text('See all comments');
			getComments();
		}
	});

  $(document).on('click', '#comment', function(){
		$('#comments-table').css('max-height',$(window).height()*0.2);
		$("#newComment").val("");

		graphPara = document.getElementById('pivot_window').contentWindow.graphPara;
		PARA = document.getElementById('pivot_window').contentWindow.PARA;

		$("#comments-body").html("");

		that.checkLogin();


		if(PARA.string_filters.length == 0) PARA.string_filters = "None";
		if(PARA.num_filters.length == 0) PARA.num_filters = "None";

		$('.operation-btn').html("");
		if(PARA.num_filters != "None" || PARA.string_filters != "None"){
			$('.operation-btn').append('<button id="download" type="button" class="btn btn-info">Download</button>');
			$('.operation-btn').append('<button id="toggle-filter" type="button" class="btn btn-info">See all comments</button>')
		}else{
			$('.operation-btn').append('<button id="download" type="button" class="btn btn-info">Download</button>');
		}

		getComments();

		//According to the PARA, draw charts
		if(graphPara.view == "bucket"){
			chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
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
	    		},
					vAxis: {
						baseline: 0
					}
				};
				chart.draw(view, options);
			}
			google.charts.setOnLoadCallback(drawChart);
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
			google.charts.setOnLoadCallback(drawSeriesChart);
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
			if(dat[0][0] != "Latitude") dat.unshift(["Latitude", "Longitude"]);

      function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(dat);

				var options = {
					width: 450,
					height: 300,
					legend: 'none',
					defaultColor: '#0074cc',
				};
				var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));

        chart.draw(data, options);
      }
			google.charts.setOnLoadCallback(drawRegionsMap);
		}else{
			chart = new google.visualization.PieChart(document.getElementById('chart_div'));

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
  });
}
