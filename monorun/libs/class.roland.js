/**
 *
 * @project        monorun
 * @file           class.preanimate.js
 * @description    Handles the enemy object, called Roland :)
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function roland( id, painter ) {
	this.painter = null;                      // Painter object, The main painter object that renders to screen
	this.rendered = null;                     // Object, rendered canvas object
	this.calculatedPositions = [];            // Array, current precalculated animation path
	this.preAnimator = null;                  // Preanimator object, the object that precalculates paths
	this.currentPositions = {                 // Object, current position of Roland
		x: 0,
		y: 0
	};
	this.speed = 50;                          // Int, the speed of rolands animation, lower == faster

	this.id = parseInt( Math.random()*1000 ); // (String/integer), the unique default id of Roland
	this.positionCounter = 0;                 // Int, current position in calculatedPositions


	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 * @param id (String/integer) The unique id of this instance
	 * @param painter (object) the main painter object
	 *
	 */
	this.initialize = function( id, painter ) {
		this.id = id || this.id;
		this.painter = painter;
		this.preAnimator = new preAnimate();
		this.render( 'assets/roland_60x60.png', 4);
		this.setupEvents();
	}

	/*
	 * private function setupEvents()
	 *
	 * Sets up our events.
	 *
	 */
	this.setupEvents = function() {
		this.painter.registerCallback( this.id, this.animateCallback.bind( this ) );
	};

	/*
	 * private function generateNewPosition()
	 *
	 * Generates a new random animation path for this instance
	 *
	 */
	this.generateNewPosition = function() {
		this.positionCounter = 0;
		var size = this.painter.getCanvasSize();
		var newX = parseInt( Math.random() * size.width );
		var newY = parseInt( Math.random() * size.height );

		this.preAnimator.setStartPosition( this.currentPositions.x, this.currentPositions.y );
		this.preAnimator.setEndPosition( newX, newY );
		this.preAnimator.setSpeed( this.speed );
		this.calculatedPositions = [];
		this.calculatedPositions = this.preAnimator.getPositions();
	}

	/*
	 * private function animateCallback()
	 *
	 * The callback that the painter runs on fram completion
	 * so that we can add a new item in the render queue for 
	 * the painter. The position is updated to the next position
	 * int the calculatedPositions array.
	 *
	 */	
	this.animateCallback = function() {

		if( this.rendered === null ) {
			setTimeout( this.animateCallback.bind(this),10 );
		}

		if( this.positionCounter >= this.calculatedPositions.length ) {
			this.generateNewPosition()
		}

		this.currentPositions.x = this.calculatedPositions[this.positionCounter].x;
		this.currentPositions.y = this.calculatedPositions[this.positionCounter].y;

		var pixelMap = {
			pixelMap: this.pixelMap,
			width: 70,
			height: 70,
			x: this.currentPositions.x,
			y: this.currentPositions.y
		};

		this.painter.addToQueue( 
			this.id,                  // id
			this.rendered,            // Image
			this.currentPositions.x,  // x position
			this.currentPositions.y,  // y position
			1,                        // z layer (or collision layer)
			pixelMap                  // Pixel data (for collision detection)
		);

		this.positionCounter++;
	};

	/*
	 * public function render()
	 *
	 * Renders out Roland as a canvas element
	 *
	 * @param imageUrl (String) The url to the image of Roland
	 * @param resolution (Int) The resolution used when creating a pixelmap
	 *
	 */
	this.render = function( imageUrl, resolution ) {
		
		// Render roland :)
		this.canvas = document.createElement( 'canvas' );
		var ctx = this.canvas.getContext( '2d' );
		
		ctx.beginPath();
		ctx.arc(35, 35, 25, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#161b1e';
		ctx.fill();
		ctx.lineWidth = 12;
		ctx.strokeStyle = '#56c4db';
		ctx.stroke();
		//console.log( this.painter );
		this.pixelMap = this.painter.pixelCollider.buildPixelMap( this.canvas, 3 );
		this.rendered = this.canvas;
		
/*
		this.imageObj = new Image();

		this.imageObj.onload = function() {
			var ctx = this.canvas.getContext( '2d' );
			ctx.drawImage( this.imageObj,0,0);
			this.pixelMap = this.painter.pixelCollider.buildPixelMap( this.canvas, resolution );
			this.rendered = this.canvas;
		}.bind( this );

        this.imageObj.src = imageUrl;
*/
	}

	/*
	 * public function setSpeed()
	 *
	 * Sets the animation speed for roland
	 *
	 * @param speed (int) Lower == Faster
	 *
	 */
	 this.setSpeed = function( speed ) {
	 	this.speed = speed;
	 };


	/*
	 * public function getCurrentPositions()
	 *
	 * Gives the current position of this roland
	 *
	 * @return object {x:, y:}
	 *
	 */
	 this.getCurrentPositions = function() {
	 	return {
	 		x: this.currentPositions.x,
	 		y: this.currentPositions.y
	 	};
	 }

	// Initialize the handler
	this.initialize( id, painter );

	// Return our outward facing interface.
	return {
		render: this.render.bind( this ),
		setSpeed: this.setSpeed.bind( this ),
		getPositions: this.getCurrentPositions.bind( this )
	}
}