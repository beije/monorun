(function( $ ) {
	
	/*
	var api = new apiInterface();

	api.registerPlayer(
		function(resp){
			console.log( 'Player registered: ', resp );
		}
	);

	api.insertScore(
		121,
		'beije',
		function(resp){
			console.log( 'Saved score: ', resp );
		}
	);
	api.fetchHighscores(
		function(resp){
			console.log( 'Highscore list: ', resp );
		}
	);
	api.fetchHighscore(
		15,
		function(resp){
			console.log( 'Highscore id 15: ', resp );
		}
	);
	console.log( api );
*/

	var startGame = function( e ) {
		e = e || window.event;
		var target = e.target; // Fetch click target
		e = e.originalEvent || e; // Damn it jquery.

		// Check that target doesn't have a href
		if( !target.href && userInterface.currentScreen == 'start-screen' ) {
			e.preventDefault();

			if( !core.gameStarted ){

				//core.gameStarted = true;
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