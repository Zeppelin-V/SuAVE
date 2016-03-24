<?php

require("CollectionCreator.php");

function createDeepZoom($uploads_dir, $source, $destination){
	$cc = new CollectionCreator();
	$cc->create($uploads_dir, $source, $destination);
}

?>
