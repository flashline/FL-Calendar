(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var net = {};
net.flash_line = {};
net.flash_line.util = {};
net.flash_line.util.ApiCommon = function() { };
net.flash_line.util.ApiCommon.__name__ = true;
net.flash_line.util.ApiCommon.flnetTrace = function(v,i) {
	var str = Std.string(v);
	var len = str.length;
	if(len > 2 && HxOverrides.substr(str,1,2) == "::") {
		if(HxOverrides.substr(str,0,1) == "e" || HxOverrides.substr(str,0,1) == "f") {
			var d = window.document.getElementById("flnet:error");
			if(d != null) {
				str = "<br/>error " + (i != null?"in " + i.fileName + " line " + i.lineNumber:"") + " : " + HxOverrides.substr(str,3,len - 3) + "<br/>";
				d.innerHTML += str + "<br/>";
				throw "fl.net error. See red message in page.";
			} else if(HxOverrides.substr(str,0,1) == "f") {
				var msg = "";
				v = HxOverrides.substr(str,3,len - 3);
				if(window.document.getElementById("haxe:trace") != null) msg = "fl.net error. See message in page."; else msg = "fl.net error. See last message above.";
				js.Boot.__trace(v,i);
				throw msg;
			}
		} else if(HxOverrides.substr(str,0,1) == "i") {
			str = "<br/>notice in " + (i != null?i.fileName + ":" + i.lineNumber:"") + "<br/>" + HxOverrides.substr(str,3,len - 3);
			var d1 = window.document.getElementById("flnet:info");
			if(d1 != null) d1.innerHTML += str + "<br/>";
		}
	} else js.Boot.__trace(v,i);
};
net.flash_line.util.ApiCommon.prototype = {
	boolVal: function(b,defVal) {
		if(defVal == null) defVal = false;
		if(b == null) return defVal;
		if(typeof(b) == "string") {
			if(b == "true") return true; else if(b == "false") return false; else return defVal;
		} else if(typeof(b) == "number") {
			if(b == 0) return false; else if(b == 1) return true; else return defVal;
		} else if(typeof(b) == "boolean") return b;
		return defVal;
	}
	,strVal: function(s,defVal) {
		if(defVal == null) defVal = "";
		if(s == null) return defVal;
		if(s == "") return defVal;
		return s;
	}
	,numVal: function(n,defVal) {
		if(defVal == null) defVal = 0;
		if(n == "0") return Std.parseFloat("0");
		if(n == null) return defVal;
		if(Math.isNaN(n)) return defVal;
		if(n == "") return defVal;
		if(typeof(n) == "string") return Std.parseFloat(n);
		return Math.pow(n,1);
	}
	,intVal: function(n,defVal) {
		if(defVal == null) defVal = 0;
		if(n == "0") return Std.parseInt("0");
		if(n == null) return defVal;
		if(Math.isNaN(n)) return defVal;
		if(n == "") return defVal;
		if(typeof(n) == "string") return Std.parseInt(n);
		return n;
	}
	,empty: function(v) {
		if(v == null) return true;
		if(v.length == 0) return true;
		return false;
	}
	,confirm: function(v) {
		return confirm(js.Boot.__string_rec(v,""));
	}
	,alert: function(v,cb,title) {
		if(net.flash_line.util.ApiCommon.alertFunction != null) net.flash_line.util.ApiCommon.alertFunction(v,cb,title); else {
			if(this.strVal(title,"") != "") v = title + "\n" + Std.string(v);
			alert(js.Boot.__string_rec(v,""));
			if(cb != null) cb();
		}
	}
	,prompt: function(v,def) {
		if(def == null) def = "";
		return prompt(v,def);
	}
	,strReplace: function(str,from,to) {
		var reg = new RegExp('('+from+')', 'g');;
		str = str.replace(reg,to);;
		return str;
	}
	,strBetween: function(str,before,after) {
		var ret = "";
		var l = 0;
		var p = 0;
		p = str.indexOf(before);
		if(p != -1) {
			p += before.length;
			l = str.indexOf(after,p);
			if(l == -1) ret = HxOverrides.substr(str,p,null); else {
				l -= p;
				ret = HxOverrides.substr(str,p,l);
			}
		}
		return ret;
	}
	,removeTrace: function() {
		var el;
		el = window.document.getElementById("flnet:error");
		if(el != null) el.id = "";
		el = window.document.getElementById("flnet:info");
		if(el != null) el.id = "";
	}
	,setupTrace: function(ctnrId) {
		var ctnr;
		if(this.empty(ctnrId)) ctnr = js.Boot.__cast(window.document.getElementsByTagName("body")[0] , Element); else ctnr = window.document.getElementById(ctnrId);
		if(ctnr != null) {
			if(window.document.getElementById("flnet:error") == null) ctnr.innerHTML += "<div id='flnet:error' style='font-weight:bold;color:#900;' ></div>";
			if(window.document.getElementById("flnet:info") == null) ctnr.innerHTML += "<div id='flnet:info' style='font-weight:bold;' ></div>";
			haxe.Log.trace = net.flash_line.util.ApiCommon.flnetTrace;
		} else return false;
		return true;
	}
	,decodeXmlReserved: function(str) {
		str = this.strVal(str,"");
		if(str != "") {
			var i = str.indexOf("~#e");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "&" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#e");
			}
			i = str.indexOf("~#{");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "<" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#{");
			}
			i = str.indexOf("~#}");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + ">" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#}");
			}
			i = str.indexOf("~#ç");
			while(i > -1) {
				str = HxOverrides.substr(str,0,i) + "%" + HxOverrides.substr(str,i + 3,null);
				i = str.indexOf("~#ç");
			}
		}
		return str;
	}
	,isBissextile: function(n) {
		return new Date(n,1,29,0,0,0).getDay() != new Date(n,2,1,0,0,0).getDay();
	}
	,__class__: net.flash_line.util.ApiCommon
};
net.flash_line.util.Common = function() { };
net.flash_line.util.Common.__name__ = true;
net.flash_line.util.Common.__super__ = net.flash_line.util.ApiCommon;
net.flash_line.util.Common.prototype = $extend(net.flash_line.util.ApiCommon.prototype,{
	elem: function(v,parent) {
		var el;
		if(this.rootHtmlElement == null) this.rootHtmlElement = window.document.body;
		if(parent == null) parent = this.rootHtmlElement;
		el = window.document.getElementById(v);
		if(el == null) haxe.Log.trace("f::Element's id: " + v + " doesn't exist !",{ fileName : "Common.hx", lineNumber : 54, className : "net.flash_line.util.Common", methodName : "elem"});
		if(!parent.contains(el)) haxe.Log.trace("f::Element's id: " + v + " is not only in parent : tag=" + parent.tagName + "/class=" + parent.className + "/id=" + parent.id,{ fileName : "Common.hx", lineNumber : 57, className : "net.flash_line.util.Common", methodName : "elem"});
		return el;
	}
	,elemBy: function(v,parent) {
		var el;
		if(this.rootHtmlElement == null) this.rootHtmlElement = window.document.body;
		if(parent == null) parent = this.rootHtmlElement;
		el = js.Boot.__cast(parent.getElementsByClassName(v)[0] , Element);
		if(el == null) haxe.Log.trace("f::Element's id: " + v + " doesn't exist !",{ fileName : "Common.hx", lineNumber : 68, className : "net.flash_line.util.Common", methodName : "elemBy"});
		return el;
	}
	,qs: function(v,parent) {
		var el;
		if(this.rootHtmlElement == null) this.rootHtmlElement = window.document.body;
		if(parent == null) parent = this.rootHtmlElement;
		el = parent.querySelector(v);
		if(el == null) haxe.Log.trace("f::Element's by selector: " + v + " doesn't exist !",{ fileName : "Common.hx", lineNumber : 78, className : "net.flash_line.util.Common", methodName : "qs"});
		return el;
	}
	,qsa: function(v,parent) {
		var nl;
		if(this.rootHtmlElement == null) this.rootHtmlElement = window.document.body;
		if(parent == null) parent = this.rootHtmlElement;
		nl = parent.querySelectorAll(v);
		return nl;
	}
	,hexToDec: function(v) {
		return Number('0x'+v) ;;
	}
	,decToHex: function(n) {
		return n.toString(16);
	}
	,addHex: function(v1,v2) {
		return this.decToHex(this.hexToDec(v1) + this.hexToDec(v2));
	}
	,mailIsValid: function(v) {
		var r = new EReg("[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z][A-Z][A-Z]?","i");
		return r.match(v);
	}
	,pagename: function() {
		var arr = window.location.pathname.split("/");
		var str = arr[arr.length - 1];
		var len = str.lastIndexOf(".");
		str = HxOverrides.substr(str,0,len);
		if(str == "") str = "index";
		return str;
	}
	,pageUrlPath: function() {
		var str = window.location.href;
		var p = str.lastIndexOf("/");
		if(p > -1) return HxOverrides.substr(str,0,p + 1);
		return "";
	}
	,get_isPhone: function() {
		return window.screen.availHeight <= 800 && this.get_isMobile();
	}
	,get_isTablet: function() {
		return window.screen.availHeight > 800 && this.get_isMobile();
	}
	,get_isMobile: function() {
		return new EReg("iPhone|ipad|iPod|Android|opera mini|blackberry|palm os|palm|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|opera mobi|windows phone|iemobile|mobile".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,get_isIphoneIpad: function() {
		return new EReg("iPhone|iPad".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,get_isWindowsPhone: function() {
		return new EReg("windows phone|iemobile".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,get_isSafari: function() {
		return new EReg("safari".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase()) && !new EReg("chrome".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,get_isFirefox: function() {
		return new EReg("firefox".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,get_isWebKit: function() {
		return new EReg("webkit|chrome|safari".toLowerCase(),"i").match(window.navigator.userAgent.toLowerCase());
	}
	,__class__: net.flash_line.util.Common
	,__properties__: {get_isTablet:"get_isTablet",get_isPhone:"get_isPhone",get_isIphoneIpad:"get_isIphoneIpad",get_isSafari:"get_isSafari",get_isFirefox:"get_isFirefox",get_isWebKit:"get_isWebKit",get_isMobile:"get_isMobile",get_isWindowsPhone:"get_isWindowsPhone"}
});
var Calendar = function(su,ms,ls,bu,auto,w) {
	if(auto == null) auto = true;
	if(bu == null) bu = "./";
	if(ls == null) ls = "custom/default/language.xml";
	if(ms == null) ms = "custom/default/model.xml";
	if(su == null) su = "php/calendar.php";
	this._languageSrc = ls;
	this._modelSrc = ms;
	this._baseUrl = bu;
	this.loadInit = new net.flash_line.event.EventSource();
	this.language = new calendar.Language();
	this.model = new calendar.Model(this.language,su,this._baseUrl);
	this.model.wait = w;
	this.view = new calendar.View(this.model,this.language);
	this.controler = new calendar.Controler(this.model,this.view);
	if(auto) this.loadModelAndLanguage();
};
Calendar.__name__ = true;
Calendar.__super__ = net.flash_line.util.Common;
Calendar.prototype = $extend(net.flash_line.util.Common.prototype,{
	loadModelAndLanguage: function() {
		this.model.load(this._baseUrl + this._modelSrc,$bind(this,this.onReadModel));
	}
	,start: function() {
		this.view.displayInit();
		this.controler.eventInit();
		this.controler.start();
	}
	,toString: function() {
		return this.model.toString();
	}
	,onReadModel: function(tree,m) {
		this.language.load(this._baseUrl + this._languageSrc,$bind(this,this.onReadLanguage));
	}
	,onReadLanguage: function(tree,l) {
		var e = new net.flash_line.event.StandardEvent(this);
		e.text = tree;
		e.model = this.model;
		this.loadInit.dispatch(e);
	}
	,set_confirmBox: function(v) {
		this.model.confirmBox = v;
		return v;
	}
	,get_confirmBox: function() {
		return this.model.confirmBox;
	}
	,set_promptBox: function(v) {
		this.model.promptBox = v;
		return v;
	}
	,get_promptBox: function() {
		return this.model.promptBox;
	}
	,__class__: Calendar
	,__properties__: $extend(net.flash_line.util.Common.prototype.__properties__,{set_promptBox:"set_promptBox",get_promptBox:"get_promptBox",set_confirmBox:"set_confirmBox",get_confirmBox:"get_confirmBox"})
});
var DateTools = function() { };
DateTools.__name__ = true;
DateTools.delta = function(d,t) {
	var t1 = d.getTime() + t;
	var d1 = new Date();
	d1.setTime(t1);
	return d1;
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var Main = function() {
	this.setupTrace();
	net.flash_line.display.ElementExtender.addLst(window,"load",$bind(this,this.start));
};
Main.__name__ = true;
Main.main = function() {
	new Main();
};
Main.__super__ = net.flash_line.util.Common;
Main.prototype = $extend(net.flash_line.util.Common.prototype,{
	start: function(e) {
		net.flash_line.display.ElementExtender.removeLst(window,"load",$bind(this,this.start));
		this.wait = this.createWaitView();
		this.wait.start("...initialisation.");
		this.c = new Calendar(cst.getServerUrl(),cst.getModelSrc(),cst.getLanguageSrc(),cst.getBaseUrl(),this.isAutoStart(true),this.wait);
		this.c.loadInit.bind($bind(this,this.onLoad));
		net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.child(this.elem("calendar"),"release"),"releaseText").innerHTML = "<b>Apix Calendar</b> " + "1.4.17";
		if(this.get_isMobile()) net.flash_line.display.ElementExtender["delete"](net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.child(this.elem("calendar"),"release"),"embed"));
	}
	,onLoad: function(e) {
		this.lang = e.text;
		if(this.get_isIphoneIpad()) net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.child(this.elem("calendar"),"release"),"github").innerHTML = this.lang.Igithub.label; else if(!this.get_isMobile()) this.addComputerOnlyLink();
		this.createErrorAlert(e.text);
		this.c.set_promptBox(this.createPromptBox(e.text));
		this.c.set_confirmBox(this.createConfirmBox(e.text));
		this.c.start();
	}
	,createErrorAlert: function(lang) {
		var el = net.flash_line.display.ElementExtender.child(this.elem("calendar"),"alertView");
		var txEl = net.flash_line.display.ElementExtender.childByName(net.flash_line.display.ElementExtender.elemBy(el,"alertDiv"),"message");
		var btEl = net.flash_line.display.ElementExtender.child(net.flash_line.display.ElementExtender.elemBy(el,"alertDiv"),"alertValid");
		var subTitleEl = net.flash_line.display.ElementExtender.elemBy(el,"subTitle");
		net.flash_line.display.ElementExtender.elemBy(el,"title").innerHTML = lang.alertSkin.title.label;
		subTitleEl.innerHTML = "<b>" + Std.string(lang.alertSkin.subTitle.label) + "</b>";
		btEl.innerHTML = lang.button.goOn.label;
		var ea = new calendar.ErrorAlert(el,js.Boot.__cast(txEl , HTMLTextAreaElement),js.Boot.__cast(btEl , HTMLButtonElement),subTitleEl);
	}
	,createConfirmBox: function(lang) {
		var el = net.flash_line.display.ElementExtender.child(this.elem("calendar"),"confirmView");
		var txEl = net.flash_line.display.ElementExtender.childByName(net.flash_line.display.ElementExtender.elemBy(el,"confirmDiv"),"message");
		var btEl = net.flash_line.display.ElementExtender.child(net.flash_line.display.ElementExtender.elemBy(el,"confirmDiv"),"confirmValid");
		var btCaEl = net.flash_line.display.ElementExtender.child(net.flash_line.display.ElementExtender.elemBy(el,"confirmDiv"),"confirmCancel");
		net.flash_line.display.ElementExtender.elemBy(el,"title").innerHTML = lang.confirmSkin.title.label;
		net.flash_line.display.ElementExtender.elemBy(el,"subTitle").innerHTML = "<b>" + Std.string(lang.confirmSkin.subTitle.label) + "</b>";
		btEl.innerHTML = lang.button.confirmLogOut.label;
		btCaEl.innerHTML = lang.button.record.label;
		var cb = new calendar.ConfirmBox(el,js.Boot.__cast(txEl , HTMLTextAreaElement),js.Boot.__cast(btEl , HTMLButtonElement),js.Boot.__cast(btCaEl , HTMLButtonElement));
		return cb;
	}
	,createPromptBox: function(lang) {
		var el = net.flash_line.display.ElementExtender.child(this.elem("calendar"),"promptView");
		var txEl = net.flash_line.display.ElementExtender.childByName(net.flash_line.display.ElementExtender.elemBy(el,"promptDiv"),"message");
		var inEl = net.flash_line.display.ElementExtender.childByName(net.flash_line.display.ElementExtender.elemBy(el,"inputDiv"),"userMail");
		var btEl = net.flash_line.display.ElementExtender.child(net.flash_line.display.ElementExtender.elemBy(el,"promptDiv"),"promptValid");
		net.flash_line.display.ElementExtender.elemBy(el,"title").innerHTML = lang.promptSkin.title.label;
		net.flash_line.display.ElementExtender.elemBy(el,"subTitle").innerHTML = "<b>" + Std.string(lang.promptSkin.subTitle.label) + "</b>";
		net.flash_line.display.ElementExtender.elemBy(el,"promptInput").innerHTML = Std.string(lang.promptSkin.input.label) + "</b>";
		btEl.innerHTML = lang.button.valid.label;
		var pb = new calendar.PromptBox(el,js.Boot.__cast(txEl , HTMLTextAreaElement),js.Boot.__cast(inEl , HTMLInputElement),js.Boot.__cast(btEl , HTMLButtonElement));
		return pb;
	}
	,createWaitView: function() {
		var el = net.flash_line.display.ElementExtender.child(this.elem("calendar"),"waitView");
		var txEl = net.flash_line.display.ElementExtender.elemBy(el,"text");
		var animBox = net.flash_line.display.ElementExtender.elemBy(el,"anim");
		var movie = net.flash_line.display.ElementExtender.child(animBox,"waitMovie");
		return new calendar.WaitView(el,txEl,animBox,movie);
	}
	,addComputerOnlyLink: function() {
		net.flash_line.display.ElementExtender.elemBy(this.elem("release"),"embed").innerHTML = "<a href='embed.simu.html' target='_blank' >&lt;&gt;&nbsp;" + Std.string(this.lang.embedLink.label) + "</a>&nbsp;&nbsp;&nbsp;&nbsp;";
		net.flash_line.display.ElementExtender.elemBy(this.elem("release"),"apixorg").innerHTML = "<a href='http://www.apixline.org' target='_blank'>Apix-line Open-Source</a>";
	}
	,isAutoStart: function(b) {
		if(b == null) b = true;
		return b;
	}
	,__class__: Main
});
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,get_nodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,attributes: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.keys();
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k1 = this.cur;
			var l1 = this.x.length;
			while(k1 < l1) {
				var n = this.x[k1];
				k1 += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k1;
					return n;
				}
			}
			return null;
		}};
	}
	,firstChild: function() {
		if(this._children == null) throw "bad nodetype";
		return this._children[0];
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,__class__: Xml
	,__properties__: {set_nodeValue:"set_nodeValue",get_nodeValue:"get_nodeValue",set_nodeName:"set_nodeName",get_nodeName:"get_nodeName"}
};
var calendar = {};
calendar.ConfirmBox = function(el,txElem,bvElem,bcElem) {
	this.ctnrElem = el;
	this.textElem = txElem;
	this.validElem = bvElem;
	this.cancelElem = bcElem;
	net.flash_line.display.ElementExtender.setReadOnly(txElem);
	this.enable();
};
calendar.ConfirmBox.__name__ = true;
calendar.ConfirmBox.__super__ = net.flash_line.util.Common;
calendar.ConfirmBox.prototype = $extend(net.flash_line.util.Common.prototype,{
	enable: function() {
		net.flash_line.display.ElementExtender.addLst(this.validElem,"click",$bind(this,this.onValid),false);
		net.flash_line.display.ElementExtender.addLst(this.cancelElem,"click",$bind(this,this.onCancel),false);
	}
	,disable: function() {
		net.flash_line.display.ElementExtender.removeLst(this.validElem,"click",$bind(this,this.onValid),false);
		net.flash_line.display.ElementExtender.removeLst(this.cancelElem,"click",$bind(this,this.onCancel),false);
		this.callBack = null;
		this.close();
	}
	,open: function(v,cb) {
		this.ctnrElem.style.visibility = "visible";
		this.textElem.innerHTML = v;
		this.callBack = cb;
	}
	,close: function() {
		this.ctnrElem.style.visibility = "hidden";
		this.textElem.innerHTML = "";
	}
	,onValid: function(e) {
		e.preventDefault();
		this.close();
		this.callBack(true,this);
		return false;
	}
	,onCancel: function(e) {
		e.preventDefault();
		this.close();
		this.callBack(false,this);
		return false;
	}
	,__class__: calendar.ConfirmBox
});
calendar.Controler = function(m,v) {
	this.model = m;
	this.view = v;
};
calendar.Controler.__name__ = true;
calendar.Controler.__super__ = net.flash_line.util.Common;
calendar.Controler.prototype = $extend(net.flash_line.util.Common.prototype,{
	eventInit: function() {
		net.flash_line.display.ElementExtender.addLst(this.view.rootHtmlElement,"resize",$bind(this,this.skinResize));
		net.flash_line.display.ElementExtender.addLst(this.view.get_window(),"resize",$bind(this,this.skinResize));
		net.flash_line.display.ElementExtender.addLst(this.view.get_window(),"beforeunload",$bind(this,this.pageUnload));
		net.flash_line.display.ElementExtender.handCursor(this.view.get_window(),false);
		net.flash_line.display.ElementExtender.addLst(this.view.get_connection(),"click",$bind(this,this.connectionClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_changeYear(),"click",$bind(this,this.changeYearClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_refresh(),"click",$bind(this,this.refreshClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_safeMode(),"click",$bind(this,this.safeModeClick));
		this.model.serverActived.bind($bind(this,this.onServerActived));
		this.createLoginViewEvent();
		this.createChangeYearViewEvent();
	}
	,pageUnload: function(e) {
		if(this.model.currUserId != null && this.areThereNotSavedOpenTexts()) return this.get_lang().message.unloadAlert.label;
		return;
	}
	,start: function() {
		this.askConnectInfo();
	}
	,askConnectInfo: function() {
		this.model.wait.start(this.get_lang().server.connectInfo.label);
		this.model.serverEvent.bind($bind(this,this.onAnswerConnectInfo));
		this.model.toServer({ req : "isConnectionOpen"});
	}
	,onAnswerConnectInfo: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		if(answ == "connectionIsOpen") {
			var currYear = e.result.currentYear;
			var currUserId = e.result.pseudo;
			var currUserPwd = e.result.pwd;
			if(this.strVal(currYear,"").length > 0) this.model.set_currYear(Std.parseInt(currYear));
			if(this.strVal(currUserId,"") != "") this.model.currUserId = currUserId;
			if(this.strVal(currUserPwd,"") != "") this.model.currUserPwd = currUserPwd;
			this.view.displayUserInfo();
			this.view.changeConnectLabel(this.get_lang().button.deconnect.label);
			net.flash_line.display.ElementExtender.removeLst(this.view.get_connection(),"click",$bind(this,this.connectionClick));
			net.flash_line.display.ElementExtender.addLst(this.view.get_connection(),"click",$bind(this,this.deconnectClick));
			net.flash_line.display.ElementExtender.show(this.view.get_changeYear());
			net.flash_line.display.ElementExtender.show(this.view.get_refresh());
			this.model.simpleCalendarUsing = false;
			e.result = new net.flash_line.util.xml.XmlParser().parse(Xml.parse(e.result.xmldata));
			if(e.result.error != null) this.alert(this.get_lang().error.server.fatalRead.label); else {
				this.initializeMonthAndDay(this.connected(true),this.dayOnly(false),e.result);
				this.view.doLayoutResponsive();
			}
		} else if(answ == "connectionIsNotOpen") {
			this.model.wait.stop();
			this.doConnection();
		} else if(answ == "error") {
			this.model.wait.stop();
			this.alert(this.get_lang().error.server.noValidConnection.label,$bind(this,this.doConnection));
		} else {
			this.model.wait.stop();
			this.alert(this.get_lang().error.server.action.label,$bind(this,this.doConnection));
		}
	}
	,askOpenConnection: function(pseudo,pwd) {
		this.model.wait.start(this.get_lang().server.openConnection.label);
		this.model.currUserPwd = pwd;
		this.model.serverEvent.unbind();
		this.model.serverEvent.bind($bind(this,this.onAnswerOpenConnection));
		this.model.toServer({ req : "openConnection", pseudo : pseudo, pwd : pwd});
	}
	,onAnswerOpenConnection: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		if(answ == "error") {
			var msg = e.result.msg;
			if(msg == "noValidPseudo") this.alert(this.get_lang().error.server.idDontExist.label,$bind(this,this.onErrorCallBackOpenConnection)); else if(msg == "noValidPwd") this.alert(this.get_lang().error.server.noValidPwd.label,$bind(this,this.onErrorCallBackOpenConnection)); else this.alert(this.get_lang().error.server.unknownError.label,$bind(this,this.onErrorCallBackOpenConnection));
		} else if(answ == "openConnectionOk") {
			var currYear = e.result.currentYear;
			var currUserId = e.result.pseudo;
			if(this.strVal(currYear,"").length > 0) this.model.set_currYear(Std.parseInt(currYear));
			if(this.strVal(currUserId,"") != "") this.model.currUserId = currUserId;
			this.view.displayUserInfo();
			this.view.changeConnectLabel(this.get_lang().button.deconnect.label);
			net.flash_line.display.ElementExtender.removeLst(this.view.get_connection(),"click",$bind(this,this.connectionClick));
			net.flash_line.display.ElementExtender.addLst(this.view.get_connection(),"click",$bind(this,this.deconnectClick));
			net.flash_line.display.ElementExtender.show(this.view.get_changeYear());
			net.flash_line.display.ElementExtender.show(this.view.get_refresh());
			if(this.model.get_isLogInAfterTimeOut()) {
				var d = 0;
				var m = 0;
				var _g = 0;
				var _g1 = this.model.save.days;
				while(_g < _g1.length) {
					var day = _g1[_g];
					++_g;
					haxe.Log.trace(day.get_key(),{ fileName : "Controler.hx", lineNumber : 179, className : "calendar.Controler", methodName : "onAnswerOpenConnection"});
					this.askToWriteOneDayText(day);
					d++;
				}
				var _g2 = 0;
				var _g11 = this.model.save.months;
				while(_g2 < _g11.length) {
					var month = _g11[_g2];
					++_g2;
					haxe.Log.trace(month.get_key(),{ fileName : "Controler.hx", lineNumber : 183, className : "calendar.Controler", methodName : "onAnswerOpenConnection"});
					this.askToWriteOneMonthText(month);
					m++;
				}
				this.model.serverWriteDayEvent.unbind();
				this.model.serverWriteMonthEvent.unbind();
				if(d > 0) this.model.serverWriteDayEvent.bind($bind(this,this.onAnswerToWriteOneDayText));
				if(m > 0) this.model.serverWriteMonthEvent.bind($bind(this,this.onAnswerToWriteOneMonthText));
			} else {
				this.model.simpleCalendarUsing = false;
				e.result = new net.flash_line.util.xml.XmlParser().parse(Xml.parse(e.result.xmldata));
				if(e.result.error != null) this.alert(this.get_lang().error.server.fatalRead.label); else if(this.model.get_isMonthAndDayCreated()) {
					this.view.removeBissexDay();
					this.model.removeBissexDay();
					if(this.model.get_isCurrYearBissextile()) {
						this.model.createBissexDay();
						this.view.createBissexDay();
					}
					this.updateMonthAndDay(this.connected(true),this.dayOnly(true),e.result);
				} else this.initializeMonthAndDay(this.connected(true),this.dayOnly(false),e.result);
				this.view.doLayoutResponsive();
				this.model.writeUserCookie();
			}
		} else this.alert(this.get_lang().error.server.unknownError.label,$bind(this,this.onErrorCallBackOpenConnection));
	}
	,onErrorCallBackOpenConnection: function() {
		this.model.currUserPwd = null;
		this.doConnection();
	}
	,askLoginCreation: function(pseudo,pwd) {
		this.model.wait.start(this.get_lang().server.loginCreation.label);
		this.model.currUserPwd = pwd;
		this.model.serverEvent.unbind();
		this.model.serverEvent.bind($bind(this,this.onAnswerLoginCreation));
		this.model.toServer({ req : "createLogin", pseudo : pseudo, pwd : pwd, year : this.model.get_currYear()});
	}
	,onAnswerLoginCreation: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		if(answ == "error") {
			var msg = e.result.msg;
			if(msg == "pseudoAlreadyExist") this.alert(this.get_lang().error.server.idAlreadyExist.label,$bind(this,this.onErrorCallBackLoginCreation)); else if(msg == "folderCreationNotPossible") this.alert(this.get_lang().error.server.fileSystemError.label,$bind(this,this.onErrorCallBackLoginCreation)); else this.alert(this.get_lang().error.server.unknownError.label,$bind(this,this.onErrorCallBackLoginCreation));
		} else if(answ == "createLoginOk") {
			var currUserId = e.result.pseudo;
			if(this.strVal(currUserId,"") != "") this.model.currUserId = currUserId;
			this.view.changeConnectLabel(this.get_lang().button.deconnect.label);
			net.flash_line.display.ElementExtender.removeLst(this.view.get_connection(),"click",$bind(this,this.connectionClick));
			net.flash_line.display.ElementExtender.addLst(this.view.get_connection(),"click",$bind(this,this.deconnectClick));
			net.flash_line.display.ElementExtender.show(this.view.get_changeYear());
			net.flash_line.display.ElementExtender.show(this.view.get_refresh());
			this.model.simpleCalendarUsing = false;
			if(this.model.get_isMonthAndDayCreated()) this.updateMonthAndDay(this.connected(true),this.dayOnly(true),new net.flash_line.util.Object()); else this.initializeMonthAndDay();
			this.view.doLayoutResponsive();
			this.view.displayUserInfo();
			this.saveUserEmail();
		} else this.alert(this.get_lang().error.server.unknownError.label,$bind(this,this.onErrorCallBackLoginCreation));
	}
	,onErrorCallBackLoginCreation: function() {
		this.model.currUserPwd = null;
		this.doConnection(true);
	}
	,askSendUserMail: function(userMail) {
		this.model.wait.start(this.get_lang().server.sendUserMail.label);
		this.model.serverEvent.unbind();
		this.model.serverEvent.bind($bind(this,this.onAnswerSendUserMail));
		this.model.toServer({ req : "sendUserMail", userMail : userMail});
	}
	,onAnswerSendUserMail: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		if(answ == "userMailSentOk") this.alert(this.get_lang().message.userMailSentOk.label,null,this.get_lang().message.userMailSubTitle.label); else this.alert(this.get_lang().error.server.userMail.label);
	}
	,askLogOut: function() {
		this.model.wait.show(this.get_lang().server.logOut.label);
		this.model.serverEvent.unbind();
		this.model.serverEvent.bind($bind(this,this.onAnswerLogOut));
		this.model.toServer({ req : "closeConnection"});
	}
	,onAnswerLogOut: function(e) {
		this.model.wait.stop();
		if(e.result.answ == "closeConnectionOk") {
			this.disableMonthTextAndDay();
			this.model.currUserId = null;
			this.model.currUserPwd = null;
			this.model.simpleCalendarUsing = true;
			this.view.doLayoutResponsive();
			this.view.displayInfoWhenNoUser();
			this.view.changeConnectLabel(this.get_lang().button.connect.label);
			net.flash_line.display.ElementExtender.removeLst(this.view.get_connection(),"click",$bind(this,this.deconnectClick));
			net.flash_line.display.ElementExtender.addLst(this.view.get_connection(),"click",$bind(this,this.connectionClick));
			net.flash_line.display.ElementExtender.hide(this.view.get_changeYear());
			net.flash_line.display.ElementExtender.hide(this.view.get_refresh());
		} else this.alert(this.get_lang().error.server.deconnectError.label);
	}
	,askToChangeYear: function(newYear) {
		this.model.wait.start(this.get_lang().server.changeYear.label);
		this.model.serverEvent.unbind();
		this.model.serverEvent.bind($bind(this,this.onAnswerToChangeYear));
		this.model.toServer({ req : "changeYear", year : newYear});
	}
	,onAnswerToChangeYear: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		if(answ == "error") {
			var msg = e.result.msg;
			if(msg == "connectionIsNotOpenOrValid") {
				this.saveOpenTextToBeWriting();
				this.alert(this.get_lang().error.server.connectionIsClose.label,$bind(this,this.doConnection));
			} else if(msg == "yearWriteError") this.alert(this.get_lang().error.server.changeYear.label); else this.alert(this.get_lang().error.server.unknownError.label);
		} else if(answ == "changeYearOk") {
			this.removeBissexDayEvent();
			this.view.removeBissexDay();
			this.model.removeBissexDay();
			this.model.set_currYear(Std.parseInt(e.result.currentYear.substr(0,4)));
			if(this.model.get_isCurrYearBissextile()) {
				this.model.createBissexDay();
				this.view.createBissexDay();
				this.createBissexDayEvent();
			}
			this.view.displayUserInfo();
			e.result = new net.flash_line.util.xml.XmlParser().parse(Xml.parse(e.result.xmldata));
			if(e.result.error != null) this.alert(this.get_lang().error.server.fatalRead.label); else this.model.storeMonthAndDayText(e.result);
		} else this.alert(this.get_lang().error.server.unknownError.label);
	}
	,askToWriteOneDayText: function(day) {
		this.model.wait.start(this.get_lang().server.writeOneDayText.label);
		this.model.serverWriteDayEvent.bind($bind(this,this.onAnswerToWriteOneDayText));
		this.model.save.currUserId = this.model.currUserId;
		this.model.toServer({ req : "writeDay", day : day.get_key(), txt : day.get_textContent()},"writeDay");
	}
	,onAnswerToWriteOneDayText: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		var msg = e.result.msg;
		if(answ == "error") {
			var msg1 = e.result.msg;
			if(msg1 == "connectionIsNotOpenOrValid") {
				this.model.serverWriteDayEvent.unbind();
				this.saveOpenTextToBeWriting();
				this.doAutoReconnection();
			} else this.alert(this.get_lang().error.server.fatalWrite.label);
		} else if(answ == "writeDayOk") {
			this.model.save.days = [];
			this.model.save.currUserId = "";
		} else this.alert(this.get_lang().error.server.unknownError.label);
	}
	,askToWriteOneMonthText: function(month) {
		this.model.wait.start(this.get_lang().server.writeOneMonthText.label);
		this.model.serverWriteMonthEvent.bind($bind(this,this.onAnswerToWriteOneMonthText));
		this.model.save.currUserId = this.model.currUserId;
		this.model.toServer({ req : "writeMonth", month : month.get_key(), txt : month.get_textContent()},"writeMonth");
	}
	,onAnswerToWriteOneMonthText: function(e) {
		this.model.wait.stop();
		var answ = e.result.answ;
		var msg = e.result.msg;
		if(answ == "error") {
			var msg1 = e.result.msg;
			if(msg1 == "connectionIsNotOpenOrValid") {
				this.saveOpenTextToBeWriting();
				this.doAutoReconnection();
			} else this.alert(this.get_lang().error.server.fatalWrite.label);
		} else if(answ == "writeMonthOk") {
			this.model.save.months = [];
			this.model.save.currUserId = "";
		} else this.alert(this.get_lang().error.server.unknownError.label);
	}
	,initializeMonthAndDay: function(connected,dayOnly,readData) {
		if(dayOnly == null) dayOnly = false;
		if(connected == null) connected = true;
		var v = this.model.tree.month.list.item.length;
		var _g = 0;
		while(_g < v) {
			var monthIdx = _g++;
			var month = this.model.createOneMonth(monthIdx);
			this.view.createOneMonth(month);
			this.createOneMonthEvent(month,connected,dayOnly);
			net.flash_line.display.ElementExtender.show(month.openTextElem);
			if(readData != null) this.model.storeOneMonthText(readData,month);
			var _g2 = 0;
			var _g1 = month.get_maxDay();
			while(_g2 < _g1) {
				var dayIdx = _g2++;
				var day = month.createOneDay(dayIdx);
				month.createOneDaySkin(day);
				this.createOneDayEvent(day,connected);
				if(readData != null) this.model.storeOneDayText(readData,day);
			}
		}
	}
	,updateMonthAndDay: function(connected,dayOnly,readData) {
		if(dayOnly == null) dayOnly = false;
		if(connected == null) connected = true;
		var month;
		var _g = 0;
		var _g1 = this.model.monthChildren;
		while(_g < _g1.length) {
			var month1 = _g1[_g];
			++_g;
			this.createOneMonthEvent(month1,connected,dayOnly);
			month1.displayUpdate();
			if(readData != null) this.model.storeOneMonthText(readData,month1);
			var _g2 = 0;
			var _g3 = month1.dayChildren;
			while(_g2 < _g3.length) {
				var day = _g3[_g2];
				++_g2;
				this.createOneDayEvent(day,connected);
				day.clear();
				day.displayUpdate();
				if(readData != null) this.model.storeOneDayText(readData,day);
			}
		}
	}
	,disableMonthTextAndDay: function() {
		var month;
		if(net.flash_line.display.ElementExtender.hasLst(this.model.monthChildren[0].reactiveElem,"click",$bind(this,this.monthClick))) {
			var _g = 0;
			var _g1 = this.model.monthChildren;
			while(_g < _g1.length) {
				var month1 = _g1[_g];
				++_g;
				this.removeOneMonthTextEvent(month1);
				if(net.flash_line.display.ElementExtender.hasLst(month1.dayChildren[0].reactiveElem,"click",$bind(this,this.dayClick))) {
					var _g2 = 0;
					var _g3 = month1.dayChildren;
					while(_g2 < _g3.length) {
						var day = _g3[_g2];
						++_g2;
						this.removeOneDayEvent(day);
						day.close();
						day.showFullNameOnTop();
					}
				}
			}
		}
	}
	,areThereNotSavedOpenTexts: function() {
		var b = false;
		var _g = 0;
		var _g1 = this.model.monthChildren;
		while(_g < _g1.length) {
			var month = _g1[_g];
			++_g;
			if(month.get_isTextAreaOpen() && month.get_hasBeenModified()) {
				b = true;
				break;
			}
			var _g2 = 0;
			var _g3 = month.dayChildren;
			while(_g2 < _g3.length) {
				var day = _g3[_g2];
				++_g2;
				if(day.get_isOpen() && day.get_hasBeenModified()) {
					b = true;
					break;
				}
			}
		}
		return b;
	}
	,saveOpenTextToBeWriting: function() {
		var _g = 0;
		var _g1 = this.model.monthChildren;
		while(_g < _g1.length) {
			var month = _g1[_g];
			++_g;
			if(month.get_isTextAreaOpen() && month.get_hasBeenModified()) {
				month.storeText();
				this.model.save.months.push(month);
			}
			var _g2 = 0;
			var _g3 = month.dayChildren;
			while(_g2 < _g3.length) {
				var day = _g3[_g2];
				++_g2;
				if(day.get_isOpen() && day.get_hasBeenModified()) {
					day.storeText();
					this.model.save.days.push(day);
				}
			}
		}
	}
	,saveUserEmail: function() {
		this.model.promptBox.open(this.get_lang().message.userMailPrompt.label,$bind(this,this.onUserMailPrompt));
	}
	,onUserMailPrompt: function(v) {
		if(this.strVal(v,"") != "") this.askSendUserMail(v);
	}
	,startNewDelay: function(noDelay) {
		if(noDelay == null) noDelay = false;
		if(noDelay) this.onDelay(null);
		if(this.delay != null) this.delay.disable();
		this.delay = new net.flash_line.event.timing.Delay($bind(this,this.onDelay),this.numVal(this.model.tree.server.dataSaveDelay,180));
	}
	,createLoginViewEvent: function() {
		net.flash_line.display.ElementExtender.addLst(this.view.get_signInCancel(),"click",$bind(this,this.cancelLoginClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_signUpCancel(),"click",$bind(this,this.cancelLoginClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_signInValid(),"click",$bind(this,this.validLoginSignInClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_signUpValid(),"click",$bind(this,this.validLoginSignUpClick));
	}
	,createChangeYearViewEvent: function() {
		net.flash_line.display.ElementExtender.addLst(this.view.get_changeYearCancel(),"click",$bind(this,this.cancelChangeYearClick));
		net.flash_line.display.ElementExtender.addLst(this.view.get_changeYearValid(),"click",$bind(this,this.validChangeYearClick));
	}
	,createOneMonthEvent: function(month,connected,dayOnly) {
		if(dayOnly == null) dayOnly = false;
		if(connected == null) connected = true;
		if(!dayOnly) {
			if(!net.flash_line.display.ElementExtender.hasLst(month.reactiveElem,"click")) net.flash_line.display.ElementExtender.addLst(month.reactiveElem,"click",$bind(this,this.monthClick),null,month);
		}
		if(connected) {
			if(!net.flash_line.display.ElementExtender.hasLst(month.openTextElem,"click")) {
				net.flash_line.display.ElementExtender.addLst(month.openTextElem,"click",$bind(this,this.openMonthTextClick),null,month);
				net.flash_line.display.ElementExtender.addLst(month.get_clearButton(),"click",$bind(this,this.monthTextClearClick),null,month);
				net.flash_line.display.ElementExtender.addLst(month.get_cancelButton(),"click",$bind(this,this.monthTextCancelClick),null,month);
				net.flash_line.display.ElementExtender.addLst(month.get_validButton(),"click",$bind(this,this.monthTextValidClick),null,month);
			}
			net.flash_line.display.ElementExtender.show(month.openTextElem);
		} else net.flash_line.display.ElementExtender.hide(month.openTextElem);
	}
	,createOneDayEvent: function(day,connected) {
		if(connected == null) connected = true;
		if(connected) {
			if(!net.flash_line.display.ElementExtender.hasLst(day.reactiveElem,"click")) {
				net.flash_line.display.ElementExtender.addLst(day.reactiveElem,"click",$bind(this,this.dayClick),null,day);
				net.flash_line.display.ElementExtender.addLst(day.reactiveElem,"mouseover",$bind(this,this.dayOver),null,day);
				net.flash_line.display.ElementExtender.addLst(day.reactiveElem,"mouseout",$bind(this,this.dayOut),null,day);
				net.flash_line.display.ElementExtender.addLst(day.get_clearButton(),"click",$bind(this,this.clearClick),null,day);
				net.flash_line.display.ElementExtender.addLst(day.get_cancelButton(),"click",$bind(this,this.cancelClick),null,day);
				net.flash_line.display.ElementExtender.addLst(day.get_validButton(),"click",$bind(this,this.validClick),null,day);
			}
		} else day.showFullNameOnTop();
	}
	,createBissexDayEvent: function() {
		if(this.model.get_isMonthAndDayCreated()) {
			var day = this.model.getMonth(2).getDay(29);
			if(day != null) {
				if(!net.flash_line.display.ElementExtender.hasLst(day.reactiveElem,"click",$bind(this,this.dayClick))) this.createOneDayEvent(day);
			}
		}
	}
	,removeOneMonthTextEvent: function(month) {
		net.flash_line.display.ElementExtender.removeLst(month.get_clearButton(),"click",$bind(this,this.monthTextClearClick));
		net.flash_line.display.ElementExtender.removeLst(month.get_cancelButton(),"click",$bind(this,this.monthTextCancelClick));
		net.flash_line.display.ElementExtender.removeLst(month.get_validButton(),"click",$bind(this,this.monthTextValidClick));
		net.flash_line.display.ElementExtender.removeLst(month.openTextElem,"click",$bind(this,this.openMonthTextClick));
		net.flash_line.display.ElementExtender.hide(month.openTextElem);
		month.closeTextArea();
	}
	,removeOneDayEvent: function(day) {
		net.flash_line.display.ElementExtender.removeLst(day.reactiveElem,"click",$bind(this,this.dayClick));
		net.flash_line.display.ElementExtender.removeLst(day.reactiveElem,"mouseover",$bind(this,this.dayOver));
		net.flash_line.display.ElementExtender.removeLst(day.reactiveElem,"mouseout",$bind(this,this.dayOut));
		net.flash_line.display.ElementExtender.removeLst(day.get_clearButton(),"click",$bind(this,this.clearClick));
		net.flash_line.display.ElementExtender.removeLst(day.get_cancelButton(),"click",$bind(this,this.cancelClick));
		net.flash_line.display.ElementExtender.removeLst(day.get_validButton(),"click",$bind(this,this.validClick));
	}
	,removeBissexDayEvent: function() {
		if(this.model.get_isMonthAndDayCreated()) {
			var day = this.model.getMonth(2).getDay(29);
			if(day != null) {
				if(net.flash_line.display.ElementExtender.hasLst(day.reactiveElem,"click",$bind(this,this.dayClick))) this.removeOneDayEvent(day);
			}
		}
	}
	,onDelay: function(d) {
		var i = 0;
		var m = 0;
		if(!this.model.simpleCalendarUsing && this.model.currUserId != null) {
			var _g = 0;
			var _g1 = this.model.monthChildren;
			while(_g < _g1.length) {
				var month = _g1[_g];
				++_g;
				if(month.get_isTextAreaOpen() && month.get_hasBeenModified()) {
					m++;
					this.doValidMonthTextClick(month);
				}
				var _g2 = 0;
				var _g3 = month.dayChildren;
				while(_g2 < _g3.length) {
					var day = _g3[_g2];
					++_g2;
					if(day.get_isOpen() && day.get_hasBeenModified()) {
						i++;
						this.doValidClick(day);
					}
				}
			}
			if(i > 0) {
				this.model.serverWriteDayEvent.unbind();
				this.model.serverWriteDayEvent.bind($bind(this,this.onAnswerToWriteOneDayText));
			}
			if(m > 0) {
				this.model.serverWriteMonthEvent.unbind();
				this.model.serverWriteMonthEvent.bind($bind(this,this.onAnswerToWriteOneMonthText));
			}
		}
	}
	,onServerActived: function(e) {
		this.startNewDelay();
	}
	,cancelLoginClick: function(e) {
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.view.get_signInValid());
		e.preventDefault();
		net.flash_line.display.ElementExtender.hide(this.view.get_changeYear());
		net.flash_line.display.ElementExtender.hide(this.view.get_refresh());
		if(!this.model.get_isMonthAndDayCreated()) this.initializeMonthAndDay(this.connected(false));
		this.model.simpleCalendarUsing = true;
		this.view.doLayoutResponsive();
		this.view.hideConnectView();
		return false;
	}
	,validLoginSignInClick: function(e) {
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.view.get_signInValid());
		e.preventDefault();
		var str = this.model.isValidSignInInput(this.view.get_signInNameInput().value,this.view.get_signInPwdInput().value);
		if(str != "") this.alert(str,$bind(this,this.onErrorCallBackValidLoginSignIn)); else {
			this.askOpenConnection(this.view.get_signInNameInput().value,this.view.get_signInPwdInput().value);
			this.view.hideConnectView();
		}
		return false;
	}
	,onErrorCallBackValidLoginSignIn: function() {
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_signInValid(),[this.view.get_signInCancel(),this.view.get_signUpValid(),this.view.get_signUpCancel()]);
	}
	,validLoginSignUpClick: function(e) {
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.view.get_signInValid());
		e.preventDefault();
		var str = this.model.isValidSignUpInput(this.view.get_signUpNameInput().value,this.view.get_signUpPwdInput().value,this.view.get_signUpConfirmInput().value);
		if(str != "") this.alert(str,$bind(this,this.onErrorCallBackValidLoginSignUp)); else {
			this.askLoginCreation(this.view.get_signUpNameInput().value,this.view.get_signUpPwdInput().value);
			this.view.hideConnectView();
		}
		return false;
	}
	,onErrorCallBackValidLoginSignUp: function() {
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_signUpValid(),[this.view.get_signInCancel(),this.view.get_signInValid(),this.view.get_signUpCancel()]);
	}
	,connectionClick: function(e) {
		this.doConnection();
		return false;
	}
	,doAutoReconnection: function() {
		var o = this.model.readUserCookie();
		if(o.id != null && o.pwd != null) this.askOpenConnection(o.id,o.pwd); else this.doConnection();
	}
	,doConnection: function(withEnterOnSignUpValid) {
		if(withEnterOnSignUpValid == null) withEnterOnSignUpValid = false;
		this.model.wait.changeImage(this.model.baseUrl + Std.string(this.model.tree.wait.standard.src));
		var o = this.model.readUserCookie();
		this.view.showConnectView(this.strVal(o.id,""),this.strVal(o.pwd,""));
		if(withEnterOnSignUpValid) net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_signUpValid(),[this.view.get_signInCancel(),this.view.get_signInValid(),this.view.get_signUpCancel()]); else net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_signInValid(),[this.view.get_signInCancel(),this.view.get_signUpValid(),this.view.get_signUpCancel()]);
	}
	,deconnectClick: function(e) {
		if(!(this.get_isWindowsPhone() && this.view.get_isChangeYearViewOpen())) {
			var conf = this.model.confirmBox;
			if(this.areThereNotSavedOpenTexts()) {
				conf.open(this.get_lang().message.saveTextConfirm.label + this.get_lang().message.logOutConfirm.label,$bind(this,this.confirmLogOut));
				net.flash_line.display.ElementExtender.joinEnterKeyToClick(conf.cancelElem,[conf.validElem]);
			} else this.confirmLogOut(this.confirmWithOutSave(true),conf);
		}
		return false;
	}
	,confirmLogOut: function(logOutWithoutSave,conf) {
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(conf.cancelElem);
		if(logOutWithoutSave) {
			this.model.wait.changeImage(this.model.baseUrl + Std.string(this.model.tree.wait.logOut.src));
			this.askLogOut();
		} else this.startNewDelay(this.isWithOutDelay(true));
	}
	,safeModeClick: function(e) {
		if(this.model.get_isSafeMode()) this.model.setSafeMode(false); else this.model.setSafeMode(true);
		this.view.changeSafeModeLabel();
		this.view.hideChangeYearView();
		return false;
	}
	,refreshClick: function(e) {
		window.location.reload();
	}
	,changeYearClick: function(e) {
		this.doChangeYear();
		return false;
	}
	,doChangeYear: function() {
		if(this.strVal(net.flash_line.display.ElementExtender.getText(this.view.get_changeYearInput()),"") == "") net.flash_line.display.ElementExtender.setText(this.view.get_changeYearInput(),this.strVal(this.model.get_currYear(),""));
		net.flash_line.display.ElementExtender.setText(this.view.get_changeYearCurrent(),this.strVal(this.model.get_currYear(),""));
		this.view.showChangeYearView();
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_changeYearValid(),[this.view.get_changeYearCancel(),this.view.get_safeMode()]);
	}
	,cancelChangeYearClick: function(e) {
		e.preventDefault();
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.view.get_changeYearValid());
		this.view.hideChangeYearView();
		return false;
	}
	,validChangeYearClick: function(e) {
		e.preventDefault();
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.view.get_changeYearValid());
		var str = this.model.isValidYearInput(this.view.get_changeYearInput().value);
		if(str != "") this.alert(str,$bind(this,this.onErrorCallBackValidChangeYear)); else {
			var newYear = this.view.get_changeYearInput().value;
			if(Std.parseInt(newYear) != this.model.get_currYear()) {
				this.model.save.currYear = newYear;
				var conf = this.model.confirmBox;
				if(this.areThereNotSavedOpenTexts()) {
					conf.open(this.get_lang().message.saveTextConfirm.label + this.get_lang().message.changeYearConfirm.label,$bind(this,this.confirmChangeYear));
					net.flash_line.display.ElementExtender.joinEnterKeyToClick(conf.cancelElem,[conf.validElem]);
				} else this.confirmChangeYear(this.confirmWithOutSave(true),conf);
			} else this.view.hideChangeYearView();
		}
		return false;
	}
	,confirmChangeYear: function(changeYearWithoutSave,conf) {
		this.view.hideChangeYearView();
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(conf.cancelElem);
		if(!changeYearWithoutSave) this.startNewDelay(this.isWithOutDelay(true));
		this.askToChangeYear(this.model.save.currYear);
		this.model.save.currYear = "";
	}
	,onErrorCallBackValidChangeYear: function() {
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.view.get_changeYearValid(),[this.view.get_changeYearCancel(),this.view.get_safeMode()]);
	}
	,skinResize: function(e) {
		this.view.doLayoutResponsive();
		return false;
	}
	,monthClick: function(e,month) {
		month.set_wasOneTimeUsed(true);
		this.model.wasOneTimeUsed = true;
		if(month.get_isOpen()) {
			var _g = 0;
			var _g1 = month.dayChildren;
			while(_g < _g1.length) {
				var day = _g1[_g];
				++_g;
				if(day.get_isOpen()) this.doValidClick(day);
			}
			month.restoreScroll();
			month.close();
		} else {
			month.open();
			month.scrollToTop();
		}
		return false;
	}
	,openMonthTextClick: function(e,month) {
		this.model.wasOneTimeUsed = true;
		if(month.get_isTextAreaOpen()) {
			this.doValidMonthTextClick(month);
			month.restoreScroll();
			month.closeTextArea();
		} else {
			month.openTextArea();
			month.scrollToTop();
		}
		return false;
	}
	,monthTextClearClick: function(e,month) {
		month.clearText();
		return false;
	}
	,monthTextCancelClick: function(e,month) {
		month.displayText();
		month.restoreScroll();
		month.closeTextArea();
		return false;
	}
	,monthTextValidClick: function(e,month) {
		month.restoreScroll();
		month.closeTextArea();
		this.doValidMonthTextClick(month);
		return false;
	}
	,doValidMonthTextClick: function(month) {
		if(month.get_hasBeenModified()) {
			this.model.serverWriteMonthEvent.unbind();
			month.storeText();
			this.model.save.months.push(month);
			this.askToWriteOneMonthText(month);
		}
	}
	,dayClick: function(e,day) {
		this.model.wasOneTimeUsed = true;
		if(day.get_isOpen()) {
			this.doValidClick(day);
			day.restoreScroll();
			day.close();
		} else {
			day.open();
			day.scrollToTop();
		}
		return false;
	}
	,dayOver: function(e,day) {
		day.setColor("over");
		return false;
	}
	,dayOut: function(e,day) {
		day.setColor("out");
		return false;
	}
	,clearClick: function(e,day) {
		day.clearText();
		return false;
	}
	,cancelClick: function(e,day) {
		day.displayText();
		day.restoreScroll();
		day.close();
		return false;
	}
	,validClick: function(e,day) {
		day.restoreScroll();
		day.close();
		this.doValidClick(day);
		return false;
	}
	,doValidClick: function(day) {
		if(day.get_hasBeenModified()) {
			this.model.serverWriteDayEvent.unbind();
			day.storeText();
			this.model.save.days.push(day);
			this.askToWriteOneDayText(day);
		}
	}
	,get_lang: function() {
		return this.model.get_lang();
	}
	,confirmWithOutSave: function(b) {
		if(b == null) b = true;
		return b;
	}
	,connected: function(b) {
		if(b == null) b = true;
		return b;
	}
	,dayOnly: function(b) {
		if(b == null) b = true;
		return b;
	}
	,isWithOutDelay: function(b) {
		if(b == null) b = true;
		return b;
	}
	,__class__: calendar.Controler
	,__properties__: $extend(net.flash_line.util.Common.prototype.__properties__,{get_lang:"get_lang"})
});
calendar.Day = function(idx,m,mp) {
	this.index = idx;
	this.monthParent = mp;
	this.model = m;
	this.lang = this.model.get_lang();
	this._isOpen = false;
};
calendar.Day.__name__ = true;
calendar.Day.__super__ = net.flash_line.util.Common;
calendar.Day.prototype = $extend(net.flash_line.util.Common.prototype,{
	displayInit: function(dayContainer) {
		this.skinElem = dayContainer;
		this.reactiveElem = net.flash_line.display.ElementExtender.elemBy(this.skinElem,"dayTop");
		var str;
		var _this = Std.string(100 + this.get_number());
		str = HxOverrides.substr(_this,1,null);
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"abbrev").innerHTML = str + " " + this.get_abbrev();
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"clear").innerHTML = this.lang.button.clear.label;
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"cancel").innerHTML = this.lang.button.cancel.label;
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"valid").innerHTML = this.lang.button.valid.label;
		this.displayIfToday();
		this.displayIfSunday();
	}
	,displayUpdate: function() {
		var str;
		var _this = Std.string(100 + this.get_number());
		str = HxOverrides.substr(_this,1,null);
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"abbrev").innerHTML = str + " " + this.get_abbrev();
		this.displayIfToday();
		this.displayIfSunday();
	}
	,clear: function() {
		this._date = null;
	}
	,scrollToTop: function() {
		this.oy = Std["int"](net.flash_line.display.ElementExtender.positionInWindow(this.skinElem).get_y());
		this.ry = window.pageYOffset;
		if(this.oy > 0) {
			if(this.get_isMobile()) new net.flash_line._api.motion.BTween(window.scrollY,this.oy + window.scrollY,1,$bind(this,this.onLoopScrollToTop)); else new net.flash_line._api.motion.BTween(window.pageYOffset,this.oy,1,$bind(this,this.onLoopScrollToTop));
		} else this.ry = null;
		if(this.ry != null) {
			var sy = this.ry;
			var _g = 0;
			var _g1 = this.monthParent.dayChildren;
			while(_g < _g1.length) {
				var d = _g1[_g];
				++_g;
				d.ry = null;
			}
			this.ry = sy;
		}
	}
	,restoreScroll: function() {
		if(this.ry != null) new net.flash_line._api.motion.BTween(window.pageYOffset,this.ry,.5,$bind(this,this.onLoopScrollToTop));
		var _g = 0;
		var _g1 = this.monthParent.dayChildren;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			d.ry = null;
		}
	}
	,show: function() {
		this.skinElem.style.display = "block";
	}
	,hide: function() {
		this.skinElem.style.display = "none";
	}
	,open: function() {
		this.showFullNameOnTop();
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"textContainer").style.display = "block";
		this._isOpen = true;
	}
	,close: function() {
		this.restoreTextOnTop();
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"textContainer").style.display = "none";
		this._isOpen = false;
	}
	,clearText: function() {
		(js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value = "";
	}
	,displayText: function() {
		(js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value = this.get_textContent();
	}
	,storeText: function() {
		this.set_textContent((js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value);
	}
	,showFullNameOnTop: function() {
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"textBegin").innerHTML = this.get_fullName();
		this.setOutColor();
	}
	,restoreTextOnTop: function() {
		net.flash_line.display.ElementExtender.elemBy(this.skinElem,"textBegin").innerHTML = (js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value;
		this.setOutColor();
	}
	,setColor: function(state) {
		var c;
		var p = this.model.tree;
		if(state == "over") {
			c = p.month.list.item[this.monthParent.index].overColor;
			if(c == null) c = p.month.overColor;
			net.flash_line.display.ElementExtender.setColor(net.flash_line.display.ElementExtender.elemBy(this.reactiveElem,"abbrev"),c);
			net.flash_line.display.ElementExtender.setColor(net.flash_line.display.ElementExtender.elemBy(this.reactiveElem,"textBegin"),c);
		} else this.setOutColor();
	}
	,setOutColor: function() {
		var el = net.flash_line.display.ElementExtender.elemBy(this.reactiveElem,"textBegin");
		var v = (js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value;
		var c = "#000000";
		if(new EReg(this.model.tree.month.emphasisRegExp,"i").match(v)) c = this.model.tree.month.emphasisColor;
		net.flash_line.display.ElementExtender.setColor(net.flash_line.display.ElementExtender.elemBy(this.reactiveElem,"abbrev"),c);
		net.flash_line.display.ElementExtender.setColor(el,c);
	}
	,toString: function() {
		var str = "\n";
		if(this.model.languageIs("en")) str += "index=" + this.index + " :" + this.get_month() + "/" + this.get_number() + "/" + this.get_year() + ". " + this.get_abbrev() + "/" + this.get_name() + "\n"; else str += "index=" + this.index + " :" + this.get_number() + "/" + this.get_month() + "/" + this.get_year() + ". " + this.get_abbrev() + "/" + this.get_name() + "\n";
		return str;
	}
	,onLoopScrollToTop: function(e) {
		if(e.type == "end") e.target.clear(); else window.scrollTo(0,e.value);
	}
	,displayIfToday: function() {
		if(this.get_decimalDate() == this.model.get_today()) net.flash_line.display.ElementExtender.elemBy(this.skinElem,"dayType").style.backgroundColor = this.model.tree.today.color; else net.flash_line.display.ElementExtender.elemBy(this.skinElem,"dayType").style.backgroundColor = "";
	}
	,displayIfSunday: function() {
		if(this.get_date().getDay() == 0) {
			if(this.get_isSafari()) {
				var c;
				var _this = this.monthParent.get_color();
				c = HxOverrides.substr(_this,1,null);
				var str = "";
				var $it0 = new net.flash_line.util.StepIterator(0,6,2);
				while( $it0.hasNext() ) {
					var i = $it0.next();
					var h = this.addHex(HxOverrides.substr(c,i,2),"44");
					if(h.length > 2) str += "ff"; else str += h;
				}
				this.skinElem.style.backgroundColor = "#" + str;
			} else this.skinElem.style.background = "linear-gradient(to right, " + this.monthParent.get_color() + ", white)";
			this.skinElem.style.paddingTop = "2px";
			this.skinElem.style.paddingBottom = "2px";
		} else {
			this.skinElem.style.background = this.model.tree.month.backgroundColor;
			this.skinElem.style.backgroundColor = this.model.tree.month.backgroundColor;
			this.skinElem.style.paddingTop = "0px";
			this.skinElem.style.paddingBottom = "0px";
		}
	}
	,get_name: function() {
		var arr = this.lang.day.list.item;
		var v = this.get_date().getDay();
		return arr[v].label;
	}
	,get_fullName: function() {
		var v = this.get_name() + " " + this.get_number() + " " + this.monthParent.get_abbrev();
		if(this.model.languageIs("en")) v = this.get_name() + " " + this.monthParent.get_abbrev() + " " + this.get_number();
		return v;
	}
	,get_abbrev: function() {
		var v = this.get_date().getDay();
		var str = this.lang.day.abbrev.substr(v,1);
		if(this.model.languageIs("en") && v == 0) str += "u";
		return str;
	}
	,get_key: function() {
		var str;
		var _this = Std.string(100 + this.get_number());
		str = HxOverrides.substr(_this,1,3);
		return this.monthParent.get_key() + str;
	}
	,get_date: function() {
		if(this._date == null) this._date = new Date(this.get_year(),this.get_month() - 1,this.get_number(),0,0,0);
		return this._date;
	}
	,get_decimalDate: function() {
		return this.get_date().getFullYear() * 10000 + (this.get_date().getMonth() + 1) * 100 + this.get_date().getDate();
	}
	,get_year: function() {
		var v = null;
		if(this.monthParent != null) v = this.monthParent.get_year(); else haxe.Log.trace("f::" + Std.string(this.lang.error.fatal.monthMissing.label),{ fileName : "Day.hx", lineNumber : 341, className : "calendar.Day", methodName : "get_year"});
		return v;
	}
	,get_month: function() {
		var v = null;
		if(this.monthParent != null) v = this.monthParent.get_number(); else haxe.Log.trace("f::" + Std.string(this.lang.error.fatal.monthMissing.label),{ fileName : "Day.hx", lineNumber : 349, className : "calendar.Day", methodName : "get_month"});
		return v;
	}
	,get_number: function() {
		return this.index + 1;
	}
	,get_isOpen: function() {
		return this._isOpen;
	}
	,get_hasBeenModified: function() {
		return this.get_textContent() != (js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.skinElem,"textarea") , HTMLTextAreaElement)).value;
	}
	,get_textContent: function() {
		return this.strVal(this._textContent,"");
	}
	,set_textContent: function(v) {
		this._textContent = this.strVal(v,"");
		return this._textContent;
	}
	,get_clearButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.skinElem,"clear");
	}
	,get_cancelButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.skinElem,"cancel");
	}
	,get_validButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.skinElem,"valid");
	}
	,__class__: calendar.Day
	,__properties__: $extend(net.flash_line.util.Common.prototype.__properties__,{get_hasBeenModified:"get_hasBeenModified",get_isOpen:"get_isOpen",get_key:"get_key",get_fullName:"get_fullName",get_name:"get_name",get_abbrev:"get_abbrev",get_decimalDate:"get_decimalDate",get_date:"get_date",get_year:"get_year",get_month:"get_month",get_number:"get_number",set_textContent:"set_textContent",get_textContent:"get_textContent",get_validButton:"get_validButton",get_cancelButton:"get_cancelButton",get_clearButton:"get_clearButton"})
});
calendar.ErrorAlert = function(el,txElem,bElem,stEl) {
	this.ctnrElem = el;
	this.subTitleElem = stEl;
	this.textElem = txElem;
	this.validElem = bElem;
	net.flash_line.display.ElementExtender.setReadOnly(txElem);
	this.enable();
};
calendar.ErrorAlert.__name__ = true;
calendar.ErrorAlert.prototype = {
	enable: function() {
		net.flash_line.display.ElementExtender.addLst(this.validElem,"click",$bind(this,this.onValid),false);
		this.alertFunction = $bind(this,this.display);
		net.flash_line.util.ApiCommon.alertFunction = $bind(this,this.display);
	}
	,disable: function() {
		net.flash_line.display.ElementExtender.removeLst(this.validElem,"click",$bind(this,this.onValid),false);
		this.alertFunction = null;
		net.flash_line.util.ApiCommon.alertFunction = null;
		this.ctnrElem.style.visibility = "hidden";
	}
	,onValid: function(e) {
		e.preventDefault();
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.validElem);
		this.ctnrElem.style.visibility = "hidden";
		if(this.callBack != null) {
			this.callBack();
			this.callBack = null;
		}
	}
	,display: function(v,cb,subTitle) {
		if(v == null) v = "";
		if(subTitle != null) this.subTitleElem.innerHTML = "<b>" + subTitle + "</b>";
		this.callBack = cb;
		this.ctnrElem.style.visibility = "visible";
		this.textElem.innerHTML = v;
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.validElem);
	}
	,__class__: calendar.ErrorAlert
};
net.flash_line.util.xml = {};
net.flash_line.util.xml.XmlParser = function() {
};
net.flash_line.util.xml.XmlParser.__name__ = true;
net.flash_line.util.xml.XmlParser.get = function(url,onDone,onError) {
	var xmp = new net.flash_line.util.xml.XmlParser();
	if(onError != null) xmp.onError = onError;
	return xmp.load(url,onDone);
};
net.flash_line.util.xml.XmlParser.__super__ = net.flash_line.util.ApiCommon;
net.flash_line.util.xml.XmlParser.prototype = $extend(net.flash_line.util.ApiCommon.prototype,{
	onLoad: function(xml,xmp) {
	}
	,onParse: function(tree,xmp) {
	}
	,onError: function(msg) {
	}
	,load: function(url,onDone,autoParse) {
		if(autoParse == null) autoParse = true;
		this.autoParse = autoParse;
		if(onDone != null) {
			if(autoParse) this.onParse = onDone; else this.onLoad = onDone;
		}
		var r = new haxe.Http(url);
		r.onError = $bind(this,this.onLoadError);
		r.onData = $bind(this,this.onLoadData);
		r.request(false);
		return this;
	}
	,parse: function(x) {
		x = x.firstElement();
		this.tree = new net.flash_line.util.Object();
		this.parseNode(x,this.tree);
		return this.tree;
	}
	,onLoadData: function(result) {
		try {
			Xml.parse(result);
		} catch( e ) {
			haxe.Log.trace("f:: xml content isn't valid ",{ fileName : "XmlParser.hx", lineNumber : 139, className : "net.flash_line.util.xml.XmlParser", methodName : "onLoadData"});
		}
		this.xml = Xml.parse(result);
		if(this.autoParse) this.onParse(this.parse(this.xml),this);
		this.onLoad(this.xml,this);
	}
	,onLoadError: function(msg) {
		this.onError(msg);
		haxe.Log.trace("f:: xml file doesn't exists => " + msg,{ fileName : "XmlParser.hx", lineNumber : 147, className : "net.flash_line.util.xml.XmlParser", methodName : "onLoadError"});
	}
	,parseNode: function(xml,o) {
		if(xml.firstChild() != null) {
			if(xml.firstChild().nodeType == Xml.PCData) {
				var v = StringTools.trim(xml.firstChild().get_nodeValue());
				if(!this.empty(v)) o.set("value",v);
			}
		}
		var $it0 = xml.attributes();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			o.set(i,xml.get(i));
		}
		var oo;
		var $it1 = xml.elements();
		while( $it1.hasNext() ) {
			var i1 = $it1.next();
			if(o.get(i1.get_nodeName()) != null) {
				if(!((o.get(i1.get_nodeName()) instanceof Array) && o.get(i1.get_nodeName()).__enum__ == null)) {
					oo = o.get(i1.get_nodeName());
					o.set(i1.get_nodeName(),new Array());
					o.get(i1.get_nodeName()).push(oo);
				}
				oo = new net.flash_line.util.Object();
				o.get(i1.get_nodeName()).push(oo);
				this.parseNode(i1,oo);
			} else {
				o.set(i1.get_nodeName(),new net.flash_line.util.Object());
				this.parseNode(i1,o.get(i1.get_nodeName()));
			}
		}
	}
	,__class__: net.flash_line.util.xml.XmlParser
});
calendar.Language = function() {
	net.flash_line.util.xml.XmlParser.call(this);
};
calendar.Language.__name__ = true;
calendar.Language.__super__ = net.flash_line.util.xml.XmlParser;
calendar.Language.prototype = $extend(net.flash_line.util.xml.XmlParser.prototype,{
	__class__: calendar.Language
});
calendar.Model = function(lg,su,bu) {
	net.flash_line.util.xml.XmlParser.call(this);
	this.language = lg;
	this.monthChildren = [];
	this.serverEvent = new net.flash_line.event.EventSource();
	this.serverActived = new net.flash_line.event.EventSource();
	this.serverWriteDayEvent = new net.flash_line.event.EventSource();
	this.serverWriteMonthEvent = new net.flash_line.event.EventSource();
	this.save = { days : [], months : [], currUserId : "", currYear : ""};
	this.serverUrl = su;
	this.baseUrl = bu;
	this.wasOneTimeUsed = false;
};
calendar.Model.__name__ = true;
calendar.Model.__super__ = net.flash_line.util.xml.XmlParser;
calendar.Model.prototype = $extend(net.flash_line.util.xml.XmlParser.prototype,{
	languageIs: function(v) {
		if(v == null) v = "en";
		return this.get_lang().id == v;
	}
	,initServer: function() {
		if(this.httpStandardRequest == null) {
			this.httpStandardRequest = new haxe.Http(this.serverUrl);
			this.httpWriteDayRequest = new haxe.Http(this.serverUrl);
			this.httpWriteMonthRequest = new haxe.Http(this.serverUrl);
		}
	}
	,createOneMonth: function(idx) {
		this.monthChildren.push(new calendar.Month(idx,this));
		return net.flash_line.util.ArrayExtender.last(this.monthChildren);
	}
	,createBissexDay: function() {
		var month = this.getMonth(2);
		if(month.dayChildren.length < 29) {
			var day = new calendar.Day(28,this,month);
			month.dayChildren.push(day);
		}
	}
	,removeBissexDay: function() {
		if(this.getMonth(2).dayChildren.length == 29) this.getMonth(2).dayChildren.pop();
	}
	,getMonth: function(n) {
		if(n < 0 || n > 13) haxe.Log.trace("f::Invalid month index !",{ fileName : "Model.hx", lineNumber : 192, className : "calendar.Model", methodName : "getMonth"});
		return this.monthChildren[n];
	}
	,storeMonthAndDayText: function(o) {
		var _g = 0;
		var _g1 = this.monthChildren;
		while(_g < _g1.length) {
			var month = _g1[_g];
			++_g;
			month.displayUpdate();
			this.storeOneMonthText(o,month);
			var _g2 = 0;
			var _g3 = month.dayChildren;
			while(_g2 < _g3.length) {
				var day = _g3[_g2];
				++_g2;
				day.clear();
				day.displayUpdate();
				this.storeOneDayText(o,day);
			}
		}
	}
	,storeOneMonthText: function(o,month) {
		if(o.get("month_" + month.get_key()) != null) month.set_textContent(this.decodeXmlReserved(o.get("month_" + month.get_key()).value)); else month.set_textContent("");
		month.displayText();
	}
	,storeOneDayText: function(o,day) {
		if(o.get("day_" + day.get_key()) != null) day.set_textContent(this.decodeXmlReserved(o.get("day_" + day.get_key()).value)); else day.set_textContent("");
		day.displayText();
		if(day.get_isOpen()) day.showFullNameOnTop(); else day.restoreTextOnTop();
	}
	,writeUserCookie: function() {
		if(!this.get_isSafeMode()) {
			if(this.currCookieId != this.currUserId || this.currCookiePwd != this.currUserPwd) {
				var del = 31536000 * 1000;
				if(this.strVal(this.currUserId,"") != "") {
					js.Cookie.set("calendarId",this.currUserId,del);
					this.currCookieId = this.currUserId;
					if(this.strVal(this.currUserPwd,"") != "") {
						js.Cookie.set("calendarPwd",this.currUserPwd,del);
						this.currCookiePwd = this.currUserPwd;
					}
				}
			}
		}
	}
	,readUserCookie: function(b) {
		if(b == null) b = true;
		var o = new net.flash_line.util.Object({ currCookieId : null, currCookiePwd : null});
		if(!this.get_isSafeMode()) {
			if(js.Cookie.exists("calendarId")) {
				this.currCookieId = js.Cookie.get("calendarId");
				this.currCookiePwd = js.Cookie.get("calendarPwd");
				o.id = this.currCookieId;
				o.pwd = this.currCookiePwd;
				this.currUserPwd = this.currCookiePwd;
			} else if(b) {
				if(this.strVal(this.currUserId,"") != "") {
					this.writeUserCookie();
					o = this.readUserCookie(false);
				}
			}
		}
		return o;
	}
	,setSafeMode: function(isSafe) {
		if(isSafe == null) isSafe = true;
		var del = 31536000 * 1000;
		if(isSafe) {
			if(js.Cookie.exists("calendarUnsafe")) js.Cookie.remove("calendarUnsafe");
			js.Cookie.remove("calendarId");
			js.Cookie.remove("calendarPwd");
			this.currCookieId = null;
			this.currCookiePwd = null;
		} else {
			if(!js.Cookie.exists("calendarUnsafe")) js.Cookie.set("calendarUnsafe","true",del);
			this.currCookieId = null;
			this.currCookiePwd = null;
			this.writeUserCookie();
		}
	}
	,toServer: function(o,type) {
		this.initServer();
		var httpRequest;
		if(type == "writeDay") {
			httpRequest = this.httpWriteDayRequest;
			httpRequest.onData = $bind(this,this.onServerWriteDayData);
		} else if(type == "writeMonth") {
			httpRequest = this.httpWriteMonthRequest;
			httpRequest.onData = $bind(this,this.onServerWriteMonthData);
		} else {
			httpRequest = this.httpStandardRequest;
			httpRequest.onData = $bind(this,this.onServerData);
		}
		httpRequest.onError = $bind(this,this.onServerError);
		if(o != null) {
			var arr = Reflect.fields(o);
			var _g1 = 0;
			var _g = arr.length;
			while(_g1 < _g) {
				var i = _g1++;
				httpRequest.setParameter(arr[i],Reflect.field(o,arr[i]));
			}
		}
		httpRequest.request(true);
		this.serverActived.dispatch(new net.flash_line.event.StandardEvent(this));
	}
	,isValidSignInInput: function(name,pwd) {
		var str = "";
		if(Std.parseInt(this.tree.login.idMinLen) > name.length || Std.parseInt(this.tree.login.idMaxLen) < name.length) str += Std.string(this.get_lang().error.idLengthNotValid.label) + "\n\n";
		if(Std.parseInt(this.tree.login.pwdMinLen) > pwd.length || Std.parseInt(this.tree.login.pwdMaxLen) < pwd.length) str += Std.string(this.get_lang().error.pwdLengthNotValid.label) + "\n\n";
		return str;
	}
	,isValidSignUpInput: function(name,pwd,confirm) {
		var str = this.isValidSignInInput(name,pwd);
		if(pwd != confirm) str += Std.string(this.get_lang().error.pwdNotIdem.label) + "\n";
		return str;
	}
	,isValidYearInput: function(v) {
		var str = "";
		if(v.length != 4) str += Std.string(this.get_lang().error.yearNotValid.label) + "\n";
		return str;
	}
	,mailIsValid: function(v) {
		var r = new EReg("[A-Z0-9._%-]+@[A-Z0-9.-]+\\.[A-Z][A-Z][A-Z]?","i");
		return r.match(v);
	}
	,toString: function() {
		var str = "";
		str += "current year=" + this.get_currYear() + "\n";
		var _g = 0;
		var _g1 = this.monthChildren;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			str += i.toString();
		}
		return str;
	}
	,onServerData: function(data) {
		data = StringTools.trim(data);
		var e = new net.flash_line.event.StandardEvent(this,"","");
		if(HxOverrides.substr(data,0,5) == "<?xml") e.result = new net.flash_line.util.xml.XmlParser().parse(Xml.parse(data)); else e.result = net.flash_line.io.HttpExtender.getParameter(this.httpStandardRequest,data);
		this.serverEvent.dispatch(e);
	}
	,onServerWriteDayData: function(data) {
		data = StringTools.trim(data);
		var e = new net.flash_line.event.StandardEvent(this,"","");
		e.result = net.flash_line.io.HttpExtender.getParameter(this.httpWriteDayRequest,data);
		this.serverWriteDayEvent.dispatch(e);
	}
	,onServerWriteMonthData: function(data) {
		data = StringTools.trim(data);
		var e = new net.flash_line.event.StandardEvent(this,"","");
		e.result = net.flash_line.io.HttpExtender.getParameter(this.httpWriteMonthRequest,data);
		this.serverWriteMonthEvent.dispatch(e);
	}
	,onServerError: function(msg) {
		this.serverEvent.dispatch(new net.flash_line.event.StandardEvent(this,"error",msg));
		haxe.Log.trace("f::From server:\n" + msg,{ fileName : "Model.hx", lineNumber : 417, className : "calendar.Model", methodName : "onServerError"});
	}
	,set_currYear: function(v) {
		if(v < 0 || v > 9999) haxe.Log.trace("f::" + Std.string(this.get_lang().error.fatal.badYear.label),{ fileName : "Model.hx", lineNumber : 424, className : "calendar.Model", methodName : "set_currYear"});
		this._currYear = v;
		return v;
	}
	,get_currYear: function() {
		var v = 0;
		if(this._currYear != null) v = this._currYear; else v = new Date().getFullYear();
		return this.intVal(v);
	}
	,get_lang: function() {
		return this.language.tree;
	}
	,get_currMonthIndex: function() {
		var v = new Date().getMonth() + 1;
		if(new Date().getFullYear() == this.get_currYear() - 1) {
			if(v == 12) v = 0; else v = null;
		} else if(new Date().getFullYear() == this.get_currYear() + 1) {
			if(v == 1) v = 13; else v = null;
		} else if(new Date().getFullYear() != this.get_currYear()) v = null;
		return v;
	}
	,get_today: function() {
		var v = new Date();
		return v.getFullYear() * 10000 + (v.getMonth() + 1) * 100 + v.getDate();
	}
	,get_isLogInAfterTimeOut: function() {
		return this.strVal(this.save.currUserId,"") != "" && this.save.currUserId == this.currUserId;
	}
	,get_isMonthAndDayCreated: function() {
		return this.monthChildren != null && this.monthChildren.length != 0;
	}
	,get_isCurrYearBissextile: function() {
		return this.isBissextile(this.get_currYear());
	}
	,get_isSafeMode: function() {
		return !js.Cookie.exists("calendarUnsafe");
	}
	,__class__: calendar.Model
	,__properties__: {get_lang:"get_lang",get_currMonthIndex:"get_currMonthIndex",get_today:"get_today",set_currYear:"set_currYear",get_currYear:"get_currYear",get_isSafeMode:"get_isSafeMode",get_isCurrYearBissextile:"get_isCurrYearBissextile",get_isMonthAndDayCreated:"get_isMonthAndDayCreated",get_isLogInAfterTimeOut:"get_isLogInAfterTimeOut"}
});
calendar.Month = function(idx,m) {
	this.index = idx;
	this.model = m;
	this.lang = this.model.get_lang();
	this.dayChildren = [];
	this._isTextAreaOpen = false;
	this._isOpen = true;
	this._wasOneTimeUsed = false;
};
calendar.Month.__name__ = true;
calendar.Month.__super__ = net.flash_line.util.Common;
calendar.Month.prototype = $extend(net.flash_line.util.Common.prototype,{
	displayInit: function(monthContainer) {
		this.skinElem = monthContainer;
		this.monthElem = net.flash_line.display.ElementExtender.elemBy(this.skinElem,"month");
		this.reactiveElem = net.flash_line.display.ElementExtender.elemBy(this.monthElem,"name");
		this.reactiveElem.innerHTML = this.get_name();
		this.openTextElem = net.flash_line.display.ElementExtender.elemBy(this.monthElem,"open");
		this.get_clearButton().innerHTML = this.lang.button.clear.label;
		this.get_cancelButton().innerHTML = this.lang.button.cancel.label;
		this.get_validButton().innerHTML = this.lang.button.valid.label;
	}
	,displayUpdate: function() {
		this.reactiveElem.innerHTML = this.get_name();
	}
	,createOneDay: function(idx) {
		var day = new calendar.Day(idx,this.model,this);
		this.dayChildren.push(day);
		return day;
	}
	,createOneDaySkin: function(day) {
		var el = net.flash_line.display.ElementExtender.elemBy(this.skinElem,"day");
		var dayElem = net.flash_line.display.ElementExtender.clone(el,true);
		this.skinElem.appendChild(dayElem);
		dayElem.id = this.skinElem.id + "d" + day.index;
		day.displayInit(dayElem);
		if(day.index == this.get_maxDay() - 1) el.parentNode.removeChild(el);
		return dayElem;
	}
	,getDay: function(n) {
		if(n < 1 || n > this.dayChildren.length) return null; else return this.dayChildren[n - 1];
	}
	,scrollToTop: function() {
		this.oy = Std["int"](net.flash_line.display.ElementExtender.positionInWindow(this.skinElem).get_y());
		this.ry = window.pageYOffset;
		if(this.oy > 0) {
			if(this.get_isMobile()) new net.flash_line._api.motion.BTween(window.scrollY,this.oy + window.scrollY,1,$bind(this,this.onLoopScrollToTop)); else new net.flash_line._api.motion.BTween(window.pageYOffset,this.oy,1,$bind(this,this.onLoopScrollToTop));
		} else this.ry = null;
		if(this.ry != null) {
			var sy = this.ry;
			var _g = 0;
			var _g1 = this.model.monthChildren;
			while(_g < _g1.length) {
				var m = _g1[_g];
				++_g;
				m.ry = null;
			}
			this.ry = sy;
		}
	}
	,restoreScroll: function() {
		if(this.ry != null) new net.flash_line._api.motion.BTween(window.pageYOffset,this.ry,1,$bind(this,this.onLoopScrollToTop));
		var _g = 0;
		var _g1 = this.model.monthChildren;
		while(_g < _g1.length) {
			var m = _g1[_g];
			++_g;
			m.ry = null;
		}
	}
	,open: function() {
		var _g = 0;
		var _g1 = this.dayChildren;
		while(_g < _g1.length) {
			var day = _g1[_g];
			++_g;
			day.show();
		}
		this._isOpen = true;
	}
	,close: function() {
		var _g = 0;
		var _g1 = this.dayChildren;
		while(_g < _g1.length) {
			var day = _g1[_g];
			++_g;
			day.hide();
		}
		this._isOpen = false;
	}
	,openTextArea: function() {
		net.flash_line.display.ElementExtender.elemBy(this.monthElem,"textContainer").style.display = "block";
		this._isTextAreaOpen = true;
	}
	,closeTextArea: function() {
		net.flash_line.display.ElementExtender.elemBy(this.monthElem,"textContainer").style.display = "none";
		this._isTextAreaOpen = false;
	}
	,clearText: function() {
		this.setMonthTextPicto("");
		(js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.monthElem,"textarea") , HTMLTextAreaElement)).value = "";
	}
	,displayText: function() {
		this.setMonthTextPicto();
		(js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.monthElem,"textarea") , HTMLTextAreaElement)).value = this.get_textContent();
	}
	,storeText: function() {
		this.set_textContent((js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.monthElem,"textarea") , HTMLTextAreaElement)).value);
	}
	,toString: function() {
		var str = "\n";
		str += "index=" + this.index + " : [" + this.get_number() + "/" + this.get_year() + "]. " + "name=" + this.get_name() + "\n";
		str += "\n";
		var _g = 0;
		var _g1 = this.dayChildren;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			str += i.toString();
		}
		return str;
	}
	,onLoopScrollToTop: function(e) {
		if(e.type == "end") e.target.clear(); else window.scrollTo(0,e.value);
	}
	,get_name: function() {
		var arr = this.model.get_lang().month.list.item;
		var v = this.index;
		var ret = arr[v].label;
		if(this.index == 0 || this.index == 13) ret += " " + this.get_year();
		return ret;
	}
	,get_abbrev: function() {
		var arr = this.model.get_lang().month.abbrev.item;
		var v = this.index;
		var ret = arr[v].label;
		return ret;
	}
	,get_key: function() {
		return Std.string(this.get_year() * 100 + this.get_number());
	}
	,get_year: function() {
		var v = null;
		if(this.index == 0) v = this.model.get_currYear() - 1; else if(this.index == 13) v = this.model.get_currYear() + 1; else v = this.model.get_currYear();
		return v;
	}
	,get_maxDay: function() {
		var v = Std.parseInt(this.model.tree.month.list.item[this.index].maxDay);
		if(this.get_number() == 2 && this.isBissextile(this.get_year())) v++;
		return v;
	}
	,get_number: function() {
		var v = null;
		if(this.index == 0) v = 12; else if(this.index == 13) v = 1; else v = this.index;
		return v;
	}
	,get_color: function() {
		return this.model.tree.month.list.item[this.index].color;
	}
	,get_isTextAreaOpen: function() {
		return this._isTextAreaOpen;
	}
	,get_isOpen: function() {
		return this._isOpen;
	}
	,get_wasOneTimeUsed: function() {
		return this._wasOneTimeUsed;
	}
	,set_wasOneTimeUsed: function(v) {
		this._wasOneTimeUsed = v;
		return this._wasOneTimeUsed;
	}
	,get_hasBeenModified: function() {
		return this.get_textContent() != (js.Boot.__cast(net.flash_line.display.ElementExtender.elemByTag(this.monthElem,"textarea") , HTMLTextAreaElement)).value;
	}
	,get_textContent: function() {
		return this.strVal(this._textContent,"");
	}
	,set_textContent: function(v) {
		this._textContent = this.strVal(v,"");
		this.setMonthTextPicto();
		return this._textContent;
	}
	,setMonthTextPicto: function(v) {
		if(v == null) v = this.strVal(this._textContent,"");
		var img;
		img = js.Boot.__cast(this.openTextElem , HTMLImageElement);
		if(v == "") img.src = this.model.baseUrl + Std.string(this.model.tree.monthTextPostIt.empty.src); else img.src = this.model.baseUrl + Std.string(this.model.tree.monthTextPostIt.full.src);
	}
	,get_clearButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.monthElem,"clear");
	}
	,get_cancelButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.monthElem,"cancel");
	}
	,get_validButton: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.monthElem,"valid");
	}
	,__class__: calendar.Month
	,__properties__: $extend(net.flash_line.util.Common.prototype.__properties__,{set_wasOneTimeUsed:"set_wasOneTimeUsed",get_wasOneTimeUsed:"get_wasOneTimeUsed",get_isTextAreaOpen:"get_isTextAreaOpen",get_isOpen:"get_isOpen",get_hasBeenModified:"get_hasBeenModified",get_color:"get_color",get_maxDay:"get_maxDay",get_abbrev:"get_abbrev",get_key:"get_key",get_name:"get_name",get_year:"get_year",get_number:"get_number",set_textContent:"set_textContent",get_textContent:"get_textContent",get_validButton:"get_validButton",get_cancelButton:"get_cancelButton",get_clearButton:"get_clearButton"})
});
calendar.PromptBox = function(el,txElem,pElem,bElem) {
	this.ctnrElem = el;
	this.textElem = txElem;
	this.validElem = bElem;
	this.promptElem = pElem;
	net.flash_line.display.ElementExtender.setReadOnly(txElem);
	this.enable();
};
calendar.PromptBox.__name__ = true;
calendar.PromptBox.__super__ = net.flash_line.util.Common;
calendar.PromptBox.prototype = $extend(net.flash_line.util.Common.prototype,{
	enable: function() {
		net.flash_line.display.ElementExtender.addLst(this.validElem,"click",$bind(this,this.onValid),false);
		this.promptElem.value = "";
	}
	,disable: function() {
		net.flash_line.display.ElementExtender.removeLst(this.validElem,"click",$bind(this,this.onValid),false);
		this.callBack = null;
		this.close();
	}
	,open: function(v,cb) {
		this.ctnrElem.style.visibility = "visible";
		if(this.get_isPhone() && this.get_isFirefox()) this.makePopUpRelativeForFireFoxPhone(this.ctnrElem);
		this.textElem.innerHTML = v;
		net.flash_line.display.ElementExtender.joinEnterKeyToClick(this.validElem);
		this.callBack = cb;
	}
	,close: function() {
		this.ctnrElem.style.visibility = "hidden";
		this.textElem.innerHTML = "";
	}
	,onValid: function(e) {
		e.preventDefault();
		net.flash_line.display.ElementExtender.clearEnterKeyToClick(this.validElem);
		this.close();
		this.callBack(this.promptElem.value);
		return false;
	}
	,makePopUpRelativeForFireFoxPhone: function(el) {
		window.scrollTo(0,0);
		el.style.position = "absolute";
		el.style.top = "0px";
		el.style.height = Std.string(window.document.documentElement.scrollHeight) + "px";
	}
	,__class__: calendar.PromptBox
});
calendar.View = function(m,lg) {
	this.model = m;
	this.doc = window.document;
	this.language = lg;
	this.rootHtmlElement = this.elem("calendar");
};
calendar.View.__name__ = true;
calendar.View.__super__ = net.flash_line.util.Common;
calendar.View.prototype = $extend(net.flash_line.util.Common.prototype,{
	displayInit: function() {
		var el;
		var str = "";
		net.flash_line.display.ElementExtender.elemBy(this.elemBy("header"),"title").innerHTML = this.get_lang().title.label;
		net.flash_line.display.ElementExtender.elemBy(this.elemBy("header"),"valided").innerHTML = this.get_lang().valided.label;
		if(this.get_isMobile()) str = this.get_lang().advertisingForMobile.label; else str = this.get_lang().advertisingForComputer.label;
		net.flash_line.display.ElementExtender.elemBy(this.elemBy("header"),"advertising").innerHTML = str;
		this.displayInfoWhenNoUser();
		el = this.elem("loginView");
		net.flash_line.display.ElementExtender.elemBy(el,"title").innerHTML = this.get_lang().loginSkin.title.label;
		net.flash_line.display.ElementExtender.elemBy(el,"letSignIn ").innerHTML = "<b>" + Std.string(this.get_lang().loginSkin.letSignIn.label) + "</b>";
		net.flash_line.display.ElementExtender.elemBy(el,"signInName ").innerHTML = this.get_lang().loginSkin.signInName.label;
		net.flash_line.display.ElementExtender.elemBy(el,"signInPwd ").innerHTML = this.get_lang().loginSkin.signInPwd.label;
		net.flash_line.display.ElementExtender.child(this.get_signInDiv(),"signInCancel").innerHTML = this.get_lang().button.cancel.label;
		net.flash_line.display.ElementExtender.child(this.get_signInDiv(),"signInValid").innerHTML = this.get_lang().button.valid.label;
		net.flash_line.display.ElementExtender.elemBy(el,"letSignUp ").innerHTML = "<b>" + Std.string(this.get_lang().loginSkin.letSignUp.label) + "</b>";
		net.flash_line.display.ElementExtender.elemBy(el,"signUpName ").innerHTML = this.get_lang().loginSkin.signUpName.label;
		net.flash_line.display.ElementExtender.elemBy(el,"signUpPwd ").innerHTML = this.get_lang().loginSkin.signUpPwd.label;
		net.flash_line.display.ElementExtender.elemBy(el,"signUpConfirm ").innerHTML = this.get_lang().loginSkin.signUpConfirm.label;
		net.flash_line.display.ElementExtender.child(this.get_signUpDiv(),"signUpCancel").innerHTML = this.get_lang().button.cancel.label;
		net.flash_line.display.ElementExtender.child(this.get_signUpDiv(),"signUpValid").innerHTML = this.get_lang().button.valid.label;
		net.flash_line.display.ElementExtender.elemBy(el,"signUpChoose ").innerHTML = this.get_lang().loginSkin.signUpChoose.label;
		net.flash_line.display.ElementExtender.elemBy(el,"basicUsing").innerHTML = this.get_lang().loginSkin.basicUsing.label;
		el = this.elem("changeYearView");
		net.flash_line.display.ElementExtender.elemBy(el,"title").innerHTML = this.get_lang().changeYearSkin.title.label;
		this.changeSafeModeLabel();
		net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.elemBy(el,"yearCtnr"),"currYear").innerHTML = Std.string(this.model.get_currYear());
		net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.elemBy(el,"yearCtnr"),"subTitle").innerHTML = "<b>" + Std.string(this.get_lang().changeYearSkin.subTitle.label) + "</b>";
		net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.elemBy(el,"yearCtnr"),"year").innerHTML = this.get_lang().changeYearSkin.year.label;
		net.flash_line.display.ElementExtender.child(this.get_changeYearDiv(),"changeYearCancel").innerHTML = this.get_lang().button.cancel.label;
		net.flash_line.display.ElementExtender.child(this.get_changeYearDiv(),"changeYearValid").innerHTML = this.get_lang().button.valid.label;
	}
	,createOneMonth: function(month) {
		if(this.monthContainerProto == null) this.monthContainerProto = this.elemBy("monthContainerProto",this.elem("calendar"));
		var monthContainer = net.flash_line.display.ElementExtender.clone(this.monthContainerProto,true);
		this.elem("monthOuter").appendChild(monthContainer);
		monthContainer.setAttribute("class","monthContainer");
		monthContainer.id = "m" + month.index;
		month.displayInit(monthContainer);
		return monthContainer;
	}
	,createBissexDay: function() {
		if(window.document.getElementById("m2d28") == null) {
			var el = this.elem("m2d27");
			var dayElem = net.flash_line.display.ElementExtender.clone(el,true);
			this.elem("m2").appendChild(dayElem);
			dayElem.id = "m2d28";
			this.model.getMonth(2).getDay(29).displayInit(dayElem);
		}
	}
	,removeBissexDay: function() {
		var el = window.document.getElementById("m2d28");
		if(el != null) el.parentNode.removeChild(el);
	}
	,doLayoutResponsive: function() {
		var w = this.rootHtmlElement.clientWidth;
		var middleWidth = this.model.tree.layout.middleWidth;
		var narrowWidth = this.model.tree.layout.narrowWidth;
		var _g = 0;
		var _g1 = this.model.monthChildren;
		while(_g < _g1.length) {
			var month = _g1[_g];
			++_g;
			if(w < narrowWidth) month.skinElem.setAttribute("class","monthContainer" + " " + "maxWidthNarrowScreen"); else if(w < middleWidth) month.skinElem.setAttribute("class","monthContainer" + " " + "maxWidthMiddleScreen"); else month.skinElem.setAttribute("class","monthContainer" + " " + "maxWidthLargeScreen");
			if(!month.get_wasOneTimeUsed()) {
				if(this.model.get_currMonthIndex() == month.index) {
					month.open();
					if(!this.model.wasOneTimeUsed) {
						if(this.get_isSafari() && this.get_isPhone() && !this.get_isIphoneIpad()) this.model.wasOneTimeUsed = true;
						if(w < middleWidth || this.get_isMobile()) {
							var minIndexForFirstScrollToTop = this.intVal(this.model.tree.month.minIndexForFirstScrollToTop,2);
							if(month.index > minIndexForFirstScrollToTop) this.model.monthChildren[month.index - minIndexForFirstScrollToTop + 1].scrollToTop();
						} else window.scrollTo(0,0);
					}
				} else if(this.model.simpleCalendarUsing && w >= middleWidth) month.open(); else month.close();
			}
		}
	}
	,changeConnectLabel: function(v) {
		if(v == this.get_lang().button.connect.label) this.get_connection().style.backgroundColor = this.model.tree.button.logon.backgroundColor; else this.get_connection().style.backgroundColor = this.model.tree.button.logoff.backgroundColor;
	}
	,changeSafeModeLabel: function() {
		var str = "";
		var str2 = "";
		var str3 = "";
		var el;
		if(this.model.get_isSafeMode()) {
			str = this.get_lang().button.safeModeOff.label;
			str2 = this.get_lang().changeYearSkin.safeSubtitleOff.label;
			str3 = "#afa";
		} else {
			str = this.get_lang().button.safeModeOn.label;
			str2 = this.get_lang().changeYearSkin.safeSubtitleOn.label;
			str3 = "#faa";
		}
		el = net.flash_line.display.ElementExtender.elemBy(net.flash_line.display.ElementExtender.elemBy(this.elem("changeYearView"),"safeModeCtnr"),"subTitle");
		str2 = "<b>" + str2 + "</b>";
		this.get_safeMode().innerHTML = str;
		el.innerHTML = str2;
		el.style.backgroundColor = str3;
	}
	,showConnectView: function(id,pwd) {
		var el = this.elem("loginView");
		el.style.visibility = "visible";
		if(this.get_isPhone() && this.get_isFirefox()) this.makePopUpRelativeForFireFoxPhone(el);
		if(id != null) this.get_signInNameInput().value = id;
		if(pwd != null) this.get_signInPwdInput().value = pwd;
		this.get_signUpNameInput().value = "";
		this.get_signUpPwdInput().value = "";
		this.get_signUpConfirmInput().value = "";
	}
	,hideConnectView: function() {
		this.elem("loginView").style.visibility = "hidden";
	}
	,showChangeYearView: function() {
		this.changeSafeModeLabel();
		var el = this.elem("changeYearView");
		el.style.visibility = "visible";
		if(this.get_isPhone() && this.get_isFirefox()) this.makePopUpRelativeForFireFoxPhone(el);
	}
	,makePopUpRelativeForFireFoxPhone: function(el) {
		window.scrollTo(0,0);
		el.style.position = "absolute";
		el.style.top = "0px";
		el.style.height = Std.string(window.document.documentElement.scrollHeight) + "px";
	}
	,hideChangeYearView: function() {
		this.elem("changeYearView").style.visibility = "hidden";
	}
	,displayUserInfo: function() {
		this.get_current().innerHTML = Std.string(this.get_lang().currentUserInfo1.label) + "<span class=\"blue\" >" + Std.string(this.model.get_currYear()) + "</span>" + Std.string(this.get_lang().currentUserInfo2.label) + this.model.currUserId;
	}
	,displayInfoWhenNoUser: function() {
		this.get_current().innerHTML = Std.string(this.get_lang().noCurrent.label) + this.strVal(this.model.get_currYear(),"");
	}
	,get_lang: function() {
		return this.language.tree;
	}
	,get_safeMode: function() {
		return this.elem("safeMode");
	}
	,get_connection: function() {
		return this.elem("connection");
	}
	,get_changeYear: function() {
		return this.elem("changeYear");
	}
	,get_refresh: function() {
		return this.elem("refresh");
	}
	,get_current: function() {
		return this.elem("current");
	}
	,get_window: function() {
		return window;
	}
	,get_signInValid: function() {
		return this.elem("signInValid");
	}
	,get_signInCancel: function() {
		return this.elem("signInCancel");
	}
	,get_signUpCancel: function() {
		return this.elem("signUpCancel");
	}
	,get_signUpValid: function() {
		return this.elem("signUpValid");
	}
	,get_changeYearValid: function() {
		return this.elem("changeYearValid");
	}
	,get_changeYearCancel: function() {
		return this.elem("changeYearCancel");
	}
	,get_signInDiv: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.elem("loginView"),"signInDiv");
	}
	,get_signUpDiv: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.elem("loginView"),"signUpDiv");
	}
	,get_changeYearDiv: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.elem("changeYearView"),"changeYearDiv");
	}
	,get_signUpNameInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_signUpDiv(),"name");
	}
	,get_signInNameInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_signInDiv(),"name");
	}
	,get_signInPwdInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_signInDiv(),"pwd");
	}
	,get_signUpPwdInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_signUpDiv(),"pwd");
	}
	,get_signUpConfirmInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_signUpDiv(),"confirm");
	}
	,get_changeYearInput: function() {
		return net.flash_line.display.ElementExtender.childByName(this.get_changeYearDiv(),"year");
	}
	,get_changeYearCurrent: function() {
		return net.flash_line.display.ElementExtender.elemBy(this.elem("changeYearView"),"currYear");
	}
	,get_isChangeYearViewOpen: function() {
		return this.strVal(this.elem("changeYearView").style.visibility,"hidden") != "hidden";
	}
	,get_isLoginViewOpen: function() {
		return this.strVal(this.elem("loginView").style.visibility,"hidden") != "hidden";
	}
	,__class__: calendar.View
	,__properties__: $extend(net.flash_line.util.Common.prototype.__properties__,{get_isLoginViewOpen:"get_isLoginViewOpen",get_isChangeYearViewOpen:"get_isChangeYearViewOpen",get_changeYearCurrent:"get_changeYearCurrent",get_changeYearInput:"get_changeYearInput",get_signUpConfirmInput:"get_signUpConfirmInput",get_signUpPwdInput:"get_signUpPwdInput",get_signInPwdInput:"get_signInPwdInput",get_signInNameInput:"get_signInNameInput",get_signUpNameInput:"get_signUpNameInput",get_changeYearDiv:"get_changeYearDiv",get_signUpDiv:"get_signUpDiv",get_signInDiv:"get_signInDiv",get_changeYearValid:"get_changeYearValid",get_changeYearCancel:"get_changeYearCancel",get_signUpCancel:"get_signUpCancel",get_signUpValid:"get_signUpValid",get_signInValid:"get_signInValid",get_signInCancel:"get_signInCancel",get_window:"get_window",get_current:"get_current",get_refresh:"get_refresh",get_changeYear:"get_changeYear",get_safeMode:"get_safeMode",get_connection:"get_connection",get_lang:"get_lang"})
});
calendar.WaitView = function(el,te,ae,mo,ax) {
	this.ctnrElem = el;
	this.textElem = te;
	this.animElem = ae;
	this.movieElem = mo;
	if(ax != null) net.flash_line.display.ElementExtender.setRotationAxis(this.movieElem,ax);
	this.clock = new net.flash_line.event.timing.Clock($bind(this,this.loop),0.08);
	this.clock.pause();
};
calendar.WaitView.__name__ = true;
calendar.WaitView.__super__ = net.flash_line.util.ApiCommon;
calendar.WaitView.prototype = $extend(net.flash_line.util.ApiCommon.prototype,{
	start: function(v,img) {
		if(img != null) this.changeImage(img);
		this.clock.restart();
		if(v != null) this.set_text(v);
		this.ctnrElem.style.visibility = "visible";
		this.animElem.style.visibility = "visible";
	}
	,show: function(v,img) {
		if(img != null) this.changeImage(img);
		net.flash_line.display.ElementExtender.setRotation(this.movieElem,0);
		this.clock.pause();
		if(v != null) this.set_text(v);
		this.ctnrElem.style.visibility = "visible";
		this.animElem.style.visibility = "visible";
	}
	,stop: function() {
		this.clock.pause();
		this.ctnrElem.style.visibility = "hidden";
		this.animElem.style.visibility = "hidden";
	}
	,remove: function() {
		this.stop();
		this.clock.remove();
	}
	,changeImage: function(v) {
		(js.Boot.__cast(net.flash_line.display.ElementExtender.elemBy(this.movieElem,"waitImg") , HTMLImageElement)).src = v;
	}
	,loop: function(c) {
		net.flash_line.display.ElementExtender.rotate(this.movieElem,7.5);
	}
	,get_text: function() {
		return this.textElem.innerHTML;
	}
	,set_text: function(v) {
		if(v == null) v = "";
		this.textElem.innerHTML = v;
		return v;
	}
	,__class__: calendar.WaitView
	,__properties__: {set_text:"set_text",get_text:"get_text"}
});
var feffects = {};
feffects.TweenObject = function(target,properties,duration,easing,autoStart,onFinish) {
	if(autoStart == null) autoStart = false;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	this.easing = easing;
	this.onFinish(onFinish);
	this.tweens = new haxe.ds.GenericStack();
	this._nbTotal = 0;
	var _g = 0;
	var _g1 = Reflect.fields(properties);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		var tp = new feffects.TweenProperty(target,key,Reflect.field(properties,key),duration,easing,false);
		tp.onFinish($bind(this,this._onFinish));
		this.tweens.add(tp);
		this._nbTotal++;
	}
	if(autoStart) this.start();
};
feffects.TweenObject.__name__ = true;
feffects.TweenObject.tween = function(target,properties,duration,easing,autoStart,onFinish) {
	if(autoStart == null) autoStart = false;
	return new feffects.TweenObject(target,properties,duration,easing,autoStart,onFinish);
};
feffects.TweenObject.prototype = {
	get_isPlaying: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tween = $it0.next();
			if(tween.isPlaying) return true;
		}
		return false;
	}
	,setEasing: function(easing) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.setEasing(easing);
		}
		return this;
	}
	,start: function() {
		this._nbFinished = 0;
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.start();
		}
		return this.tweens;
	}
	,pause: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.pause();
		}
	}
	,resume: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.resume();
		}
	}
	,seek: function(n) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.seek(n);
		}
		return this;
	}
	,reverse: function() {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.reverse();
		}
	}
	,stop: function(finish) {
		var $it0 = this.tweens.iterator();
		while( $it0.hasNext() ) {
			var tweenProp = $it0.next();
			tweenProp.stop(finish);
		}
	}
	,onFinish: function(f) {
		if(f != null) this.__onFinish = f; else this.__onFinish = function() {
		};
		return this;
	}
	,_onFinish: function() {
		this._nbFinished++;
		if(this._nbFinished == this._nbTotal) this.__onFinish();
	}
	,__class__: feffects.TweenObject
	,__properties__: {get_isPlaying:"get_isPlaying"}
};
var haxe = {};
haxe.ds = {};
haxe.ds.GenericStack = function() {
};
haxe.ds.GenericStack.__name__ = true;
haxe.ds.GenericStack.prototype = {
	add: function(item) {
		this.head = new haxe.ds.GenericCell(item,this.head);
	}
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,__class__: haxe.ds.GenericStack
};
feffects.Tween = function(init,end,dur,easing,autoStart,onUpdate,onFinish) {
	if(autoStart == null) autoStart = false;
	this._initVal = init;
	this._endVal = end;
	this.duration = dur;
	this._offsetTime = 0;
	this.position = 0;
	this.isPlaying = false;
	this.isPaused = false;
	this.isReversed = false;
	this.onUpdate(onUpdate);
	this.onFinish(onFinish);
	this.setEasing(easing);
	if(autoStart) this.start();
};
feffects.Tween.__name__ = true;
feffects.Tween.addTween = function(tween) {
	if(!feffects.Tween._isTweening) {
		feffects.Tween._timer = new haxe.Timer(feffects.Tween.INTERVAL);
		feffects.Tween._timer.run = feffects.Tween.cb_tick;
		feffects.Tween._isTweening = true;
		feffects.Tween.cb_tick();
	}
	feffects.Tween._aTweens.add(tween);
};
feffects.Tween.removeActiveTween = function(tween) {
	feffects.Tween._aTweens.remove(tween);
	feffects.Tween.checkActiveTweens();
};
feffects.Tween.removePausedTween = function(tween) {
	feffects.Tween._aPaused.remove(tween);
	feffects.Tween.checkActiveTweens();
};
feffects.Tween.checkActiveTweens = function() {
	if(feffects.Tween._aTweens.head == null) {
		if(feffects.Tween._timer != null) {
			feffects.Tween._timer.stop();
			feffects.Tween._timer = null;
		}
		feffects.Tween._isTweening = false;
	}
};
feffects.Tween.getActiveTweens = function() {
	return feffects.Tween._aTweens;
};
feffects.Tween.getPausedTweens = function() {
	return feffects.Tween._aPaused;
};
feffects.Tween.setTweenPaused = function(tween) {
	feffects.Tween._aPaused.add(tween);
	feffects.Tween._aTweens.remove(tween);
	feffects.Tween.checkActiveTweens();
};
feffects.Tween.setTweenActive = function(tween) {
	feffects.Tween._aTweens.add(tween);
	feffects.Tween._aPaused.remove(tween);
	if(!feffects.Tween._isTweening) {
		feffects.Tween._timer = new haxe.Timer(feffects.Tween.INTERVAL);
		feffects.Tween._timer.run = feffects.Tween.cb_tick;
		feffects.Tween._isTweening = true;
		feffects.Tween.cb_tick();
	}
};
feffects.Tween.cb_tick = function() {
	var $it0 = feffects.Tween._aTweens.iterator();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		i.doInterval();
	}
};
feffects.Tween.easingEquation = function(t,b,c,d) {
	return c / 2 * (Math.sin(Math.PI * (t / d - 0.5)) + 1) + b;
};
feffects.Tween.prototype = {
	start: function(position) {
		if(position == null) position = 0;
		this._startTime = new Date().getTime();
		this._reverseTime = new Date().getTime();
		this.seek(position);
		if(this.isPaused) feffects.Tween.removePausedTween(this);
		this.isPlaying = true;
		this.isPaused = false;
		feffects.Tween.addTween(this);
		if(this.duration == 0 || position >= this.duration) this.stop(true);
	}
	,pause: function() {
		if(!this.isPlaying || this.isPaused) return;
		this._pauseTime = new Date().getTime();
		this.isPlaying = false;
		this.isPaused = true;
		feffects.Tween.setTweenPaused(this);
	}
	,resume: function() {
		if(!this.isPaused || this.isPlaying) return;
		this._startTime += new Date().getTime() - this._pauseTime;
		this._reverseTime += new Date().getTime() - this._pauseTime;
		this.isPlaying = true;
		this.isPaused = false;
		feffects.Tween.setTweenActive(this);
	}
	,seek: function(ms) {
		if(ms < this.duration) this._offsetTime = ms; else this._offsetTime = this.duration;
		return this;
	}
	,reverse: function() {
		if(!this.isPlaying) return;
		this.isReversed = !this.isReversed;
		if(!this.isReversed) this._startTime += (new Date().getTime() - this._reverseTime) * 2;
		this._reverseTime = new Date().getTime();
	}
	,stop: function(doFinish) {
		if(doFinish == null) doFinish = false;
		if(this.isPaused) feffects.Tween.removePausedTween(this); else if(this.isPlaying) feffects.Tween.removeActiveTween(this);
		this.isPaused = false;
		this.isPlaying = false;
		if(doFinish) this.finish();
	}
	,finish: function() {
		this._onUpdate(this.isReversed?this._initVal:this._endVal);
		this._onFinish();
	}
	,onUpdate: function(f) {
		if(f != null) this._onUpdate = f; else this._onUpdate = function(_) {
		};
		return this;
	}
	,onFinish: function(f) {
		if(f != null) this._onFinish = f; else this._onFinish = function() {
		};
		return this;
	}
	,setEasing: function(f) {
		if(f != null) this._easingF = f; else this._easingF = feffects.Tween.easingEquation;
		return this;
	}
	,doInterval: function() {
		var stamp = new Date().getTime();
		var curTime = 0;
		if(this.isReversed) curTime = this._reverseTime * 2 - stamp - this._startTime + this._offsetTime; else curTime = stamp - this._startTime + this._offsetTime;
		var curVal = this._easingF(curTime,this._initVal,this._endVal - this._initVal,this.duration);
		if(curTime >= this.duration || curTime < 0) this.stop(true); else this._onUpdate(curVal);
		this.position = curTime;
	}
	,getCurVal: function(curTime) {
		return this._easingF(curTime,this._initVal,this._endVal - this._initVal,this.duration);
	}
	,getStamp: function() {
		return new Date().getTime();
	}
	,__class__: feffects.Tween
};
feffects.TweenProperty = function(target,prop,value,duration,easing,autostart,onFinish) {
	if(autostart == null) autostart = false;
	this.target = target;
	this.property = prop;
	feffects.Tween.call(this,Reflect.getProperty(target,this.property),value,duration,easing,autostart,$bind(this,this.__onUpdate),onFinish);
};
feffects.TweenProperty.__name__ = true;
feffects.TweenProperty.__super__ = feffects.Tween;
feffects.TweenProperty.prototype = $extend(feffects.Tween.prototype,{
	__onUpdate: function(n) {
		Reflect.setProperty(this.target,this.property,n);
	}
	,__class__: feffects.TweenProperty
});
feffects.easing = {};
feffects.easing.Bounce = function() { };
feffects.easing.Bounce.__name__ = true;
feffects.easing.Bounce.easeOut = function(t,b,c,d) {
	if((t /= d) < 0.36363636363636365) return c * (7.5625 * t * t) + b; else if(t < 0.72727272727272729) return c * (7.5625 * (t -= 0.54545454545454541) * t + .75) + b; else if(t < 0.90909090909090906) return c * (7.5625 * (t -= 0.81818181818181823) * t + .9375) + b; else return c * (7.5625 * (t -= 0.95454545454545459) * t + .984375) + b;
};
feffects.easing.Bounce.easeIn = function(t,b,c,d) {
	return c - feffects.easing.Bounce.easeOut(d - t,0,c,d) + b;
};
feffects.easing.Bounce.easeInOut = function(t,b,c,d) {
	if(t < d * 0.5) return (c - feffects.easing.Bounce.easeOut(d - t * 2,0,c,d)) * .5 + b; else return feffects.easing.Bounce.easeOut(t * 2 - d,0,c,d) * .5 + c * .5 + b;
};
feffects.easing.Cubic = function() { };
feffects.easing.Cubic.__name__ = true;
feffects.easing.Cubic.easeIn = function(t,b,c,d) {
	return c * (t /= d) * t * t + b;
};
feffects.easing.Cubic.easeOut = function(t,b,c,d) {
	return c * ((t = t / d - 1) * t * t + 1) + b;
};
feffects.easing.Cubic.easeInOut = function(t,b,c,d) {
	if((t /= d * 0.5) < 1) return c * 0.5 * t * t * t + b; else return c * 0.5 * ((t -= 2) * t * t + 2) + b;
};
feffects.easing.Linear = function() { };
feffects.easing.Linear.__name__ = true;
feffects.easing.Linear.easeNone = function(t,b,c,d) {
	return c * t / d + b;
};
feffects.easing.Linear.easeIn = function(t,b,c,d) {
	return c * t / d + b;
};
feffects.easing.Linear.easeOut = function(t,b,c,d) {
	return c * t / d + b;
};
feffects.easing.Linear.easeInOut = function(t,b,c,d) {
	return c * t / d + b;
};
feffects.easing.Quad = function() { };
feffects.easing.Quad.__name__ = true;
feffects.easing.Quad.easeIn = function(t,b,c,d) {
	return c * (t /= d) * t + b;
};
feffects.easing.Quad.easeOut = function(t,b,c,d) {
	return -c * (t /= d) * (t - 2) + b;
};
feffects.easing.Quad.easeInOut = function(t,b,c,d) {
	if((t /= d * 0.5) < 1) return c * 0.5 * t * t + b; else return -c * 0.5 * (--t * (t - 2) - 1) + b;
};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	setParameter: function(param,value) {
		this.params = Lambda.filter(this.params,function(p) {
			return p.param != param;
		});
		this.params.push({ param : param, value : value});
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.ds.GenericCell.__name__ = true;
haxe.ds.GenericCell.prototype = {
	__class__: haxe.ds.GenericCell
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.xml = {};
haxe.xml.Parser = function() { };
haxe.xml.Parser.__name__ = true;
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Browser = function() { };
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
js.Cookie = function() { };
js.Cookie.__name__ = true;
js.Cookie.set = function(name,value,expireDelay,path,domain) {
	var s = name + "=" + encodeURIComponent(value);
	if(expireDelay != null) {
		var d = DateTools.delta(new Date(),expireDelay * 1000);
		s += ";expires=" + d.toGMTString();
	}
	if(path != null) s += ";path=" + path;
	if(domain != null) s += ";domain=" + domain;
	window.document.cookie = s;
};
js.Cookie.all = function() {
	var h = new haxe.ds.StringMap();
	var a = window.document.cookie.split(";");
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		e = StringTools.ltrim(e);
		var t = e.split("=");
		if(t.length < 2) continue;
		h.set(t[0],decodeURIComponent(t[1].split("+").join(" ")));
	}
	return h;
};
js.Cookie.get = function(name) {
	return js.Cookie.all().get(name);
};
js.Cookie.exists = function(name) {
	return js.Cookie.all().exists(name);
};
js.Cookie.remove = function(name,path,domain) {
	js.Cookie.set(name,"",-10,path,domain);
};
net.flash_line._api = {};
net.flash_line._api.math = {};
net.flash_line._api.math.Vector = function(vx,vy,vz) {
	if(vz == null) vz = 0;
	this.set_x(vx);
	this.set_y(vy);
	this.set_z(vz);
};
net.flash_line._api.math.Vector.__name__ = true;
net.flash_line._api.math.Vector.prototype = {
	get_x: function() {
		return this._x;
	}
	,set_x: function(v) {
		this._x = v;
		return v;
	}
	,get_y: function() {
		return this._y;
	}
	,set_y: function(v) {
		this._y = v;
		return v;
	}
	,get_z: function() {
		return this._z;
	}
	,set_z: function(v) {
		this._z = v;
		return v;
	}
	,__class__: net.flash_line._api.math.Vector
	,__properties__: {set_z:"set_z",get_z:"get_z",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x"}
};
net.flash_line._api.motion = {};
net.flash_line._api.motion.BTween = function(s,e,d,onLoop,asset,listenerParam) {
	feffects.Tween.call(this,s,e,Math.round(d * 1000),feffects.easing.Quad.easeInOut,false,$bind(this,this._onLoop),$bind(this,this._onEnd));
	this.onLoop = onLoop;
	this.listenerParam = listenerParam;
	this.asset = asset;
	this.start();
};
net.flash_line._api.motion.BTween.__name__ = true;
net.flash_line._api.motion.BTween.__super__ = feffects.Tween;
net.flash_line._api.motion.BTween.prototype = $extend(feffects.Tween.prototype,{
	clear: function() {
		this.onLoop = null;
		this.listenerParam = null;
		this.asset = null;
	}
	,_onEnd: function() {
		var evtObj = new net.flash_line.event.StandardEvent(this,"end");
		evtObj.value = -1;
		evtObj.asset = this.asset;
		evtObj.data = this.listenerParam;
		this.onLoop(evtObj);
	}
	,_onLoop: function(e) {
		var evtObj = new net.flash_line.event.StandardEvent(this,"loop");
		evtObj.value = e;
		evtObj.asset = this.asset;
		evtObj.data = this.listenerParam;
		this.onLoop(evtObj);
	}
	,__class__: net.flash_line._api.motion.BTween
});
net.flash_line.display = {};
net.flash_line.display.ElementExtender = function() { };
net.flash_line.display.ElementExtender.__name__ = true;
net.flash_line.display.ElementExtender.elemBy = function(el,v) {
	if(el.getElementsByClassName(v)[0] == null) haxe.Log.trace("f:: class '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 56, className : "net.flash_line.display.ElementExtender", methodName : "elemBy"});
	return js.Boot.__cast(el.getElementsByClassName(v)[0] , Element);
};
net.flash_line.display.ElementExtender.elemByTag = function(el,v) {
	if(el.getElementsByTagName(v)[0] == null) haxe.Log.trace("f:: tag '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 60, className : "net.flash_line.display.ElementExtender", methodName : "elemByTag"});
	return js.Boot.__cast(el.getElementsByTagName(v)[0] , Element);
};
net.flash_line.display.ElementExtender.child = function(el,v) {
	var ret = null;
	var child = null;
	var _g = 0;
	var _g1 = el.children;
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		child = js.Boot.__cast(i , Element);
		if(child.id == v) {
			ret = child;
			break;
		}
	}
	if(ret == null) haxe.Log.trace("f:: child with id '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 91, className : "net.flash_line.display.ElementExtender", methodName : "child"});
	return ret;
};
net.flash_line.display.ElementExtender.childByName = function(el,v) {
	var ret = null;
	var child = null;
	var _g = 0;
	var _g1 = el.children;
	while(_g < _g1.length) {
		var i = _g1[_g];
		++_g;
		if(js.Boot.__instanceof(i,HTMLInputElement) || js.Boot.__instanceof(i,HTMLTextAreaElement)) {
			child = i;
			if(child.name == v) {
				ret = child;
				break;
			}
		}
	}
	if(ret == null) haxe.Log.trace("f:: InputElement child with name '" + v + "' doesn't exist in element with id '" + el.id + "'",{ fileName : "ElementExtender.hx", lineNumber : 106, className : "net.flash_line.display.ElementExtender", methodName : "childByName"});
	return ret;
};
net.flash_line.display.ElementExtender.clone = function(el,b) {
	if(b == null) b = true;
	return js.Boot.__cast(el.cloneNode(b) , Element);
};
net.flash_line.display.ElementExtender.positionInWindow = function(el) {
	var v = new net.flash_line._api.math.Vector(0,0);
	do {
		var _g = v;
		_g.set_x(_g.get_x() + (el.offsetLeft - el.scrollLeft));
		var _g1 = v;
		_g1.set_y(_g1.get_y() + (el.offsetTop - el.scrollTop));
		el = el.offsetParent;
	} while(el != null);
	return v;
};
net.flash_line.display.ElementExtender.getBoundInfo = function(el) {
	var r = el.getBoundingClientRect();
	var ebi = { x : null, y : null, left : null, right : null, top : null, bottom : null, width : null, height : null};
	var v = net.flash_line.display.ElementExtender.positionInWindow(el);
	ebi.x = v.get_x();
	ebi.y = v.get_y();
	ebi.left = r.left;
	ebi.right = r.right;
	ebi.top = r.top;
	ebi.bottom = r.bottom;
	ebi.width = r.width;
	ebi.height = r.height;
	return ebi;
};
net.flash_line.display.ElementExtender.handCursor = function(ev,v) {
	if(v == null) v = true;
	if(js.Boot.__instanceof(ev,Element)) {
		var el;
		el = js.Boot.__cast(ev , Element);
		var str;
		if(v) str = "pointer"; else str = "auto";
		el.style.cursor = str;
	}
};
net.flash_line.display.ElementExtender.setReadOnly = function(el,b) {
	if(b == null) b = true;
	if(!(js.Boot.__instanceof(el,HTMLInputElement) || js.Boot.__instanceof(el,HTMLTextAreaElement))) el.readOnly = b; else el.disabled = b;
};
net.flash_line.display.ElementExtender.setVisible = function(el,b) {
	if(b == null) b = true;
	var v = "visible";
	if(!b) v = "hidden";
	el.style.visibility = v;
};
net.flash_line.display.ElementExtender.show = function(el) {
	el.style.display = net.flash_line.display.ElementExtender.strVal(el.getAttribute("data-flnet-display"),"inline");
};
net.flash_line.display.ElementExtender.hide = function(el) {
	el.style.display = "none";
};
net.flash_line.display.ElementExtender.setColor = function(el,v) {
	if(v == null) v = "#000";
	el.style.color = v;
};
net.flash_line.display.ElementExtender.removeChildren = function(el) {
	if(el.hasChildNodes()) while(el.childNodes.length > 0) el.removeChild(el.firstChild);
};
net.flash_line.display.ElementExtender["delete"] = function(el) {
	if(el.parentNode != null) el.parentNode.removeChild(el);
};
net.flash_line.display.ElementExtender.setText = function(e,v) {
	if(v == null) v = "";
	var el = e;
	if(js.Boot.__instanceof(el,HTMLInputElement) || js.Boot.__instanceof(el,HTMLTextAreaElement)) el.value = v; else if(js.Boot.__instanceof(el,Element)) el.innerHTML = v;
};
net.flash_line.display.ElementExtender.getText = function(e) {
	var el = e;
	var v = null;
	if(js.Boot.__instanceof(el,HTMLInputElement) || js.Boot.__instanceof(el,HTMLTextAreaElement)) v = el.value; else if(js.Boot.__instanceof(el,Element)) v = el.innerHTML;
	return v;
};
net.flash_line.display.ElementExtender.setRotationAxis = function(e,v) {
	var el = e;
	el.style.webkitTransformOrigin = v;
	el.style.mozTransformOrigin = v;
	el.style.msTransformOrigin = v;
	el.style.oTransformOrigin = v;
	el.style.khtmlTransformOrigin = v;
	el.style.transformOrigin = v;
};
net.flash_line.display.ElementExtender.setRotation = function(e,v) {
	var el = e;
	var r;
	if(v == null) r = "null"; else r = "" + v;
	el.style.webkitTransform = "rotate(" + r + "deg)";
	el.style.mozTransform = "rotate(" + r + "deg)";
	el.style.msTransform = "rotate(" + r + "deg)";
	el.style.oTransform = "rotate(" + r + "deg)";
	el.style.khtmlTransform = "rotate(" + r + "deg)";
	el.style.transform = "rotate(" + r + "deg)";
};
net.flash_line.display.ElementExtender.rotate = function(el,v) {
	var r = el.rotation;
	if(r == null) {
		r = 0.0;
		el.rotation = 0.0;
	}
	v += el.rotation;
	net.flash_line.display.ElementExtender.setRotation(el,v);
	el.rotation = v;
};
net.flash_line.display.ElementExtender.joinEnterKeyToClick = function(el,buttonArray,focusElem) {
	var activeEl = null;
	if(focusElem != null) focusElem.focus(); else el.focus();
	if(buttonArray == null) buttonArray = [];
	buttonArray.push(el);
	window.onkeypress = function(e) {
		if(e.keyCode == 13) {
			var _g = 0;
			while(_g < buttonArray.length) {
				var button = buttonArray[_g];
				++_g;
				if(button == window.document.activeElement) activeEl = window.document.activeElement;
			}
			if(activeEl == null) {
				var evt = new Event("click");
				el.dispatchEvent(evt);
			}
		}
	};
};
net.flash_line.display.ElementExtender.clearEnterKeyToClick = function(el) {
	window.onkeypress = null;
};
net.flash_line.display.ElementExtender.addLst = function(srcEvt,type,listenerFunction,b,data) {
	if(b == null) b = false;
	var el;
	if(js.Boot.__instanceof(srcEvt,Element) && type == "click") net.flash_line.display.ElementExtender.handCursor(srcEvt);
	var deleguateFunction = net.flash_line.display.ElementExtender.getLst(srcEvt,listenerFunction,data);
	el = srcEvt;
	if(el.listeners == null) el.listeners = [];
	el.listeners.push({ type : type, listenerFunction : listenerFunction, deleguateFunction : deleguateFunction});
	srcEvt.addEventListener(type,deleguateFunction,b);
};
net.flash_line.display.ElementExtender.removeLst = function(srcEvt,type,listenerFunction,b) {
	if(b == null) b = false;
	if(js.Boot.__instanceof(srcEvt,Element) && type == "click") net.flash_line.display.ElementExtender.handCursor(srcEvt,false);
	if(!net.flash_line.display.ElementExtender.removeDelegateListener(srcEvt,type,listenerFunction,b)) srcEvt.removeEventListener(type,listenerFunction,b);
};
net.flash_line.display.ElementExtender.hasLst = function(srcEvt,type,listenerFunction) {
	var el = srcEvt;
	var ret = false;
	if(el.listeners != null) {
		var len = el.listeners.length;
		var _g = 0;
		while(_g < len) {
			var n = _g++;
			var i = el.listeners[n];
			if(i.type == type) {
				if(listenerFunction == null) ret = true; else if(Reflect.compareMethods(i.listenerFunction,listenerFunction)) ret = true;
				if(ret) break;
			}
		}
	}
	return ret;
};
net.flash_line.display.ElementExtender.removeDelegateListener = function(srcEvt,type,listenerFunction,b) {
	if(b == null) b = false;
	var match = false;
	var el = srcEvt;
	if(el.listeners != null) {
		var len = el.listeners.length;
		var _g = 0;
		while(_g < len) {
			var n = _g++;
			var i = el.listeners[n];
			if(Reflect.compareMethods(i.listenerFunction,listenerFunction)) {
				if(i.type == type) {
					if(i.deleguateFunction != null) srcEvt.removeEventListener(type,i.deleguateFunction,b);
					el.listeners.splice(n,1);
					match = true;
					break;
				}
			}
		}
	}
	return match;
};
net.flash_line.display.ElementExtender.getLst = function(srcEvt,listenerFunction,data) {
	var deleguateFunction;
	if(data == null) deleguateFunction = listenerFunction; else deleguateFunction = function(e) {
		listenerFunction.call(srcEvt,e,data);
	};
	return deleguateFunction;
};
net.flash_line.display.ElementExtender.strVal = function(s,defVal) {
	if(defVal == null) defVal = "";
	if(s == null) return defVal;
	if(s == "") return defVal;
	return s;
};
net.flash_line.event = {};
net.flash_line.event.EventSource = function() {
	this._listenerArray = [];
};
net.flash_line.event.EventSource.__name__ = true;
net.flash_line.event.EventSource.prototype = {
	bind: function(listener,data) {
		this._listenerArray.push({ listener : listener, data : data});
		return true;
	}
	,unbind: function(listener) {
		var match = false;
		if(listener == null) {
			this._listenerArray = [];
			match = true;
		} else {
			var _g = 0;
			var _g1 = this._listenerArray;
			while(_g < _g1.length) {
				var o = _g1[_g];
				++_g;
				if(Reflect.compareMethods(listener,o.listener)) {
					var x = o;
					HxOverrides.remove(this._listenerArray,x);
					this.unbind(listener);
					match = true;
					break;
				}
			}
		}
		return match;
	}
	,dispatch: function(e) {
		var ret = null;
		if(e.target == null) e.target = this;
		var _g = 0;
		var _g1 = this._listenerArray;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			e.data = o.data;
			ret = o.listener(e);
		}
		return ret;
	}
	,hasListener: function() {
		return this._listenerArray.length != 0;
	}
	,getLength: function() {
		return this._listenerArray.length;
	}
	,__class__: net.flash_line.event.EventSource
};
net.flash_line.event.StandardEvent = function(target,type,message) {
	if(message == null) message = "";
	if(type == null) type = "event";
	this.target = target;
	this.type = type;
	this.message = message;
};
net.flash_line.event.StandardEvent.__name__ = true;
net.flash_line.event.StandardEvent.prototype = {
	__class__: net.flash_line.event.StandardEvent
};
net.flash_line.event.timing = {};
net.flash_line.event.timing.Clock = function(f,per) {
	if(per == null) per = 0.04;
	haxe.Timer.call(this,Math.round(per * 1000));
	this.top = new net.flash_line.event.EventSource();
	this.run = $bind(this,this.clockRun);
	this.listener = f;
	this._idle = false;
};
net.flash_line.event.timing.Clock.__name__ = true;
net.flash_line.event.timing.Clock.__super__ = haxe.Timer;
net.flash_line.event.timing.Clock.prototype = $extend(haxe.Timer.prototype,{
	pause: function() {
		this._idle = true;
	}
	,restart: function() {
		this._idle = false;
	}
	,remove: function() {
		haxe.Timer.prototype.stop.call(this);
		this.listener = null;
		this.run = null;
		this.top = null;
		return null;
	}
	,clockRun: function() {
		if(!this._idle) {
			if(this.listener != null) this.listener(this);
			this.top.dispatch(new net.flash_line.event.StandardEvent(this));
		}
	}
	,get_isEnabled: function() {
		return !this._idle;
	}
	,__class__: net.flash_line.event.timing.Clock
	,__properties__: {get_isEnabled:"get_isEnabled"}
});
net.flash_line.event.timing.Delay = function(f,per) {
	if(per == null) per = 0.04;
	this.period = per;
	this.listener = f;
	this._idle = false;
	this.timerDelay = haxe.Timer.delay($bind(this,this.clockRun),Math.round(this.period * 1000));
};
net.flash_line.event.timing.Delay.__name__ = true;
net.flash_line.event.timing.Delay.prototype = {
	disable: function() {
		this._idle = true;
		this.timerDelay.stop();
	}
	,clockRun: function() {
		if(!this._idle) this.listener(this);
	}
	,__class__: net.flash_line.event.timing.Delay
};
net.flash_line.io = {};
net.flash_line.io.HttpExtender = function() { };
net.flash_line.io.HttpExtender.__name__ = true;
net.flash_line.io.HttpExtender.getParameter = function(h,v) {
	var params = new net.flash_line.util.Object();
	var _g = 0;
	var _g1 = new EReg("[&]","g").split(v);
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var pl = p.split("=");
		if(pl.length < 2) continue;
		var name = pl.shift();
		params.set(decodeURIComponent(name.split("+").join(" ")),StringTools.urlDecode(pl.join("=")));
	}
	return params;
};
net.flash_line.util.ArrayExtender = function() { };
net.flash_line.util.ArrayExtender.__name__ = true;
net.flash_line.util.ArrayExtender.last = function(arr) {
	if(arr.length < 1) return null; else return arr[arr.length - 1];
};
net.flash_line.util.Object = function(o) {
	if(o != null) {
		var arr = Reflect.fields(o);
		var _g1 = 0;
		var _g = arr.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v = Reflect.field(o,arr[i]);
			this.set(arr[i],v);
		}
	}
};
net.flash_line.util.Object.__name__ = true;
net.flash_line.util.Object.prototype = {
	set: function(k,v) {
		this[k] = v;
	}
	,get: function(k) {
		return Reflect.field(this,k);
	}
	,remove: function(k) {
		Reflect.deleteField(this,k);
	}
	,array: function() {
		return Reflect.fields(this);
	}
	,length: function() {
		return Reflect.fields(this).length;
	}
	,toDynamic: function() {
		var d = { };
		var _g1 = 0;
		var _g = this.array().length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = this.array()[i];
			var v = this.get(k);
			d[k] = v;
		}
		return d;
	}
	,toHtmlString: function(tab) {
		if(tab == null) tab = "";
		var str = tab + "{<br/>";
		var tabType = "&nbsp;&nbsp;&nbsp;&nbsp; ";
		var len = this.array().length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var k = this.array()[i];
			var v = this.get(k);
			str += tab + k + ":";
			if(js.Boot.__instanceof(v,net.flash_line.util.Object)) str += "<br/>" + Std.string(v.toHtmlString(tab + tabType)); else str += "\"" + Std.string(v) + "\"";
			if(i < len - 1) str += ",<br/>"; else str += "<br/>";
		}
		str += tab + "}<br/>";
		return str;
	}
	,toString: function(tab) {
		if(tab == null) tab = "";
		var str = tab + "{\n";
		var tabType = "\t\t";
		var len = this.array().length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			var k = this.array()[i];
			var v = this.get(k);
			str += tab + k + ":";
			if(js.Boot.__instanceof(v,net.flash_line.util.Object)) str += "\n" + Std.string(v.toString(tab + tabType)); else str += "\"" + Std.string(v) + "\"";
			if(i < len - 1) str += ",\n"; else str += "\n";
		}
		str += tab + "}\n";
		return str;
	}
	,__class__: net.flash_line.util.Object
};
net.flash_line.util.StepIterator = function(min,max,step) {
	this.min = min;
	this.max = max;
	if(step == null) {
		if(min < max) step = 1; else step = -1;
	}
	if(min <= max && step < 0 || min > max && step >= 0) step *= -1;
	this.step = step;
};
net.flash_line.util.StepIterator.__name__ = true;
net.flash_line.util.StepIterator.prototype = {
	hasNext: function() {
		var ret;
		if(this.step > 0) ret = this.min < this.max; else ret = this.min > this.max;
		return ret;
	}
	,next: function() {
		var ret = this.min;
		this.min += this.step;
		return ret;
	}
	,__class__: net.flash_line.util.StepIterator
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
net.flash_line.util.ApiCommon.STD_ERROR_MSG = "fl.net error. See last message above.";
net.flash_line.util.ApiCommon.RED_IN_PAGE_ERROR_MSG = "fl.net error. See red message in page.";
net.flash_line.util.ApiCommon.IN_PAGE_ERROR_MSG = "fl.net error. See message in page.";
Main.version = "1.4.17";
feffects.Tween._aTweens = new haxe.ds.GenericStack();
feffects.Tween._aPaused = new haxe.ds.GenericStack();
feffects.Tween.INTERVAL = 10;
feffects.Tween.DEFAULT_EASING = feffects.Tween.easingEquation;
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
net.flash_line.display.ElementExtender.listeners = [];
net.flash_line.event.StandardEvent.CLICK = "click";
net.flash_line.event.StandardEvent.DBL_CLICK = "dblclick";
net.flash_line.event.StandardEvent.MOUSE_DOWN = "mousedown";
net.flash_line.event.StandardEvent.MOUSE_MOVE = "mousemove";
net.flash_line.event.StandardEvent.MOUSE_OUT = "mouseout";
net.flash_line.event.StandardEvent.MOUSE_OVER = "mouseover";
net.flash_line.event.StandardEvent.MOUSE_UP = "mouseup";
net.flash_line.event.StandardEvent.MOUSE_WHEEL = "mousewheel";
Main.main();
})();
