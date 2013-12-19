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
import js.html.Event;
import js.html.ImageElement;
import js.Lib;
import net.flash_line.event.timing.Clock;
import net.flash_line.util.ApiCommon;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* Display an animation until asynchronous task end.
*/
class WaitView extends ApiCommon {
	var ctnrElem:Element;
	var movieElem:Element;
	var textElem:Element;
	var animElem :Element;
	var clock :Clock;
	/**
	 * facultative message text displayed
	 */
	public var text(get,set):String;
	/**
	* constructor
	*/
	/**
	 * 
	 * @param	el 	Container -recover 100% of browser
	 * @param	te 	Message container
	 * @param	ae 	Animation outer container
	 * @param	mo 	Image/svg container
	 * @param	?ax Rotation axis -css way
	 */
	public function new (el:Element,te:Element,ae:Element,mo:Element,?ax:String=null) {
		ctnrElem = el;
		textElem = te;
		animElem = ae;
		movieElem = mo ;
		if (ax!=null) movieElem.setRotationAxis (ax);
		clock = new Clock(loop,0.08);
		clock.pause();		
    }
	/**
	 * display this
	 * @param	?v		Message text
	 * @param	?img	image url if must change
	 */
	public function start (?v:String =null,?img:String) {		
		if (img != null) changeImage (img);
		clock.restart();
		if (v != null) text = v;
		ctnrElem.style.visibility = "visible";
		animElem.style.visibility="visible";
	}
	/**
	 * display this without rotation
	 * @param	?v		Message text
	 * @param	?img	image url if must change
	 */
    public function show (?v:String =null,?img:String) {		
		if (img != null) changeImage (img);
		movieElem.setRotation(0);
		clock.pause();
		if (v != null) text = v;
		ctnrElem.style.visibility = "visible";
		animElem.style.visibility="visible";
	}
	public function stop () {
		clock.pause();
		ctnrElem.style.visibility = "hidden";
		animElem.style.visibility="hidden";
	}
    public function remove () {
		stop();
		clock.remove();
	}
    public function changeImage (v:String) {
		cast(movieElem.elemBy("waitImg"), ImageElement).src = v;
	}
    function loop (c:Clock) {
		movieElem.rotate(7.5);
	}
    function get_text ():String {		
		return textElem.innerHTML ;
	}
	function set_text (?v:String = "") :String {		
		textElem.innerHTML = v;
		return v;
	}
	
}
