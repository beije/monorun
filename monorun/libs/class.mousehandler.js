function mousehandler( targetElement ) {

	this.$element = null;
	this.active = false;
	this.positions = {
		x: 0,
		y: 0
	};

	this.callbacks = {
		start: function() {},
		move: function() {},
		end: function() {}
	}

	// Mousemove / touchmove
	// Mousedown / touchstart
	// Mouseup / touchend
	this.movements = {
		move: 'mousemove',
		start: 'mousedown',
		end: 'mouseup'
	};

	this.initialize = function( targetElement ) {
		console.log('Mouse init');
		this.$element = $( targetElement );
		this.setupEvents();
	}

	this.setupEvents = function() {
		console.log( 'binding shiot' );
		this.$element.bind( 
			this.movements.move,
			this.move.bind( this )
		);
		this.$element.bind( 
			this.movements.start,
			this.start.bind( this )
		);
		this.$element.bind( 
			this.movements.end,
			this.end.bind( this )
		);
	};

	this.move = function( e ) {
		e = e || window.event;
		e.preventDefault();
		if( this.active ) {
			this.positions = {
				x: e.clientX,
				y: e.clientY
			};
			this.callbacks.move( e.clientX, e.clientY );
		}
		return false;
	}

	this.start = function( e ) {
		e = e || window.event;
		e.preventDefault();
		this.callbacks.start();
		console.log('asd');
		this.active = true;
		return false;
	}

	this.end = function( e ) {
		e = e || window.event;
		e.preventDefault();
		this.callbacks.end();
		this.active = false;
		return false;
	}

	this.setCallback = function( type, callback ) {
		this.callbacks[type] = callback;
	}

	this.getPositionX = function() {
		return this.positions.x;
	}
	this.getPositionY = function() {
		return this.positions.y;
	}

	this.initialize( targetElement );

	return {
		x: this.getPositionX.bind( this ),
		y: this.getPositionY.bind( this ),
		setCallback: this.setCallback.bind( this )
	};
}