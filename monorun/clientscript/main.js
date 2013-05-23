(function( $ ) {
	var gameStarted = false;

	// Should be click or touch
	$( document ).click( function() {
		if( !gameStarted ){

			$('#game').show();
			$('#timer').show();

			core.initialize();
			core.start();
			gameStarted = true;
		}
	});
})( jQuery );