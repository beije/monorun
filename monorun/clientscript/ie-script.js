(function( $ ){
	$( document ).ready(function() {
		// Not the most beautiful way to check if IE
		// But because all the files are concatenated
		// we need to do it this way.
		if (navigator.appVersion.indexOf("MSIE") != -1) {
			// IE9 doesn't support transitions
			$(".fade-in-and-down").css({"top":"-1.5em"}).delay(1500).animate({top:"0",opacity:"1"},1000);
		}
	});
})( jQuery );