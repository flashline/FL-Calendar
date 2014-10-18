<?php
	/**************************************************************************************************
	SoftWare : pixaLine  calendar
	File : calendar.php
	Description : all server codes of calendar project
	Content : /
	Author : Delettre Jean-Michel
	CoAuthors : 
	Copyright / Droits d'auteur : Free-Works.Org - Flash-Line.net
	****************************************************************************************************/
	error_reporting (4) ;
	/*
	header('Expires: '.gmdate('D, d M Y H:i:s', (time()-1)).'GMT');
	header('Cache-Control: no-store, no-cache, must-revalidate');
	header('Cache-Control: post-check=0, pre-check=0', FALSE);
	header('Pragma: no-cache');
	*/
	ini_set('session.gc_maxlifetime', 3*60*60);
	//
	require "function.php";
	session_start();
	//
	$endStr = "";//$endStr="<br/>";//
	$adminMail = "info@pixaline.net";
	if (count($_GET)>0) {
		if (isset($_GET["req"])) $req=$_GET["req"];
		if (isset($_GET["pseudo"])) $pseudo=$_GET["pseudo"];
		if (isset($_GET["pwd"])) $pwd=$_GET["pwd"];
		if (isset($_GET["day"])) $day=$_GET["day"];
		if (isset($_GET["txt"])) $txt=$_GET["txt"];
		if (isset($_GET["year"])) $year=$_GET["year"];
		if (isset($_GET["month"])) $month=$_GET["month"];
		if (isset($_GET["userMail"])) $userMail=$_GET["userMail"];
		
	} else if (count($_POST)>0) {
		if (isset($_POST["req"])) $req=$_POST["req"];
		if (isset($_POST["pseudo"])) $pseudo=$_POST["pseudo"];
		if (isset($_POST["pwd"])) $pwd=$_POST["pwd"];	
		if (isset($_POST["day"])) $day=$_POST["day"];
		if (isset($_POST["txt"])) $txt=$_POST["txt"];
		if (isset($_POST["year"])) $year=$_POST["year"];
		if (isset($_POST["month"])) $month = $_POST["month"];
		if (isset($_POST["userMail"])) $userMail = $_POST["userMail"];
	} 
	
	if (!isset($req)) errorAndExit();

	// connect or login actions	
	     if ($req=="isConnectionOpen") 		outPutAndExit (isConnectionOpen());
	else if ($req=="openConnection") 		outPutAndExit (openConnection());
	else if ($req=="closeConnection") 		outPutAndExit (closeConnection());
	else if ($req=="createLogin") 			outPutAndExit (createLogin());
	// after connect actions
	//else if ($req=="readDay") 				outPutAndExit (readDay($day));
	else if ($req=="readAllMonthAndDay") 	outPutAndExit (readAllMonthAndDay($year));
	else if ($req=="writeDay") 				outPutAndExit (writeDay($day,$txt));
	else if ($req=="writeMonth") 			outPutAndExit (writeMonth($month,$txt));
	else if ($req=="changeYear") 			outPutAndExit (changeYear($year));
	else if ($req=="sendUserMail") 			outPutAndExit (sendUserMail($userMail,$adminMail));
	else 									outPutAndExit (sendInvalidReq());
	
	// NO POSSIBLE TO ARRIVE THERE	
	errorAndExit();
	
	// gets	
	function getPwd() {
		return $_SESSION['pwd'];
	}
	function getPseudo() {
		return $_SESSION['pseudo'] ;
	}	
	function setPseudo($str) {
		$_SESSION['pseudo']=$str ;
	}	
	function setPwd ($str) {
		$_SESSION['pwd']=$str;
	}
	
	
	
	//
	//
	function changeYear($year) {
		if (!isConnectionValid()) {
			$out="answ=error&msg=connectionIsNotOpenOrValid";
		} else {
			$str=readPseudoFile() ; 
			$pos = strpos($str,"&currentYear=");
			if ($pos===false) {
				$str2=$str."&currentYear=".$year ;
			} else {
				$str2=substr($str,0,$pos)."&currentYear=".$year.substr($str,$pos+17);
			}
			//write to file		
			if (!writePseudoFile(getPseudo(),$str2) ) {
				$out="answ=error&msg=yearWriteError";
			} else {
				$out = "answ=changeYearOk".readPseudoFile()."";
				$out.="&xmldata=".readAllMonthAndDay($year);				
			}
		}
		return $out;		 
	}
	function readDay($day) {
		if (!isConnectionValid()) {
			$out="answ=error&msg=connectionIsNotOpenOrValid";
		} else {
			require "cst.php";
			$folder=folderPathName(getPseudo(),getPwd());
			$file=$day.$DAY_EXT ;
			chdir ($folder);
			if (!$txt=file_get_contents  ( $file)) {
				$out="answ=fileNotFoundOrEmpty";
			} else {
				$txt=encodeXmlReserved($txt);
				$out="answ=readDayOk&txt=$txt";	
			}
		}
		return $out;		 
	}
	function writeDay($day,$txt) {
		if (!isConnectionValid()) {
			$out="answ=error&msg=connectionIsNotOpenOrValid";
		} else {
			require "cst.php";
			$folder=folderPathName(getPseudo(),getPwd());
			$file=$day.$DAY_EXT ;
			chdir ($folder);
			if ($txt=="") {
				unlink  ($file);
				$out="answ=writeDayOk&msg=dayIsRemoved";
			} else {
				if (!$nf=fopen($file,"w")) { 
					$out="answ=error&msg=openFileNotPossible";
				} else if (!$txt=fwrite($nf,$txt)) {
					$out="answ=error&msg=writeFileError";
				} else {
					$out="answ=writeDayOk&day=".$day ;	
				}
			}
		}
		return $out;
	}
	function writeMonth($month,$txt) {
		if (!isConnectionValid()) {
			$out="answ=error&msg=connectionIsNotOpenOrValid";
		} else {
			require "cst.php";
			$folder=folderPathName(getPseudo(),getPwd());
			$file=$month.$MONTH_EXT ;
			chdir ($folder);
			if ($txt=="") {
				unlink  ($file);
				$out="answ=writeMonthOk&msg=monthIsRemoved";
			} else {
				if (!$nf=fopen($file,"w")) {
					$out="answ=error&msg=openFileNotPossible";
				} else if (!$txt=fwrite($nf,$txt)) {
					$out="answ=error&msg=writeFileError";
				} else {
					$out="answ=writeMonthOk&month=".$month ;	
				}
			}
		}
		return $out;
	}
	function readAllMonthAndDay($year) {		
		$out="<?xml version = \"1.0\" encoding=\"UTF-8\" ?> \n";
		$out.="<root> \n";		
		if (!isConnectionValid()) {
			$out.="<error>connectionIsNotOpenOrValid</error>";
		} else {
			$folder=folderPathName(getPseudo(),getPwd());
			chdir ($folder);
			//
			$year=(integer) $year;		
			//
			$out.=readDayOfMonth($year,1,12);
			$year--;
			$out.=readDayOfMonth($year,12,12);
			$year++;$year++;
			$out.=readDayOfMonth($year,1,1);
		}
		$out.="</root> \n";	
		return $out;		 
	}
	function readDayOfMonth($year,$bm,$em) {
		require "cst.php";
		//
		$out="";
		for ($im=$bm;$im<=$em;$im++) {	
			$month=$year*100+$im;
			$name=(string)$month;	
			$file=$name.$MONTH_EXT ;
			if ($txt=file_get_contents  ( $file)) {
				$out.="<month_$name> \n";
				$out.=encodeXmlReserved($txt)."\n";
				$out.="</month_$name> \n";
			} 
			for ($id=1;$id<=31;$id++) {	
				$day=$year*10000+$im*100+$id;
				$name=(string)$day;	
				$file=$name.$DAY_EXT ;		
				if ($txt=file_get_contents  ( $file)) {
					$out.="<day_$name> \n";
					$out.=encodeXmlReserved($txt)."\n";
					$out.="</day_$name> \n";
				} 
			}
		}
		return $out;		 
	}
	
	//
	//
	
	function isConnectionOpen() {
		if(!sessionIsOpened ()) {
			$out="answ=connectionIsNotOpen";
		} else if (!pseudoFileExist(getPseudo())) {
			$out="answ=error&msg=pseudoFileMissing";
			destroySession();
		} else if (!pseudoFolderExist(getPseudo(),getPwd())) {
			$out="answ=error&msg=pseudoFolderMissing";
			destroySession();
		} else {
			$out="answ=connectionIsOpen".readPseudoFile()."&pseudo=".getPseudo();//."&pwd=".getPwd();	
			//
			$out=addReadMonthAndDay($out);
		}		
		return $out;
	}
	function addReadMonthAndDay($out) {
		$str=readPseudoFile() ; 
		$pos = strpos($str,"&currentYear=");			
		if ($pos!=false) {
			$year=substr($str,$pos+13,4);
			$out.="&xmldata=".readAllMonthAndDay($year);
		} else {
			$out.="&xmldata="."<?xml version = \"1.0\" encoding=\"UTF-8\" ?> \n"."<root><error>currentYearDoesntExist</error></root>";			
		}
		return $out;
	}
	
	function openConnection() {
		GLOBAL $pseudo;
		GLOBAL $pwd;
		if(sessionIsOpened () ) { 
			$out="answ=error&msg=connectionAlreadyOpen";
		} else if (!inputValid($pseudo,$pwd)) {
			$out="answ=error&msg=noValidInput";		
		} else if (!pseudoValid($pseudo)) {
			$out="answ=error&msg=noValidPseudo";		
		} else if (!pwdValid($pseudo,$pwd)) {
			$out="answ=error&msg=noValidPwd";		
		} else {
			$_SESSION['pwd']=$pwd; $_SESSION['pseudo']=$pseudo ;			
			$out="x=x&answ=openConnectionOk".readPseudoFile()."&pseudo=".$pseudo;
			//
			$out=addReadMonthAndDay($out);
		}
		return $out;
	}
	function closeConnection() {		
		if(sessionIsOpened () ) {
			$pseudo=getPseudo() ;
		} else $pseudo="";
		$out="answ=closeConnectionOk&pseudo=".$pseudo."";	
		destroySession();
		return $out;
	}
	function createLogin() {
		GLOBAL $pseudo;
		GLOBAL $pwd;
		GLOBAL $year;
		if (!inputValid($pseudo,$pwd)) {
			$out="answ=error&msg=noValidInput";		
		} else if (pseudoFileExist($pseudo)) {
			$out="answ=error&msg=pseudoAlreadyExist";			
		} else {			
			if(sessionIsOpened () ) {
				unset($_SESSION['pseudo']); unset($_SESSION['pwd']); 
			} 
			if (!createPseudoFolderAndFile($pseudo,$pwd,$year)) {
				$out="answ=error&msg=folderCreationNotPossible";
			} else {
				setPseudo($pseudo) ;
				setPwd($pwd) ;
				$out="answ=createLoginOk&pseudo=".$pseudo."";	
			}
		}
		return $out;
	}
	function sendInvalidReq() {
		$out="answ=error&msg=invalidRequest";		
		return $out;
	}	
	//
	//
	function inputValid($pseudo,$pwd) {
		if (!isset($pwd) || !isset($pseudo) ) return false ;
		else if ( $pwd=="" ||  $pseudo=="" ) return false ;
		else return true ;
	}
	function pseudoValid($pseudo) {			
		return pseudoFileExist($pseudo) ;
	}
	function pwdValid($pseudo,$pwd) {		
		return pseudoFolderExist($pseudo,$pwd) ;
	}
	function pseudoFileExist($pseudo) {
		$file=pseudoPathName($pseudo);
		return(file_exists($file));
	}
	function pseudoFolderExist($pseudo,$pwd) {
		require "cst.php";
		$dir=folderPathName($pseudo,$pwd);
		$ok=chdir ($dir);
		chdir($BASE.$PHP_DIR);
		return $ok ;
	}
	function folderPathName($pseudo,$pwd) {
		require "cst.php";
		$folder=$BASE.$DATA_DIR.md5("$pseudo.$pwd");
		return  $folder;
	}
	function pseudoPathName($pseudo) {
		require "cst.php";
		$file=$BASE.$ID_DIR.md5("$pseudo").$LOG_EXT;
		return  $file;
	}
	function dataDirIsInitialized() {
		require "cst.php";
		if (file_exists($BASE.$DATA_DIR) && file_exists($BASE.$ID_DIR) ) return true ;
		else {
			if (!file_exists($BASE.$DATA_DIR)) {
				if (!mkdir ($BASE.$DATA_DIR,$PERM)) return false ;
			}
			if (!file_exists($BASE.$ID_DIR)) {
				if (!mkdir ($BASE.$ID_DIR,$PERM)) return false ;
			}			
		} 
		return true ;
	}
	function createPseudoFolderAndFile($pseudo,$pwd,$year) {
		if (!isset($year)) $year="";
		if (pseudoFolderExist($pseudo,$pwd)) {
			return false ;
		} else if (pseudoFileExist($pseudo)) {
			return false ;
		} else {
			require "cst.php";
			if (dataDirIsInitialized()) {
				$dir=folderPathName($pseudo,$pwd);
				if (!mkdir ($dir,$PERM)) {	
					return false ;
				} else {
					chmod ($dir,$PERM) ; 
					//create file
					$out="&dir=$dir&currentYear=$year";
					if (!writePseudoFile($pseudo,$out)) return false;
					else {
						$file=pseudoPathName($pseudo);
						return chmod ($file,$PERM) ;//ici
					}
				}
			} else return false ;
		}
	}
	function readPseudoFile() {
		$file=pseudoPathName(getPseudo());
		$str=file_get_contents  ( $file) ;
		if (!isset($str) ) $str="";			
		return $str;		
	}
	function writePseudoFile($pseudo,$out) {
		if (!isset($pseudo)) return false ;
		if ($pseudo=="") return false ;		
		$file=pseudoPathName($pseudo);
		$nf=fopen($file,"w");
		if (!fputs ($nf,$out)) {
			return false ;
		} 
		fclose($nf);
		return true ;
	}	
	function sessionIsOpened () {
		return (isset($_SESSION["pseudo"])) ;
	}
	function isConnectionValid() {
		if(!sessionIsOpened ()) return false ;
		else {				
			if (!pseudoFileExist(getPseudo())) {
				return false ;
			}
			else if (!pseudoFolderExist(getPseudo(),getPwd())) return false ;
			else return true ;
		}
	}
	//
	// send user's mail to flnet	
	function sendUserMail($userMail,$adminMail) {
		$subject = "Utilisateur de FL-Calendar Html5 : ".$userMail ;			
		$header = "";
		$header .= "MIME-Version: 1.0"."\r\n";				
		$header .= "Content-type: text; charset=iso-8859-1"."\r\n";
		$header .= "From: ".$userMail."\r\n";
		$header	.= "Reply-To: ".$userMail."\r\n";
		$header	.= "X-Mailer: PHP/".phpversion()."\r\n";
		$msg = $subject."\n\n";
		if (mail($adminMail, $subject, $msg, $header)) {
			$out="answ=userMailSentOk";				
		} else {
			$out="answ=error&msg=sendUserMailError";
		}
		return $out;
	}	
	//
	//
	function errorAndExit() {
		GLOBAL $endStr;
		echo "answ=unknowErr".$endStr;
		doExit();
	}
	function outPutAndExit($out) {
		GLOBAL $endStr;
		echo $out.$endStr;
		doExit();
	}	
	function doExit() {
		//showAlert();
		exit();
	}	
?>

