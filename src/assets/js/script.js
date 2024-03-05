$(function () {
  $('[data-toggle="popover"]').popover();
  $("#careersModal").prependTo("body");
  $("#signinModal").prependTo("body");
  $("#signupModal").prependTo("body");
});

var elem = document.getElementById("wrapper");
$(".openFullscreen").on("click",function(){
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}) 
// $(".exitFullscreen").on("click",function(){
//   console.log(elem);
//   if (elem.requestFullscreen) {
//     elem.exitFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitexitFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msexitFullscreen();
//   }
// }) 
function openFullscreen(){
  var elem = document.getElementById("wrapper");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}
function exitFullscreen(){
  
      if(document.exitFullscreen)
      document.exitFullscreen();
    else if(document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if(document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if(document.msExitFullscreen)
      document.msExitFullscreen();
}
	
var i = 1;
$(window).scroll(function (event) {
  var scroll = $(window).scrollTop();
  if (scroll > 500 && i == 1) {
    openFullscreen();
    i= 2;
  }else if (scroll < 500 && i == 2) {
    exitFullscreen();
    i= 1;
  }
});

var element = document.querySelector("#wrapper");

element.requestFullscreen()
.then(function() {
	// element has entered fullscreen mode successfully
})
.catch(function(error) {
	// element could not enter fullscreen mode
	// error message
	console.log(error.message);
});