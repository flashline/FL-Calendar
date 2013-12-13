/**
 * Copyright (c) jm Delettre.
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
import js.html.Document;
import js.html.DOMWindow;
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
	public var lang(get,null):Object;	
	public var connection(get,null):Element;	
	public var safeMode(get,null):Element;	
	public var changeYear(get,null):Element;	
	public var current(get,null):Element;	
	public var window(get, null):DOMWindow;
	
	public var signInCancel(get,null):Element;	
	public var signInValid(get,null):Element;	
	public var signUpValid(get,null):Element;	
	public var signUpCancel(get,null):Element;	
	public var changeYearCancel(get,null):Element;	
	public var changeYearValid(get,null):Element;	
	public var signInDiv(get,null):Element;	
	public var signUpDiv(get,null):Element;	
	public var changeYearDiv(get,null):Element;	
	public var signUpNameInput(get,null):InputElement;	
	public var signInNameInput(get,null):InputElement;	
	public var signInPwdInput(get,null):InputElement;	
	public var signUpPwdInput(get,null):InputElement;	
	public var signUpConfirmInput(get,null):InputElement;	
	public var changeYearInput(get, null):InputElement;	
	public var changeYearCurrent(get,null):Element;	
	public var isChangeYearViewOpen(get,null):Bool;	
	//public var xxx(get,null):Element;	
	
	
		
	/**
	* constructor
	*/
	public function new (m:Model,lg:Language) {
		model = m;
		doc = js.Browser.document;
		language = lg;
		rootHtmlElement = elem("calendar");
    }
	
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
		connection.innerHTML = lang.button.connect.label;
		changeYear.innerHTML = lang.button.changeYear.label;
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
	/*
	public function createMonthAndDay () {
		var el:Element = elemBy("monthContainerProto",elem("calendar"));
		for (month in model.monthChildren) {
			var monthContainer:Element = el.clone(true) ;
			elem("monthOuter").appendChild(monthContainer);
			//monthContainer.className = "monthContainer";
			monthContainer.setAttribute("class", "monthContainer");
			//monthContainer.style.display = "inline-block";			
			monthContainer.id = "m" + month.index;
			month.displayInit(monthContainer);
		}			
		doLayoutResponsive();
	}
	*/
	public function removeMonthAndDay () {
		elem("monthOuter").removeChildren();
	}
	public function createOneMonth (month:Month) :Element{
		if (monthContainerProto==null) monthContainerProto = elemBy("monthContainerProto",elem("calendar"));
		var monthContainer:Element = monthContainerProto.clone(true) ;
		elem("monthOuter").appendChild(monthContainer);
		monthContainer.setAttribute("class", "monthContainer");
		monthContainer.id = "m" + month.index;
		month.initSkin (monthContainer);
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
		connection.innerHTML = v;
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
	public function showConnectView(?id:String,?pwd:String) {
		elem("loginView").style.visibility = "visible";
		if (id != null) signInNameInput.value = id;
		if (pwd != null) signInPwdInput.value = pwd;
		signUpNameInput.value = "";
		signUpPwdInput.value = "";
		signUpConfirmInput.value = "";
	}
	public function hideConnectView() {
		elem("loginView").style.visibility = "hidden";
	}
	public function showChangeYearView() {
		changeSafeModeLabel ();
		elem("changeYearView").style.visibility = "visible";
	}
    public function hideChangeYearView() {
		elem("changeYearView").style.visibility = "hidden";
	}
	public function displayFullNameInDay () {
		var month:Month;
		for (month in model.monthChildren) {			
			for (day in month.dayChildren) {
				day.showFullNameOnTop();	
			}
		}
	}
	public function restoreDisplayInDay() {
		var month:Month;
		for (month in model.monthChildren) {			
			for (day in month.dayChildren) {
				day.restoreTextOnTop();	
			}
		}
	}
	public function displayUserInfo() {
		current.innerHTML = lang.currentUserInfo1.label+'<span class="blue" >'+Std.string(model.currYear)+'</span>'+lang.currentUserInfo2.label + model.currUserId;
	}
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
    //function get_xxx() :Element {return elem("xxx"); }
    //function get_xxx() :Element {return elem("xxx"); }
    //function get_xxx() :Element {return elem("xxx"); }
    //function get_xxx() :Element {return elem("xxx"); }
    
}
