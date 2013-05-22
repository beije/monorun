var core = {
	player: null,
	painter:null,
	enemies: [],
	startTime: 0,
	endTime: 0,
	timer: null,
	lineHandlers:[],
	lineHandler:null,
	screenData: {},

	initialize: function() {

		this.screenData = this.calculateCanvasSize();
		console.log( this.screenData );
		$( '#game' ).attr( 'width', this.screenData.width + 'px'  );
		$( '#game' ).attr( 'height',this.screenData.height + 'px'  );
		$( '#message' ).hide();
		
		this.painter = new painter( '#game' );
		this.lineHandler = new Line($( '#game' )[0] );
		this.lineHandler.setLineWidth( 10 );
		this.lineHandler.setLineColor( 'rgba(87,197,219,0.1)' );
		

		this.setupEvents();
		this.resizeCanvas();
	},
	connectingRoland: function() {
		for( var i = 0; i < this.enemies.length; i = i + 2 ) {
			if( !this.enemies[i+1] ) break;
			var basePos = this.enemies[i].getPositions();
			var newPos = this.enemies[i+1].getPositions();
			this.lineHandler.setStartPosition( basePos.x+30, basePos.y+30 );
			this.lineHandler.setEndPosition( newPos.x+30, newPos.y+30 );
			this.lineHandler.getLine();
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
		//if( this.enemies.length > 5 ) return false;
		var index = this.enemies.length;
		// Ugly hack with sending in a prerendered roland pixelmap
		this.enemies.push( new roland( 'rolle'+index , this.painter, this.enemies[0].getPixelMap() ) );
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

		this.screenData = this.calculateCanvasSize();

		var w = this.screenData.width;
		var h = this.screenData.height;

		$( '#game' ).attr( 'width', w + 'px'  );
		$( '#game' ).attr( 'height', h + 'px'  );

	},
	calculateCanvasSize: function() {

		var windowWidth = window.outerWidth;
		var windowHeight = window.outerHeight;

		var iWindowWidth = window.innerWidth;
		var iWindowHeight = window.innerHeight;

		var screenWidth = screen.width;
		var screenHeight = screen.height;

		var availableScreenWidth = screen.availWidth;
		var availableScreenHeight = screen.availHeight;

		var isRetina = false;

		//
		// DUCK TEST
		// (Devices that lack window.devicePixelRatio like Windows Phone 8)
		//

		// Check if the browser has any extra stuff around it
		// Mobiles don't have that stuff
		if( windowWidth == iWindowWidth && windowHeight == iWindowHeight ) {
			// Check if the complete screen is available
			// Computers usually have taskbars, so the browser doesn't have full access
			if( screenWidth == availableScreenWidth && screenHeight == availableScreenHeight ) {

				// Check that the window and screen are not the same size
				// and that the window is smaller than the screen
				if( windowWidth < screenWidth && windowHeight < screenHeight ) {
					
					// If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck.
					isRetina = true;
				}
			}
		}

		//
		// For other devices that have window.devicePixelRatio
		//
		if( window.devicePixelRatio ) {
			if( window.devicePixelRatio > 1 ){
				isRetina = true;
				screenWidth = iWindowWidth * window.devicePixelRatio;
				screenHeight = iWindowHeight * window.devicePixelRatio;
			} else {
				// Override duck test
				isRetina = false;
			}
		}

		if( isRetina ) {
			return {
				isRetina: isRetina,
				width: screenWidth,
				height: screenHeight
			}
		} else {
			return {
				isRetina: isRetina,
				width: iWindowWidth,
				height: iWindowHeight
			}
		}
	}
}
