function preAnimate() {
	this.positions = [];
	this.startPosition = {
		x: 0,
		y: 150
	};
	this.endPosition = {
		x: 100,
		y: 45
	};
	this.speed = 20;
	this.calculatedPositions = {
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	};
	this.initialize = function() {}

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
	this.setSpeed = function( speed ) {
		this.speed = speed;
	}
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

	this.initialize();

	return {
		setStartPosition: this.setStart.bind( this ),
		setEndPosition: this.setEnd.bind( this ),
		setSpeed: this.setSpeed.bind( this ),
		getPositions: this.getPositions.bind( this )
	}
}