function collisionDetection() {
	this.initialize = function() {

	}

	this.hitTest = function( source, target ) {
		var hit = false;
		var start = new Date().getTime();

		if( this.boxHitTest( source, target ) ) {
			console.log( 'Box passed' );
			if( this.pixelHitTest( source, target ) ) {
				console.log( 'Pixel passed' );
				hit = true;
			}
		}

		var end = new Date().getTime();
		if( hit == true ){
		console.log( 'detection took: ' + (end - start) + 'ms' );
		}

		return hit;
	}

	this.boxHitTest = function( source, target ) {
		return !( 
			( ( source.y + source.height ) < ( target.y ) ) ||
			( source.y > ( target.y + target.height ) ) ||
			( ( source.x + source.width ) < target.x ) ||
			( source.x > ( target.x + target.width ) ) 
		);
	}

	this.pixelHitTest = function( source, target ) {
		for( var s = 0; s < source.pixelMap.data.length; s++ ) {
			var sourcePixel = source.pixelMap.data[s];
			var sourceArea = {
				x: sourcePixel.x + source.x,
				y: sourcePixel.y + source.y,
				width: source.pixelMap.resolution,
				height: source.pixelMap.resolution
			};
			for( var t = 0; t < target.pixelMap.data.length; t++ ) {
				var targetPixel = target.pixelMap.data[t];
				var targetArea = {
					x: targetPixel.x + target.x,
					y: targetPixel.y + target.y,
					width: target.pixelMap.resolution,
					height: target.pixelMap.resolution
				};

				if( this.boxHitTest( sourceArea, targetArea ) ) {
					return true;
				}
			}
		}
	}

	this.buildPixelMap = function( source, resolution ) {
		var resolution = resolution || 1;
		var ctx = source.getContext("2d");
		var pixelMap = [];

		for( var y = 0; y < source.width; y = y+resolution ) {
			for( var x = 0; x < source.height; x = x+resolution ) {
				var pixel = ctx.getImageData(x,y,resolution,resolution);
				if( pixel.data[3] != 0 ) {
					pixelMap.push( { x:x, y:y } );
				}
			}
		}
		return {
			data: pixelMap,
			resolution: resolution
		};
	}

	this.initialize();

	return {
		hitTest: this.hitTest.bind( this ),
		buildPixelMap: this.buildPixelMap.bind( this )
	}
}