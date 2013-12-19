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
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
*  valid/cancel box 
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
	/**
	 * @param	el		Confirm-box container 
	 * @param	txElem	Message container
	 * @param	bvElem	valid button
	 * @param	bcElem	Cancel button
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
	/**
	 * @param	v	Message text
	 * @param	cb	Callback function when user click a button. The function receive true if user click valid or false if user click cancel.
	 */
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
