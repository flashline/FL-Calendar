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
*  root package
*/
package;
/**
* classes imports
*/
import calendar.ConfirmBox;
import calendar.Language;
import calendar.Model;
import calendar.PromptBox;
import calendar.View;
import calendar.Controler;
import calendar.WaitView;
import net.flash_line.event.StandardEvent;
import net.flash_line.util.Common;
import net.flash_line.event.EventSource;
import net.flash_line.util.Object;
/**
* Calendar main component. 
* @see net.flash_line.util.Common
*/
class Calendar extends Common {
	var _modelSrc:String;
	var _languageSrc:String;
	var _baseUrl:String;
	//
	//
	//	
	/**
	 * Event dispatcher when xml files are loaded.
	 * @see net.flash_line.event.<EventSource , StandardEvent>
	 */
	public var loadInit:EventSource;
	/**
	 * model related class
	 */
	public var model(default, null):Model ;
	/**
	 * view related class
	 */
	public var view(default, null):View;
	/**
	 * controler related class
	 */
	public var controler(default, null):Controler;
	/**
	 * language loader 
	 */
	public var language(default, null):Language;
	/**
	 * Confirm-box -replace js standard
	 */
	public var confirmBox(get, set):ConfirmBox;
	/**
	 * Prompt-box -replace js standard
	 */
	public var promptBox(get, set):PromptBox;
	/**
	 * constructor
	 * @param	?su			server program url
	 * @param	?ms			model.xml path
	 * @param	?ls			language.xml path
	 * @param	?bu			root url -where app is install.
	 * @param	?auto=true	If false loadModelAndLanguage() must be called after new Calendar()
	 * @param	?w			WaitView or sub-class must be instancied before.
	 */
	public function new (?su:String="php/calendar.php",?ms:String="custom/default/model.xml",?ls:String="custom/default/language.xml",?bu:String="./",?auto=true,?w:WaitView) {
		_languageSrc = ls ;
		_modelSrc = ms;
		_baseUrl = bu;
		loadInit = new EventSource();
		language = new Language() ;
		model = new Model(language, su,_baseUrl) ; model.wait = w;
		view = new View(model,language);
    	controler = new Controler(model,view);
    	if (auto) {
			loadModelAndLanguage();
		}	
    }
	/**
	 * load model.xml... then language.xml. Must be called after new Calendar(,,,,auto) if auto==false.
	 */
   	public function loadModelAndLanguage () {  
		model.load(_baseUrl + _modelSrc,onReadModel);	
    }
	/**
	 * Must be called by the listener of loadInit-dispatcher.
	 */
	public function start () {  
		view.displayInit(); 
		controler.eventInit();	
		controler.start();	
    }	
	/**
	 * used to test app
	 */
	public function toString () {		
		return model.toString();
    }
	/**
    *@private
    */
	private function onReadModel (tree:Object,m:Model) {
		language.load(_baseUrl + _languageSrc,onReadLanguage);	
	}
	private function onReadLanguage (tree:Object, l:Language) {
		var e:StandardEvent = new StandardEvent(this);
		e.text = tree;
		e.model=model;
		loadInit.dispatch(e);
	}
	function set_confirmBox(v:ConfirmBox) :ConfirmBox{
		model.confirmBox = v;
		return v;
	} 
	function get_confirmBox() : ConfirmBox {		
		return model.confirmBox;
	} 
	function set_promptBox(v:PromptBox) :PromptBox{
		model.promptBox = v;
		return v;
	} 
	function get_promptBox() : PromptBox {		
		return model.promptBox;
	} 
}