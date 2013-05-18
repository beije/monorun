function painter( canvas ) {
	this.canvasSelector = '';
	this.$canvas = null;
	this.context = null;
	this.renderQue = [];
	this.clearCanvas = false;
	this.raf = null;
	this.currentRenderFrame = 0;
	this.finishedFrameCallbacks = [];
	this.enqueuedImages = {};
	this.pixelCollider = null;

	// Get our prefixed cancelAnimationFrame function
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
		window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

	// Get our prefixed requestAnimationFrame function
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	this.initialize = function( canvas ) {
		console.log( 'Painter initialized' );
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

	this.setupEvents = function() {

	};

	this.main = function() {
		//console.log( 'Main loop' );
		if( this.renderQue.length > 0 ) {
			this.clearcontext();
		}

		for( var i = 0; i < this.renderQue.length; i++ ) {
			if( !this.renderQue[i].image ) continue; 
			this.context.drawImage( this.renderQue[i].image, this.renderQue[i].x, this.renderQue[i].y );
		}

		// Collision detection
		for( var i = 0; i < this.renderQue.length; i++ ) {
			if( !this.renderQue[i].image ) continue; 
			var item = this.renderQue[i];
			if( item.pixelMap != null ) {
				for( var n = 0; n < this.renderQue.length; n++ ) {
					if( i === n ) continue;
					if( this.renderQue[n].pixelMap != null && this.renderQue[n].z == item.z ) {
						if( this.pixelCollider.hitTest( item.pixelMap, this.renderQue[n].pixelMap ) ) {
							setTimeout( item.collisionCallback, 0 );
							setTimeout( this.renderQue[n].collisionCallback, 0 );
							//setTimeout( item.collisionCallback( item.id, this.renderQue[n].id ), 0 );
							//setTimeout( this.renderQue[n].collisionCallback( this.renderQue[n].id, item.id ), 0 );
						}
					}
				}
			}
		}


		// Clean render que
		this.renderQue = [];



		// Run end frame callbacks
		for( var i = 0; i < this.finishedFrameCallbacks.length; i++ ) {
			this.finishedFrameCallbacks[i].callback();
		}

		this.currentRenderFrame = parseInt( Math.random()*1000 );
		this.raf = requestAnimationFrame( this.main.bind( this ) );
	};

	this.clearcontext = function() {
		// TODO, fix height width
		this.context.clearRect( 0 , 0 , 10000 , 10000 );
	}

	// Todo: Add width and height for box-collision detection.
	this.addToQueue = function( id, image, x, y, z, pixelMap, collisionCallback ) {
		var z = z || 0;
		var collisionCallback = collisionCallback || function() {};
		var pixelMap = pixelMap || null;
		//console.log( id, pixelMap );
		if( this.enqueuedImages[id] === undefined ) {
			this.renderQue.push({
				id: id,
				x: x,
				y: y,
				z: z,
				pixelMap: pixelMap,
				collisionCallback: collisionCallback,
				image: image
			});
			this.enqueuedImages[id] = this.renderQue.length-1;
		} else {
			this.renderQue[ this.enqueuedImages[id] ] = {
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
	this.stop = function() {
		if( this.raf ) {
			cancelAnimationFrame( this.raf );
			this.raf = null;
		}
	};
	this.start = function() {
		this.main();
	};

	/* Gives the current frame id (For polling) */
	this.getCurrentRenderFrame = function() {
		return this.currentRenderFrame;
	}

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
	}
	this.getCanvasSelector = function() {
		return this.canvasSelector;
	}
	this.initialize( canvas );

	return {
		pixelCollider: this.pixelCollider,
		addToQueue: this.addToQueue.bind( this ),
		stop: this.stop.bind( this ),
		start: this.start.bind( this ),
		getCanvasSelector: this.getCanvasSelector.bind( this ),
		getCurrentRenderFrame: this.getCurrentRenderFrame.bind( this ),
		registerCallback: this.registerCallback.bind( this ),
		unregisterCallback: this.unregisterCallback.bind( this )
	};
} 