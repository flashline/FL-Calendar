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
import js.html.ButtonElement;
import js.html.DivElement;
import js.html.Document;
import js.html.DOMWindow;
import js.html.ImageElement;
import js.html.InputElement;
import net.flash_line.util.Object;
import js.Lib;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* Calendar Viewclass
*/
class View extends Common {
	var model:Model;
	var doc:Document;
	var language:Language;
	var monthContainerProto:Element;
	/**
	 * current language texts
	 */
	public var lang(get, null):Object;	
	/**
	 * login/logoff button
	 */
	public var connection(get, null):Element;	
	/**
	 * safemode on/of button in settings box
	 */
	public var safeMode(get, null):Element;	
	/**
	 * open settings-box button
	 */
	public var changeYear(get, null):Element;	
	/**
	 * refresh call button
	 */
	public var refresh(get, null):Element;	
	/**
	 * Element where scheduler name+year are displayed
	 */
	public var current(get,null):Element;	
	public var window(get, null):DOMWindow;	
	/**
	 * signin cancel button
	 */
	public var signInCancel(get,null):Element;	
	/**
	 * signin valid button
	 */
	public var signInValid(get,null):Element;	
	/**
	 * signup valid button
	 */
	public var signUpValid(get,null):Element;	
	/**
	 * signup cancel button
	 */
	public var signUpCancel(get,null):Element;	
	/**
	 * settings-box cancel button
	 */
	public var changeYearCancel(get,null):Element;	
	/**
	 * settings-box valid button
	 */
	public var changeYearValid(get,null):Element;	
	/**
	 * signin elements parentNode
	 */
	public var signInDiv(get,null):Element;	
	/**
	 * signup elements parentNode
	 */
	public var signUpDiv(get,null):Element;	
	/**
	 * settings-box elements parentNode
	 */
	public var changeYearDiv(get,null):Element;	
	/**
	 * signup name field
	 */
	public var signUpNameInput(get,null):InputElement;	
	/**
	 * signin name field
	 */
	public var signInNameInput(get,null):InputElement;	
	/**
	 * signin password field
	 */
	public var signInPwdInput(get,null):InputElement;	
	/**
	 * signup password field
	 */
	public var signUpPwdInput(get,null):InputElement;	
	/**
	 * signin confirm password field
	 */
	public var signUpConfirmInput(get,null):InputElement;	
	/**
	 * year field in settings-box
	 */
	public var changeYearInput(get, null):InputElement;	
	/**
	 * current year display in settings-box
	 */
	public var changeYearCurrent(get, null):Element;	
	/**
	 * true if settings-box is open 
	 */
	public var isChangeYearViewOpen(get,null):Bool;	
	/**
	 * true if settings-box is open 
	 */
	public var isLoginViewOpen(get,null):Bool;	
	//public var xxx(get,null):Element;	
	//
	//
	//
	/**
	 * constructor 
	 * @param	m
	 * @param	lg
	 */
	public function new (m:Model,lg:Language) {
		model = m;
		doc = js.Browser.document;
		language = lg;
		rootHtmlElement = elem("calendar");
    }
	/**
	 * init display
	 */
    public function displayInit () {
		//main skin - level 0
		var el:Element; var str = "";
		elemBy("header").elemBy("title").innerHTML = lang.title.label;
		elemBy("header").elemBy("valided").innerHTML = lang.valided.label;
		if (isMobile) {
			str = lang.advertisingForMobile.label; 
		} else {
			str = lang.advertisingForComputer.label;
		 }
		elemBy("header").elemBy("advertising").innerHTML = str;		
		displayInfoWhenNoUser();
		//
		//here createMonthAndDay () ;
		//
		// login skin -level 1
		el = elem("loginView");
		el.elemBy("title").innerHTML = lang.loginSkin.title.label;
		el.elemBy("letSignIn ").innerHTML = "<b>"+lang.loginSkin.letSignIn.label+ "</b>";
		el.elemBy("signInName ").innerHTML = lang.loginSkin.signInName.label;
		el.elemBy("signInPwd ").innerHTML = lang.loginSkin.signInPwd.label;
		signInDiv.child("signInCancel").innerHTML= lang.button.cancel.label;
		signInDiv.child("signInValid").innerHTML= lang.button.valid.label;
		el.elemBy("letSignUp ").innerHTML = "<b>"+lang.loginSkin.letSignUp.label+ "</b>";
		el.elemBy("signUpName ").innerHTML = lang.loginSkin.signUpName.label;
		el.elemBy("signUpPwd ").innerHTML = lang.loginSkin.signUpPwd.label;
		el.elemBy("signUpConfirm ").innerHTML = lang.loginSkin.signUpConfirm.label;
		signUpDiv.child("signUpCancel").innerHTML= lang.button.cancel.label;
		signUpDiv.child("signUpValid").innerHTML= lang.button.valid.label;
		el.elemBy("signUpChoose ").innerHTML = lang.loginSkin.signUpChoose.label;
		el.elemBy("basicUsing").innerHTML = lang.loginSkin.basicUsing.label;
		//
		// changeYear skin -level 1
		el = elem("changeYearView");
		el.elemBy("title").innerHTML = lang.changeYearSkin.title.label;
		//		
		changeSafeModeLabel();		
		//
		el.elemBy("yearCtnr").elemBy("currYear").innerHTML = Std.string(model.currYear);
		el.elemBy("yearCtnr").elemBy("subTitle").innerHTML = "<b>"+lang.changeYearSkin.subTitle.label+ "</b>";
		el.elemBy("yearCtnr").elemBy("year").innerHTML = lang.changeYearSkin.year.label;
		changeYearDiv.child("changeYearCancel").innerHTML= lang.button.cancel.label;
		changeYearDiv.child("changeYearValid").innerHTML = lang.button.valid.label;
		//
		
    }
	/**
	 * @param month 
	 * @return new created month container
	 */
	public function createOneMonth (month:Month) :Element{
		if (monthContainerProto==null) monthContainerProto = elemBy("monthContainerProto",elem("calendar"));
		var monthContainer:Element = monthContainerProto.clone(true) ;
		elem("monthOuter").appendChild(monthContainer);
		monthContainer.setAttribute("class", "monthContainer");
		monthContainer.id = "m" + month.index;
		month.displayInit (monthContainer);
		return monthContainer;
	}
	public function createBissexDay () {
		if (Browser.document.getElementById("m2d28") == null) {
			var el = elem("m2d27");
			var dayElem:Element = el.clone(true) ;
			elem("m2").appendChild(dayElem);
			dayElem.id = "m2d28";
			model.getMonth(2).getDay(29).displayInit(dayElem);
		}
	}
	public function removeBissexDay () {
		var el = Browser.document.getElementById("m2d28");
		if (el != null) el.parentNode.removeChild(el);
	}
	public function doLayoutResponsive() {
		var w = rootHtmlElement.clientWidth ;
		var middleWidth = model.tree.layout.middleWidth;
		var narrowWidth = model.tree.layout.narrowWidth;
		for (month in model.monthChildren) {
			if (w < narrowWidth ) {
				month.skinElem.setAttribute("class", "monthContainer" + " " + "maxWidthNarrowScreen");	
			} else if (w < middleWidth ) {
				month.skinElem.setAttribute("class", "monthContainer" + " " + "maxWidthMiddleScreen");
			} else {
				month.skinElem.setAttribute("class", "monthContainer" + " " + "maxWidthLargeScreen");
			}
			if (!month.wasOneTimeUsed) {
				if (model.currMonthIndex == month.index) {
					month.open();
					if (!model.wasOneTimeUsed) {
						//if ((isSafari && isPhone) || (isIphoneIpad && isPhone) ) model.wasOneTimeUsed = true; // native browser on android smartphones && iPhone
						if (isSafari && isPhone && (!isIphoneIpad) ) model.wasOneTimeUsed = true; // native browser on android smartphones 
						if ((w < middleWidth) || isMobile) {							
							var minIndexForFirstScrollToTop = intVal(model.tree.month.minIndexForFirstScrollToTop, 2) ;
							if(month.index>minIndexForFirstScrollToTop) {
								model.monthChildren[month.index-minIndexForFirstScrollToTop+1].scrollToTop();
							}
						} else {
							Browser.window.scrollTo(0,0);
						}
					}
				} else if ( model.simpleCalendarUsing && (w >= middleWidth)  ) {
					month.open();
				}
				else month.close();
			}
		}
	}
	public function changeConnectLabel (v:String) {
		connection.style.backgroundColor = (v == lang.button.connect.label)? model.tree.button.logon.backgroundColor: model.tree.button.logoff.backgroundColor;
		
	}
	public function changeSafeModeLabel () {
		var str = ""; var str2 = ""; var str3 = ""; var el;
		if (model.isSafeMode)	{
			str = lang.button.safeModeOff.label; 
			str2 = lang.changeYearSkin.safeSubtitleOff.label; 
			str3 = "#afa";
		} else {
			str = lang.button.safeModeOn.label; 
			str2 = lang.changeYearSkin.safeSubtitleOn.label;
			str3 = "#faa";
		 }
		el = elem("changeYearView").elemBy("safeModeCtnr").elemBy("subTitle");
		str2 = "<b>" + str2 + "</b>";
		safeMode.innerHTML = str;	
		el.innerHTML = str2;
		el.style.backgroundColor = str3;		
	}
	public function showConnectView(?id:String, ?pwd:String) {		
		var el = elem("loginView");
		el.style.visibility = "visible";	
		if (isPhone && isFirefox) makePopUpRelativeForFireFoxPhone(el);
		if (id != null) signInNameInput.value = id;
		if (pwd != null) signInPwdInput.value = pwd;
		signUpNameInput.value = "";
		signUpPwdInput.value = "";
		signUpConfirmInput.value = "";
	}
	public function hideConnectView() {
		elem("loginView").style.visibility = "hidden";
	}
	/**
	 * show settings box
	 */
	public function showChangeYearView() {
		changeSafeModeLabel ();
		var el = elem("changeYearView");
		el.style.visibility = "visible";		
		if (isPhone && isFirefox) makePopUpRelativeForFireFoxPhone(el);
		
	}
	function makePopUpRelativeForFireFoxPhone(el:Element) {
		Browser.window.scrollTo(0,0);
		el.style.position = "absolute";
		el.style.top = "0px";		
		el.style.height= Std.string(Browser.document.documentElement.scrollHeight)+"px";
	}
	/**
	 * hide settings box
	 */	
    public function hideChangeYearView() {
		elem("changeYearView").style.visibility = "hidden";
	}	
	/**
	 * display scheduleName and current year.
	 */
	public function displayUserInfo() {
		current.innerHTML = lang.currentUserInfo1.label+'<span class="blue" >'+Std.string(model.currYear)+'</span>'+lang.currentUserInfo2.label + model.currUserId;
	}
	/**
	 * display calendar current year.
	 */
	public function displayInfoWhenNoUser () {		
		current.innerHTML = lang.noCurrent.label+strVal(model.currYear,"");	
	}
	
	
    /**
    *@private
    */
	function get_lang() :Object { return language.tree; }
    //
	function get_safeMode() :Element {return elem("safeMode"); }
    function get_connection() :Element {return elem("connection"); }
    function get_changeYear() :Element {return elem("changeYear"); }
    function get_refresh() :Element {return elem("refresh"); }
    function get_current() :Element {return elem("current"); }
    function get_window() :DOMWindow {return Browser.window; }
    function get_signInValid() :Element {return elem("signInValid"); }
    function get_signInCancel() :Element {return elem("signInCancel"); }
    function get_signUpCancel() :Element {return elem("signUpCancel"); }
    function get_signUpValid() :Element {return elem("signUpValid"); }
    function get_changeYearValid() :Element {return elem("changeYearValid"); }
    function get_changeYearCancel() :Element {return elem("changeYearCancel"); }
    function get_signInDiv() : Element {return elem("loginView").elemBy("signInDiv") ; }
    function get_signUpDiv() : Element {return elem("loginView").elemBy("signUpDiv") ; }
    function get_changeYearDiv() : Element {return elem("changeYearView").elemBy("changeYearDiv") ; }
    function get_signUpNameInput() :InputElement {return signUpDiv.childByName("name") ; }
    function get_signInNameInput() :InputElement {return signInDiv.childByName("name"); }
    function get_signInPwdInput() :InputElement {return signInDiv.childByName("pwd") ; }
    function get_signUpPwdInput() :InputElement {return signUpDiv.childByName("pwd") ; }
    function get_signUpConfirmInput() :InputElement {return signUpDiv.childByName("confirm") ; }
    function get_changeYearInput() :InputElement { return changeYearDiv.childByName("year") ; }
	function get_changeYearCurrent() :Element {return elem("changeYearView").elemBy("currYear") ; }
    function get_isChangeYearViewOpen() :Bool { return strVal(elem("changeYearView").style.visibility,"hidden") != "hidden" ; }
    function get_isLoginViewOpen() :Bool { return strVal(elem("loginView").style.visibility,"hidden") != "hidden" ; }
    //function get_xxx() :Element {return elem("xxx"); }
    
}
