/**
 *
 * @project        monorun
 * @file           core.js
 * @description    Binds everything together
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

var core = {
	player: null,                   // Object, Player object created from class.player.js
	painter:null,                   // Object, Painter object created from class.painter.js
	enemies: [],                    // Array, Contains all the enemy objects (class.roland.js)
	rolandSpawn: null,              // Object, Sound object creataed from class.sound.js
	backgroundSound: null,          // Object, Sound object created from class.sound.js
	startTime: 0,                   // Int, When the game started
	endTime: 0,                     // Int, When the game ended
	timer: null,                    // Timer, Checks the user's position every 200ms
	rolandTimer: null,              // Timer, handles the spawning of the rolands every 2 seconds
	lineHandler:null,               // Object, lineHandler object create from class.linehandler.js
	screenData: {},                 // Object, contains data about the user's screen
	playerLastPosition: {},         // Object, contains data about the last recorded user position
	latestPlayerPositionCheck: 0,   // Int, When was the last time we checked the user's position
	gameStarted: false,             // Boolean, true if game has started
	gameEnded: true,                // Boolean, true if game has ended

	/*
	 * public function initialize()
	 *
	 * Initializes the core, registers all objects that can live
	 * through out the complete session (for restarting game, see start() and end())
	 *
	 */
	initialize: function() {
		this.screenData = this.calculateCanvasSize();

		$( '#game' ).attr( 'width', this.screenData.width + 'px'  );
		$( '#game' ).attr( 'height',this.screenData.height + 'px'  );
		$( '#message' ).hide();
		
		this.painter = new painter( '#game' );
		this.lineHandler = new Line($( '#game' )[0] );
		this.lineHandler.setLineWidth( 10 );
		this.lineHandler.setLineColor( 'rgba(87,197,219,0.1)' );

		this.rolandSpawn = new SoundHandler( 'sound/sinus.mp3' );
		
		// Because of bad support of the looping of sound
		// we're keeping this off
		//this.backgroundSound = new SoundHandler( 'sound/emptiness.mp3' );

		this.setupVisibility();
		this.resizeCanvas();
	},

	/*
	 * public function setupVisibility()
	 *
	 * Adds eventlisteners to visibility change, kills the game
	 * if the game loses focus (Called once from initialize)
	 *
	 */
	setupVisibility: function() {

		// Copied from MDN
		// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API#Example
		var visibilityChange; 
		if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
			visibilityChange = "visibilitychange";
		} else if (typeof document.mozHidden !== "undefined") {
			visibilityChange = "mozvisibilitychange";
		} else if (typeof document.msHidden !== "undefined") {
			visibilityChange = "msvisibilitychange";
		} else if (typeof document.webkitHidden !== "undefined") {
			visibilityChange = "webkitvisibilitychange";
		}

		// If page loses visbility, end the game
		$( document ).bind(
			visibilityChange,
			function() {
				if( this.gameEnded == false ){
					this.end();
				}
			}.bind(this)
		);
	},

	/*
	 * public function connectingRoland()
	 *
	 * Draws lines between rolands (in-pair) function
	 * hi-jacks the painter object and draws the lines
	 * before the "rendering"
	 *
	 */
	connectingRoland: function() {
		for( var i = 0; i < this.enemies.length; i = i + 2 ) {
			if( !this.enemies[i+1] ) break;
			var basePos = this.enemies[i].getPositions();
			var newPos = this.enemies[i+1].getPositions();
			this.lineHandler.setStartPosition( basePos.x+30, basePos.y+30 );
			this.lineHandler.setEndPosition( newPos.x+30, newPos.y+30 );
			this.lineHandler.getLine();
		}

	},

	/*
	 * public function updateTimer()
	 *
	 * Runs every 200ms, check the user position, if the
	 * user stands still for too long (500ms) it redirects a 
	 * random roland to the user position
	 *
	 */
	updateTimer: function() {
		var now = new Date().getTime();

		// If user stands on the same position for over 100 milliseconds
		// redirect a random roland to that location
		if( this.latestPlayerPositionCheck == 0 ) {
			this.latestPlayerPositionCheck = now+5000;
		}
		var currenPlayerPosition = this.player.getPlayerPosition();
		if( currenPlayerPosition.x == this.playerLastPosition.x && currenPlayerPosition.y == this.playerLastPosition.y ) {
			if( ( now - this.latestPlayerPositionCheck ) > 500 ) {
				// Redirect roland
				this.enemies[ Math.round( Math.random()*(this.enemies.length-1) ) ].generateNewPosition( currenPlayerPosition.x, currenPlayerPosition.y );
				this.latestPlayerPositionCheck = now;
			}
		} else {
			if( this.latestPlayerPositionCheck < now ) {
				this.latestPlayerPositionCheck = now;
			}
		}
		this.playerLastPosition = currenPlayerPosition;
	},

	/*
	 * public function start()
	 *
	 * Starts the game
	 *
	 */
	start: function( startPosition ) {
		this.gameStarted = true;
		this.gameEnded = false;
		this.latestPlayerPositionCheck = 0;
		// Translate start position to canvas position
		if( startPosition ) {
			startPosition.x = ( startPosition.x / $( '#game' ).width() ) * this.screenData.width;
			startPosition.y = ( startPosition.y / $( '#game' ).height() ) * this.screenData.height;
		}

		this.startTime = new Date().getTime();
		this.player = new Player( this.painter );

		if( startPosition ) {
			this.player.updatePositions( startPosition.x, startPosition.y );
		}

		this.painter.registerCallback(
			'connectingRoland', 
			this.connectingRoland.bind( this ),
			'preFrameRender'
		);
		//this.backgroundSound.play( true );
		this.resizeCanvas();
		this.setupEvents();
	},

	/*
	 * public function appendRoland()
	 *
	 * Spawns a roland to the playing field every 2 seconds
	 *
	 */
	appendRoland: function() {
		//if( this.enemies.length > 5 ) return false;
		var index = this.enemies.length;
		// Ugly hack with sending in a prerendered roland pixelmap
		this.enemies.push( new roland( 'rolle'+index , this.painter, ( this.enemies.length != 0 ? this.enemies[0].getPixelMap() : false ) ) );
		this.enemies[index].setSpeed( parseInt( Math.random()*100 )+20 );
		this.rolandSpawn.play();
	},

	/*
	 * public function end()
	 *
	 * Ends the game, redirects to add high score screen
	 * (is usually called from class.player.js)
	 *
	 */
	end: function() {
		this.painter.stop();
		//this.backgroundSound.stop();
		clearInterval( this.rolandTimer );
		clearInterval( this.timer );

		this.gameEnded = true;
		this.gameStarted = false;

		this.endTime = new Date().getTime();
		userInterface.postHighScore( (this.endTime - this.startTime) );

		document.getElementById( 'latest-run-score' ).innerHTML = (this.endTime - this.startTime);
		document.getElementById( 'latest-run-life' ).innerHTML = Math.round( (this.endTime - this.startTime) / 1000 );
		this.enemies = [];

		// Freeze frame, and remove game after 2 seconds
		setTimeout(
			function(){
				// Show game screen
				userInterface.showScreen( 'submit-score-screen' );
				
				// Rough end game animation
				$( '#game' ).removeClass( 'normal' ).addClass( 'gameover' );
				setTimeout(function(){
					$( '#game' ).removeAttr('class');
				},500);

				// Reset engine
				this.initialize();

			}.bind(this),
			1000
		);
	},

	/*
	 * public function setupEvents()
	 *
	 * Sets up variouos events
	 *
	 */
	setupEvents: function() {
		$(window).resize(
			core.resizeCanvas.bind(this)
		);

		this.timer = setInterval(
			this.updateTimer.bind( this ),
			200
		);

		this.rolandTimer = setInterval(
			this.appendRoland.bind( this ),
			2000
		);
	},

	/*
	 * public function resizeCanvas()
	 *
	 * Makes the game device agnostic, any screen
	 * should be able to render the game.
	 *
	 */
	resizeCanvas: function() {

		this.screenData = this.calculateCanvasSize();
	
		if( this.player ){
			this.player.setScreenData( this.screenData );
		}

		var w = this.screenData.width;
		var h = this.screenData.height;

		$( '#game' ).attr( 'width', w + 'px'  );
		$( '#game' ).attr( 'height', h + 'px'  );

	},

	/*
	 * public function calculateCanvasSize()
	 *
	 * Because monorun! uses the virtual viewport for the dom
	 * tree, we get the wrong screen size. This function
	 * tries to get the correct size so the game (canvas-tag)
	 * can render in native resolution instead of virtual.
	 *
	 * @return object An object with the real sizes.
	 *
	 */
	calculateCanvasSize: function() {

		var windowWidth = window.outerWidth;
		var windowHeight = window.outerHeight;

		var iWindowWidth = window.innerWidth;
		var iWindowHeight = window.innerHeight;

		var screenWidth = screen.width;
		var screenHeight = screen.height;

		var availableScreenWidth = screen.availWidth;
		var availableScreenHeight = screen.availHeight;

		var isRetina = false;

		//
		// DUCK TEST
		// (Devices that lack window.devicePixelRatio like Windows Phone 8)
		//

		// Check if the browser has any extra stuff around it
		// Mobiles don't have that stuff
		if( windowWidth == iWindowWidth && windowHeight == iWindowHeight ) {
			// Check if the complete screen is available
			// Computers usually have taskbars, so the browser doesn't have full access
			if( screenWidth == availableScreenWidth && screenHeight == availableScreenHeight ) {

				// Check that the window and screen are not the same size
				// and that the window is smaller than the screen
				if( windowWidth < screenWidth && windowHeight < screenHeight ) {
					
					// If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck.
					isRetina = true;
				}
			}
		}

		//
		// For other devices that have window.devicePixelRatio
		//
		if( window.devicePixelRatio ) {
			if( window.devicePixelRatio > 1 ){
				isRetina = true;
				screenWidth = iWindowWidth * window.devicePixelRatio;
				screenHeight = iWindowHeight * window.devicePixelRatio;
			} else {
				// Override duck test
				isRetina = false;
			}
		}

		if( isRetina ) {

			// throw around the height and width if the orientation is
			// landscape on the device.
			// And only if height is larger than width. Windows Phone 8
			// doesn't update the screen.width/height on re-orientation
			if ( window.matchMedia("(orientation: landscape)").matches ) {
				if( screenWidth < screenHeight ) {
					var newHeight = screenWidth;
					var newWidth = screenHeight;
					screenWidth = newWidth;
					screenHeight = newHeight;
				}
			}

			return {
				isRetina: isRetina,
				width: screenWidth,
				height: screenHeight
			}
		} else {
			return {
				isRetina: isRetina,
				width: iWindowWidth,
				height: iWindowHeight
			}
		}
	}
};
