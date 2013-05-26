var userInterface = {
	screens: [
		'start-screen',
		'submit-score-screen',
		'high-score-screen'
	],
	externalApi: null,
	currentScreen: 'start-screen',
	latestUserScore: null,
	initialize: function() {
		this.externalApi = new apiInterface();
		this.setupEvents();

		this.externalApi.registerPlayer(
			function(resp){
				console.log( 'Player registered against backend: ', resp );
			}
		);

	},
	setupEvents: function() {

		// Setup click events for internal redirection
		// buttons
		var buttons = $( '.btn' );
		for( var i = 0; i < buttons.length; i++ ) {
			var $curr = $( buttons[i] );
			if( $curr.attr('data-location') ) {
				$curr.click( function( e ) {
					e = e || window.event;
					e.preventDefault();
					var $t = $( e.target );
					userInterface.showScreen( $t.attr( 'data-location' ) );
					return false;
				});
			}
		}

		$( '.btn.update-username' ).click(
			function( e ) {
				e = e || window.event;
				e.preventDefault();

				this.updateUsername();
				this.showScreen( 'high-score-screen' );

				return false;
			}.bind( this )
		);

		// Setup post highscore event
	},
	postHighScore: function( score ) {
		this.externalApi.insertScore(
			score,
			'-',
			function( resp ){
				if( resp ) {
					this.latestUserScore = resp;
				} else {
					console.log( 'couldnt submit score' );
				}
			}.bind( this )
		);
	},
	updateUsername: function( username ) {
		if( !username ) {
			username = document.getElementById('name').value;
		} 
		if( this.latestUserScore ) {
			this.externalApi.updateScore(
				this.latestUserScore.id,
				this.latestUserScore.secretkey,
				username,
				function( resp ) { }
			);
		}
	},
	showScreen: function( type ) {
		for( var i = 0; i < this.screens.length; i++ ) {
			$( '#' + this.screens[i] ).hide();
		}
		this.currentScreen = type;
		switch( type ) {
			case 'start-screen':
				$( '#start-screen' ).show();
			break;
			case 'submit-score-screen':
				$( '#submit-score-screen' ).show();
			break;
			case 'high-score-screen':
				this.externalApi.fetchHighscores(
					this.updateHighScores.bind( this )
				);
			break;
		}
	},
	updateHighScores: function( data ) {
		var resultsContainer = $( '#high-score-screen' ).find( '.high-score-results' );
		resultsContainer.html('');
		$( '#high-score-screen' ).show();

		//high-score-results
		var fragment = document.createDocumentFragment();
		for( var i = 0; i < data.length; i++ ) {
			var row = document.createElement('tr');

			var position = document.createElement( 'td' );
			position.innerHTML = i+1;

			var userName = document.createElement( 'td' );
			userName.innerHTML = data[i].username;

			var score = document.createElement( 'td' );
			score.innerHTML = data[i].score;

			row.appendChild( position );
			row.appendChild( userName );
			row.appendChild( score );
			fragment.appendChild( row );
		}
		resultsContainer[0].appendChild( fragment );
	}
};
userInterface.initialize();