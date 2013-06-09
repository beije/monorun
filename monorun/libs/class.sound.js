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

	soundObject = null;   // DOM object, Audio element
	path = null;          // String, Path to sound file

	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 * @param url (String) The path to the sound file
	 *
	 */
	this.initialize = function( url ) {
		this.path = url;
		this.soundObject = this.createSoundObject();
	};

	/*
	 * private function initialize()
	 *
	 * Creates and initializes the audio object
	 *
	 * @return Audio element object 
	 *
	 */
	this.createSoundObject = function() {
		var obj = new Audio();
		obj.src = this.path;

		$( obj ).bind(
			'ended',
			this.loop.bind( this )
		);

		return obj;
	};

	/*
	 * public function play()
	 *
	 * Starts the sound
	 *
	 * @param repeat (Boolean) If the sound should loop
	 *
	 */
	this.play = function( repeat ) {
		if( !this.soundObject.play ) {
			return false;
		}

		this.repeat = ( repeat ? true : false );
		this.soundObject.play();
	};

	/*
	 * private function loop()
	 *
	 * Restarts the sound when file ends
	 *
	 */
	this.loop = function() {
		if( this.repeat ) {
			this.soundObject.currentTime = 0;
			this.soundObject.play();
		}
	};

	/*
	 * private function stop()
	 *
	 * Stops the sound.
	 *
	 */
	this.stop = function() {
		if( !this.soundObject.pause ) {
			return false;
		}
		this.repeat = false;
		this.soundObject.pause();
		this.soundObject.currentTime = 0;
	};

	// Initialize the sound object
	this.initialize( url );

	// Return our outward facing interface.
	return {
		play:this.play.bind(this),
		stop:this.stop.bind(this)
	};
};