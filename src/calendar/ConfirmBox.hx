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
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* 
*/
class ConfirmBox extends Common {
	var ctnrElem:Element;
	var textElem:TextAreaElement;
	public var validElem(default,null) :ButtonElement;
	public var cancelElem(default,null) :ButtonElement;
	var callBack :Dynamic;
	/**
	* constructor
	*/
	public function new (el:Element,txElem:TextAreaElement,bvElem:ButtonElement,bcElem:ButtonElement) {
		ctnrElem = el;
		textElem = txElem;
		validElem = bvElem;
		cancelElem = bcElem;	
		txElem.setReadOnly();
		enable();
    }
	public function enable () {	
		validElem.addLst("click", onValid, false);		
		cancelElem.addLst("click", onCancel, false);		
	}
    public function disable () {
		validElem.removeLst("click", onValid, false);
		cancelElem.removeLst("click", onCancel, false);		
		callBack = null;
		close();
	}
	public function open (v:String ,cb:Dynamic) {
		ctnrElem.style.visibility = "visible";
		textElem.innerHTML = v;
		callBack = cb;
	}
    public function close () {
		ctnrElem.style.visibility = "hidden";
		textElem.innerHTML = "";
	}
    function onValid (e:Event) {
		e.preventDefault();
		close();
		callBack(true,this);
		return false;
	}
     function onCancel (e:Event) {
		e.preventDefault();	
		close();
		callBack(false,this);
		return false;
	}
    
	
}
