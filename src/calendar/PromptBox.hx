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
import js.html.InputElement;
import js.html.TextAreaElement;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* 
*/
class PromptBox extends Common {
	var ctnrElem:Element;
	var textElem:TextAreaElement;
	var validElem :ButtonElement;
	var promptElem :InputElement;
	var callBack :String->Void;
	/**
	* constructor
	*/
	public function new (el:Element,txElem:TextAreaElement,pElem:InputElement,bElem:ButtonElement) {
		ctnrElem = el;
		textElem = txElem;
		validElem = bElem;
		promptElem = pElem;	
		txElem.setReadOnly();
		enable();
    }
	public function enable () {	
		validElem.addLst("click", onValid, false);	
		promptElem.value = "";
	}
    public function disable () {
		validElem.removeLst("click", onValid, false);		
		callBack = null;
		close();
	}
	public function open (v:String ,cb:Dynamic) {
		ctnrElem.style.visibility = "visible";
		textElem.innerHTML = v;	
		validElem.joinEnterKeyToClick();
		callBack = cb;
	}
    public function close () {
		ctnrElem.style.visibility = "hidden";
		textElem.innerHTML = "";
	}
    function onValid (e:Event) {
		e.preventDefault();
		validElem.clearEnterKeyToClick();			
		close();
		callBack(promptElem.value);
		return false;
	}
       
	
}
