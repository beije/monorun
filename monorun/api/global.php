<?php
/**
 * global.php
 *
 * Sets up the db connection. Should be included with every php file.
 *
 */

// Include config file
include( 'config.php' );

if( !isset( $config ) ) {
	die();
}

// Prepare connection to the database
try {
	// Make the connection
	$db_connection = new PDO (
		"mysql:host=".$config['DB_HOST'].";dbname=".$config['DB_DATABASE'].';charset=utf8', 
		$config['DB_USERNAME'], 
		$config['DB_PASSWORD'] 
	);
	// Unset database config-flags
	unset( $config['DB_USERNAME'] );
	unset( $config['DB_PASSWORD'] );
	unset( $config['DB_DATABASE'] );
	unset( $config['DB_HOST'] );

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

?>