var core = {
	player: null,
	painter:null,
	enemies: [],
	startTime: 0,
	endTime: 0,
	timer: null,
	initialize: function() {
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
		$( '#message' ).hide();
		
		this.painter = new painter( '#game' );
		this.setupEvents();
		this.resizeCanvas();
		console.log( this.painter )
	},
	updateTimer: function() {
		var now = new Date().getTime();
		$('#timer')[0].innerHTML = (now - this.startTime) + ' ms';
	},
	start: function() {
		this.startTime = new Date().getTime();
		player = new Player( this.painter );
		for( var i = 0; i < 6; i++ ) {
			this.enemies.push( new roland( 'rolle'+i , this.painter ) );
			this.enemies[i].setSpeed( parseInt( Math.random()*100 )+20 );
		}

		//setTimeout( function() { enemies.render('assets/redcross.png', 2); },2000 )
		//rolle = new roland( 'rolle', painterhandler );
		
	},
	showMessage: function( msg ) {
		$( '#message' ).show();
		$( '#message' ).html( msg );

	},
	end: function() {
		clearInterval( timer );
		this.endTime = new Date().getTime();
		this.painter.stop();
		console.log( 'Game time: '+ (this.endTime - this.startTime) );
		this.showMessage( "Bummer, you've failed at life :(" );
	},
	setupEvents: function() {
		$(window).resize(
			core.resizeCanvas.bind(this)
		);
		timer = setInterval(
			this.updateTimer.bind( this ),
			20
		);
	},
	resizeCanvas: function() {
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
	}
}
