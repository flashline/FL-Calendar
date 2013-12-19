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
import js.html.ImageElement;
import js.html.TextAreaElement;
import net.flash_line._api.motion.BTween;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import net.flash_line.util.Object;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* * Model & View for a month
*/
class Month extends Common {
	var  model:Model;
	var  lang:Object;
	/**
	 * original y position in window. used to restore Ypos after close.
	 */
	public var oy:Int;
	//
	public var clearButton(get,null):Element;	
	public var cancelButton(get,null):Element;	
	public var validButton(get,null):Element;	
	//
	/**
	 * text valided for this month
	 */
	public var textContent(get,set):String;var _textContent:String;
	//
	/**
	 * Days of this month
	 */
	public var dayChildren(default, null):Array<Day>;
	/**
	 * index pos in Model array. from 0 to 13: 0==dec year-1 ; 13=jan year+1
	 */
	public var index(default, null):Int;	
	/**
	 * container Element in DOM
	 */
	public var skinElem(default, null):Element;	
	/**
	 * top container (css class="month")
	 */
	public var monthElem(default, null):Element;	
	/**
	 * click month Element
	 */
	public var reactiveElem(default, null):Element;		
	/**
	 * text open click button
	 */
	public var openTextElem(default, null):Element;		
	//public var openTextCtnrElem(default, null):Element;		
	/**
	 * @return 1 to 12
	 */	
	public var number(get,null):Int;	
	/**
	 * @return year of this Month 0 to 9999
	 */
	public var year(get, null):Int;
	/**
	 * @return one of "January","February",etc -in current language
	 */
	public var name(get, null):String; 
	/**
	 * @return month's yyyymm
	 */
	public var key(get, null):String; 
	/**
	 * @return month's abbreviation
	 */
	public var abbrev(get, null):String; 
	/**
	 * @return max number of days in this.
	 */
	public var maxDay(get, null):Int; 
	/**
	 * @return month's sunday color
	 */
	public var color(get, null):String; 
	/**
	 * @return true if month's global note has been modified since it was opened.
	 */
	public var hasBeenModified(get, null):Bool; 
	/**
	 * @return true if opened ; false if closed (default is true)
	 */
	public var isOpen(get, null):Bool; var _isOpen:Bool;
	/**
	 * @return true if textArea is opened ; false if closed (default is false)
	 */
	public var isTextAreaOpen(get, null):Bool; var _isTextAreaOpen:Bool;
	/**
	 * @return true if user at least one time open or close 
	 */
	public var wasOneTimeUsed(get, set):Bool; var _wasOneTimeUsed:Bool;
	//
	//
	/**
	* constructor
	* 
	* @param	idx index pos in Model array -from 0 to 13
	* @param	m	Model
	*/
	public function new (idx:Int,m:Model) {
		index = idx;
		model = m;		
		lang = model.lang;
		dayChildren = [];
		_isTextAreaOpen = false;
		_isOpen = true;
		_wasOneTimeUsed = false ;
    }
	/**
	 * @param	monthContainer
	 */
	public function displayInit (monthContainer:Element) {
		skinElem = monthContainer;
		monthElem = skinElem.elemBy("month") ;
		reactiveElem = monthElem.elemBy("name");		
		reactiveElem.innerHTML = name;		
		openTextElem = monthElem.elemBy("open");		
		clearButton.innerHTML = lang.button.clear.label ;
		cancelButton.innerHTML = lang.button.cancel.label ;
		validButton.innerHTML = lang.button.valid.label ;		
    }
	/**
	 * Display month name with correct year -used for dec and jan
	 */	 
	public function displayUpdate () {				
		reactiveElem.innerHTML = name;	
    }		
    public function createOneDay (idx:Int):Day {
		var day:Day=new Day(idx, model, this);
		dayChildren.push(day);			
		return day;
    }
	public function createOneDaySkin (day:Day) :Element {
		var el:Element = skinElem.elemBy("day"); 
		var dayElem:Element = el.clone(true) ;
		skinElem.appendChild(dayElem);
		dayElem.id = skinElem.id + "d"+day.index;
		day.displayInit(dayElem);
		if (day.index==maxDay-1) el.parentNode.removeChild(el);	
		return dayElem;
	}
    public function getDay (n:Int) {
		if (n < 1 || n > dayChildren.length) return null;
		else return dayChildren[n - 1];		
    }
   
	public function scrollToTop () {
		oy = Std.int(skinElem.positionInWindow().y);
		if (oy > 0) {
			/* DONT REMOVE COMMENTS
			 if (isMobile || !isWebKit) {				
				if (isSafari ) {
					if (isIphoneIpad) new BTween (Browser.window.pageYOffset, oy , 1, onLoopScrollToTop ); 
					// only for android native browser
					else new BTween (Browser.window.pageYOffset, oy + Browser.window.pageYOffset, 1, onLoopScrollToTop ); 
				} 
				else if (isWindowsPhone) skinElem.scrollIntoView(true); 				
				// ffox or no safari+no win mobile
				else new BTween (Browser.window.pageYOffset, oy , 1, onLoopScrollToTop ) ; //
			}
			else {
				//pc/mac chrome, safari 
				new BTween (Browser.window.pageYOffset, oy + Browser.window.pageYOffset, 1, onLoopScrollToTop ); 				
			}	
			*/
			//
			if 		(isIphoneIpad)  				new BTween (Browser.window.pageYOffset, oy , 1, onLoopScrollToTop ); 
			else if (isFirefox) 					new BTween (Browser.window.pageYOffset, oy , 1, onLoopScrollToTop ); 
			else if (isWindowsPhone) 				skinElem.scrollIntoView(true); 
			else 									new BTween (Browser.window.pageYOffset, oy + Browser.window.pageYOffset, 1, onLoopScrollToTop ); 
			//
		}		
		else oy = null;		
		if (oy != null) {
			var sy = oy;
			for (m in model.monthChildren) {
				m.oy = null;
			}
			oy = sy;
		}
    }	
	public function restoreScroll () {
		if (!isMobile && isWebKit) {
			if (oy != null) new BTween (Browser.window.pageYOffset ,-oy+Browser.window.pageYOffset,.5, onLoopScrollToTop );// Browser.window.scrollTo(0, -oy+Browser.window.scrollY); 
		}
		oy = null;
    }
	public function open () {
		for (day in dayChildren) {
			day.show();
		}	
		_isOpen = true;
    }
	public function close () {
		for (day in dayChildren) {
			day.hide();
		}
		_isOpen = false;
    }
	public function openTextArea () {
		monthElem.elemBy("textContainer").style.display = "block";
		_isTextAreaOpen = true;
    }
	public function closeTextArea () {
		monthElem.elemBy("textContainer").style.display = "none";
		_isTextAreaOpen = false;
    }
	/**
	 * clear screen
	 */
	public function clearText () {
		setMonthTextPicto("");
		cast(monthElem.elemByTag("textarea"), TextAreaElement).value = "";
    }	
	/**
	 * screenbuffer to screen
	 */
	public function displayText() {
		setMonthTextPicto();
		cast(monthElem.elemByTag("textarea"), TextAreaElement).value =  textContent;
    }
	/**
	 * screen to screenbuffer
	 */
	public function storeText() {
		textContent=cast(monthElem.elemByTag("textarea"),TextAreaElement).value;	
    }
	public function toString () {
		var str = "\n";
		str += "index=" + index + " : [" + number + "/" + year + "]. " + "name=" + name + "\n";
		str += "\n";
		for (i in dayChildren) {
			str += i.toString();
		}
		return str;
    }	
    /**
    *@private
    */
	function onLoopScrollToTop (e:StandardEvent) {
		if (e.type == "end") {
			e.target.clear () ;
		} else {
			Browser.window.scrollTo(0,e.value);
		}
	}
	//get/set
	function get_name() :String {
		var arr = model.lang.month.list.item;
		var v = index;		
		var ret = arr[v].label;
		if (index == 0 || index == 13) ret += " " + year;
		return ret;
	}
	function get_abbrev() :String {
		var arr = model.lang.month.abbrev.item;
		var v = index;		
		var ret = arr[v].label;
		return ret;
	}
	function get_key() :String {		
		return Std.string(year * 100 + number);
	}	
	function get_year() :Int {
		var v:Int =null;
		if (index == 0) v = model.currYear -1; // Std.parseInt(model.currYear)-1;
		else if (index == 13) v = model.currYear + 1;
		else v = model.currYear;
		return v;
	}
	function get_maxDay () : Int {
		var v = Std.parseInt(model.tree.month.list.item[index].maxDay);
		if (number == 2 && isBissextile(year)) v++;
		return v;
	}
	
	function get_number() :Int {
		var v:Int =null;
		if (index == 0) v = 12;
		else if (index == 13) v = 1;
		else v = index;
		return v;
	}    
	function get_color() :String {
		return model.tree.month.list.item[index].color;
	}
    function get_isTextAreaOpen () : Bool {
		return _isTextAreaOpen;
	}
    function get_isOpen () : Bool {
		return _isOpen;
	}
    function get_wasOneTimeUsed () : Bool {
		return _wasOneTimeUsed;
	}
    function set_wasOneTimeUsed (v:Bool) : Bool {
		_wasOneTimeUsed = v;
		return _wasOneTimeUsed;
	}
	function get_hasBeenModified () : Bool {		
		return (textContent != cast(monthElem.elemByTag("textarea"), TextAreaElement).value);
	}
	
	//
	function get_textContent () : String {
		return strVal(_textContent, "");
	}
	function set_textContent (v: String) : String {
		_textContent = strVal(v, "");
		setMonthTextPicto();
		return _textContent;
	}
	function setMonthTextPicto (?v: String) {
		if (v==null) v=strVal(_textContent, "");
		var img:ImageElement = cast(openTextElem, ImageElement);
		if (v == "") 	img.src = model.tree.monthTextPostIt.empty.src ;
		else 			img.src = model.tree.monthTextPostIt.full.src ;
	}
	// get interactive textArea buttons
    function get_clearButton()  :Element {return monthElem.elemBy("clear"); }
    function get_cancelButton()  :Element {return monthElem.elemBy("cancel"); }
    function get_validButton()  :Element {return monthElem.elemBy("valid"); }
}
