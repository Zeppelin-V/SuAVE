var surveys;

$(document).ready(function(){
	var hc = new HomeController();
	$('#new-survey').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			var name = document.getElementById('new-file-name').value + ".csv";
			//return name.endsWith('.csv') == true
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			setTimeout(function(){window.location.href = '/';}, 300);
		},
		error : function(e){
			if(e.responseText == "Name is taken"){
				$("#error-text").text("The name is used!");
			}
		}
	});

	surveys = hc.getSurveys(function(e){
		if(e == "error") {
			console.log(e);
		}else {
			surveys = e;
			hc.displaySurveys(surveys);
		}
	});
});
