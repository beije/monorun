(function( $ ) {
	$( document ).ready( function() {
		console.log( 'kick it' );
		core.initialize();
		core.start();
		
		// Collision detection test
	/*	
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
		var painterhandler = new painter( '#game' );
		var hitTest = new collisionDetection();

		var itemOneCanvas = document.createElement( 'canvas' );
		var ctxOne = itemOneCanvas.getContext( '2d' );
		ctxOne.beginPath();
		ctxOne.arc(30, 30, 20, 0, 2 * Math.PI, false);
		ctxOne.fillStyle = 'pink';
		ctxOne.fill();
		ctxOne.lineWidth = 0;
		ctxOne.strokeStyle = '#ff0000';
		ctxOne.stroke();

		var itemTwoCanvas = document.createElement( 'canvas' );
		var ctxTwo = itemTwoCanvas.getContext( '2d' );
		ctxTwo.beginPath();
		ctxTwo.arc(30, 30, 20, 0, 2 * Math.PI, false);
		ctxTwo.fillStyle = 'green';
		ctxTwo.fill();
		ctxTwo.lineWidth = 0;
		ctxTwo.strokeStyle = '#ff0000';
		ctxTwo.stroke();

		
		var itemOne = {};
		itemOne.object = itemOneCanvas;
		itemOne.width = 40;
		itemOne.height = 40;
		itemOne.x = 0;
		itemOne.y = 0;
		itemOne.pixelMap = hitTest.buildPixelMap( itemOne.object, 1 );
		
		var itemTwo = {};
		itemTwo.object = itemTwoCanvas;
		itemTwo.width = 40;
		itemTwo.height = 40;
		itemTwo.x = 55;
		itemTwo.y = 30;
		itemTwo.pixelMap = hitTest.buildPixelMap( itemTwo.object, 1 );

		console.log(  itemOne, itemTwo );
		
*/

		
		// Game test code
/*
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );

		var painterhandler = new painter( '#game' );

		rolle = new roland( 'rolle', painterhandler );
		setTimeout( function() { rolle.render('assets/redcross.png', 2); },2000 )
		//rolle = new roland( 'rolle', painterhandler );
		player = new Player( painterhandler );
*/		
		//rolle.setPainter( painterhandler );
	});
})( jQuery );