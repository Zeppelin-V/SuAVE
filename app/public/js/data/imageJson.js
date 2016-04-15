var colorImg = [
    {
        text: "Please select a pattern",
        value: 0,
        selected: false,
        imageSrc: "/../../img/default.jpg"
    },
    {
        text: "Crimson",
        value: "crimson",
        selected: false,
        imageSrc: "/../../img/color/crimson.jpg"
    },
    {
        text: "Maroon",
        value: "maroon",
        selected: false,
        imageSrc: "/../../img/color/maroon.jpg"
    },
    {
        text: "Plum",
        value: "plum",
        selected: false,
        imageSrc: "/../../img/color/plum.jpg"
    }
];

var defaultImg = [
  {
      text: "Default",
      value: "default",
      selected: true,
      imageSrc: "/../../img/default.jpg"
  }
];

var genderImg = [

];

var shapeImg = [

];

function generateImgJson(options){
  var result = [];
  for(var i = 0; i < options.length; i++){
    data = options[i];
    if(data.length == 0) data = "Null";
    result.push({'text': data,
                  'value': data,
                  'selected': false,
                  'imageSrc': "/../../img/blue.jpg"}
    );
  }
  return result;
}
