
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
	var DLength;
	var collection = {};
	var SID;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });
	$('#btn-update').click(function(){ window.open('/update', "_self"); });
	$('#btn-addNew').click(function(){$('.modal-new-survey').modal('show') });

//set listener on buttons
	$(document).on('click', '.surveys-edit', function(){
		$('.modal-select-collection').modal('show');
		var id = $(this).attr("id");
		var i = id.slice(-1);
		SID = i;
		var survey = surveys[i];
		//insert views checkboxes
		$('#pv-views').empty();
		$('#pv-views').append(
			'<div class="row" ><div class="col-xs-2"><input id="pv-grid" class="checkbox-custom"  type="checkbox">'+
			'<label for="pv-grid" class="checkbox-custom-label">Grid</label></div>'+
			'<div class="col-xs-2"><input id="pv-bucket" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-bucket" class="checkbox-custom-label">Buecket</label></div>'+
			'<div class="col-xs-2"> <input id="pv-crosstab" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-crosstab" class="checkbox-custom-label">Crosstab</label></div></div><div class="row">'+
			'<div class="col-xs-2"> <input id="pv-qca" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-qca" class="checkbox-custom-label">QCA</label></div>'+
			'<div class="col-xs-2"> <input id="pv-map" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-map" class="checkbox-custom-label">Map</label> </div>'+
			'<div class="col-xs-2"><input id="pv-r" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-r" class="checkbox-custom-label">R</label></div></div>'
		);
		var views = survey.views.toString();
		if(views[0] == '1') $("#pv-grid").prop("checked", true);
    if(views[1] == '1') $("#pv-bucket").prop("checked", true);
    if(views[2] == '1') $("#pv-crosstab").prop("checked", true);
    if(views[3] == '1') $("#pv-qca").prop("checked", true);
    if(views[4] == '1') $("#pv-map").prop("checked", true);
		if(views[5] == '1') $("#pv-r").prop("checked", true);

		$('#column-select').empty();
		//get Columns
		$.ajax({
			url: "/getSurveyColumnsNCollection",
			type: "POST",
			data: {"name" : survey.name, "user": user},
			success: function(data){
				var column = data[0];
				var collection = data[1];
				$("#column-select").append($("<option selected disabled hidden></option>").html(""));
				for(var i = 0; i < column.length; i++){
					$("#column-select").append($("<option></option>").val(i).html(column[i]));
				}

				for(var i = 0; i < collection.length; i++){
					$("#collect-select").append($("<option></option>").val(collection[i]).html(collection[i]));
				}

			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	});

	$("#collect-select").change(function() {
    var collectVal = $(this).find(':selected').val();
    var columnVal = $('#column-select').find(':selected').text();

    if(columnVal.length > 0){
			collection['column'] = parseInt($('#column-select').find(':selected').val());
      that.fetchColVal(columnVal, collectVal);
    }

	});

	$("#column-select").change(function() {
    var columnVal = $(this).find(':selected').text();
    var collectVal = $('#collect-select').find(':selected').val();

    if(collectVal.length > 0){
			collection['column'] = parseInt($('#column-select').find(':selected').val());
    	that.fetchColVal(columnVal, collectVal);
    }
	});

	$(document).on('click', '#select-collection-submit', function(){

		if($('#collect-select').find(':selected').val() != undefined &&
	 				$('#column-select').find(':selected').val() != undefined){
			$.ajax({
				url: "/changeCollection",
				type: "POST",
				data: {"name" : surveys[SID].name, "user": user, "collection": collection},
				success: function(data){
					setTimeout(function(){window.location.href = '/';}, 3000);
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}

		var views = "";
		//change view options
		if($("#pv-grid").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-bucket").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-crosstab").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-qca").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-map").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-r").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}

		$.ajax({
			url: "/changeViewOptions",
			type: "POST",
			data: {"name" : surveys[SID].name, "user": user, "views": parseInt(views)},
			success: function(data){
				surveys[SID].views = parseInt(views);
				setTimeout(function(){window.location.href = '/';}, 3000);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});



	$(document).on('click', '.toggle-button', function() {
		$(this).toggleClass('toggle-button-selected');
		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];

		$.ajax({
			url: "/hideSurveyByNameID",
			type: "POST",
			data: {"name" : survey.name, "user": user},
			success: function(data){
				//setTimeout(function(){window.location.href = '/';}, 3000);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});

	$(document).on('click', '.view-button', function() {
		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];
		var view = id.substring(0, id.length-2);

		if(view == survey.view) return;
		surveys[id.slice(-1)].view = view;

		$.ajax({
			url: "/changeViewByNameID",
			type: "POST",
			data: {"name" : survey.name, "user": user, "view": view},
			success: function(data){
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});

	//when "show" button is clicked
	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var survey = surveys[id.slice(-1)];
		var file = survey.name;
		//Grid, bucket, crosstab, QGA, map
		window.open(window.location+'/../main.html?file='+user+"_"+file+'.csv'+
			"&views="+survey.views+"&view="+survey.view);
	});

	$(document).on('click', '.surveys-delete', function(){
		var id = $(this).attr('id');
		var file = surveys[id.slice(-1)].name;

		var that = this;
		$.ajax({
			url: "/deleteSurvey",
			type: "POST",
			data: {"name" : file, "user": user},
			success: function(data){
				$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
				$('.modal-alert .modal-header h3').text('Success!');
				$('.modal-alert .modal-body p').html('Successfully deleted the survey.<br>Redirecting you back to the homepage.');
				$('.modal-alert').modal('show');
				$('.modal-alert button').click(function(){window.location.href = '/';})
				setTimeout(function(){window.location.href = '/';}, 3000);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	});

	this.fetchColVal = function(columnVal, collectVal){
		$('#column-collect').empty();
		collection['name'] = collectVal;

		var columnImg;
		var collect;
		if(collectVal == "default" ){
			collect = defaultImg;
		}else if(collectVal == "color"){
			collect = colorImg;
		}else if(collectVal == "gender"){

		}else if(collectVal == "shape"){

		}

		$.ajax({
			url: "/getColumnsOptions",
			type: "POST",
			data: {"name" : surveys[SID].name, "user": user, "column": columnVal},
			success: function(data){
				//generate initial collect json
				collection['values'] = {};
				for(var i = 0; i < data.length; i++){
					collection.values[data[i]] = 'default';
				}

				columnImg = generateImgJson(data);
				Dlength = data.length;
				$('#column-collect').append('<p>Please assign an image to each value:</p>');

				for(var i = 0; i < data.length; i++){
					$('#column-collect').append(
						'<div class="row"><div class="col-xs-3"><div id="column-drop-'+i+'"></div></div>'+
						'<div class="col-xs-3"><div id="collect-drop-'+i+'" class="col-xs-3"></div></div></div>');
				}

				for(var i = 0; i < data.length; i++){

					//inflate collection dropdown
					$('#collect-drop-'+i).ddslick({
						data:collect,
						width:250,
						imagePosition:"right",
						onSelected: function(selectedData){

							if(selectedData.selectedData.value != 0){
								collection.values[data[i]] = selectedData.selectedData.value;
							}
						}
					});

					$('#column-drop-'+i).ddslick({
						data:[columnImg[i]],
						width:250,
						imagePosition:"right",
						onSelected: function(selectedData){
							if(selectedData.selectedData.value != 0){
								console.log(selectedData.selectedData.value);
							}
						}
					});
				}
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});





	}

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/logout",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}


	this.getSurveys = function(callback)
	{
		var that = this;
		$.ajax({
			url: "/getSurveys",
			type: "POST",
			data: {"user" : user},
			success: function(data){
				callback(data);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				callback("error");
			}
		});
	}

	this.displaySurveys = function(surveys){
		for(i = 0; i < surveys.length; i++){
			$("#main-container").append('<div class="row carousel-row"><div id="carousel-'+i+'" class="col-xs-8 col-xs-offset-2 slide-row">'+
			'<div class="carousel slide slide-carousel" data-ride="carousel">'+
			'<div class="carousel-inner"><img src="/../img/blue.jpg" alt="Image"></div></div>'+
			'<div class="slide-content"><h2>'+surveys[i].name+'</h2><div class="container"><div class="row" id="row-'+i+'">'
		  +'</div></div></div>');

			var views = surveys[i].views.toString();

			if(views[0] == '1') $('#row-'+i).append(
				'<div class="col-xs-1"><input type="radio" name="radio-'+i+'" id="grid-button-'+i+'" class="radio"/>'+
				'<label id="grid-'+i+'" class="view-button" for="grid-button-'+i+'">Grid</label></div>');
	    if(views[1] == '1') $('#row-'+i).append('<div class="col-xs-1">'+
				'<input type="radio" name="radio-'+i+'" id="bucket-button-'+i+'" class="radio"/><label id="bucket-'+
				i+'" class="view-button" for="bucket-button-'+i+'">Bucket</label></div>');
	    if(views[2] == '1') $('#row-'+i).append('<div class="col-xs-1"> <input type="radio" name="radio-'
			+i+'" id="crosstab-button-'+i+'" class="radio"/>'+
			'<label id="crosstab-'+i+'" class="view-button" for="crosstab-button-'+i+'">Crosstab</label></div>');
	    if(views[4] == '1') $('#row-'+i).append(
				'<div class="col-xs-1"><input type="radio" name="radio-'+i+'" id="map-button-'+i+'" class="radio"/>'+
				'<label id="map-'+i+'" class="view-button" for="map-button-'+i+'">Map</label></div>');

			$("#carousel-"+i).append(
			'<div class="slide-footer"><div id="hidden-button" class="col-xs-1"><h4>Public: </h4></div>'+
			'<div class="toggle-button" id="public-'+i+'"><button ></button></div>'+
			'<span class="pull-right buttons">'+
			'<button id="survey-'+i+'" class="btn btn-sm btn-primary surveys-click"><i class="fa fa-fw fa-eye"></i> Show</button>'+
			'<button id="edit-'+i+'" class="btn btn-sm btn-primary surveys-edit"><i class="fa fa-map-o"></i> Edit</button>'+
			'<button id="delete-'+i+'" class="btn btn-sm btn-primary surveys-delete"><i class="fa fa-fw fa-warning"></i> Delete</button>'+
			'</span></div></div></div>'
			);
			if($('#'+surveys[i].view+'-'+i).length == 0){
				$('#'+'grid-'+i).trigger('click');
			}else{
				$('#'+surveys[i].view+'-'+i).trigger("click");
			}
			if(parseInt(surveys[i].hidden) == 0) $("#public-"+i).toggleClass('toggle-button-selected');

		}
	}
	// redirect to homepage on new survey creation
		$('#help-button').click(function(){window.open("https://docs.google.com/document/d/1f4ABDP1YrEU3vRxYkIPHl9dyGTT4w3pqfRNI2Kn97Ic/edit#heading=h.vcpylem4gnc7")});


}
