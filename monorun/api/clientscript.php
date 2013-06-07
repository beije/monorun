<?php
/**
 * clientscript.php
 * 
 * Combines all JS files and writes them to a cache file
 * 
 * @author 		: Benjamin Horn
 * @project		: monorun!
 * @file		: clientscript.php
 * @version		: 1.0.0
 * @created		: 2013-06-07
 * @updated		: 2013-06-07
 *
 */
require_once( 'global.php' );

if( !isset( $config['DEBUG'] ) ) {
	$config['DEBUG'] = false;
}


$files = array();
$output = '';

// Set correct header
header( 'Content-type: application/javascript; charset=utf-8' );

// Check if there's a cached version, use that if it exists
// the cache needs to be emptied on git pull though
if( file_exists ( dirname(__FILE__) . '/../cache/clientscript-cache.js' ) && $config['DEBUG'] == false ){
	readfile( dirname(__FILE__) . '/../cache/clientscript-cache.js' );
	exit;
}

// Get all common files
$dirpath = dirname(__FILE__).'/../clientscript/';
$dir = new DirectoryIterator( $dirpath );
foreach ($dir as $fileinfo) {
	if (!$fileinfo->isDot()) {
		$filepath = $dirpath . $fileinfo->getFilename();
		if( !in_array( $filepath, $files ) ) {
			$files[] = $filepath;
		}
	}
}

// Get all libs
$dirpath = dirname(__FILE__).'/../libs/';
$dir = new DirectoryIterator( $dirpath );
foreach ($dir as $fileinfo) {
	if (!$fileinfo->isDot()) {
		$filepath = $dirpath . $fileinfo->getFilename();
		if( !in_array( $filepath, $files ) ) {
			$files[] = $filepath;
		}
	}
}

// Output files
foreach( $files as $filepath ) {
	$output .= file_get_contents( $filepath );
}

// Ouput the content
file_put_contents ( dirname(__FILE__) . '/../cache/clientscript-cache.js', $output );
echo $output;
exit;
?>