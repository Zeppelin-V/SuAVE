var surveys;
var hc;
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
      /*var html = [];

      $.each(row, function (key, value) {
        console.log(key);
        console.log(value);
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
      });*/
      var overview = '';
      overview = overview + '<p><b>content:</b> ' + row.content + '</p>';
      overview = overview + '<p><b>uer:</b> ' + row.commenter + '</p>';
      overview = overview + '<p><b>file:</b> ' + row.file + '</p>';
      overview = overview + '<p><b>view:</b> ' + row.view + '</p>';
      overview = overview + '<p><b>category :</b> ' + row.category + '</p>';
      overview = overview + '<p><b>filters :</b> ' + row.filters + '</p>';
      overview = overview + '<p><b>date:</b> ' + row.date + '</p>';
      var result =
      '<div class="row"><div class="col-xs-12 col-lg-6">'+
      '<div id="chart_div_'+row.para_id+'" style="display: block;" class="col-xs-8 col-xs-offset-2"></div></div>'+
      '<div class="col-xs-12 col-lg-6">'+overview+"</div>"+
      '<div class="row">'+
      '<div class="col-xs-6 col-xs-offset-2">'+
      '<div id="comment-part" class="form-group label-floating">'+
      '<label for="newComment" style="font-size:100%;" class="control-label">Add new comment:</label>'+
      '<textarea id="newComment" style="width:100%; font-size:100%" class="form-control"></textarea>'+
      '</div>'+
      '</div>'+
      '<div class="col-xs-1">'+
      '<button id="add-comments" type="button" class="btn btn-primary" style="margin-top:35px;">Add</button>'+
      '</div>';

      hc.getGraphPara(row.para_id, row);
      return result;
      //return '<div class="row"><div id="chart_div" style="display: block;" class="col-xs-8 col-xs-offset-2"></div></div>';
}


$(document).ready(function(){
  $('.navbar-brand').append("  "+name);

  hc = new CommentsController();
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
