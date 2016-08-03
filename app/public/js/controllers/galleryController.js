
function GalleryController()
{
// bind event listeners to button clicks //
	var that = this;

//set listener on buttons
	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var survey = surveys[id.slice(-1)];
		var file = survey.name;

		window.open(window.location+'/../../main/file='+user+"_"+file+'.csv'+
			"&views="+survey.views+"&view="+survey.view);
	});

	$(".page-header").append(" by "+user);

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

	$(document).on('click', '.file-source', function() {

		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];

		window.open("/getSurveys/"+survey.user+"_"+survey.name+".csv", "_blank");

	});

	this.displaySurveys = function(survey){
		var surveys = survey.reverse();

		for(i = 0; i < surveys.length; i++){
			$('#display-surveys').append('<div class="col-md-4"> <div class="panel panel-default">  <div class="tab-content"> <div class="tab-pane fade in active" id="tab1-'+i+'"> </div> '+
			'<div class="tab-pane fade" id="tab2-'+i+'"> </div> '+
			'<div class="tab-pane fade" id="tab3-'+i+'" style="width:100%;"> </div> '+
			'</div></div><!--/.panel--> </div>');

			var dateString = surveys[i].date;

			$('#tab1-'+i).append('<div class="row survey-title"> ');
			$('#tab1-'+i).append('<div class="col-xs-6"><div id="icon-img">'+
			'<img id="survey-'+i+'" class="surveys-click" src="/../img/blue.jpg" alt="Image" style="width:100%;"> </div></div>'+
			'<div class="col-xs-6 survey-info"><h4 style="text-align:center;">'+surveys[i].name+'</h4>'+
			'<p style="text-align:center;">Created from: </p>'+
			'<a id="source-'+i+'" class="file-source" style="text-align:center;display:block;">'+surveys[i].originalname+'</a>'+
			'<p style="text-align:center;">'+ dateString+'</p>'+
			'</div>'+
			' </div>');

		}
	}
}
