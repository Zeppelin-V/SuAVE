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
  result.push({'text': "Please select a value",
                'value': 0,
                'selected': false,
                imageSrc: "/../../img/default.jpg"}
  );
  for(var i = 0; i < options; i++){
    result.push({'text': options[i],
                  'value': options[i],
                  'selected': false,
                  imageSrc: "/../../img/default.jpg"}
    );
  }
}
