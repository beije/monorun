/**
 *
 * @project        monorun
 * @file           class.apiinterface.js
 * @description    Handles communication with back end
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function apiInterface() {
	this.data = {                // Object, Post data that will be sent to server
		'do': false,             // Boolean, What kind of post
		'score': '',             // Int, Score
		'username': '',          // String, User name
		'secretkey': ''          // String, MD5 hash needed for updating a score
	};

	this.apiUrl = 'api/api.php'; // String, The api url to post to.

	/*
	 * private function initialize()
	 *
	 * Does nothing! :D
	 *
	 */
	this.initialize = function() {}

	/*
	 * private function makeRequest()
	 *
	 * Sends the data object to the server. fires
	 * the callback on completion.
	 *
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.makeRequest = function( callback ) {
		$.ajax({
			type: "POST",
			url: this.apiUrl,
			data: this.data,
			dataType: 'JSON'
		}).done(callback);
	}

	/*
	 * public function registerPlayer()
	 *
	 * Sends an empty request, so the user session is updated
	 *
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.registerPlayer = function( callback ) {
		this.data = {
				'do': 'register'
		}

		this.makeRequest( callback );
	};

	/*
	 * public function insertScore()
	 *
	 * Sends the a new highscore to the server
	 *
	 * @param score (Int) The score
	 * @param username (String) The username
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.insertScore = function( score, username, callback ) {
		
		this.data = {
				'do': 'put',
				'score': score,
				'username': ( username ? username : false )
		}

		this.makeRequest( callback );
	}

	/*
	 * public function updateScore()
	 *
	 * Updates the score (actually username) on a given
	 * high score.
	 *
	 * @param id (Int) The high score id that was given on highscore submittal
	 * @param secretkey (String) The secretkey that was given on highscore submittal
	 * @param username (String) The new username
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.updateScore = function( id, secretkey, username, callback ) {
		this.data = {
			'do': 'update',
			'id': id,
			'secretkey': secretkey,
			'username': username
		}
		this.makeRequest( callback );

	}

	/*
	 * public function fetchHighscore()
	 *
	 * Fetches a single highscore based on id
	 *
	 * @param id (Int) The high score's database id
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.fetchHighscore = function( id, callback ) {
		this.data = {
			'do': 'get',
			'id': id
		}
		this.makeRequest( callback );	
	}

	/*
	 * public function fetchHighscores()
	 *
	 * Fetches multiple (10) of the leading highscores
	 *
	 * @param callback (function) The callback that should fire on completion
	 *
	 */
	this.fetchHighscores = function( callback ) {
		this.data = {
				'do': 'get'
		}
		this.makeRequest( callback );
	}

	// Initialize the api interface
	this.initialize();

	return {
		registerPlayer: this.registerPlayer.bind(this),
		insertScore: this.insertScore.bind(this),
		updateScore: this.updateScore.bind(this),
		fetchHighscore: this.fetchHighscore.bind(this),
		fetchHighscores: this.fetchHighscores.bind(this)
	};
};