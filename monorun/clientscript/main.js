(function( $ ) {
	var gameStarted = false;

	var startGame = function( e ) {
		e = e || window.event;
		var target = e.target; // Fetch click target
		e = e.originalEvent || e; // Damn it jquery.

		// Check that target doesn't have a href
		if( !target.href ) {
			e.preventDefault();

			if( !gameStarted ){
				console.log( gameStarted);
				gameStarted = true;
				$('#game').show();
				$('#timer').show();

				var clickPositions = {
					x: e.clientX,
					y: e.clientY
				};

				core.initialize();
				core.start( clickPositions );
			}
		}
	};

	// Can't use touch events because then you wouldn't
	// be able to scroll. 
	$( document ).click( startGame );

})( jQuery );