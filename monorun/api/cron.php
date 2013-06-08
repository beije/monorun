<?php
/**
 * cron.php
 *
 * Should only be called from cron because it can be quite taxing.
 * 
 * Runs through all scores in the database and decreases the scores
 * when needed.
 *
 */

require_once( 'global.php' );
require_once( 'class.highscore.php' );

// Fetch all scores (Only id is needed)
$statement = $db_connection->prepare( "SELECT id FROM highscore" );
$statement->execute();			 

// Run through 
if( $statement->rowCount() != 0 ) {
	while($row = $statement->fetch()) {
		// Load the highscore.
		$highscore = new Highscore( $row->id );
		$current_score = $highscore->get_current_score();

		// If the score was decrease, save the object.
		if( $highscore->split_half_life() ) {
			$highscore->save();
		}

		// If the score is zero, remove the item.
		if( $highscore->get_current_score() == 0 ) {
			// If somebody links to the highscore and
			// it has been removed, the user will be
			// none the wiser. This needs a fix.
			// $highscore->delete();
		}
	}
}
?>