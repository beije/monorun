(function( $ ){
	$( document ).ready(function() {
		if (navigator.appVersion.indexOf("MSIE") != -1) {
			$(".fade-in-and-down").css({"top":"-1.5em"}).delay(1500).animate({top:"0",opacity:"1"},1000);
		}
	});
})( jQuery );