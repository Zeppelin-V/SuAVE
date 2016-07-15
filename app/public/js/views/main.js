var paraStr;
var user;
var file;

$(document).ready(function(){
  var mc = new MainController();
  var query = URI.parseQuery(querys);

  /*set up iframe to load SuAVE*/

  var suave_ifr = document.createElement('iframe');
  suave_ifr.id = 'pivot_window';
  suave_ifr.src = '/loading.html?'+querys;
  suave_ifr.style.width="100%";
  suave_ifr.style.height="95%";
  suave_ifr.style.margin="0";
  suave_ifr.style.padding="0";
  suave_ifr.style.border="0";
  suave_ifr.frameborder ='0';
  document.body.appendChild(suave_ifr);

  /*initialize banner*/

  var aboutTitle;
  var aboutPath = "../surveys/";
  var index = query.file.indexOf("_");

  user= query.file.substring(0, index);
  file = query.file.substring(index+1);
  file = file.replace(".csv", "");

  if(query.file.endsWith(".csv")){
    aboutPath = aboutPath + (query.file).replace('.csv', '')+ "about.html";
  }else if(query.file.endsWith(".zip")){
    aboutPath = aboutPath + (query.file).replace('.zip', '')+ "about.html";
  }else if(query.file.endsWith(".cxml")){
    aboutPath = aboutPath + (query.file).replace('.cxml', '')+ "about.html";
  }
  $("#help").attr("onclick", "window.open('"+aboutPath+"','_blank')");
  $("<header>").load(aboutPath + " #about-title", function(){
    aboutTitle = "About " + $(this).text() + " Survey";
    $('.tagline').text($(this).text());
  });


});
