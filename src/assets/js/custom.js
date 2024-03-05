$(document).ready(function () {

	var window_top = $(window).scrollTop(); 
	if (window_top >= 30) {
		$('.left-side-bar').addClass('fixed-left-sidebar');
	} else {
		$('.left-side-bar').removeClass('fixed-left-sidebar');
	}
	onScroll;

	$(window).scroll(function(){
		var window_top = $(window).scrollTop(); 
		if (window_top >= 30) {
			$('.left-side-bar').addClass('fixed-left-sidebar');
		} else {
			$('.left-side-bar').removeClass('fixed-left-sidebar');
		}
	});  

	$(document).on("scroll", onScroll);
});