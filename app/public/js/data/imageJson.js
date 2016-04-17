var colorImg = [
    {
        text: "Please select a pattern",
        value: 0,
        selected: false,
        imageSrc: "/../../img/default.jpg"
    },
    {
        text: "Ivory",
        value: "ivory",
        selected: false,
        imageSrc: "/../../img/color/ivory.jpg"
    },
    {
        text: "Beige",
        value: "beige",
        selected: false,
        imageSrc: "/../../img/color/beige.jpg"
    },
    {
        text: "Wheat",
        value: "wheat",
        selected: false,
        imageSrc: "/../../img/color/wheat.jpg"
    },
    {
        text: "Tan",
        value: "tan",
        selected: false,
        imageSrc: "/../../img/color/tan.jpg"
    },
    {
        text: "Khaki",
        value: "khaki",
        selected: false,
        imageSrc: "/../../img/color/khaki.jpg"
    },
    {
        text: "Silver",
        value: "silver",
        selected: false,
        imageSrc: "/../../img/color/silver.jpg"
    },
    {
        text: "Gray",
        value: "gray",
        selected: false,
        imageSrc: "/../../img/color/gray.jpg"
    },
    {
        text: "Charcoal",
        value: "charcoal",
        selected: false,
        imageSrc: "/../../img/color/charcoal.jpg"
    },
    {
        text: "Navy Blue",
        value: "navy_blue",
        selected: false,
        imageSrc: "/../../img/color/navy_blue.jpg"
    },
    {
        text: "Royal Blue",
        value: "royal_blue",
        selected: false,
        imageSrc: "/../../img/color/royal_blue.jpg"
    },
    {
        text: "Medium Blue",
        value: "medium_blue",
        selected: false,
        imageSrc: "/../../img/color/medium_blue.jpg"
    },
    {
        text: "Azure",
        value: "azure",
        selected: false,
        imageSrc: "/../../img/color/azure.jpg"
    },
    {
        text: "Cyan",
        value: "cyan",
        selected: false,
        imageSrc: "/../../img/color/cyan.jpg"
    },
    {
        text: "Aquamarine",
        value: "aquamarine",
        selected: false,
        imageSrc: "/../../img/color/aquamarine.jpg"
    },
    {
        text: "Teal",
        value: "teal",
        selected: false,
        imageSrc: "/../../img/color/teal.jpg"
    },
    {
        text: "Forest Green",
        value: "forest_gree",
        selected: false,
        imageSrc: "/../../img/color/forest_gree.jpg"
    },
    {
        text: "Olive",
        value: "olive",
        selected: false,
        imageSrc: "/../../img/color/olive.jpg"
    },
    {
        text: "Chartreuse",
        value: "chartreuse",
        selected: false,
        imageSrc: "/../../img/color/chartreuse.jpg"
    },
    {
        text: "Lime",
        value: "lime",
        selected: false,
        imageSrc: "/../../img/color/lime.jpg"
    },
    {
        text: "Golden",
        value: "golden",
        selected: false,
        imageSrc: "/../../img/color/golden.jpg"
    },
    {
        text: "Goldenrod",
        value: "goldenrod",
        selected: false,
        imageSrc: "/../../img/color/goldenrod.jpg"
    },
    {
        text: "Coral",
        value: "coral",
        selected: false,
        imageSrc: "/../../img/color/coral.jpg"
    },
    {
        text: "Salmon",
        value: "salmon",
        selected: false,
        imageSrc: "/../../img/color/salmon.jpg"
    },
    {
        text: "Hot Pink",
        value: "hot_pink",
        selected: false,
        imageSrc: "/../../img/color/hot_pink.jpg"
    },
    {
        text: "Fuchsia",
        value: "fuchsia",
        selected: false,
        imageSrc: "/../../img/color/fuchsia.jpg"
    },
    {
        text: "Puce",
        value: "puce",
        selected: false,
        imageSrc: "/../../img/color/puce.jpg"
    },
    {
        text: "Mauve",
        value: "mauve",
        selected: false,
        imageSrc: "/../../img/color/mauve.jpg"
    },
    {
        text: "Lavender",
        value: "lavender",
        selected: false,
        imageSrc: "/../../img/color/lavender.jpg"
    },
    {
        text: "Plum",
        value: "plum",
        selected: false,
        imageSrc: "/../../img/color/plum.jpg"
    },
    {
        text: "Indigo",
        value: "indigo",
        selected: false,
        imageSrc: "/../../img/color/indigo.jpg"
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
