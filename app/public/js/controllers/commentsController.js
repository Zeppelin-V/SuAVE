
function CommentsController()
{
  $("#copy-link").on("click", function(){
    document.querySelector('#share-link').select();
    document.execCommand('copy');
  });

  window.actionEvents = {
    'click .share': function (e, value, row, index) {
      $("#share-link").html("");
      $("#share-dialog").modal('toggle');
      var pathArray = location.href.split( '/' );
  		$("#share-link").append("http://"+pathArray[2]+"/snapshot/"+row.para_id);
    },
    'click .remove': function (e, value, row, index) {
      $('#comments-table').bootstrapTable('remove', {field: "comment_id", values: [row.comment_id]});
      $.ajax({
        url: "/deleteCommentsById",
        type: "POST",
        data: {"id" : [row.comment_id]},
        success: function(output){
        },
        error: function(jqXHR){
          console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
      });
    }
  };

}
