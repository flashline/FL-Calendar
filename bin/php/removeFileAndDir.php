<?php
	require "cst.php";
	$dir="";
	$file = "200901.month";	
	if ($dir!="" && $file!="") {
		$dir=$BASE.$DATA_DIR.$dir;	
		$file=$dir."/".$file;
		//
		echo "file=".$file."<br/>";
		$b= "chmodok=".chmod ($file, $PERM) ;
		echo $b."<br/>";
		$b= unlink ($file);
		echo "unlinkok=".$b."<br/>";
		echo "<br/>";
		echo "<br/>";	
		echo "dir=".$dir."<br/>";
		$b= rmdir ($dir);
		echo "rmdirOk=".$b."<br/>";
	}
	
?>
