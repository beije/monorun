function Player( painter ) {
	this.mouseHandler = null;
	this.rendered = null;
	this.pixelMap = [];
	this.painter = null;
	this.position = {
		x: 478,
		y: 239
	};
	this.initialize = function( painter ) {
		this.painter = painter;
		this.rendered = this.render();
		this.pixelMap = painter.pixelCollider.buildPixelMap( this.rendered, 3 );
		this.mouseHandler = new mousehandler( this.painter.getCanvasSelector() );
		this.setupEvents();
	}
	this.render = function() {
		var userImage = document.createElement( 'canvas' );
		var ctx = userImage.getContext( '2d' );

		ctx.beginPath();
		ctx.arc(30, 30, 15, 0, 2 * Math.PI, false);
		ctx.fillStyle = '#20afdf';
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#88c8dd';
		ctx.stroke();

		return userImage;
	}
	this.collision = function() {
		console.log('death has occured');
	},
	this.renderPlayer = function() {
		var pixelMap = {
			pixelMap: this.pixelMap,
			width: 34,
			height: 34,
			x: this.position.x-30,
			y: this.position.y-30
		};

		//console.log( this.x(), this.y() );
		this.painter.addToQueue( 
			'user',          // ID
			this.rendered,         // Image
			this.position.x-30, // X position
			this.position.y-30, // Y position
			1,                 // z layer (collision layer) 
			pixelMap,          // Pixel map (for collision detection)
			this.collision.bind(this)
		);
	};
	this.updatePositions = function(x,y) {
		this.position = {
			x: x,
			y: y
		};
	};
	this.setupEvents = function() {

		this.mouseHandler.setCallback(
			'move', 
			this.updatePositions.bind( this ) 
		);
		this.painter.registerCallback( 'user', this.renderPlayer.bind(this) );
	}
	this.initialize( painter );

	return {
		updatePositions: this.updatePositions.bind( this )
	};
}