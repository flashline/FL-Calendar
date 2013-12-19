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
import js.html.Event;
import js.html.InputElement;
import js.html.TextAreaElement;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
*  used as js prompt-box 
*/
class PromptBox extends Common {
	var ctnrElem:Element;
	var textElem:TextAreaElement;
	var validElem :ButtonElement;
	var promptElem :InputElement;
	var callBack :String->Void;
	/**
	 * 
	 * @param	el		Prompt-box container 
	 * @param	txElem	Message container
	 * @param	pElem	Input field
	 * @param	bElem	Valid button
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
	/**
	 * @param	v	Message
	 * @param	cb	Callback function when user click enter
	 */
	public function open (v:String ,cb:Dynamic) {
		ctnrElem.style.visibility = "visible";
		if (isPhone && isFirefox) makePopUpRelativeForFireFoxPhone(ctnrElem) ;
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
    function makePopUpRelativeForFireFoxPhone(el:Element) {
		Browser.window.scrollTo(0,0);
		el.style.position = "absolute";
		el.style.top = "0px";		
		el.style.height= Std.string(Browser.document.documentElement.scrollHeight)+"px";
	}  
	
}
