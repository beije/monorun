<?php
session_start();

// Check session
if( !isset( $_SESSION['registered'] ) ) {
	$_SESSION['registered'] = 1;
	 $_SESSION['last_time_on_page'] = time();
}
$last_time_on_page = $_SESSION['last_time_on_page'];
$_SESSION['last_time_on_page'] = time();

// Include config file
include( 'config.php' );

if( !isset( $config ) ) {
	die();
}

// Prepare connection to the database
try {
	// Make the connection
	$db_connection = new PDO (
		"mysql:host=".$config['DB_HOST'].";dbname=".$config['DB_DATABASE'], 
		$config['DB_USERNAME'], 
		$config['DB_PASSWORD'] 
	);

	// Show exceptions on error
	$db_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Always return rows as objects
	$db_connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

	// Don't emulated prepared statements
	$db_connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch(PDOException $e) {
    echo "ERROR: " . $e->getMessage();
    die();
}

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
		$return_data = true;
	break;
	
	// Update a username if the correct id and secretkey is given
	case 'update':

		// Set initial vars
		$id = ( isset( $_REQUEST['id'] ) ? $_REQUEST['id'] : 0 );
		$secretkey = ( isset( $_REQUEST['secretkey'] ) ? $_REQUEST['secretkey'] : '' );
		$username = ( isset( $_REQUEST['username'] ) ? $_REQUEST['username'] : '' );

		// Look for results
		$statement = $db_connection->prepare( "SELECT * FROM highscore WHERE id = :id AND secretkey = :secretkey" );
		$statement->execute( 
			array( 
				'id' => $id,
				'secretkey' => $secretkey
			)
		);

		// Check if anything was returned
		if( $statement->rowCount() == 1 ) {
			// Update row with new username
			$statement = $db_connection->prepare("
				UPDATE highscore set
					username = :username
				WHERE
					id = :id
			");
			$statement->execute( 
				array( 
					'id' => $id,
					'username' => $username
				)
			);

			$return_data = true;
		} else {
			$return_data = false;
		}
	break;

	// Insert new score
	case 'put':

		// Set initial vars
		$score = false;
		$username = '';

		// Generate a random secret key with md5
		$secretkey = md5( rand( 0,1000000 ) . '_monorun_' . $timenow );

		if( isset( $_REQUEST['score'] ) ) {
			$score = intval( $_REQUEST['score'] );
		}
		if( isset( $_REQUEST['username'] ) ) {
			$username = $_REQUEST['username'];
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

			// Insert the score
			$statement = $db_connection->prepare( trim( "
				INSERT INTO highscore (
					username, 
					dateline, 
					original_score, 
					current_score,
					secretkey
				) VALUES (
					:username,
					:dateline,
					:originalscore,
					:currentscore,
					:secretkey
				)
			") );
			$statement->execute( 
				array( 
					'username' => $username,
					'dateline' => $timenow,
					'originalscore' => $score,
					'currentscore' => $score,
					'secretkey' => $secretkey
				) 
			);

			// Return the score id and the generated secretkey for
			// this score
			$return_data = array(
				'id' => $db_connection->lastInsertId(),
				'secretkey' => $secretkey,
				'position' => findPosition( $score )
			);
		} else {
			$return_data = false;
		}

	break;

	// Get the ten latest results or a specific result based on id
	case 'get':
		try {
			if( isset( $_REQUEST['id'] ) ) {
				$statement = $db_connection->prepare( "SELECT username, dateline, current_score as score FROM highscore WHERE id = :id" );
				$statement->execute( array( 'id' => $_REQUEST['id'] ) );			
			} else {
				$statement = $db_connection->prepare( "SELECT username, dateline, current_score as score FROM highscore ORDER BY current_score DESC LIMIT 10" );
				$statement->execute();
			}

			while($row = $statement->fetch()) {
				$row->position = findPosition( $row->score );
				$return_data[] = $row;
			}

		} catch(PDOException $e) {
			echo 'ERROR: ' . $e->getMessage();
			die();
		}
	break;
}

// For debugging purpose, will be removed in final
//echo '<pre>';
//print_r($return_data);
//echo '</pre>';

echo json_encode( $return_data );
?>