/**
 *
 * @project        monorun
 * @file           interface.js
 * @description    Shows the different screens and communicates
 *                 with the backend through class.apiinterface.js
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

var userInterface = {
	screens: [                        // Array, All the screens that are available
		'start-screen',               // Start screen, only screen where you can start the game
		'submit-score-screen',        // Submit screen, where the user can submit a high score
		'high-score-screen'           // High score screen, where we can view the high score list
	],
	externalApi: null,                // Object, external api interface object, created from class.apiinterface.js
	currentScreen: 'start-screen',    // String, the screen that is currently visible
	latestUserScore: null,            // Object, the last object that the user has received from the back end after score submittal


	/*
	 * public function initialize()
	 *
	 * Prepares the object
	 *
	 */
	initialize: function() {
		this.externalApi = new apiInterface();
		this.setupEvents();

		// Register user for the backend
		this.externalApi.registerPlayer(function(resp){});

	},

	/*
	 * public function setupEvents()
	 *
	 * Sets up different events
	 *
	 */
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

		// High score submittal screen
		// When user adds something in the input field,
		// update the submit button
		$( '#name' ).change(function( e ){
			e = e || window.event;
			if( this.value != '' ) {
				$( '.btn.update-username' ).html( 'Claim high score!' );
			} else {
				$( '.btn.update-username' ).html( 'View high score!' );
			}
		});
		$( '#name' ).keyup(function( e ){
			e = e || window.event;
			if( this.value != '' ) {
				$( '.btn.update-username' ).html( 'Claim high score!' );
			} else {
				$( '.btn.update-username' ).html( 'View high score!' );
			}
		});

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

	/*
	 * public function postHighscore()
	 *
	 * Post's a highscore to the back end
	 *
	 */
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

	/*
	 * public function updateUsername()
	 *
	 * Updates the username of the last submitted
	 * score.
	 *
	 */
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

	/*
	 * public function showScreen()
	 *
	 * Switches screen modes.
	 *
	 * @param type (String) The screen we want to switch to
	 *
	 */
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

	/*
	 * public function updateHighscores()
	 *
	 * Updates the highscore list, highlights the last
	 * submitted score.
	 *
	 * @param data (Array) The high score list from backend
	 *
	 */
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

	/*
	 * public function createHighscoreRow()
	 *
	 * Creates a <tr> element with the cells for a row in the
	 * highscore
	 *
	 * @param position (Int) The position number in the table
	 * @param username (String) The username
	 * @param score (Int) The score that should be visible
	 * @param highlight (Boolean)(optional) If this row should be highlighted
	 *
	 * @return DOM-object, the row
	 *
	 */
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
		if( parseInt( score ) == score ){
			this.setText( Math.round( score/1000 ), scoreCell );
		} else {
			this.setText( score, scoreCell );
		}

		row.appendChild( positionCell );
		row.appendChild( userNameCell );
		row.appendChild( scoreCell );

		return row;
	},

	/*
	 * public function setText()
	 *
	 * Safely set's text in a DOM element
	 *
	 * @return msg (String) The message we want to set
	 * @return tagetElement (DOM-object) The target element which should contain the message
	 *
	 * @return object An object with the real sizes.
	 *
	 */
	setText: function(msg, targetElement ) {
		if ( 'innerText' in targetElement ) {
			targetElement.innerText = msg;
		} else {
			targetElement.textContent = msg;
		}		
	},

	/*
	 * public function updateShareButtonUrls()
	 *
	 * Updates the text and links on the facebook
	 * and twitter share buttons depending on state.
	 * (If the user has played or not.)
	 *
	 */
	updateShareButtonUrls: function() {
		var baseUrl = document.URL.split( '#' )[0];

		var urlToIcon = "http://dev.monorun.com/img/facebook-shareicon.png";

		var urlToScore = baseUrl + ( this.latestUserScore && this.latestUserScore.secretkey ? '#'+this.latestUserScore.id : '' );
		var twitterUrl = "http://twitter.com/share?url=" + encodeURIComponent( urlToScore ) + "&text=" + encodeURIComponent( ( this.latestUserScore && this.latestUserScore.secretkey ? "Beat my high score before it decays! #monorun!" : ' How long can you stay positive? #monorun!' ) );
		// Using the deprecated sharer.php
		var facebookUrl = "http://www.facebook.com/sharer.php?s=100&p[url]=" + encodeURIComponent( urlToScore ) + "&p[images][0]=" + encodeURIComponent ( urlToIcon ) + "&p[title]=" + encodeURIComponent( ( this.latestUserScore && this.latestUserScore.secretkey ? "Beat my high score before it decays! " : 'How long can you stay positive?' ) );
		
		$( '.btn.twitter' ).attr( 'href', twitterUrl );
		$( '.btn.facebook' ).attr( 'href', facebookUrl );
	}
};
// Initialize
userInterface.initialize();