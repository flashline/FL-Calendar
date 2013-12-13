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
import js.html.ImageElement;
import js.html.TextAreaElement;
import net.flash_line._api.motion.BTween;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import net.flash_line.util.Object;
import js.html.Element; import net.flash_line.display.ElementExtender ; using net.flash_line.display.ElementExtender;
/**
* 
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
	 * text entered and valided for this month
	 */
	public var textContent(get,set):String;var _textContent:String;
	//
	/**
	 * Day() of this Month()
	 */
	public var dayChildren(default, null):Array<Day>;
	/**
	 * index pos in parent model array
	 */
	public var index(default, null):Int;	
	/**
	 * main Element in DOM
	 */
	public var skinElem(default, null):Element;	
	/**
	 * top container (class="month")
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
	 * @return 0 to 9999
	 */
	public var year(get, null):Int;
	/**
	 * @return one of "January","February",etc
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
	 * @return month's color
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
	 * @return true if users at least one time open or close 
	 */
	public var wasOneTimeUsed(get, set):Bool; var _wasOneTimeUsed:Bool;
	
	
	//
	//
	/**
	* constructor
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
	 * Create days of the month and push into this.dayChildren[]
	 */
    public function createDay () {
		for (i in 0...maxDay) {
			dayChildren.push(new Day(i, model, this));
		}
    }
	public function initSkin (monthContainer:Element) {
		skinElem = monthContainer;
		monthElem = skinElem.elemBy("month") ;
		reactiveElem = monthElem.elemBy("name");		
		reactiveElem.innerHTML = name;		
		openTextElem = monthElem.elemBy("open");		
		clearButton.innerHTML = lang.button.clear.label ;
		cancelButton.innerHTML = lang.button.cancel.label ;
		validButton.innerHTML = lang.button.valid.label ;		
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
		day.initSkin(dayElem);
		if (day.index==maxDay-1) el.parentNode.removeChild(el);	
		return dayElem;
	}
    public function getDay (n:Int) {
		if (n < 1 || n > dayChildren.length) return null;
		else return dayChildren[n - 1];		
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
	
	public function scrollToTop () {
		oy = Std.int(skinElem.positionInWindow().y);
		if (oy > 0) {
			if (isMobile || !isWebKit) skinElem.scrollIntoView(true); 
			else {
				new BTween (Browser.window.pageYOffset, oy + Browser.window.pageYOffset, 1, onLoopScrollToTop ); 				
			}			
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
	function onLoopScrollToTop (e:StandardEvent) {
		if (e.type == "end") {
			e.target.clear () ;
		} else {
			Browser.window.scrollTo(0,e.value);
		}
	}
	public function restoreScroll () {
		if (!isMobile && isWebKit) {
			if (oy != null) new BTween (Browser.window.pageYOffset ,-oy+Browser.window.pageYOffset,.5, onLoopScrollToTop );// Browser.window.scrollTo(0, -oy+Browser.window.scrollY); 
		}
		oy = null;
    }
	public function displayInit (monthContainer:Element) {
		skinElem = monthContainer;
		monthElem = skinElem.elemBy("month") ;
		reactiveElem = monthElem.elemBy("name");		
		reactiveElem.innerHTML = name;		
		openTextElem = monthElem.elemBy("open");		
		//openTextCtnrElem = monthElem.elemBy("openCtnr");
		//
		clearButton.innerHTML = lang.button.clear.label ;
		cancelButton.innerHTML = lang.button.cancel.label ;
		validButton.innerHTML = lang.button.valid.label ;	
		//
		var el:Element = monthContainer.elemBy("day"); 
		for (day in dayChildren) {
			var dayElem:Element = el.clone(true) ;
			skinElem.appendChild(dayElem);
			dayElem.id = skinElem.id + "d"+day.index;
			day.displayInit(dayElem);
		}
		el.parentNode.removeChild(el);		
    }	
	
	
	public function displayUpdate () {				
		reactiveElem.innerHTML = name;	
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
	public function clearText () {
		setMonthTextPicto("");
		cast(monthElem.elemByTag("textarea"), TextAreaElement).value = "";
    }	
	public function displayText() {
		setMonthTextPicto();
		cast(monthElem.elemByTag("textarea"), TextAreaElement).value =  textContent;
    }
	public function storeText() {
		textContent=cast(monthElem.elemByTag("textarea"),TextAreaElement).value;	
    }
	
    /**
    *@private
    */
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
