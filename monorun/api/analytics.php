<?php
/**
 * analytics.php
 *
 * Outputs the content in $config['ANALYTICS'] so it can be included
 * in the page. (and doesn't need inline script tags)
 *
 */

// Include global file
include( 'global.php' );

header( 'Content-type: application/javascript; charset=utf-8' );
if( isset( $config['ANALYTICS'] ) && $config['ANALYTICS'] != '' ) {
	echo $config['ANALYTICS'];
} else {
	echo "console.log( 'No analytics found in config' );";
}
?>