/**
 *
 * @project        monorun
 * @file           class.sound.js
 * @description    Handles the sound effects
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function SoundHandler( url ) {

	soundObject = null;
	path = null;

	this.initialize = function( url ) {
		this.path = url;
		this.soundObject = this.createSoundObject();
	};

	this.createSoundObject = function() {
		var obj = new Audio();
		obj.src = this.path;

		$( obj ).bind(
			'ended',
			this.loop.bind( this )
		);

		return obj;
	};

	this.play = function( repeat ) {
		if( !this.soundObject.play ) {
			return false;
		}

		this.repeat = ( repeat ? true : false );
		this.soundObject.play();
	};

	this.loop = function() {
		if( this.repeat ) {
			this.soundObject.currentTime = 0;
			this.soundObject.play();
		}
	};

	this.stop = function() {
		if( !this.soundObject.pause ) {
			return false;
		}
		console.log( 'stopping sound' );
		this.repeat = false;
		this.soundObject.pause();
		this.soundObject.currentTime = 0;
	};

	this.initialize( url );

	return {
		play:this.play.bind(this),
		stop:this.stop.bind(this)
	};
};