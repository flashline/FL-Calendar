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
import js.html.Event;
import js.html.ImageElement;
import js.Lib;
import net.flash_line.event.timing.Clock;
import net.flash_line.util.ApiCommon;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* 
*/
class WaitView extends ApiCommon {
	var ctnrElem:Element;
	var movieElem:Element;
	var textElem:Element;
	var animElem :Element;
	var clock :Clock;
	public var text(get,set):String;
	/**
	* constructor
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
	public function start (?v:String =null,?img:String) {		
		if (img != null) changeImage (img);
		clock.restart();
		if (v != null) text = v;
		ctnrElem.style.visibility = "visible";
		animElem.style.visibility="visible";
	}
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
		//trace (cast(Browser.document.getElementById("toto"), ImageElement).src);
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
