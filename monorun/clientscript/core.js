var core = {
	player: null,
	painter:null,
	enemies: [],
	startTime: 0,
	endTime: 0,
	timer: null,
	lineHandlers:[],
	lineHandler:null,
	initialize: function() {
		$( '#game' ).attr( 'width', $(document).width() + 'px'  );
		$( '#game' ).attr( 'height', $(document).height() + 'px'  );
		$( '#message' ).hide();
		
		this.painter = new painter( '#game' );
		this.lineHandler = new Line($( '#game' )[0] );
		this.lineHandler.setLineWidth( 10 );
		this.lineHandler.setLineColor( 'rgba(87,197,219,0.1)' );

		this.setupEvents();
		this.resizeCanvas();
		console.log( this.painter )
	},
	connectingRoland: function() {
		for( var i = 0; i < this.enemies.length; i = i + 2 ) {
			if( !this.enemies[i+1] ) break;
			var basePos = this.enemies[i].getPositions();
			var newPos = this.enemies[i+1].getPositions();
			this.lineHandler.setStartPosition( basePos.x+30, basePos.y+30 );
			this.lineHandler.setEndPosition( newPos.x+30, newPos.y+30 );
			this.lineHandler.getLine();
			oldPos = basePos;
		}

	},
	updateTimer: function() {
		var now = new Date().getTime();
		$('#timer')[0].innerHTML = (now - this.startTime) + ' ms';
	},
	start: function() {
		this.startTime = new Date().getTime();
		player = new Player( this.painter );

		for( var i = 0; i < 1; i++ ) {
			this.enemies.push( new roland( 'rolle'+i , this.painter ) );
			this.enemies[i].setSpeed( parseInt( Math.random()*100 )+20 );
		}

		this.painter.registerCallback(
			'connectingRoland', 
			this.connectingRoland.bind( this ),
			'preFrameRender'
		);

		setInterval(
			this.appendRoland.bind( this ),
			2000
		);

		//setTimeout( function() { enemies.render('assets/redcross.png', 2); },2000 )
		//rolle = new roland( 'rolle', painterhandler );
		
	},
	appendRoland: function() {
		var index = this.enemies.length;
		this.enemies.push( new roland( 'rolle'+index , this.painter ) );
		this.enemies[index].setSpeed( parseInt( Math.random()*100 )+20 );
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
		this.showMessage( "Game ended" );
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
		var w = $(document).width();
		var h = $(document).height();
		$( '#game' ).attr( 'width', w + 'px'  );
		$( '#game' ).attr( 'height', h + 'px'  );
	}
}
