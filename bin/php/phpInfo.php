<?php
	/**************************************************************************************************
	SoftWare : Flash-Line  calendar
	Author : Delettre Jean-Michel
	CoAuthors : 
	Copyright / Droits d'auteur : Free-Works.Org - Flash-Line.net
	****************************************************************************************************/
	// ini_set('display_errors', 0); // or // //ini_set('display_errors', 0); error_reporting (4) ; //
	echo "TESTS:"."<br/>";
	echo "ini_get('display_errors')=".ini_get('display_errors')."<br/>";
	ini_set('session.gc_maxlifetime', 3 * 60 * 60);
	$gcmlt= ini_get('session.gc_maxlifetime');
	echo "server=".$_SERVER['SERVER_NAME']."<br/>";
	echo "dirname=".dirname($_SERVER['PHP_SELF'])."<br/>";
	echo "base1=".$_SERVER['SERVER_NAME'].dirname($_SERVER['PHP_SELF'])."<br/>";
	echo "base2=".$_SERVER['DOCUMENT_ROOT'].dirname($_SERVER['PHP_SELF'])."<br/>";
	echo "session.cookie_lifetime=".INI_Get('session.cookie_lifetime')."<br/>";
	echo "gc_maxlifetime="+$gcmlt."<br/>";	
	echo "****************************************"."<br/>";	
	phpinfo();	
?>
