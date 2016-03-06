$(document).ready(function(){

	var hc = new HomeController();

	$('#new-survey').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			var name = document.getElementById('new-file-name').value + ".csv";
			console.log(name);
			//return name.endsWith('.csv') == true
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("success");
			//if (status == 'success') $('.modal-alert').modal('show');
			$(".btn-newSurvey").click();
		},
		error : function(e){
			if(e.responseText == "Name is taken"){
				$("#error-text").text("The name is used!");
			}
		}
	});
});
