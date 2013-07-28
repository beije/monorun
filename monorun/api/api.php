<?php
/**
 * api.php
 *
 * Main api file, interacts with the highscore class, the database
 * and the front end.
 *
 * Should always return JSON encoded data.
 *
 * Usage:
 *
 * // Register user (only starts the session)
 * // Returns true (always)
 * api.php?do=register
 *
 * // Returns the top 10 leaderboard
 * // Returns a json array with objects on success
 * api.php
 * api.php?do=get
 *
 * // Get a specific highscore
 * // Returns a json object on success
 * api.php?do=get
 *
 * // Inserts a score with user name Roland
 * // Returns a json object on success
 * api.php?do=put&username=Roland&score=123123
 *
 * // Updates a score's username
 * // Returns true on success
 * api.php?do=update&username=Roland&secretkey=Jaaw[...]e23eds
 *
 *
 */


session_start();
if( isset( $_REQUEST['playerid'] ) ) {
	session_id( $_REQUEST['playerid'] );
}
require_once( 'global.php' );
require_once( 'class.highscore.php' );
require_once( 'class.unicornName.php' );

// Check session
if( !isset( $_SESSION['registered'] ) ) {
	$_SESSION['registered'] = 1;
	 $_SESSION['last_time_on_page'] = time();
}
$last_time_on_page = $_SESSION['last_time_on_page'];
$_SESSION['last_time_on_page'] = time();

// Set initial vars
$do = ( isset( $_REQUEST['do'] ) ? $_REQUEST['do'] : 'get' );
$return_data = array();
$timenow = time();

function findPosition( $score ) {
	global $db_connection;
	$statement = $db_connection->prepare( "SELECT id FROM highscore WHERE current_score > :score" );
	$statement->execute( 
		array( 
			'score' => intval( $score )
		)
	);

	return $statement->rowCount() + 1;
}

//
// Main switch
//
switch( $do ) {
	case 'register':
		$return_data = session_id();
	break;

	// Update a username if the correct id and secretkey is given
	case 'update':

		// Set initial vars
		$id = ( isset( $_REQUEST['id'] ) ? $_REQUEST['id'] : 0 );
		$secret_key = ( isset( $_REQUEST['secretkey'] ) ? $_REQUEST['secretkey'] : '' );
		$username = ( isset( $_REQUEST['username'] ) ? $_REQUEST['username'] : '' );
		$username = trim( $username );

		// Check username, make it a unicorn name if empty
		if( $username == '' || $username == 'false' || $username == false ){
			$username = UnicornName::generateName();
		}

		$return_data = false;

		$highscore = new Highscore( $id );

		if( $highscore->get_id() && $highscore->validate( $secret_key ) ) {
			// Should be good
			$highscore->set_username( $username );
			$return_data = $highscore->save();
		}
	break;

	// Insert new score
	case 'put':

		// Set initial vars
		$score = false;
		$username = '';
		$return_data = false;
		$source_id = 1;
		if( isset( $_REQUEST['score'] ) ) {
			$score = intval( $_REQUEST['score'] );
		}
		if( isset( $_REQUEST['username'] ) ) {
			$username = trim( $_REQUEST['username'] );
		}
		if( isset( $_REQUEST['sourceid'] ) ) {
			$source_id = intval( $_REQUEST['sourceid'] );
			// 1 = Web, 2 = Android, 3 = Windows Phone
			if( $source_id == 0 || $source_id > 3 ) {
				$source_id = 1;
			}
		}

		// Create unicorn name for user
		if( $username == '' || $username == 'false' || $username == false ){
			$username = UnicornName::generateName();
		}

		// Simple score spam protection, check that the 
		// time between the last request and this request
		// is larger than the score.
		// Only protects agains simple url spam.
		$timedifference = $timenow - $last_time_on_page;
		if( $timedifference < ( $score / 1000 ) ) {
			$return_data = false;
			break;
		}

		// Check that there's a score
		if( $score ) {
			$highscore = new Highscore();
			$highscore->set_source_id( $source_id );
			$highscore->set_username( $username );
			$highscore->set_dateline( $timenow );
			$highscore->set_original_score( $score );
			$highscore->set_current_score( $score );

			if( $highscore->save() ) {
				// Return the score id and the generated secretkey for
				// this score
				$return_data = array(
					'id' => $highscore->get_id(),
					'sourceid' => $highscore->get_source_id(),
					'username' => $highscore->get_username(),
					'dateline' => $highscore->get_dateline(),
					'score' => $highscore->get_current_score(),
					'position' => $highscore->get_position(),
					'secretkey' => $highscore->get_secret_key()
				);
			}
		}

	break;

	// Get the ten latest results or a specific result based on id
	case 'get':
		try {
			if( isset( $_REQUEST['id'] ) ) {
				$statement = $db_connection->prepare( "SELECT id FROM highscore WHERE id = :id" );
				$statement->execute( array( 'id' => $_REQUEST['id'] ) );			
			} else {
				$statement = $db_connection->prepare( "SELECT id FROM highscore ORDER BY current_score DESC LIMIT 10" );
				$statement->execute();
			}

			while($row = $statement->fetch()) {
				$highscore = new Highscore( $row->id );

				$data = (Object) array(
					'id' => $highscore->get_id(),
					'username' => $highscore->get_username(),
					'dateline' => $highscore->get_dateline(),
					'score' => $highscore->get_current_score(),
					'position' => $highscore->get_position()
				);

				$return_data[] = $data;
			}




		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			die();
		}
	break;
}

// Ouput data top browser
header( 'Content-type: application/json; charset=utf-8' );
if( defined( 'JSON_PRETTY_PRINT' ) && isset( $_REQUEST['pretty'] ) ) {
	echo json_encode( $return_data, JSON_PRETTY_PRINT );
} else {
	echo json_encode( $return_data );
}
?>