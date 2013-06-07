/**
 *
 * @project        monorun
 * @file           class.preanimate.js
 * @description    Pre-calculates accelerated movement paths.
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function preAnimate() {

	// Array, Contains the latest calculated path
	this.positions = [];

	// Object, the start position of the object
	this.startPosition = {
		x: 0,
		y: 150
	};

	// Object, the end position of the object
	this.endPosition = {
		x: 100,
		y: 45
	};

	// Int, speed of the object, lower == faster
	this.speed = 20;

	// Object, the positions used on the latest calculation
	this.calculatedPositions = {
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	};

	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 */
	this.initialize = function() {}

	/*
	 * private function calculateAnimation()
	 *
	 * Calculates every step in the animation.
	 * The steps are saved to this.positions
	 *
	 * @return array, the positions
	 *
	 */
	this.calculateAnimation = function(){
		this.positions = [];
		xPos = false;
		yPos = false;
		counter = 0;
		// Calculate the difference between star and end
		difference = { 
			x: (this.endPosition.x > this.startPosition.x ? this.endPosition.x - this.startPosition.x : this.startPosition.x - this.endPosition.x ), 
			y: (this.endPosition.y > this.startPosition.y ? this.endPosition.y - this.startPosition.y : this.startPosition.y - this.endPosition.y ) 
		};

		// The latest correct positions
		latestCorrectPosition = { 
			x:this.startPosition.x, 
			y:this.startPosition.y  
		};

		while( !yPos || !xPos ) {
			// Calculate next position
			x = (Math.sin(counter/this.speed)*difference.x );
			y = (Math.sin(counter/this.speed)*difference.y );

			// Check if we're done with any of the axises
			// if we are, set the last known correct position (end position)
			latestCorrectPosition.x = ( xPos === false ? x : difference.x );
			latestCorrectPosition.y = ( yPos === false ? y : difference.y );

			// Save the x and y position as one of the steps in the animation
			// And calculate the REAL position of the object
			this.positions.push( {
				x: (this.endPosition.x > this.startPosition.x ? this.startPosition.x + latestCorrectPosition.x : this.startPosition.x - latestCorrectPosition.x ),
				y: (this.endPosition.y > this.startPosition.y ? this.startPosition.y + latestCorrectPosition.y : this.startPosition.y - latestCorrectPosition.y )
			} );
			
			// Check if one of the axises are done, and if they are
			// flag them as so.
			if( x >= difference.x-1 ) {
				xPos = true;
			}
			if( y >= difference.y-1 ) {
				yPos = true;
			}

			counter++;

			// For safety precautions :)
			// if the animations is over 500 steps, kill it. kill it with fire.
			if( counter > 500 ) {
				yPos = true;
				xPos = true;
				break;
			}
		}

		// Push in as the last step the complete end positions
		this.positions.push( {
			x: this.endPosition.x,
			y: this.endPosition.y
		} );

		return this.positions;
	}

	/*
	 * public function setStart()
	 *
	 * Sets the start position
	 *
	 * @param x (integer) the start x position
	 * @param y (integer) the start y position
	 *
	 */
	this.setStart = function( x, y ) {
		this.startPosition = {
			x: x,
			y: y
		};
		this.calculatedPositions = {
			startX: x,
			startY: y,
		};
	}

	/*
	 * public function setEnd()
	 *
	 * Sets the end position
	 *
	 * @param x (integer) the end x position
	 * @param y (integer) the end y position
	 *
	 */
	this.setEnd = function( x, y ) {
		this.endPosition = {
			x: x,
			y: y
		};
		this.calculatedPositions = {
			endX: x,
			endY: y
		};
	}

	/*
	 * public function setSpeed()
	 *
	 * Sets the animation speed position
	 *
	 * @param speed (integer) the animation speed, lower == faster
	 *
	 */
	this.setSpeed = function( speed ) {
		this.speed = speed;
	}

	/*
	 * public function getPositions()
	 *
	 * Gets the complete animation path. If the calculatedPositions haven't
	 * changed since last render, we return the cached positions, otherwise
	 * we recalculate the whole sequence.
	 *
	 * @return array
	 *
	 */
	this.getPositions = function() {
		recalculate = false;
		if( 
			this.calculatedPositions.endX !== this.endPosition.x ||
			this.calculatedPositions.endY !== this.endPosition.y ||
			this.calculatedPositions.startX !== this.startPosition.x ||
			this.calculatedPositions.startY !== this.startPosition.y
		) {
			// Recalculate
			this.calculateAnimation();
		}

		return this.positions;
	}

	// Initialize the player
	this.initialize();

	// Return our outward facing interface.
	return {
		setStartPosition: this.setStart.bind( this ),
		setEndPosition: this.setEnd.bind( this ),
		setSpeed: this.setSpeed.bind( this ),
		getPositions: this.getPositions.bind( this )
	};
};