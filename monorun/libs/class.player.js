/**
 *
 * @project        monorun
 * @file           class.player.js
 * @description    Handles the player object in the game
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function Player( painter ) {
	this.mouseHandler = null;  // MouseHandler object, see class.mousehandler.js
	this.rendered = null;      // Object, rendered canvas object
	this.pixelMap = [];        // PixelMap object, The pixel map representation of this.rendered
	this.painter = null;       // Painter object, The main painter object that renders to screen
	this.position = {          // Object, current position of the player
		x: 478,
		y: 239
	};

	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 * @param painter (object) the main painter object
	 *
	 */
	this.initialize = function( painter ) {
		this.painter = painter;
		this.rendered = this.render();
		this.pixelMap = painter.pixelCollider.buildPixelMap( this.rendered, 3 );
		this.mouseHandler = new mousehandler( this.painter.getCanvasSelector() );
		this.setupEvents();
	}

	/*
	 * private function render()
	 *
	 * Renders our player image
	 *
	 * @param canvas-elemtn, The rendered canvas element
	 *
	 */
	this.render = function() {
		var userImage = document.createElement( 'canvas' );
		var ctx = userImage.getContext( '2d' );

		ctx.beginPath();
		ctx.arc(25, 25, 15, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#161b1d';
		ctx.stroke();

		return userImage;
	}

	/*
	 * private function collision()
	 *
	 * Collision callback, fired when something collides with
	 * player on the same z-layer
	 *
	 */
	this.collision = function() {
		core.end();
		console.log('death has occured');
	},

	/*
	 * public function renderPlayer()
	 *
	 * Renders our player object to the painter
	 *
	 */
	this.renderPlayer = function() {
		var pixelMap = {
			pixelMap: this.pixelMap,
			width: 50,
			height: 50,
			x: this.position.x-25,
			y: this.position.y-25
		};

		this.painter.addToQueue( 
			'user',                   // ID
			this.rendered,            // Image
			this.position.x-25,       // X position
			this.position.y-25,       // Y position
			1,                        // z layer (collision layer) 
			pixelMap,                 // Pixel map (for collision detection)
			this.collision.bind(this) // Collision callback
		);
	};

	/*
	 * public function updatePositions()
	 *
	 * Callback that is fired from the mousehandler on movement.
	 * Updates the player positions on the screen.
	 *
	 */
	this.updatePositions = function(x,y) {
		this.position = {
			x: x,
			y: y
		};
	};

	/*
	 * private function setupEvents()
	 *
	 * Sets up our events.
	 *
	 */	
	this.setupEvents = function() {

		// Set callback for mousehandler
		this.mouseHandler.setCallback(
			'move', 
			this.updatePositions.bind( this ) 
		);

		// Set callback for painter on finish frame
		this.painter.registerCallback( 'user', this.renderPlayer.bind(this) );
	};

	// Initialize the player
	this.initialize( painter );

	// Return our outward facing interface.
	return {
		updatePositions: this.updatePositions.bind( this ),
		renderPlayer: this.renderPlayer.bind( this )
	};
}