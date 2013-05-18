function roland( id, painter ) {
	this.painter = null;
	this.rendered = null;
	this.calculatedPositions = [];
	this.preAnimator = null;
	this.currentPositions = {
		x: 0,
		y: 0
	};
	this.id = parseInt( Math.random()*1000 );
	this.positionCounter = 0;

	this.initialize = function( id, painter ) {
		this.id = id || this.id;
		this.painter = painter;
		this.preAnimator = new preAnimate();
		this.render( 'assets/greencross.png', 2);
		this.setupEvents();
	}

	this.setupEvents = function() {
		this.painter.registerCallback( this.id, this.animateCallback.bind( this ) );
	};
	this.generateNewPosition = function() {
		this.positionCounter = 0;
		var newX = parseInt( Math.random()*1000 );
		var newY = parseInt( Math.random()*1000 );

		this.preAnimator.setStartPosition( this.currentPositions.x, this.currentPositions.y );
		this.preAnimator.setEndPosition( newX, newY );
		this.preAnimator.setSpeed( 100 );
		this.calculatedPositions = [];
		this.calculatedPositions = this.preAnimator.getPositions();
	}
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
			width: 60,
			height: 60,
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

	this.setPainter = function( painter ) {} 

	this.render = function( imageUrl, resolution ) {
		
		// Render roland :)
		this.canvas = document.createElement( 'canvas' );
		//var ctx = fakeCanvas.getContext( '2d' );
		/*
		ctx.beginPath();
		ctx.arc(30, 30, 25, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#0b0e0f';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#ffffff';
		ctx.stroke();
		//console.log( this.painter );
		this.pixelMap = this.painter.pixelCollider.buildPixelMap( fakeCanvas, 3 );
		this.rendered = fakeCanvas;
		*/

		this.imageObj = new Image();

		this.imageObj.onload = function() {
			var ctx = this.canvas.getContext( '2d' );
			ctx.drawImage( this.imageObj,0,0);
			this.pixelMap = this.painter.pixelCollider.buildPixelMap( this.canvas, resolution );
			this.rendered = this.canvas;
		}.bind( this );

        this.imageObj.src = imageUrl;

	}

	this.initialize( id, painter );

	return {
		setPainter: this.setPainter.bind( this ),
		render: this.render.bind( this )
	}
}