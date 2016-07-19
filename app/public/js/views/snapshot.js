var PARA;
var snapshotPara;
var views;
var comments;

$(document).ready(function(){
	var sc = new SnapshotController();
  var hrefArray = location.href.split('/');

  sc.getSnapshotPara(hrefArray[4]);

  sc.getPara(hrefArray[4]);

  $('#comment-template').css('max-height',$(window).height()*0.7);
});
