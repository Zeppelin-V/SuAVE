
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });
	$('#btn-update').click(function(){ window.open('/update', "_self"); });
	$('#btn-addNew').click(function(){$('.modal-new-survey').modal('show') });
//set listener on buttons
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

	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var file = surveys[id.slice(-1)].name;
		window.open(window.location+'/../main.html?file='+user+"_"+file+'.csv');
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
			$("#main-container").append('<div class="row carousel-row"><div class="col-xs-8 col-xs-offset-2 slide-row">'+
			'<div id="carousel-1" class="carousel slide slide-carousel" data-ride="carousel">'+
			'<div class="carousel-inner"><img src="/../img/black.jpeg" alt="Image"></div></div>'+
			'<div class="slide-content"><h2>'+surveys[i].name+'</h2><p>'+'</p></div>'+
			'<div class="slide-footer"><div class="col-xs-1"><h4>Public: </h4></div>'+
			'<div class="toggle-button" id="public-'+i+'"><button ></button></div>'+
			'<span class="pull-right buttons">'+
			'<button id="survey-'+i+'" class="btn btn-sm btn-primary surveys-click"><i class="fa fa-fw fa-eye"></i> Show</button>'+
			'<button id="delete-'+i+'" class="btn btn-sm btn-primary surveys-delete"><i class="fa fa-fw fa-warning"></i> Delete</button>'+
			'</span></div></div></div>'
			);

			if(parseInt(surveys[i].hidden) == 0) $("#public-"+i).toggleClass('toggle-button-selected');

		}
	}
	// redirect to homepage on new survey creation
		$('#help-button').click(function(){window.open("https://docs.google.com/document/d/1f4ABDP1YrEU3vRxYkIPHl9dyGTT4w3pqfRNI2Kn97Ic/edit#heading=h.vcpylem4gnc7")});


}
