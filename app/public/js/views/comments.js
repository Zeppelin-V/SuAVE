var surveys;

function actionFormatter(value, row, index) {
  return [
      '<a class="share ml10" href="javascript:void(0)" title="Share">',
      '<i class="glyphicon glyphicon-share-alt"></i>',
      '</a>',
      '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
      '<i class="glyphicon glyphicon-remove"></i>',
      '</a>'
  ].join('');
}

function detailFormatter(index, row) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
}


$(document).ready(function(){
  var hc = new CommentsController();
  $.ajax({
    url: "/getCommentsByUSer",
    type: "GET",
    data: {"user": "lisided"},
    success: function(output){
      $('#comments-table').bootstrapTable('append', output);
    },
    error: function(jqXHR){
      console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
    }
  });
});
