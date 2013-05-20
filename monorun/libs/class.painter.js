/**
 *
 * @project        monorun
 * @file           class.painter.js
 * @description    Handles painting to a canvas with render queues
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function painter( canvas ) {
	this.canvasSelector = '';         // String, Selector used for finding the canvas
	this.$canvas = null;              // jQuery object, The canvas
	this.context = null;              // Context, the canvas 2d context
	this.renderQueue = [];              // Array, contains the render queue for next frame 
	this.enqueuedImages = {};         // Array, contains the ID of all the items in the render queue, used for cross reference
	this.clearCanvas = false;         // Boolean, if the canvas should be cleard
	this.raf = null;                  // Timer, requestAnimationFrame timer
	this.currentRenderFrame = 0;      // Integer, current frame ID that is visible
	this.finishedFrameCallbacks = []; // Array, contains all the callbacks that should fire on frame finish
	this.pixelCollider = null;        // collisionDetection object, detects collisions on the z-layer (Public object!)

	// Get our prefixed cancelAnimationFrame function
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
		window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

	// Get our prefixed requestAnimationFrame function
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 * @param canvas (string), Selector for the canvas
	 *
	 */
	this.initialize = function( canvas ) {
		this.canvasSelector = canvas;
		this.$canvas = $( canvas );

		if( this.$canvas[0] && this.$canvas[0].getContext && this.$canvas[0].getContext('2d') ) {
			this.context = this.$canvas[0].getContext( '2d' );
		} else {
			throw "This browser doesn't support canvas";
		}

		this.pixelCollider = new collisionDetection();

		this.start();
	};

	/*
	 * private function setupEvents()
	 *
	 * Sets up our events.
	 *
	 */
	this.setupEvents = function() {};


	/*
	 * private function main()
	 *
	 * Our main render loop which runs on every
	 * requestAnimationFrame
	 *
	 */
	this.main = function() {
		
		// Check if we should clear the context
		if( this.renderQueue.length > 0 ) {
			this.clearcontext();
			this.renderQueue.sort( this.orderByZindex );
		}

		// Render out the queue
		for( var i = 0; i < this.renderQueue.length; i++ ) {
			if( !this.renderQueue[i].image ) continue; 
			this.context.drawImage( this.renderQueue[i].image, this.renderQueue[i].x, this.renderQueue[i].y );
		}

		// Collision detection
		// Loop through the render-que
		for( var i = 0; i < this.renderQueue.length; i++ ) {
			// Check that the image exists
			if( !this.renderQueue[i].image ) continue;

			// No use using this item as source if doesn't have
			// a callback.
			if( !this.renderQueue[i].collisionCallback ) continue; 

			var item = this.renderQueue[i];

			// Check that we have a pixelmap
			if( item.pixelMap != null ) {

				// Go through the queue again
				for( var n = 0; n < this.renderQueue.length; n++ ) {

					// Check that we're not going against the
					// same item
					if( i === n ) continue;

					// Check that we're on the same z-layer
					if( this.renderQueue[n].pixelMap != null && this.renderQueue[n].z == item.z ) {

						// Detect collision
						if( this.pixelCollider.hitTest( item.pixelMap, this.renderQueue[n].pixelMap ) ) {
							// Fire the collision callback after the function
							// is done with setTimeout.
							if( item.collisionCallback != false ) {
								setTimeout( item.collisionCallback, 0 );
							}
							if( this.renderQueue[n].collisionCallback != false ) {
								setTimeout( this.renderQueue[n].collisionCallback, 0 );
							}
						}
					}
				}
			}
		}


		// Clean render queue
		this.renderQueue = [];



		// Run end frame callbacks
		for( var i = 0; i < this.finishedFrameCallbacks.length; i++ ) {
			this.finishedFrameCallbacks[i].callback();
		}

		// Generate a new frame id
		this.currentRenderFrame = parseInt( Math.random()*1000 );

		// Rebind the requestAnimationFrame
		this.raf = requestAnimationFrame( this.main.bind( this ) );
	};

	/*
	 * private function clearcontext()
	 *
	 * Clears the context, aka removes everything in the canvas
	 *
	 */
	this.clearcontext = function() {
		// TODO, fix height width
		this.context.clearRect( 0 , 0 , 10000 , 10000 );
	}

	/*
	 * public function addToQueue()
	 *
	 * Adds item to the render queue, the item will be rendered
	 * at the next frame-rendering. If two items with the same ID
	 * is entered into the queue, only the second one will be rendered.
	 *
	 * @param id (string) A unique identifier for the item
	 * @param image (Object) The item which we wish to render out
	 * @param x (Int) The x position
	 * @param y (Int) The y position
	 * @param z (Int) (optional) The z position, on what collision layer
	 * @param pixelMap (Object) (optional) The pixel map representation of the object
	 * @param collisionCallback (function) (optional) A callback that fires on collision with other things on the same layer
	 *
	 */
	this.addToQueue = function( id, image, x, y, z, pixelMap, collisionCallback ) {
		
		// Set optional flags
		var z = z || 0;
		var collisionCallback = collisionCallback || false;
		var pixelMap = pixelMap || null;

		// Check if item already exists in queue
		// Add or overwrite to queue.
		if( this.enqueuedImages[id] === undefined ) {
			this.renderQueue.push({
				id: id,
				x: x,
				y: y,
				z: z,
				pixelMap: pixelMap,
				collisionCallback: collisionCallback,
				image: image
			});
			this.enqueuedImages[id] = this.renderQueue.length-1;
		} else {
			this.renderQueue[ this.enqueuedImages[id] ] = {
				id: id,
				x: x,
				y: y,
				z: z,
				pixelMap: pixelMap,
				collisionCallback: collisionCallback,
				image: image
			};			
		}
	};

	/*
	 * public function stop()
	 *
	 * Stops the painter from rendering frame
	 *
	 */
	this.stop = function() {
		if( this.raf ) {
			cancelAnimationFrame( this.raf );
			this.raf = null;
		}
	};

	/*
	 * public function start()
	 *
	 * Starts the painter rendering
	 *
	 */
	this.start = function() {
		this.main();
	};

	/*
	 * private function orderByZindex()
	 *
	 * Order an array with objects on property z
	 *
	 */
	this.orderByZindex = function(a,b) {
		return ( a.z < b.z ? -1 : ( a.z > b.z ? 1 : 0 ) );
	}

	/*
	 * public function getCurrentRenderFrame()
	 *
	 * Gives the current unique frame id (For polling)
	 *
	 * @return Int, unique frame id
	 *
	 */
	this.getCurrentRenderFrame = function() {
		return this.currentRenderFrame;
	}

	/*
	 * public function registerCallback()
	 *
	 * Registers a callback for specific event type
	 *
	 * @param id (String), the unique id of the callback (so we can unregister it)
	 * @param callback (function), the function that should fire on the event
	 * @param type (string)(optional), the event type, currently only supports finishedFrame
	 *
	 * @return boolean
	 *
	 */
	this.registerCallback = function( id, callback, type ) {
		if( !id || !callback ) {
			throw "Not all parameters where given";
		}

		if( !type ) {
			type = 'finishedFrame';
		}

		switch( type ) {
			case 'finishedFrame':
				this.finishedFrameCallbacks.push({
					id: id,
					callback: callback
				});
			break;
		};

		return true;
	};

	/*
	 * public function unregisterCallback()
	 *
	 * Removes a callback
	 *
	 * @param id (String), the unique id of the callback
	 * @param callback (function), the function that should fire on the event
	 * @param type (string)(optional), the event type, currently only supports finishedFrame
	 *
	 * @return boolean
	 *
	 */
	this.unregisterCallback = function( id, callback, type ) {
		if( !type ) {
			type = 'finishedFrame';
		}
		switch( type ) {
			case 'finishedFrame':
				newArr = array();
				for( var i = 0; i < this.finishedFrameCallbacks.length; i++ ) {
					if( this.finishedFrameCallbacks[i].id !== id ) {
						newArr.push( this.finishedFrameCallbacks[i] );
					}
				}
				this.finishedFrameCallbacks = newArr;
			break;
		}

		return true;
	}

	/*
	 * public function getCanvasSelector()
	 *
	 * Returns the canvas selector used to find the canvas
	 *
	 * @return String, canvas selector
	 *
	 */
	this.getCanvasSelector = function() {
		return this.canvasSelector;
	};
	
	/*
	 * public function getCanvasSize()
	 *
	 * Returns an object with the canvas dimensions
	 *
	 * @return object, canvas dimensions
	 *
	 */
	this.getCanvasSize = function() {
		return {
			width: this.$canvas.width(),
			height: this.$canvas.height()
		}
	};

	// Initialize the handler
	this.initialize( canvas );

	// Return our outward facing interface.
	return {
		pixelCollider: this.pixelCollider,
		addToQueue: this.addToQueue.bind( this ),
		stop: this.stop.bind( this ),
		start: this.start.bind( this ),
		getCanvasSelector: this.getCanvasSelector.bind( this ),
		getCurrentRenderFrame: this.getCurrentRenderFrame.bind( this ),
		getCanvasSize: this.getCanvasSize.bind( this ),
		registerCallback: this.registerCallback.bind( this ),
		unregisterCallback: this.unregisterCallback.bind( this )
	};
} 