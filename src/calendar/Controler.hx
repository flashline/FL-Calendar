/**
 * Copyright (c) jm Delettre.
 * 
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/**
* app calendar package
*/
package calendar;
/**
* classes imports
*/
import js.Browser;
import js.html.Element;
import js.html.Event;
import js.html.EventListener;
import js.html.KeyboardEvent;
import js.html.MouseEvent;
import net.flash_line.event.StandardEvent;
import net.flash_line.event.timing.Delay;
import net.flash_line.util.Object;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
import net.flash_line.util.xml.XmlParser;
/**
* Calendar controler class
*/
class Controler extends Common {
	var model:Model;
	var view:View;
	var delay:Delay;
	
	public var lang(get,null):Object;	
	/**
	 * constructor
	 * @param	m model class related with model.xml and language.xml
	 * @param	v view class
	 */
	public function new (m:Model,v:View) {
		model = m;
		view = v;		
    }
    /**
     * Init basic events...
     */
	public function eventInit () {
		view.rootHtmlElement.addLst("resize", skinResize);
		view.window.addLst("resize", skinResize);
		view.window.addLst("beforeunload", pageUnload);
		view.window.handCursor(false);
		view.connection.addLst(StandardEvent.CLICK,connectionClick); 
		view.changeYear.addLst(StandardEvent.CLICK, changeYearClick); 
		view.refresh.addLst(StandardEvent.CLICK, refreshClick); 
		view.safeMode.addLst(StandardEvent.CLICK, safeModeClick); 
		model.serverActived.bind(onServerActived);
		createLoginViewEvent ();
		createChangeYearViewEvent ();
	}
	function  pageUnload (e:Event)  {
		if ((model.currUserId != null) && ( areThereNotSavedOpenTexts () ) ) {
			return lang.message.unloadAlert.label ; 		
		}
		return ;
	}
	/**
	 * ... end start.
	 */
	public function start () {
		askConnectInfo ();		
	}
    /**
    *@private
    */
	//
	//
	// server ask/answers
	//
	//
	function askConnectInfo () {
		model.wait.start(lang.server.connectInfo.label);
		model.serverEvent.bind(onAnswerConnectInfo);
		model.toServer({req:"isConnectionOpen"});
	}
	function onAnswerConnectInfo (e:StandardEvent) {
		//model.serverEvent.unbind(onAnswerConnectInfo);
		model.wait.stop();
		var answ = e.result.answ;
		if (answ == "connectionIsOpen") { 
			var currYear = e.result.currentYear; var currUserId = e.result.pseudo; var currUserPwd = e.result.pwd;
			if (strVal(currYear, "").length > 0) model.currYear = Std.parseInt(currYear);
			if (strVal(currUserId, "") != "") model.currUserId = currUserId;	
			if (strVal(currUserPwd, "") != "") model.currUserPwd = currUserPwd;	
			view.displayUserInfo();
			//
			view.changeConnectLabel(lang.button.deconnect.label);
			view.connection.removeLst(StandardEvent.CLICK,connectionClick); 
			view.connection.addLst(StandardEvent.CLICK,deconnectClick); 
			//
			view.changeYear.show();
			view.refresh.show();
			//
			model.simpleCalendarUsing = false;				
			//
			e.result= new XmlParser().parse( Xml.parse(e.result.xmldata));
			if (e.result.error != null) {
				alert(lang.error.server.fatalRead.label);
			}
			else {				
				initializeMonthAndDay(connected(true),dayOnly(false),e.result);
				view.doLayoutResponsive();
			}	
		} else if (answ == "connectionIsNotOpen")  {	
			model.wait.stop();
			doConnection ();
		} else if (answ == "error")  {
			model.wait.stop();
			alert(lang.error.server.noValidConnection.label,doConnection); 
		} else {		
			model.wait.stop();
			alert(lang.error.server.action.label,doConnection);
		}		
	}
	function askOpenConnection ( pseudo:String, pwd:String) {
		model.wait.start(lang.server.openConnection.label);
		model.currUserPwd = pwd;
		model.serverEvent.unbind();
		model.serverEvent.bind(onAnswerOpenConnection);
		model.toServer( { req:"openConnection", pseudo:pseudo, pwd:pwd } );
		
	}
	function onAnswerOpenConnection (e:StandardEvent) {
		model.wait.stop();
		var answ:String=e.result.answ;
		if (answ=="error") { 
			var msg:String=e.result.msg;
			if (msg=="noValidPseudo") {
				alert(lang.error.server.idDontExist.label,onErrorCallBackOpenConnection);					
			} else if (msg=="noValidPwd")  {
				alert(lang.error.server.noValidPwd.label,onErrorCallBackOpenConnection);
			} else {
				alert(lang.error.server.unknownError.label,onErrorCallBackOpenConnection);					
			} 			
		} 
		else if (answ == "openConnectionOk")  {		
			var currYear = e.result.currentYear; var currUserId = e.result.pseudo;
			if (strVal(currYear, "").length > 0) model.currYear = Std.parseInt(currYear);
			if (strVal(currUserId, "") != "") model.currUserId = currUserId;	
			view.displayUserInfo();
			//
			view.changeConnectLabel(lang.button.deconnect.label);
			view.connection.removeLst(StandardEvent.CLICK,connectionClick); 
			view.connection.addLst(StandardEvent.CLICK,deconnectClick); 
			//
			view.changeYear.show();
			view.refresh.show();
			if (model.isLogInAfterTimeOut ) {
				var d = 0; var m = 0; 
				for ( day in model.save.days) {
					trace(day.key);
					askToWriteOneDayText(day); d++;
				}
				for ( month in model.save.months) {
					trace(month.key);
					askToWriteOneMonthText(month); m++;
				}
				//
				model.serverWriteDayEvent.unbind();
				model.serverWriteMonthEvent.unbind();				
				if (d > 0) {				
					model.serverWriteDayEvent.bind(onAnswerToWriteOneDayText);
				}
				if (m > 0) {
					model.serverWriteMonthEvent.bind(onAnswerToWriteOneMonthText);
				}
			} 
			else {
				model.simpleCalendarUsing = false;	
				//
				e.result= new XmlParser().parse( Xml.parse(e.result.xmldata));
				if (e.result.error != null) {
					alert(lang.error.server.fatalRead.label);
				}
				else {
					if (model.isMonthAndDayCreated) {
						view.removeBissexDay ();
						model.removeBissexDay();
						if (model.isCurrYearBissextile) {
							model.createBissexDay();
							view.createBissexDay();
						}
						updateMonthAndDay(connected(true),dayOnly(true),e.result);										
					} else {					
						initializeMonthAndDay(connected(true),dayOnly(false),e.result);						
					}					
				}
				view.doLayoutResponsive();
				model.writeUserCookie();
			}
		} 
		else {
			alert(lang.error.server.unknownError.label,onErrorCallBackOpenConnection);
		}			
	}	
	function onErrorCallBackOpenConnection () {
		model.currUserPwd = null;
		doConnection();
	}
	function askLoginCreation ( pseudo:String, pwd:String) {
		model.wait.start(lang.server.loginCreation.label);
		model.currUserPwd = pwd;
		model.serverEvent.unbind();
		model.serverEvent.bind(onAnswerLoginCreation);
		model.toServer( {req:"createLogin",pseudo:pseudo,pwd:pwd,year:model.currYear});	
	}
	function onAnswerLoginCreation (e:StandardEvent) {
		model.wait.stop();
		var answ:String=e.result.answ;
		if (answ=="error") { 
			var msg:String=e.result.msg;
			if (msg=="pseudoAlreadyExist") {
				alert(lang.error.server.idAlreadyExist.label,onErrorCallBackLoginCreation);					
			} else if (msg=="folderCreationNotPossible")  {
				alert(lang.error.server.fileSystemError.label,onErrorCallBackLoginCreation);
			} else {
				alert(lang.error.server.unknownError.label,onErrorCallBackLoginCreation);					
			} 
		} else if (answ == "createLoginOk")  {
			var currUserId = e.result.pseudo;
			if (strVal(currUserId, "") != "") model.currUserId = currUserId;	
			//
			view.changeConnectLabel(lang.button.deconnect.label);
			view.connection.removeLst(StandardEvent.CLICK,connectionClick); 
			view.connection.addLst(StandardEvent.CLICK,deconnectClick); 
			//
			view.changeYear.show();		
			view.refresh.show();		
			model.simpleCalendarUsing = false;			
			//
			if (model.isMonthAndDayCreated) {				
				updateMonthAndDay(connected(true),dayOnly(true),new Object());
			}			
			//model.currYear = null;
			else {
				initializeMonthAndDay ();	
			}
			view.doLayoutResponsive();
			view.displayUserInfo();			
			saveUserEmail();
		} else {			
			alert(lang.error.server.unknownError.label,onErrorCallBackLoginCreation);
		}
		
	}	
	function onErrorCallBackLoginCreation () {
		model.currUserPwd = null;
		doConnection(true);
	}
	function askSendUserMail (userMail) {
		model.wait.start(lang.server.sendUserMail.label);
		model.serverEvent.unbind();
		model.serverEvent.bind(onAnswerSendUserMail);
		model.toServer( {req:"sendUserMail",userMail:userMail});	
	}
	function onAnswerSendUserMail (e:StandardEvent) {
		model.wait.stop();
		var answ:String=e.result.answ;
		if (answ == "userMailSentOk")  {
			alert(lang.message.userMailSentOk.label,null,lang.message.userMailSubTitle.label);
		} else {
			alert(lang.error.server.userMail.label);
		}
	}		
	function askLogOut () {			
		model.wait.show(lang.server.logOut.label);
		model.serverEvent.unbind();
		model.serverEvent.bind(onAnswerLogOut);
		model.toServer( { req:"closeConnection" } );
	}
	function onAnswerLogOut (e:StandardEvent) {		
		model.wait.stop();			
		if (e.result.answ == "closeConnectionOk")  {	
			this.disableMonthTextAndDay();
			model.currUserId = null;
			model.currUserPwd = null;
			model.simpleCalendarUsing = true;
			//
			view.doLayoutResponsive() ;		
			view.displayInfoWhenNoUser();
			view.changeConnectLabel(lang.button.connect.label);
			view.connection.removeLst(StandardEvent.CLICK,deconnectClick); 
			view.connection.addLst(StandardEvent.CLICK,connectionClick); 
			//
			view.changeYear.hide();
			view.refresh.hide();
			
		} else {
			alert(lang.error.server.deconnectError.label);	
		}
	}
	function askToChangeYear (newYear:String) {
		model.wait.start(lang.server.changeYear.label);
		model.serverEvent.unbind();
		model.serverEvent.bind(onAnswerToChangeYear);
		model.toServer( {req:"changeYear",year:newYear});
	}
	function onAnswerToChangeYear (e:StandardEvent) {
		model.wait.stop();
		var answ = e.result.answ;
		if (answ == "error") { 
			var msg:String=e.result.msg;
			if (msg == "connectionIsNotOpenOrValid") {
				saveOpenTextToBeWriting();
				alert(lang.error.server.connectionIsClose.label,doConnection);					
			} else if (msg=="yearWriteError")  {
				alert(lang.error.server.changeYear.label);
			} else {
				alert(lang.error.server.unknownError.label);					
			} 			
		} else if (answ == "changeYearOk")  {	
			this.removeBissexDayEvent();
			view.removeBissexDay ();
			model.removeBissexDay();
			model.currYear = Std.parseInt(e.result.currentYear.substr(0, 4));
			
			if (model.isCurrYearBissextile) {
				model.createBissexDay();
				view.createBissexDay();
				this.createBissexDayEvent();
			}
			view.displayUserInfo();	
			//
			e.result= new XmlParser().parse( Xml.parse(e.result.xmldata));
			if (e.result.error != null) {
				alert(lang.error.server.fatalRead.label);
			}
			else {				
				model.storeMonthAndDayText(e.result);
			}
			//
		} else {
			alert(lang.error.server.unknownError.label);	
		}
	}	
	//day write
	function askToWriteOneDayText(day:Day) {
		model.wait.start(lang.server.writeOneDayText.label);		
		model.serverWriteDayEvent.bind(onAnswerToWriteOneDayText);
		model.save.currUserId = model.currUserId;		
		model.toServer( {req:"writeDay",day:day.key,txt:day.textContent},"writeDay");
	}
	function onAnswerToWriteOneDayText(e:StandardEvent) {
		//don't remove comment before : model.serverWriteDayEvent.unbind();		
		model.wait.stop();
		var answ = e.result.answ; var msg = e.result.msg;
		if (answ == "error") { 
			var msg:String=e.result.msg;
			if (msg == "connectionIsNotOpenOrValid") {	
				model.serverWriteDayEvent.unbind();	
				saveOpenTextToBeWriting();	
				//here: doConnection(); // replaced by: doAutoReconnection ();
				doAutoReconnection();
			} 
			else {
				alert(lang.error.server.fatalWrite.label);					
			} 			
		} else if (answ == "writeDayOk")  {	
			model.save.days=[];
			model.save.currUserId = "";
		} else {
			alert(lang.error.server.unknownError.label);	
		}
	}
	// month write
	function askToWriteOneMonthText(month:Month) {
		model.wait.start(lang.server.writeOneMonthText.label);		
		model.serverWriteMonthEvent.bind(onAnswerToWriteOneMonthText);
		model.save.currUserId = model.currUserId;		
		model.toServer( { req:"writeMonth", month:month.key, txt:month.textContent }, "writeMonth");
	}
	function onAnswerToWriteOneMonthText(e:StandardEvent) {
		//don't remove this comment : model.serverWriteMonthEvent.unbind();		
		model.wait.stop();
		var answ = e.result.answ; var msg = e.result.msg;
		if (answ == "error") { 
			//
			var msg:String=e.result.msg;
			if (msg == "connectionIsNotOpenOrValid") {
				saveOpenTextToBeWriting();
				//here: doConnection(); // replaced by: doAutoReconnection ();
				doAutoReconnection();
			} 
			else {
				alert(lang.error.server.fatalWrite.label);					
			} 			
		} else if (answ == "writeMonthOk")  {	
			//trace("on  answ : month=" + e.result.month) ;
			model.save.months=[];
			model.save.currUserId = "";
		} else {
			alert(lang.error.server.unknownError.label);	
		}
	}
	//
	//
	// main loop-modules
	//
	//
	function initializeMonthAndDay (?connected:Bool = true, ?dayOnly:Bool = false, ?readData:Object = null) {
		var v = model.tree.month.list.item.length;
		for (monthIdx in 0...v) {
			var month:Month 			= 	model.createOneMonth(monthIdx);
											view.createOneMonth (month);
											this.createOneMonthEvent (month,connected,dayOnly);
			month.openTextElem.show();
			if (readData != null) 			model.storeOneMonthText (readData, month);
			for (dayIdx in 0...month.maxDay) {
				var day:Day					=	month.createOneDay(dayIdx);
												month.createOneDaySkin(day);
												this.createOneDayEvent (day, connected);
				if (readData != null) 			model.storeOneDayText (readData, day);
			}
		}
	}
	function updateMonthAndDay (?connected:Bool=true,?dayOnly:Bool=false,?readData:Object=null) {
		var month:Month;
		for (month in model.monthChildren) {
			createOneMonthEvent(month, connected, dayOnly);
			month.displayUpdate();
			if (readData != null) model.storeOneMonthText (readData, month);
			for (day in month.dayChildren) {
				createOneDayEvent(day, connected);	
				day.clear(); day.displayUpdate () ;	
				if (readData != null) model.storeOneDayText (readData, day);
			}
		}						
	}
	function disableMonthTextAndDay () {		
		var month:Month;
		if (model.monthChildren[0].reactiveElem.hasLst(StandardEvent.CLICK, monthClick)) {
			for (month in model.monthChildren) {			
				removeOneMonthTextEvent(month);
				//
				if (month.dayChildren[0].reactiveElem.hasLst(StandardEvent.CLICK, dayClick)) {
					for (day in month.dayChildren) {
						removeOneDayEvent(day);
						day.close();
						day.showFullNameOnTop();
					}
				}
			}
		}  
	}	
	//
	//
	// divers functions
	//
	//
	function areThereNotSavedOpenTexts () :Bool {
		var b = false;
		for (month in model.monthChildren) {
			if (month.isTextAreaOpen && month.hasBeenModified) {
				b = true;
				break;				
			}				
			for (day in month.dayChildren) {
				if (day.isOpen && day.hasBeenModified) {
					b = true;
					break;
				}
			}
		}
		return b;
	}
	function saveOpenTextToBeWriting ()  {		
		for (month in model.monthChildren) {
			if (month.isTextAreaOpen && month.hasBeenModified) {
				month.storeText();
				model.save.months.push(month);				
			}				
			for (day in month.dayChildren) {
				if (day.isOpen && day.hasBeenModified) {
					day.storeText();
					model.save.days.push(day);
				}
			}
		}
	}
	function saveUserEmail() {
		model.promptBox.open(lang.message.userMailPrompt.label, onUserMailPrompt) ;		
	}	
	function onUserMailPrompt (v:String) {
		if (strVal(v, "") != "") { 
			askSendUserMail(v);
		} 
	}
	function startNewDelay (?noDelay:Bool=false) {
		if (noDelay) onDelay(null) ;
		if (delay != null) delay.disable();
		delay = new Delay(onDelay,numVal(model.tree.server.dataSaveDelay, 180));
	}
	//
	//
	// events add/remove 
	//
	//
	function createLoginViewEvent () {
		view.signInCancel.addLst(StandardEvent.CLICK,cancelLoginClick);
		view.signUpCancel.addLst(StandardEvent.CLICK,cancelLoginClick);
		view.signInValid.addLst(StandardEvent.CLICK,validLoginSignInClick);
		view.signUpValid.addLst(StandardEvent.CLICK,validLoginSignUpClick);
	}
	function createChangeYearViewEvent () {
		view.changeYearCancel.addLst(StandardEvent.CLICK,cancelChangeYearClick);
		view.changeYearValid.addLst(StandardEvent.CLICK,validChangeYearClick);
	}
	function createOneMonthEvent (month:Month, ?connected:Bool = true, ?dayOnly:Bool = false) {
		if (!dayOnly) {
			if (!month.reactiveElem.hasLst(StandardEvent.CLICK) ) {
				month.reactiveElem.addLst(StandardEvent.CLICK, monthClick, month);		
			} 
		}
		if (connected) {
			if (!month.openTextElem.hasLst(StandardEvent.CLICK) ) {		
				month.openTextElem.addLst(StandardEvent.CLICK, openMonthTextClick, month);					
				month.clearButton.addLst(StandardEvent.CLICK, monthTextClearClick, month);
				month.cancelButton.addLst(StandardEvent.CLICK, monthTextCancelClick, month);
				month.validButton.addLst(StandardEvent.CLICK, monthTextValidClick, month);	
			} 
			month.openTextElem.show();
		}
		else month.openTextElem.hide();
	}
	function createOneDayEvent(day:Day,?connected:Bool=true) {
		if (connected) {
			if (!day.reactiveElem.hasLst(StandardEvent.CLICK) ) {
				day.reactiveElem.addLst(StandardEvent.CLICK, dayClick, day);
				day.reactiveElem.addLst(StandardEvent.MOUSE_OVER, dayOver, day); 
				day.reactiveElem.addLst(StandardEvent.MOUSE_OUT, dayOut, day);
				day.clearButton.addLst(StandardEvent.CLICK, clearClick, day);
				day.cancelButton.addLst(StandardEvent.CLICK, cancelClick, day);
				day.validButton.addLst(StandardEvent.CLICK, validClick, day);
			} 
		} 
		else  {
			//day.close();
			day.showFullNameOnTop();
		}
	}
	function createBissexDayEvent () {		
		if (model.isMonthAndDayCreated) {
			var day:Day = model.getMonth(2).getDay(29);
			if (day!=null) {
				if (!day.reactiveElem.hasLst(StandardEvent.CLICK, dayClick)) createOneDayEvent(day);				
			}
		}
	}
	function removeOneMonthTextEvent (month:Month) {	
		month.clearButton.removeLst(StandardEvent.CLICK, monthTextClearClick);
		month.cancelButton.removeLst(StandardEvent.CLICK, monthTextCancelClick);
		month.validButton.removeLst(StandardEvent.CLICK, monthTextValidClick);			
		month.openTextElem.removeLst(StandardEvent.CLICK, openMonthTextClick); 
		month.openTextElem.hide(); 
		month.closeTextArea();
	}
	function removeOneDayEvent(day:Day) {
		day.reactiveElem.removeLst(StandardEvent.CLICK, dayClick);
		day.reactiveElem.removeLst(StandardEvent.MOUSE_OVER, dayOver); 
		day.reactiveElem.removeLst(StandardEvent.MOUSE_OUT, dayOut);					
		day.clearButton.removeLst(StandardEvent.CLICK, clearClick);
		day.cancelButton.removeLst(StandardEvent.CLICK, cancelClick);
		day.validButton.removeLst(StandardEvent.CLICK, validClick);							
	}
	function removeBissexDayEvent () {		
		if (model.isMonthAndDayCreated) {
			var day:Day = model.getMonth(2).getDay(29);
			if (day!=null) {
				if (day.reactiveElem.hasLst(StandardEvent.CLICK, dayClick)) removeOneDayEvent(day);				
			}
		}
	}	
	//
	//
	// listeners
	//
	//
	function onDelay (d:Delay) {
		//save texts 
		var i = 0;var m = 0;
		if ((!model.simpleCalendarUsing) && (model.currUserId!=null)) {
			for (month in model.monthChildren) {
				if (month.isTextAreaOpen && month.hasBeenModified ) {										
					m++;
					doValidMonthTextClick (month);
				}				
				for (day in month.dayChildren) {
					if (day.isOpen && day.hasBeenModified) {
						i++;
						doValidClick (day);
					}
				}
			}
			if (i > 0) {
				model.serverWriteDayEvent.unbind();
				model.serverWriteDayEvent.bind(onAnswerToWriteOneDayText);
				/*
				if (i == 1) trace("Text in " + i + " open day have been saved...");	
				else trace("Text in " + i + " open days have been saved...");	
				*/
			}
			if (m > 0) {
				model.serverWriteMonthEvent.unbind();
				model.serverWriteMonthEvent.bind(onAnswerToWriteOneMonthText);
				/*
				if (m == 1) trace("Text in " + m + " open month's text have been saved...");	
				else trace("Text in " + m + " open month's texts have been saved...");	
				*/
			}
		}
	}	
	function onServerActived (e:StandardEvent) {
		startNewDelay ();
	}
	function cancelLoginClick (e:Event):Bool { 
		view.signInValid.clearEnterKeyToClick();
		e.preventDefault();	
		view.changeYear.hide();		
		view.refresh.hide();		
		if (!model.isMonthAndDayCreated) {
			initializeMonthAndDay(connected(false));
		}
		model.simpleCalendarUsing = true;
		view.doLayoutResponsive();
		view.hideConnectView();
		return false;	
	}	
	function validLoginSignInClick (e:Event):Bool {
		view.signInValid.clearEnterKeyToClick();
		e.preventDefault();		
		var str = model.isValidSignInInput(view.signInNameInput.value, view.signInPwdInput.value) ;		
		if (str!= "") {
			alert(str,onErrorCallBackValidLoginSignIn);
		} else {
			askOpenConnection( view.signInNameInput.value, view.signInPwdInput.value);// onErrorOpenConnection);			
			view.hideConnectView();			
		}
		return false;
	}	
	function onErrorCallBackValidLoginSignIn () {
		view.signInValid.joinEnterKeyToClick([view.signInCancel,view.signUpValid,view.signUpCancel]);
	}

	function validLoginSignUpClick (e:Event):Bool {
		view.signInValid.clearEnterKeyToClick();
		e.preventDefault();		
		var str = model.isValidSignUpInput(view.signUpNameInput.value, view.signUpPwdInput.value, view.signUpConfirmInput.value) ;		
		if (str != "") {
			alert(str,onErrorCallBackValidLoginSignUp);
		} else {
			askLoginCreation( view.signUpNameInput.value, view.signUpPwdInput.value);
			view.hideConnectView();
		}
		return false;
	}	
	function onErrorCallBackValidLoginSignUp () {
		view.signUpValid.joinEnterKeyToClick([view.signInCancel,view.signInValid,view.signUpCancel]);
	}
	function connectionClick (e:Event):Bool {	
		doConnection();
		return false;
	}	
	function doAutoReconnection () {
		var o = model.readUserCookie();	
		if (o.id != null && o.pwd != null) {
			askOpenConnection( o.id, o.pwd);
		}
		else doConnection();				
	}		
	function doConnection (?withEnterOnSignUpValid=false) {
		model.wait.changeImage(model.baseUrl+model.tree.wait.standard.src);	
		var o = model.readUserCookie();	
		view.showConnectView(strVal(o.id, ""), strVal(o.pwd, ""));
		if(withEnterOnSignUpValid) view.signUpValid.joinEnterKeyToClick([view.signInCancel,view.signInValid,view.signUpCancel]);
		else view.signInValid.joinEnterKeyToClick([view.signInCancel,view.signUpValid,view.signUpCancel]);
	}
	function deconnectClick (e:Event):Bool {
		// line below because WindowsPhone's bug!!!
		if (!(isWindowsPhone && view.isChangeYearViewOpen)) {			
			var conf = model.confirmBox;
			if (areThereNotSavedOpenTexts() ) {
				conf.open(lang.message.saveTextConfirm.label+lang.message.logOutConfirm.label, confirmLogOut) ;
				conf.cancelElem.joinEnterKeyToClick([conf.validElem]); 		
			} else confirmLogOut (confirmWithOutSave(true),conf) ;
		}
		return false;
	}	
	function confirmLogOut (logOutWithoutSave:Bool,conf:ConfirmBox) {
		conf.cancelElem.clearEnterKeyToClick();
		if (logOutWithoutSave) { 
			model.wait.changeImage(model.baseUrl+model.tree.wait.logOut.src);		
			askLogOut () ;
		} else  {			
			startNewDelay (isWithOutDelay(true));
		}
		
	}
	function safeModeClick (e:Event):Bool {
		if (model.isSafeMode) {
			model.setSafeMode(false);
		} else {
			model.setSafeMode(true);
		}	
		view.changeSafeModeLabel();
		view.hideChangeYearView();
		return false;
	}
	//
	function refreshClick (e:Event):Void {
		Browser.location.reload() ; //true
	}
	//
    function changeYearClick (e:Event):Bool {
		doChangeYear ();
		return false;	
	}
    function doChangeYear () {
		if (strVal(view.changeYearInput.getText(), "") == "") view.changeYearInput.setText(strVal(model.currYear, "")); 
		view.changeYearCurrent.setText(strVal(model.currYear, "")); 			
		view.showChangeYearView();
		view.changeYearValid.joinEnterKeyToClick([view.changeYearCancel,view.safeMode]); 
	}
	function cancelChangeYearClick (e:Event):Bool {
		e.preventDefault();
		view.changeYearValid.clearEnterKeyToClick(); 
		view.hideChangeYearView();
		return false;
	}
	function validChangeYearClick (e:Event):Bool {
		e.preventDefault();
		view.changeYearValid.clearEnterKeyToClick();
		var str = model.isValidYearInput(view.changeYearInput.value);		
		if (str!= "") {
			alert(str,onErrorCallBackValidChangeYear);
		} else {
			var newYear = view.changeYearInput.value;
			if (Std.parseInt(newYear) != model.currYear) {
				// year change is valided
				model.save.currYear = newYear;
				var conf = model.confirmBox;
				if (areThereNotSavedOpenTexts() ) {					
					conf.open(lang.message.saveTextConfirm.label+lang.message.changeYearConfirm.label, confirmChangeYear) ;
					conf.cancelElem.joinEnterKeyToClick([conf.validElem]); 
				} 
				else confirmChangeYear (confirmWithOutSave(true),conf) ;
				
			} else view.hideChangeYearView();
		}
		return false;
	}
	function confirmChangeYear (changeYearWithoutSave:Bool, conf:ConfirmBox) {
		view.hideChangeYearView();
		conf.cancelElem.clearEnterKeyToClick();
		if (!changeYearWithoutSave) startNewDelay (isWithOutDelay(true));
		askToChangeYear(model.save.currYear);	
		model.save.currYear = "";
	}
	function onErrorCallBackValidChangeYear () {
		view.changeYearValid.joinEnterKeyToClick([view.changeYearCancel,view.safeMode]); 
	}
	function skinResize (e:Event):Bool {
		view.doLayoutResponsive();
		return false;
	}	
	//month
    function monthClick (e:Event, month:Month):Bool {		
		month.wasOneTimeUsed = true;
		model.wasOneTimeUsed = true;
		if (month.isOpen) {
			for (day in month.dayChildren) {
				if (day.isOpen) doValidClick (day);
			}
			month.restoreScroll();
			month.close();	
		}
		else {			
			month.open();		
			month.scrollToTop();
		}		
		return false;
	}	
	// month textarea
	function openMonthTextClick (e:Event, month:Month):Bool {
		model.wasOneTimeUsed = true;		
		if (month.isTextAreaOpen) {
			doValidMonthTextClick (month);
			month.restoreScroll();
			month.closeTextArea();
		}
		else {
			month.openTextArea();
			month.scrollToTop();
			
		}		
		return false;
	}	
	function monthTextClearClick (e:Event, month:Month):Bool {
		month.clearText();
		return false;
	}
	function monthTextCancelClick (e:Event, month:Month):Bool {
		month.displayText();
		month.restoreScroll();
		month.closeTextArea();
		return false;
	}
	function monthTextValidClick (e:Event, month:Month):Bool {
		//model.serverWriteMonthEvent.unbind();	
		month.restoreScroll();
		month.closeTextArea();		
		doValidMonthTextClick(month);
		return false;
	}
    function doValidMonthTextClick (month:Month) {
		if (month.hasBeenModified) {
			model.serverWriteMonthEvent.unbind();
			month.storeText();	
			model.save.months.push(month);
			askToWriteOneMonthText(month);
		}
		
	}
	// day 
    function dayClick (e:Event, day:Day):Bool {
		model.wasOneTimeUsed = true;		
		if (day.isOpen) {
			doValidClick(day);
			day.restoreScroll();
			day.close();
		}
		else {			
			day.open() ;
			day.scrollToTop();
		}
		return false;		
	}
	function dayOver (e:Event, day:Day):Bool {
		day.setColor("over");
		return false;
	}
	function dayOut (e:Event, day:Day):Bool {
		day.setColor("out");
		return false;
	}
	// day textArea 
    function clearClick (e:Event,day:Day):Bool {
		day.clearText();
		return false;
	}
    function cancelClick (e:Event,day:Day):Bool {
		day.displayText();
		day.restoreScroll();
		day.close();
		return false;
	}
    function validClick (e:Event, day:Day):Bool {	
		day.restoreScroll();
		day.close();		
		doValidClick(day);
		return false;
	}
    function doValidClick (day:Day) {	
		if (day.hasBeenModified) {
			model.serverWriteDayEvent.unbind();
			day.storeText();
			model.save.days.push(day);
			askToWriteOneDayText(day);
		}
	}
	//
	//
	// get/set 
	//
	//
	function get_lang() :Object { return model.lang; }
    //
	//
	// Boolean functions for better understanding.
	//
	//
	function confirmWithOutSave(?b:Bool=true):Bool { return b; }
	function connected(?b:Bool=true):Bool { return b; }
	function dayOnly(?b:Bool=true):Bool { return b; }
	function isWithOutDelay(?b:Bool=true):Bool { return b; }
}
