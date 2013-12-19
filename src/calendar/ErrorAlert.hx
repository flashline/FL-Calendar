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
import js.html.ButtonElement;
import js.html.Event;
import js.html.TextAreaElement;
import net.flash_line.util.ApiCommon;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* used instead of js alert()
* @see net.flash_line.util.ApiCommon.alert()
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
	 * @param	el		Alert-box container 
	 * @param	txElem	Message container
	 * @param	bElem	OK button
	 * @param	stEl	title Element
	 */
	public function new (el:Element,txElem:TextAreaElement,bElem:ButtonElement,stEl:Element) {
		ctnrElem = el;
		subTitleElem = stEl;
		textElem = txElem;
		validElem = bElem;
		txElem.setReadOnly();
		enable();
    }
	/**
	 * call this ErrorAlert when alert().
	 */
	public function enable () {		
		validElem.addLst("click", onValid, false);		
		alertFunction = display;
		ApiCommon.alertFunction = display;
	}
	/**
	 * restore js standard alert-box when alert()
	 */
    public function disable () {
		validElem.removeLst("click", onValid, false);
		alertFunction = null;
		ApiCommon.alertFunction= null;
		ctnrElem.style.visibility = "hidden";
	}
	/**
    *@private
    */
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
