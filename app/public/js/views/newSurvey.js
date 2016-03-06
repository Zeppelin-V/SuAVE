
$(document).ready(function(){

	$('#new-survey').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
      var name = document.getElementById('new-file-name').value;
      return name.endsWith('.csv') == true
		},
		success	: function(responseText, status, xhr, $form){
			//if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
      /*
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}*/
		}
	});

});
