function MainController()
{
// bind event listeners to button clicks //
	var that = this;

  var testPara = '{"y_axis":"1 Household members in with CONTRACT or INDEFINITE EMPLOYMENT (total number of)","selected_Id":-1,"x_axis":"1 Neighborhood /Colonia","string_filters":[{"facet":"1 Neighborhood /Colonia","value":["Colonia 2"],"index":0}],"num_filters":[{"facet":"1 Years living in current neighborhood/colonia","selectedMin":11,"selectedMax":63,"rangeMin":0,"rangeMax":63}],"view":"crosstab"}';

  $(document).on('click', '#comment', function(){
    var PARA = document.getElementById('pivot_window').contentWindow.PARA;
    console.log(JSON.stringify(PARA));
    /*
    $.ajax({
      url: "/getScreenshotByPara",
      type: "GET",
      data: {"url" : url, "para": PARA},
      success: function(data){
        //callback(data);
      },
      error: function(jqXHR){
        console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
      }
    });*/
  });
}
