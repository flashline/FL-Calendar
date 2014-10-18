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
* app root package
*/
package;
/**
* classes imports
*/

import calendar.ConfirmBox;
import calendar.ErrorAlert;
import calendar.PromptBox;
import calendar.WaitView;
import js.Browser;
import js.html.ButtonElement;
import js.html.Event;
import js.html.InputElement;
import js.html.TextAreaElement;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.ApiCommon;
import net.flash_line.util.Common;
import net.flash_line.util.Cst;
import net.flash_line.util.Object;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* root class
* Main isn't part of Calendar component.
* Prepares and calls Calendar :
* Instances a wait-view, Calendar(), a prompt-box, a confirm-box and starts Calendar().
* @see net.flash_line.util.Common
*/
class Main extends Common {
	var c:Calendar;
	var wait:WaitView;
	var lang:Object;
	static inline var version:String="1.4.2";
	/**
	 * constructor
	 */
	public function new () {		
		setupTrace();
		Browser.window.addLst("load", start);
	}
	/**
	 * @private
	 */
	function start (e:Event) {
		Browser.window.removeLst("load", start);
		wait = createWaitView();
		wait.start("...initialisation.");
		c = new Calendar(Cst.getServerUrl(),Cst.getModelSrc(),Cst.getLanguageSrc(),Cst.getBaseUrl(),isAutoStart(true),wait);
		c.loadInit.bind(onLoad);	
		//
		elem("calendar").child("release").elemBy("releaseText").innerHTML = "<b>FL-Calendar</b> " + version;
		if (isMobile) elem("calendar").child("release").elemBy("embed").delete();	
	}	
	function onLoad (e:StandardEvent) {	
		lang = e.text;
		if (isIphoneIpad) {			
			elem("calendar").child("release").elemBy("github").innerHTML = lang.Igithub.label ;			
		}
		createErrorAlert (e.text);	
		c.promptBox = createPromptBox(e.text);
		c.confirmBox = createConfirmBox(e.text);
		c.start();
	}
	function createErrorAlert (lang:Object) {	
		var el = elem("calendar").child("alertView");
		var txEl=el.elemBy("alertDiv").childByName("message");
		var btEl = el.elemBy("alertDiv").child("alertValid");
		var subTitleEl = el.elemBy("subTitle");
		//
		el.elemBy("title").innerHTML = lang.alertSkin.title.label;
		subTitleEl.innerHTML = "<b>"+lang.alertSkin.subTitle.label+"</b>";
		btEl.innerHTML = lang.button.goOn.label;
		//		
		var ea = new ErrorAlert(el, cast(txEl,TextAreaElement), cast(btEl,ButtonElement),subTitleEl);		
	}
	function createConfirmBox (lang:Object) : ConfirmBox{	
		var el = elem("calendar").child("confirmView");
		var txEl=el.elemBy("confirmDiv").childByName("message");
		var btEl = el.elemBy("confirmDiv").child("confirmValid");
		var btCaEl = el.elemBy("confirmDiv").child("confirmCancel");
		//
		el.elemBy("title").innerHTML = lang.confirmSkin.title.label;
		el.elemBy("subTitle").innerHTML = "<b>"+lang.confirmSkin.subTitle.label+"</b>";
		btEl.innerHTML = lang.button.confirmLogOut.label;
		btCaEl.innerHTML = lang.button.record.label;
		//		
		var cb = new ConfirmBox(el, cast(txEl,TextAreaElement), cast(btEl,ButtonElement), cast(btCaEl,ButtonElement));
		return cb;
	}
	function createPromptBox (lang:Object) :PromptBox{	
		var el = elem("calendar").child("promptView");
		var txEl=el.elemBy("promptDiv").childByName("message");
		var inEl=el.elemBy("inputDiv").childByName("userMail");
		var btEl = el.elemBy("promptDiv").child("promptValid");
		//
		el.elemBy("title").innerHTML = lang.promptSkin.title.label;
		el.elemBy("subTitle").innerHTML = "<b>"+lang.promptSkin.subTitle.label+"</b>";
		el.elemBy("promptInput").innerHTML = lang.promptSkin.input.label+"</b>";
		btEl.innerHTML = lang.button.valid.label;
		//		
		var pb = new PromptBox(el, cast(txEl,TextAreaElement),cast(inEl,InputElement), cast(btEl,ButtonElement));
		return pb;
	}
	function createWaitView () {	
		var el = elem("calendar").child("waitView");
		var txEl = el.elemBy("text");
		var animBox = el.elemBy("anim");
		var movie = animBox.child("waitMovie");
		return new WaitView(el, txEl, animBox,movie); //,"50% 0%" 
	}
	//
	// Boolean functions .
	function isAutoStart(?b:Bool=true):Bool { return b; }
	// app entry point
    static function main() {  
		new Main();
	}
}