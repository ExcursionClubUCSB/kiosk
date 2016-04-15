<?php

$dest_height = 100;
$dest_width = $dest_height * 0.98;

$src_width = 1944;
$src_height = 1983;

$dir = getcwd();

chdir('../gear/photo');
$photos = scandir('.');

foreach($photos as $filename) {
	
	if(strtolower(pathinfo($filename, PATHINFO_EXTENSION)) != 'jpg') {
		continue;
	}
	
	// The file
	$percent = 0.5;
	
	// Get new dimensions
	list($width, $height) = getimagesize($filename);
	
	// Resample
	$image_p = imagecreatetruecolor($dest_width, $dest_height);
	$image = imagecreatefromjpeg($filename);
	imagecopyresampled($image_p, $image, 0, 0, 0, 200, $dest_width, $dest_height, $src_width, $src_height);
	
	// Output
	imagejpeg($image_p, $dir.'/photo/'.$filename, 100);
	
	echo $dir.'/photo/'.$filename."\n";
	
}

?>