<?php
	$json = $_POST['data'];
	$file = fopen('data.json','w');
	fwrite($file, $json);
	fclose($file);
?>