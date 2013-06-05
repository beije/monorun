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

		this.externalApi.registerPlayer(function(resp){});

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

		this.latestUserScore.username = username;

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
				this.updateShareButtonUrls();
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

		var currentScore = {
			id: 0,
			secretkey: 0,
			position: -1
		};


		if( this.latestUserScore ) {
			currentScore = this.latestUserScore;
		}

		var loopend = ( this.latestUserScore.position > 10 ? data.length - 2 : data.length );

		//high-score-results
		var fragment = document.createDocumentFragment();
		for( var i = 0; i < loopend; i++ ) {			
			var row = this.createHighscoreRow( i+1, ( data[i].id == currentScore.id ? currentScore.username : data[i].username ), data[i].score, ( data[i].id == currentScore.id ? true : false ) );
			fragment.appendChild( row );
		}

		if( loopend < data.length ) {
			var emptyRow = this.createHighscoreRow( '...', '...', '...', false );
			fragment.appendChild( emptyRow );

			var userRow = this.createHighscoreRow( currentScore.position, ( currentScore.username ? currentScore.username : 'Abra kadabra!' ), currentScore.score, true );
			fragment.appendChild( userRow );
		}

		resultsContainer[0].appendChild( fragment );

		this.updateShareButtonUrls();
	},
	createHighscoreRow: function( position, username, score, highlight ) {
		var row = document.createElement('tr');

		if( highlight ) {
			row.className = 'highlight';
		}

		var positionCell = document.createElement( 'td' );
		this.setText( position, positionCell );

		var userNameCell = document.createElement( 'td' );
		this.setText(username, userNameCell );

		var scoreCell = document.createElement( 'td' );
		this.setText(score, scoreCell );

		row.appendChild( positionCell );
		row.appendChild( userNameCell );
		row.appendChild( scoreCell );

		return row;
	},
	setText: function(msg, targetElement ) {
		if ( 'innerText' in targetElement ) {
			targetElement.innerText = msg;
		} else {
			targetElement.textContent = msg;
		}		
	},
	updateShareButtonUrls: function() {
		var baseUrl = document.URL.split( '#' )[0];

		var urlToIcon = "http://dev.monorun.com/img/facebook-shareicon.png";

		var urlToScore = baseUrl + ( this.latestUserScore && this.latestUserScore.secretkey ? '#'+this.latestUserScore.id : '' );
		var twitterUrl = "http://twitter.com/share?url=" + encodeURIComponent( urlToScore ) + "&text=" + encodeURIComponent( ( this.latestUserScore && this.latestUserScore.secretkey ? "I just played #monorun beat my score!" : 'Play #monorun!' ) );
		// Using the deprecated sharer.php
		var facebookUrl = "http://www.facebook.com/sharer.php?s=100&p[url]=" + encodeURIComponent( urlToScore ) + "&p[images][0]=" + encodeURIComponent ( urlToIcon ) + "&p[title]=" + encodeURIComponent( ( this.latestUserScore && this.latestUserScore.secretkey ? "I just played monorun beat my score!" : 'Play monorun!' ) );
		
		$( '.btn.twitter' ).attr( 'href', twitterUrl );
		$( '.btn.facebook' ).attr( 'href', facebookUrl );
	}
};
userInterface.initialize();