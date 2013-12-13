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
//import js.Browser;
//import js.html.Document;
//import net.flash_line.util.Object;

//import js.Lib;
import js.Browser;
import js.html.InputElement;
import js.html.TextAreaElement;
import net.flash_line._api.motion.BTween;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
import net.flash_line.util.Object;
/**
* 
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
	 * index pos in parent model array
	 */
	public var index(default, null):Int;	
	//
	public var clearButton(get,null):Element;	
	public var cancelButton(get,null):Element;	
	public var validButton(get,null):Element;	
	/**
	 * text entered and valided for this day
	 */
	public var textContent(get,set):String;var _textContent:String;
	/**
	 * Element in DOM
	 */
	public var skinElem(default, null):Element;	
	/**
	 * Element in DOM
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
	 * @return 1 to 12
	 */	
	public var month(get,null):Int; 
	/**
	 * @return 0 to 9999
	 */
	public var year(get, null):Int; 
	//var _year:Int;
	/**
	* @return Date() of this (year,month,number)
	**/
	public var date(get, null):Date; var _date:Date;
	/**
	 * @return one of "SMTWTFS"
	 */
	public var abbrev(get, null):String; 
	/**
	 * @return one of "Sunday","Monday",etc
	 */
	public var name(get, null):String; 
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
	*/
	public function new (idx:Int,m:Model,mp:Month) {
		index = idx;
		monthParent = mp;
		model = m;
		lang = model.lang;
		_isOpen = false;
    }
	public function displayInit (dayContainer:Element) {
		initSkin (dayContainer);
    }
	public function initSkin (dayContainer:Element) {
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
	public function displayUpdate () {
		var str=Std.string(100 + number).substr(1);
		skinElem.elemBy("abbrev").innerHTML = str + " " + abbrev;	
		displayIfSunday ();
    }
	public function clear () {
		_date = null;		
	}	
	//
	public function scrollToTop () {
		//trace(skinElem.getBoundInfo());		
		oy = Std.int(skinElem.positionInWindow().y);
		if (oy > 0) {
			if (isMobile || !isWebKit) skinElem.scrollIntoView(true); 
			else new BTween (Browser.window.scrollY, oy+Browser.window.scrollY,1, onLoopScrollToTop ); 
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
		if (!isMobile && isWebKit) { 
			if (oy != null) new BTween (Browser.window.scrollY ,-oy+Browser.window.scrollY,.5, onLoopScrollToTop );// Browser.window.scrollTo(0, -oy + Browser.window.scrollY); //+Browser.window.scrollY
		}
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
	public function clearText () {
		 cast(skinElem.elemByTag("textarea"),TextAreaElement).value="";		
    }
	public function displayText () {
		 cast(skinElem.elemByTag("textarea"), TextAreaElement).value = textContent;		
    }
	public function storeText () {
		 textContent=cast(skinElem.elemByTag("textarea"),TextAreaElement).value;		
    }
	public function showFullNameOnTop() {
		skinElem.elemBy("textBegin").innerHTML = name + " " + number + " " + monthParent.abbrev;	
	}
	public function restoreTextOnTop() {
		skinElem.elemBy("textBegin").innerHTML = cast(skinElem.elemByTag("textarea"),TextAreaElement).value;			
	}
	public function setColor (state:String) { 
		var c = "#000000"; var p:Object = model.tree;
		if (state == "over") {
			c = p.month.list.item[monthParent.index].overColor; 
			if (c==null) c=p.month.overColor;
		}
		reactiveElem.elemBy("abbrev").setColor(c);
		reactiveElem.elemBy("textBegin").setColor(c);		
	}
	//
    public function toString () {
		var str = "\n";
		str += "index=" + index + " :" + number + "/" + month + "/" + year + ". " + abbrev + "/" + name+"\n";
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
			skinElem.style.background = "linear-gradient(to right, " + monthParent.color + ", white)";
			skinElem.style.paddingTop = "2px";
			skinElem.style.paddingBottom = "2px";			
		} else {
			skinElem.style.background = null;
			skinElem.style.paddingTop = "0px";
			skinElem.style.paddingBottom = "0px";	
		}		
	}
	function get_name() :String {
		var arr = lang.day.list.item;
		var v = date.getDay();		
		return arr[v].label;
	}
	function get_abbrev() :String {
		var str = lang.day.abbrev;
		var v = date.getDay();		
		return str.substr(v, 1);
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
		//else if (_year != null) v = _year;
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
