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
	this.data = {
		'do': false,
		'score': '',
		'username': '',
		'secretkey': ''
	};
	this.apiUrl = 'api/api.php';

	this.initialize = function() {

	}
	this.makeRequest = function( callback ) {
		$.ajax({
			type: "POST",
			url: this.apiUrl,
			data: this.data,
			dataType: 'JSON'
		}).done(callback);
	}


	this.registerPlayer = function( callback ) {
		this.data = {
				'do': 'register'
		}

		this.makeRequest( callback );
	};
	this.insertScore = function( score, username, callback ) {
		
		this.data = {
				'do': 'put',
				'score': score,
				'username': ( username ? username : false )
		}

		this.makeRequest( callback );
	}
	this.updateScore = function( id, secretkey, username, callback ) {
		this.data = {
			'do': 'update',
			'id': id,
			'secretkey': secretkey,
			'username': username
		}
		this.makeRequest( callback );

	}
	this.fetchHighscore = function( id, callback ) {
		this.data = {
			'do': 'get',
			'id': id
		}
		this.makeRequest( callback );	
	}
	this.fetchHighscores = function( callback ) {
		this.data = {
				'do': 'get'
		}
		this.makeRequest( callback );
	}

	this.initialize();

	return {
		registerPlayer: this.registerPlayer.bind(this),
		insertScore: this.insertScore.bind(this),
		updateScore: this.updateScore.bind(this),
		fetchHighscore: this.fetchHighscore.bind(this),
		fetchHighscores: this.fetchHighscores.bind(this)
	};
};