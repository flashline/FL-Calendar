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

import js.html.ButtonElement;
import js.html.Event;
import js.html.TextAreaElement;
import net.flash_line.util.ApiCommon;
//import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* 
*/
class ErrorAlert  {
	var ctnrElem:Element;
	var subTitleElem:Element;
	var textElem:TextAreaElement;
	var validElem :ButtonElement;
	var callBack :Void->Void;
	public var alertFunction(default,null) :Dynamic;
	/**
	* constructor
	*/
	public function new (el:Element,txElem:TextAreaElement,bElem:ButtonElement,stEl:Element) {
		ctnrElem = el;
		subTitleElem = stEl;
		textElem = txElem;
		validElem = bElem;
		txElem.setReadOnly();
		enable();
    }
	public function enable () {		
		validElem.addLst("click", onValid, false);		
		alertFunction = display;
		ApiCommon.alertFunction = display;
	}
    public function disable () {
		validElem.removeLst("click", onValid, false);
		alertFunction = null;
		ApiCommon.alertFunction= null;
		ctnrElem.style.visibility = "hidden";
	}
    function onValid (e:Event) {
		e.preventDefault();	
		validElem.clearEnterKeyToClick();	//here
		ctnrElem.style.visibility = "hidden";
		if (callBack != null) {
			callBack();
			callBack = null;
		}
	}
    function display (?v:String = "", ?cb:Dynamic, ?subTitle) {		
		if (subTitle!=null) subTitleElem.innerHTML = "<b>"+subTitle+"</b>";
		callBack = cb;
		ctnrElem.style.visibility = "visible";
		textElem.innerHTML = v;
		validElem.joinEnterKeyToClick();
	}
	
}
