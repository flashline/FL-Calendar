<?php
	function convertAmp($str){
		$str=str_replace("&","~#e",$str) ;
		return $str;
	}
	function convertMarkupChar($str){
		$str=str_replace("<","~#{",$str) ;
		$str = str_replace(">", "~#}", $str) ;
		$str=str_replace("%","~#ç",$str) ;		
		return $str;
	}
	function encodeXmlReserved($str){		
		return convertMarkupChar(convertAmp($str));
	}	
	function destroySession() {	
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
	}
	//GLOBAL vars
	$msg="";
	// debug alert 
	function showAlert() {  
		GLOBAL  $msg ;
		if  (!isset($msg) || $msg=="") return ;
			$str="";		
			$str.='<div style="text-align:center;width:500px;border: 1px #000000 solid;background-color:#eeeeee;color:#000000; ">';		 
			$str.='ALERT MESSAGE  ';
			$str.=' <div style="text-align:left;padding-left:5px;width:495px;border: 1px #000000 solid;background-color:#ffffff;color:#000000; "> ';
			$str.=$msg;
			$str.='</div>';
			$str.='</div>';
			echo $str;
	}
	function alert($txt) {  
		GLOBAL $msg ;
		$msg.=$txt."<br/>";
		
	}
?>
