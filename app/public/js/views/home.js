$(document).ready(function(){

	var hc = new HomeController();

	$('#new-survey').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			//var name = document.getElementById('new-file-name').value;
			//return name.endsWith('.csv') == true
			return true;
		},
		success	: function(responseText, status, xhr, $form){
			console.log("success");
			//if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			console.log(e);
			/*
			if (e.responseText == 'email-taken'){
					av.showInvalidEmail();
			}*/
		}
	});
});
