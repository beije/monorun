<?php
require_once( 'db.php' );
require_once( 'class.highscore.php' );

$statement = $db_connection->prepare( "SELECT id, username, dateline, last_cron_run, current_score, original_score, secret_key FROM highscore" );
$statement->execute();			 

if( $statement->rowCount() == 0 ) {
	return false;
}

while($row = $statement->fetch()) {
	$highscore = new Highscore( $row->id );
	$current_score = $highscore->get_current_score();
	if( $highscore->split_half_life() ) {
		$highscore->save();
	}
	if( $highscore->get_current_score() == 0 ) {
		$highscore->delete();
	}
}
?>