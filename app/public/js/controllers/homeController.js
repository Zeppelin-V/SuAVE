
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });
	$('#btn-update').click(function(){ window.open('/update', "_self"); });
	$('#btn-addNew').click(function(){$('.modal-new-survey').modal('show') });
//set listener on buttons
	$(document).on('click', '.surveys-click', function(){
		var file = $(this).text();
		//TODO: added link to current survey
		//id+"_"+filename
		//var file = user+"_"+$(this).text();
		window.open('http://maxim.ucsd.edu/suave_sid/main.html?file='+file+'.csv');
	});

	$(document).on('click', '.surveys-delete', function(){
		var file = $(this).attr('id');
		var that = this;
		$.ajax({
			url: "/deleteSurvey",
			type: "POST",
			data: {"name" : file, "user": user},
			success: function(data){
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
			$("#main-container").append('<div><button id="survey-'+i+'" class="btn btn-primary surveys-click">'+
				'<i class="icon-lock icon-white"></i>'+surveys[i].name+'</button><button id="'+surveys[i].name+'"class="surveys-delete" style="margin-left:50px">delete</button></div><br/>')
		}
	}
	// redirect to homepage on new survey creation
		$('.modal-newSurvey #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});


}
