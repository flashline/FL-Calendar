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
import js.html.InputElement;
import js.html.TextAreaElement;
import net.flash_line._api.motion.BTween;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
import net.flash_line.util.Object;
import net.flash_line.util.StepIterator;
/**
* Model & View for a day
*/
class Day extends Common {
	var lang:Object;
	var model:Model;
	var monthParent:Month;
	//
	//
	/**
	 * original y position in window. used to restore Ypos after close.
	 */
	public var oy:Int;
	/**
	 * index pos in parent model array -first day of month has index==0
	 */
	public var index(default, null):Int;	
	//
	public var clearButton(get,null):Element;	
	public var cancelButton(get,null):Element;	
	public var validButton(get,null):Element;	
	/**
	 * text valided for this day
	 */
	public var textContent(get,set):String;var _textContent:String;
	/**
	 * Element main container
	 */
	public var skinElem(default, null):Element;	
	/**
	 * Element outer monthParent container
	 */
	public var monthElem(default, null):Element;	
	/**
	 * click day Element
	 */
	public var reactiveElem(default, null):Element;		
	/**
	 * @return 1 to 31
	 */
	public var number(get, null):Int;
	/**
	 * @return month parent number (0 to 12)
	 */	
	public var month(get,null):Int; 
	/**
	 * @return 0 to 9999 year of this Day
	 */
	public var year(get, null):Int; 
	/**
	* @return Date(year,month,number) of this Day 
	**/
	public var date(get, null):Date; var _date:Date;
	/**
	 * @return one of "SMTWTFS"
	 */
	public var abbrev(get, null):String; 
	/**
	 * @return one of "Sunday","Monday",etc in current language
	 */
	public var name(get, null):String; 
	/**
	 * @return dayName monthName dayNumber or dayName dayNumber monthName depending language.
	 */
	public var fullName(get, null):String; 
	/**
	 * @return day's yyyymmdd
	 */
	public var key(get, null):String; 	
	/**
	 * @return true if opened ; false if closed (default is true)
	 */
	public var isOpen(get, null):Bool; var _isOpen:Bool;
	/**
	 * @return true if day's note has been modified since day was opened.
	 */
	public var hasBeenModified(get, null):Bool; 
	//
	/**
	 * constructor
	 * @param	idx index pos in Month parent array -first day of month has index==0
	 * @param	m	Model
	 * @param	mp	Month parent
	 */
	public function new (idx:Int,m:Model,mp:Month) {
		index = idx;
		monthParent = mp;
		model = m;
		lang = model.lang;
		_isOpen = false;
    }	
	public function displayInit (dayContainer:Element) {
		skinElem = dayContainer;
		reactiveElem = skinElem.elemBy("dayTop");
		var str=Std.string(100 + number).substr(1);
		skinElem.elemBy("abbrev").innerHTML = str + " " + abbrev;	
		skinElem.elemBy("clear").innerHTML = lang.button.clear.label ;
		skinElem.elemBy("cancel").innerHTML = lang.button.cancel.label ;
		skinElem.elemBy("valid").innerHTML = lang.button.valid.label ;	
		// sunday => bg color
		 displayIfSunday ();
    }
	/**
	 * used when day's date changes
	 */
	public function displayUpdate () {
		var str=Std.string(100 + number).substr(1);
		skinElem.elemBy("abbrev").innerHTML = str + " " + abbrev;	
		displayIfSunday ();
    }
	/**
	 * used when year is changing
	 */
	public function clear () {
		_date = null;		
	}	
	public function scrollToTop () {		
		oy = Std.int(skinElem.positionInWindow().y);
		if (oy > 0) {
			/*
			if (isMobile || !isWebKit) skinElem.scrollIntoView(true); 
			else new BTween (Browser.window.scrollY, oy + Browser.window.scrollY, 1, onLoopScrollToTop ); 
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
			for (d in monthParent.dayChildren) {
				d.oy = null;
			}
			oy = sy;
		}		
    }	
	public function restoreScroll () {
		/*if (!isMobile && isWebKit) { 
			if (oy != null) new BTween (Browser.window.scrollY ,-oy+Browser.window.scrollY,.5, onLoopScrollToTop );// Browser.window.scrollTo(0, -oy + Browser.window.scrollY); //+Browser.window.scrollY
		}*/
		
		oy = null;
    }
	public function  show () {
		skinElem.style.display = "block";	
    }
	public function hide () {
		skinElem.style.display = "none";	
    }
	public function open () {
		showFullNameOnTop();
		skinElem.elemBy("textContainer").style.display = "block";	
		_isOpen = true;
    }
	public function close () {
		restoreTextOnTop();
		skinElem.elemBy("textContainer").style.display = "none";	
		_isOpen = false;
    }
	/**
	 * clear screen
	 */
	public function clearText () {
		 cast(skinElem.elemByTag("textarea"),TextAreaElement).value="";		
    }
	/**
	 * screenbuffer to screen
	 */	
	public function displayText () {
		 cast(skinElem.elemByTag("textarea"), TextAreaElement).value = textContent;		
    }
	/**
	 * screen to screenbuffer
	 */	
	public function storeText () {
		 textContent=cast(skinElem.elemByTag("textarea"),TextAreaElement).value;		
    }
	/**
	 * when day is open or user is logoff : fullname day is displayed
	 */
	public function showFullNameOnTop() {
		skinElem.elemBy("textBegin").innerHTML = fullName;
		setOutColor();
	}
	/**
	 * when day is close and user is logged in : begin of text is displayed
	 */
	public function restoreTextOnTop() {		
		skinElem.elemBy("textBegin").innerHTML = cast(skinElem.elemByTag("textarea"), TextAreaElement).value ;
		setOutColor();		
	}
	/**
	 * @param	state "out" or "over"
	 */
	public function setColor (state:String) { 
		var c ; var p:Object = model.tree;
		if (state == "over") {
			c = p.month.list.item[monthParent.index].overColor; 
			if (c == null) c = p.month.overColor;
			reactiveElem.elemBy("abbrev").setColor(c);
			reactiveElem.elemBy("textBegin").setColor(c);	
		}
		else {
			setOutColor ();			
		}
	}
	function setOutColor () { 
		var el = reactiveElem.elemBy("textBegin");
		var v = cast(skinElem.elemByTag("textarea"), TextAreaElement).value;
		var c = "#000000";
		if ( new EReg( model.tree.month.emphasisRegExp, "i").match(v)  ) c = model.tree.month.emphasisColor ;
		reactiveElem.elemBy("abbrev").setColor(c);
		el.setColor(c);
		
		
		
	}
	/**
	 * method to debug
	 */	
    public function toString () {
		var str = "\n";
		if (model.languageIs("en")) str += "index=" + index + " :" + month + "/" + number + "/" + year + ". " + abbrev + "/" + name + "\n";
		else str += "index=" + index + " :" + number + "/" + month + "/" + year + ". " + abbrev + "/" + name + "\n";		
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
	function displayIfSunday () {
		if (date.getDay() == 0) {				
			if (isSafari) {		
				var c = monthParent.color.substr(1); var str = "";
				for (i in new StepIterator(0, 6, 2)) {					
					var h = addHex(c.substr(i, 2), "44");
					str+= (h.length > 2)? "ff" : h ;					
				}
				skinElem.style.backgroundColor =  "#"+str; 
			}
			else skinElem.style.background = "linear-gradient(to right, " + monthParent.color + ", white)";
			skinElem.style.paddingTop = "2px";
			skinElem.style.paddingBottom = "2px";
		} else {
			skinElem.style.background = model.tree.month.backgroundColor;
			skinElem.style.backgroundColor = model.tree.month.backgroundColor;
			skinElem.style.paddingTop = "0px";
			skinElem.style.paddingBottom = "0px";	
		}		
	}
	function get_name() :String {
		var arr = lang.day.list.item;
		var v = date.getDay();		
		return arr[v].label;
	}
	function get_fullName() :String {		
		var v = name + " " + number + " " + monthParent.abbrev;		
		if (model.languageIs("en") )  v = name + " "  + monthParent.abbrev + " " + number ;			
		return v;
	}
	function get_abbrev() :String {
		var v = date.getDay();		
		var str = lang.day.abbrev.substr(v, 1);
		if (model.languageIs("en") && v == 0 ) str += "u";
		return str;
	}
	function get_key() :String {	
		var str = Std.string(100 + number).substr(1, 3);
		return monthParent.key+str;
	}
	function get_date() :Date {
		if (_date == null) { 
			_date = new Date(year, month-1, number, 0, 0, 0);
		}
		return _date;
	}
	function get_year() :Int {
		var v:Int = null;
		if (monthParent != null) v = monthParent.year;
		else { 
			trace("f::" + lang.error.fatal.monthMissing.label);
		}
		return v;
	}
	function get_month() :Int {		
		var v:Int = null;
		if (monthParent != null) v = monthParent.number;
		else { 
			trace("f::" + lang.error.fatal.monthMissing.label);
		}
		return v;
	}	
	function get_number() :Int {		
		return index+1;
	}
    function get_isOpen () : Bool {
		return _isOpen;
		//return (skinElem.style.display == "block" || skinElem.style.display == "");
	}
	function get_hasBeenModified () : Bool {		
		return (textContent!=cast(skinElem.elemByTag("textarea"),TextAreaElement).value);
	}
	function get_textContent () : String {
		return strVal(_textContent, "");
	}
	function set_textContent (v: String) : String {
		_textContent = strVal(v, "");
		return _textContent;
	}
	function get_clearButton()  :Element {return skinElem.elemBy("clear"); }
    function get_cancelButton()  :Element {return skinElem.elemBy("cancel"); }
    function get_validButton()  :Element {return skinElem.elemBy("valid"); }
   
}
