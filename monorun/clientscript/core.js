var core = {
	player: null,
	painter:null,
	enemies: [],
	initialize: function() {
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
		this.painter = new painter( '#game' );
		this.setupEvents();
		this.resizeCanvas();
		console.log( this.painter )
	},
	start: function() {
		player = new Player( this.painter );
		for( var i = 0; i < 6; i++ ) {
			this.enemies.push( new roland( 'rolle'+i , this.painter ) );
		}

		//setTimeout( function() { enemies.render('assets/redcross.png', 2); },2000 )
		//rolle = new roland( 'rolle', painterhandler );
		
	},
	setupEvents: function() {
		$(window).resize(
			core.resizeCanvas.bind(this)
		);
	},
	resizeCanvas: function() {
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
	}
}
