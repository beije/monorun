/**
 *
 * @project        monorun
 * @file           class.mouseHandler.js
 * @description    Handles mouse and touch movements, return x and y coordinates
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function mousehandler( targetElement ) {

	this.$element = null;	// The element which we bind the mouse to
	this.active = false;    // If tracking is active
	this.positions = {      // Current positions
		x: 0,
		y: 0
	};

	// Callbacks
	this.callbacks = {
		start: function() {}, // Fires on movement start
		move: function() {},  // Fires while movement is active
		end: function() {}    // Fires at end of movement
	}

	// Mousemove / touchmove
	// Mousedown / touchstart
	// Mouseup / touchend

	// Listeners that we bind to
	// TODO: Implement touce listener
	
	this.movements = {
		move: [
			'mousemove',
			'touchmove',
			'MSPointerMove'
		],
		start: [
			'mousedown',
			'touchstart',
			'MSPointerDown'
		],
		end: [
			'mouseup',
			'touchend',
			'MSPointerUp'
		]
	};
	
	/* Window phone */
	/*
	this.movements = {
		move: 'MSPointerMove',
		start: 'MSPointerDown',
		end: 'MSPointerUp'
	};
	*/
	/* Normal touch devices */
	/*
	this.movements = {
		move: 'touchmove',
		start: 'touchstart',
		end: 'touchend'
	};
	*/

	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 */
	this.initialize = function( targetElement ) {
		this.$element = $( targetElement );
		this.setupEvents();
	}

	/*
	 * private function setupEvents()
	 *
	 * Sets up our events.
	 *
	 */
	this.setupEvents = function() {

		for( var i = 0; i < this.movements.move.length; i++ ) {
			this.$element.bind( 
				this.movements.move[i],
				this.move.bind( this )
			);
		}
		for( var i = 0; i < this.movements.start.length; i++ ) {
			this.$element.bind( 
				this.movements.start[i],
				this.start.bind( this )
			);
		}
		for( var i = 0; i < this.movements.end.length; i++ ) {
			this.$element.bind( 
				this.movements.end[i],
				this.end.bind( this )
			);
		}
	};

	/*
	 * private function move()
	 *
	 * Fires while mouse is moving, and state
	 * is active. Updates the internal position object.
	 *
	 */
	this.move = function( e ) {
		e = e || window.event;
		e = e.originalEvent || e; // Damn it jquery.
		e.preventDefault();

		// Windows phone / Mobile IE10
		// Doesn't use "touches"
		if( e.touches != undefined ) {
			e = e.touches[0];
		}

		if( this.active ) {
			this.positions = {
				x: e.clientX,
				y: e.clientY
			};

			// Fire external callback on every move
			this.callbacks.move( e.clientX, e.clientY );
		}

		return false;
	}

	/*
	 * private function start()
	 *
	 * Starts the tracking
	 *
	 */
	this.start = function( e ) {
		e = e || window.event;
		e.preventDefault();

		// Fire external callback
		this.callbacks.start();
		// Set stat to active
		this.active = true;

		return false;
	}

	/*
	 * private function end()
	 *
	 * Fires on end of the tracking
	 *
	 */
	this.end = function( e ) {
		e = e || window.event;
		e.preventDefault();

		// Fire external callback
		this.callbacks.end();
		// Set stat to inactive
		this.active = false;

		return false;
	}

	/*
	 * public function setCallback()
	 *
	 * Sets a callback
	 *
	 * @param type (String) What callback to bind to (start|move|end) 
	 * @param callback (function) The function that will be called
	 *
	 */
	this.setCallback = function( type, callback ) {
		this.callbacks[type] = callback;
	}

	/*
	 * public function getPositionX()
	 *
	 * Returns current x-position
	 *
	 * @return Int
	 *
	 */
	this.getPositionX = function() {
		return this.positions.x;
	}

	/*
	 * public function getPositionY()
	 *
	 * Returns current y-position
	 *
	 * @return Int
	 *
	 */
	this.getPositionY = function() {
		return this.positions.y;
	}

	// Initialize the handler
	this.initialize( targetElement );

	// Return our outward facing interface.
	return {
		x: this.getPositionX.bind( this ),
		y: this.getPositionY.bind( this ),
		setCallback: this.setCallback.bind( this )
	};
}