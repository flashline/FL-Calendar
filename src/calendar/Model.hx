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
import js.Cookie;
import net.flash_line.event.EventSource;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import net.flash_line.util.Cst;
import net.flash_line.util.Object;
import net.flash_line.util.xml.XmlParser;
import net.flash_line.util.ArrayExtender ; using net.flash_line.util.ArrayExtender ;
import haxe.Http; import net.flash_line.io.HttpExtender ; using net.flash_line.io.HttpExtender ;
//
typedef Save = {
    var days : Array<Day>;
    var months: Array<Month>;
    var currUserId : String;
	var currYear:String;
}
/**
* Calendar Model class.
* contains in var tree dynamic properties read from model.xml and language texts in var lang.
*/
class Model extends XmlParser {
	/**
	 * to store days and months texts in case of timeout or user interruption.
	 */
	public var save:Save;
	public var confirmBox:ConfirmBox;
	public var promptBox:PromptBox;
	/**
	 * @return true if users at least one time has clicked on month or Month text post-it or day 
	 */
	public var wasOneTimeUsed:Bool;
	/**
	 * event dispatcher when server answers
	 */
	public var serverEvent(default,null):EventSource;
	public var serverWriteDayEvent(default,null):EventSource;
	public var serverWriteMonthEvent(default,null):EventSource;
	public var serverActived(default, null):EventSource;	
	//
	/**
	 * true if logOut then automatic login, was due to a server timeout.
	 */
	public var isLogInAfterTimeOut(get, null):Bool; 
	/**
	 * true if array of <Month> isn't empty.
	 */
	public var isMonthAndDayCreated(get, null):Bool; 
	/**
	 * true if current year is bissextile.
	 */
	public var isCurrYearBissextile(get, null):Bool; 
	
	/**
	 * true if safe mode is active
	 */
	public var isSafeMode(get, null):Bool; 
	/**
	 * used to temporize
	 */
	public var wait:WaitView; 
	/**
	 * true if user is not connected
	 */
	public var simpleCalendarUsing:Bool; 
	/**
	 * current year
	 */
	public var currYear(get, set):Int; var _currYear:Int;
	/**
	 * index month of Date.now() or null
	 */
	public var currMonthIndex(get, null):Int; 
	/**
	 * languages labels
	 */
	public var lang(get, null):Object;
	/**
	 * list of 14 month (dec year-1 until jan year+1 through 12 months of year.
	 */
	public var monthChildren(default, null):Array<Month>;
	/**
	 * user name, id, pseudo etc
	 */
	public var currUserId :String;
	/**
	 * pwd
	 */
	public var currUserPwd :String;
	//
	//
	var currCookieId:String;
	var currCookiePwd:String;
	var httpStandardRequest(default,null):Http;
	var httpWriteDayRequest(default,null):Http;
	var httpWriteMonthRequest(default,null):Http;
	var language:Language;
	var serverUrl:String;
	//
	/**
	 * constructor
	 * @param	lg App texts instance
	 * @param	su server program url
	 */
	public function new (lg:Language,su:String) {
		super();
		language = lg;
		monthChildren = [];
		serverEvent = new EventSource(); 
		serverActived = new EventSource();
		serverWriteDayEvent = new EventSource();
		serverWriteMonthEvent= new EventSource();
		save={days:[],months:[],currUserId:"",currYear:""};
		serverUrl = su;
		wasOneTimeUsed = false;
    }
	 /**
	 * Create request
	 */
    public function initServer () {
		if (httpStandardRequest == null) {
			httpStandardRequest = new Http(serverUrl);
			httpWriteDayRequest = new Http(serverUrl);
			httpWriteMonthRequest = new Http(serverUrl);
		}		
	}    
	public function createOneMonth (idx:Int) : Month {		
		monthChildren.push(new Month(idx, this));
		return monthChildren.last();
	}
	public function createBissexDay () {
		var month:Month = getMonth(2);
		if (month.dayChildren.length<29) {
			var day:Day = new Day(28,this,month );
			month.dayChildren.push(day);			
		}
	}
	public function removeBissexDay () {
		if (getMonth(2).dayChildren.length==29) getMonth(2).dayChildren.pop();
	}
	/**
	 * @param	n a number 1 to 12 or 0=december year-1 or 13=january year+1
	 * @return a Month()
	 */
	public function getMonth (n:Int) :Month {
		if (n < 0 || n > 13) trace("f::Invalid month index !");
		return monthChildren[n];		
    }
	/**
	 * used after year change 
	 * @param	o
	 */
	public function storeMonthAndDayText (o:Object) {						
		//months
		for (month in monthChildren) {
			month.displayUpdate();
			storeOneMonthText(o,month);
			// days		
			for (day in month.dayChildren) {
				day.clear(); day.displayUpdate () ;	
				storeOneDayText (o, day);
			}
		}	
	}
	/**
	 * used when a global months/days loop already done by the caller
	 * @param	o	data read
	 * @param	month instance
	 */
	public function storeOneMonthText (o:Object,month:Month) {
		if (o.get("month_" + month.key) != null) {		
			month.textContent = decodeXmlReserved(o.get("month_" + month.key).value);			
		} else {
			month.textContent = "";
		}	
		month.displayText();
	}	
	/**
	 * used when a global months/days loop already done by the caller
	 * @param	o data read
	 * @param	day instance
	 */
	public function storeOneDayText (o:Object, day:Day ) {
		if (o.get("day_" + day.key) != null) {							
			day.textContent = decodeXmlReserved(o.get("day_" + day.key).value);							
		} else {
			day.textContent = "";
		}		
		day.displayText();
		if (day.isOpen) day.showFullNameOnTop();
		else day.restoreTextOnTop();
	}
	//
	public function  writeUserCookie () {
		if (!isSafeMode) {
			if ( currCookieId!=currUserId || currCookiePwd != currUserPwd) {
				var del = 365 * 24 * 60 * 60 * 1000;
				if ( strVal(currUserId, "") != "") {
					Cookie.set("calendarId", currUserId, del); // , null, tree.cookie.domain
					currCookieId = currUserId;
					if (strVal(currUserPwd, "") != "") {
						Cookie.set("calendarPwd", currUserPwd, del); 
						currCookiePwd = currUserPwd;
					}
				} 
			} 
		} 
	}
	public function  readUserCookie (?b:Bool = true) {
		var o:Object = new Object( { currCookieId:null, currCookiePwd:null } ) ;
		if (!isSafeMode) {
			if (Cookie.exists("calendarId")) {
				currCookieId=Cookie.get("calendarId");
				currCookiePwd = Cookie.get("calendarPwd");
				o.id = currCookieId;
				o.pwd = currCookiePwd;
				currUserPwd = currCookiePwd;
				//trace("read : "+currCookieId+"/"+currCookiePwd);
			} else {
				if (b) {
					if ( strVal(currUserId, "") != "") {
						 writeUserCookie ();
						 o=readUserCookie (false) ;
					} 
				} 
			}
		} 
		return o;
	}
	/**
	 * @param	?isSafe=true means no cookies
	 */
	public function  setSafeMode (?isSafe=true) {
		var del = 365 * 24 * 60 * 60 * 1000;
		if (isSafe) {	
			if (Cookie.exists("calendarUnsafe")) Cookie.remove("calendarUnsafe");
			Cookie.remove("calendarId");
			Cookie.remove("calendarPwd");
			currCookieId=null;
			currCookiePwd = null;	
		} else {		
			if (!Cookie.exists("calendarUnsafe")) Cookie.set("calendarUnsafe", "true" , del);
			currCookieId=null;
			currCookiePwd = null;
			writeUserCookie();
		}			
	}
	/**
	 * Main method to send server request
	 * @param	?o		vars to send
	 * @param	?type	request types : standard, writeDay or writeMonth
	 */
	public function toServer (?o:Dynamic=null,?type:String)  {
		initServer(); var httpRequest:Http;
		//
		if (type == "writeDay") {
			httpRequest = httpWriteDayRequest;
			httpRequest.onData = onServerWriteDayData;		
		}
		else if (type == "writeMonth") {
			httpRequest = httpWriteMonthRequest;
			httpRequest.onData = onServerWriteMonthData;
		} else {
			httpRequest = httpStandardRequest;
			httpRequest.onData = onServerData;
		}
		//
		httpRequest.onError = onServerError;
		if (o != null) {
			var arr:Array<String> = Reflect.fields(o);
			for (i in 0...arr.length) {
				httpRequest.setParameter(arr[i], Reflect.field(o, arr[i]) ) ;
			}
		}
		httpRequest.request(true);
		serverActived.dispatch(new StandardEvent(this));
	}
	/**
	 * validity control
	 * @param	name 
	 * @param	pwd
	 * @return error msg or ""
	 */
	public function isValidSignInInput (name:String,pwd:String) : String {
		var str = "";
		if (  	(Std.parseInt(tree.login.idMinLen) > name.length)
			|| 	(Std.parseInt(tree.login.idMaxLen) < name.length) ) 
			str += lang.error.idLengthNotValid.label + "\n\n" ;
		//	
		if (  	(Std.parseInt(tree.login.pwdMinLen) > pwd.length)
			|| 	(Std.parseInt(tree.login.pwdMaxLen) < pwd.length) ) 
			str += lang.error.pwdLengthNotValid.label + "\n\n" ;
		//	
		return str;
	}
	/**
	 * validity control
	 * @param	name 
	 * @param	pwd
	 * @param	confirm
	 * @return error msg or ""
	 */	
	public function isValidSignUpInput (name:String,pwd:String,confirm:String) : String {
		var str = isValidSignInInput(name, pwd);
		if ( pwd!=confirm) str += lang.error.pwdNotIdem.label + "\n" ;
		//		
		return str;
	}
	/**
	 * validity control
	 * @param	v year
	 * @return error msg or ""
	 */
	public function isValidYearInput (v:String) : String {
		var str = "";
		if ( v.length != 4) str += lang.error.yearNotValid.label + "\n" ;
		//		
		return str;
	}
	/**
	 * mail control
	 * @param	v email
	 * @return false if error
	 */
	public function mailIsValid (v:String) : Bool {
		var r:EReg = ~/[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z][A-Z][A-Z]?/i;
		return r.match(v);		
    }
	/**
	 * method to debug
	 */
	public function toString () {
		var str = "";
		str += "current year=" + currYear + "\n";
		for (i in monthChildren) {
			str += i.toString();
		}
		return str;		
    }
	
    /**
    *@private
    */
	//
	// server return listeners
	//
	function onServerData (data:String)  {
		data = StringTools.trim(data);
		var e:StandardEvent = new StandardEvent(this, "", "");
		if (data.substr(0, 5) == "<?xml") {	
			e.result= new XmlParser().parse( Xml.parse(data));			
		} else {
			e.result = httpStandardRequest.getParameter(data);
		}
		serverEvent.dispatch(e);
	}
	function onServerWriteDayData (data:String)  {
		data = StringTools.trim(data);
		var e:StandardEvent = new StandardEvent(this, "", "");
		e.result = httpWriteDayRequest.getParameter(data);
		serverWriteDayEvent.dispatch(e);
	}
	function onServerWriteMonthData (data:String)  {
		data = StringTools.trim(data);
		var e:StandardEvent = new StandardEvent(this, "", "");
		e.result = httpWriteMonthRequest.getParameter(data);
		serverWriteMonthEvent.dispatch(e);
	}
	function onServerError (msg:String)  {
		serverEvent.dispatch( new StandardEvent(this, "error", msg));
		trace("f::From server:\n" + msg);
	}
	//
	//	get/set
	//
	function set_currYear(v:Int) :Int {
		if (v < 0 || v > 9999) {
			trace("f::" + lang.error.fatal.badYear.label);
		}
		_currYear = v;
		return v;
	} 
	function get_currYear() :Int {
		var v:Int = 0;
		if (_currYear != null) {
			v= _currYear;
		} else {
			v= Date.now().getFullYear();
		}
		return intVal(v);
	} 
	function get_lang() :Object {
		return language.tree;
	} 
	function get_currMonthIndex() :Int {
		var v = Date.now().getMonth() + 1;
		if (Date.now().getFullYear() == (currYear - 1)) {
			if (v == 12) v = 0;
			else v = null;
		} else if (Date.now().getFullYear() == (currYear + 1)) {
			if (v == 1) v = 13;
			else v = null;
		} else if (Date.now().getFullYear()!=currYear) {
			v = null;
		} 
		return v;
	} 
	function get_isLogInAfterTimeOut() :Bool {
		return (strVal(save.currUserId, "")!="" &&  save.currUserId== currUserId );
	}
	function get_isMonthAndDayCreated() :Bool {
		return (monthChildren!=null && monthChildren.length!=0 );
	}
	function get_isCurrYearBissextile() : Bool {
		return isBissextile(currYear) ;
	}
    function  get_isSafeMode () : Bool{	
		return !(Cookie.exists("calendarUnsafe")) ;		
	}	
}
