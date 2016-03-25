
function GalleryController()
{
// bind event listeners to button clicks //
	var that = this;

//set listener on buttons
	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var file = surveys[id.slice(-1)].name;
		window.open(window.location+'/../main.html?file='+user+"_"+file+'.csv');
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
			$("#main-container").append('<div class="row carousel-row"><div class="col-xs-8 col-xs-offset-2 slide-row">'+
			'<div id="carousel-1" class="carousel slide slide-carousel" data-ride="carousel">'+
			'<div class="carousel-inner"><img src="/../img/black.jpeg" alt="Image"></div></div>'+
			'<div class="slide-content"><h2>'+surveys[i].name+'</h2><p>'+'</p></div>'+
			'<div class="slide-footer"><span class="pull-right buttons">'+
			'<button id="survey-'+i+'" class="btn btn-sm btn-primary surveys-click"><i class="fa fa-fw fa-eye"></i> Show</button>'+
			'</span></div></div></div>'
			);
		}
	}
}
