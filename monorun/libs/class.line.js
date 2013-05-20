function Line() {
	this.canvas = null;
	this.context = null;
	this.lineWidth = '2';
	this.lineColor = '#000000';

	this.positions = {
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	};

	this.initialize = function() {
		this.canvas = document.createElement( 'canvas' );
		$( this.canvas ).attr( 'width', '1000px'  );
		$( this.canvas ).attr( 'height', '1000px'  );
		this.context = this.canvas.getContext( '2d' );
	};

	this.setStartPosition = function(x,y) {
		this.positions.startX = x;
		this.positions.startY = y;
	};

	this.setEndPosition = function(x,y) {
		this.positions.endX = x;
		this.positions.endY = y;
	};
	this.setSize = function(width, height) {
		$( this.canvas ).attr( 'width', width + 'px'  );
		$( this.canvas ).attr( 'height', height + 'px'  );
	};

	this.getLine = function() {

		this.context.clearRect( 0 , 0 , 10000 , 10000 );

		this.context.beginPath();

		this.context.moveTo( this.positions.startX, this.positions.startY );
		this.context.lineTo( this.positions.endX, this.positions.endY );
		this.context.lineWidth = this.lineWidth;
		this.context.strokeStyle = this.lineColor;
		this.context.stroke();

		return this.canvas;
	};

	this.setLineWidth = function( width ) {
		this.lineWidth = width;
	}

	this.setLineColor = function( color ) {
		this.lineColor = color;
	}

	this.initialize();

	return {
		setStartPosition: this.setStartPosition.bind( this ),
		setEndPosition: this.setEndPosition.bind( this ),
		getLine: this.getLine.bind( this ),
		setSize: this.setSize.bind( this ),
		setLineWidth: this.setLineWidth.bind( this ),
		setLineColor: this.setLineColor.bind( this )
	};
}