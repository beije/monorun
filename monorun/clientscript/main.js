(function( $ ) {
	
	userInterface.updateShareButtonUrls();
	var scoreId = parseInt( document.location.hash.replace( '#', '' ) );
	if( scoreId ) {
		userInterface.externalApi.fetchHighscore(
			scoreId,
			function(resp){
				if( resp && resp.length == 1 ){
					userInterface.latestUserScore = resp[0];
					userInterface.showScreen( 'high-score-screen' );
					userInterface.updateShareButtonUrls();
				}
			}
		);
	}

	var clickPositions = {};
	var startGame = function( e ) {
		e = e || window.event;
		var target = e.target; // Fetch click target
		e = e.originalEvent || e; // Damn it jquery.

		// Check that target doesn't have a href
		if( !target.href && userInterface.currentScreen == 'start-screen' ) {
			e.preventDefault();

			if( !core.gameStarted ){
				$('#game').show();

				clickPositions = {
					x: e.clientX,
					y: e.clientY
				};
				$('#game').removeClass( 'normal' );
				$('#game').css({
					'display':'block',
					'position':'fixed',
					'top':clickPositions.y+'px',
					'left':clickPositions.x+'px',
					'width':0,
					'height':0
				});
				setTimeout(function(){
					$('#game').addClass( 'normal' );
				},0);
				setTimeout(function() {
					$('#game').removeAttr( 'style' );
					core.initialize();
					core.start( clickPositions );
				},350);
			}
		}
	};

	// Can't use touch events because then you wouldn't
	// be able to scroll. 
	$( document ).click( startGame );

})( jQuery );