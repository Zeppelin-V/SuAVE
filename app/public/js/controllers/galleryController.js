
function GalleryController()
{
// bind event listeners to button clicks //
	var that = this;

//set listener on buttons
	$(document).on('click', '.surveys-click', function(){
		var file = $(this).text();
		//TODO: added link to current survey
		//id+"_"+filename
		//var file = user+"_"+$(this).text();
		window.open('http://maxim.ucsd.edu/suave_sid/main.html?file='+file+'.csv');
	});

	this.getSurveys = function(callback)
	{
		var that = this;
		$.ajax({
			url: "/getPublicSurveys",
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
				'<i class="icon-lock icon-white"></i>'+surveys[i].name+'</button></div><br/>')
		}
	}
}
