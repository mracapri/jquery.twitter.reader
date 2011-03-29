// The MIT License
// 
// Copyright (c) 2011 Valle del Bit
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


// Autor: 	Mario Rivera Angeles (lis.mario.rivera@gmail.com)
// Twitter:  	twitter.com/mra_capri
// Objetivo: 	Plugin que incrusta una componente de lectura de Twitter para RSS
// Version: 	1.0.0-SNAPSHOT

/**
 * Inicia closure de plugin
 */
(function($) {

	var EMPTY 		= " ";
	var ONE 		= 1;
	var TWITTER 		= "http://twitter.com/statuses/user_timeline/";
	var FORMAT 		= ".json";
	var FIRST_ELEMENT 	= 0;
	var DAY 		= 0;	
	var TAG_SPAN		= "<span/>";

	var COMMAND 		= 'command';
	var CSS 		= 'css';
	var TWITTER_USER	= 'twitterUser';
	var TIME_REFRESH	= 'timeRefresh';

	var imageAvatar = "";
	
	/**
	 *  Metodos principales
	 */
	var methods = {
		/**
		 * Inicia TwitterReader
		 * @param {array} [options] Recibe el arreglo de opciones del plugin
		 */		
		init : function(options){
			$.getJSON(TWITTER + options[TWITTER_USER] + FORMAT + "?count=10&callback=?", function(data){
				$.each(data, function(key, value){
					if(key == FIRST_ELEMENT){
						imageAvatar = value.user['profile_image_url'];
					}
					var twit = $(TAG_SPAN).text(value.text + EMPTY + $.fn.twitterReader.relativeTime(value.created_at));
				});
			});
			if($.isFunction(options.result)){options.result("out");}
		}
	};

	/**
	 * Plugin jQuery de area51 que tiene como objetivo presentar un top twitt
	 * @param {array} [options] Recibe el arreglo de opciones del plugin
	 * @return {object} 
	 */
	$.fn.twitterReader = function(options, result) {


		// inicializacion de opciones del plugin antes de contruir el plugin
		var opts = $.fn.twitterReader.defaults;
			
		// Verifica si la funcion ha sido definida
		if($.isFunction(options)){
			result = options;
			options = {};
			opts = $.extend({}, opts, {"result":result});
		}else{
			opts = $.extend({}, options, {"result":result});
		}
			
		// verifica si las opciones vienen en closure, sino
		// le asigna valores por default
		var _options = !options ? opts : options;

		if(_options.hasOwnProperty(TWITTER_USER)){
			if(_options.hasOwnProperty(TIME_REFRESH) && !_options.hasOwnProperty(CSS)){
				_options = $.extend({}, _options, {css : opts[CSS]}, {result : opts.result});
			}else if(!_options.hasOwnProperty(TIME_REFRESH) && _options.hasOwnProperty(CSS)){
				_options = $.extend({}, _options, {'timeRefresh' : opts[TIME_REFRESH]}, {result : opts.result});
			}else{
				_options = $.extend({}, _options, opts);
			}

			// itera y reformatea cada elemento que coincide con el elemento
			return this.each(function() {
				return methods['init'].apply($(this), [_options]);
			});
		}else{
			$(this).text("Plugin require twitter user");
		}

	};	
	
	/**
	 * Escribe en el log
	 * @param {object} $object El objeto escribira en el log del explorer
	 * @return {void}
	 */
	function debug($object) {
		if (window.console && window.console.log)
			window.console.log($object);
	};
	
	/**
	 * Construye interfaz del usuario
	 * @return {string} HTML de la interfaz de usuario
	 */
	$.fn.twitterReader.buildUi = function() {
		return "";
	};

	/**
	 * Establece el tiempo relativo del twit
	 * @return {string} HTML de la interfaz de usuario
	 */
	$.fn.twitterReader.relativeTime = function(timeValue) {

		var MONTH	= 1;
		var YEAR 	= 5;
		var HOUR 	= 3;

		var timeValues = timeValue.split(EMPTY);
		timeValue = timeValues[DAY] + EMPTY + timeValues[MONTH] + ", " + timeValues[YEAR] + EMPTY + timeValues[HOUR];
		var parsedDate = Date.parse(timeValue);
		var relativeTo = (arguments.length > ONE) ? arguments[ONE] : new Date();
		var delta = parseInt((relativeTo.getTime() - parsedDate) / 1000);
		delta = delta + (relativeTo.getTimezoneOffset() * 60);

		var relativeTime = '';
		if (delta < 60) {
			relativeTime = 'a minute ago';
		} else if(delta < 120) {
			relativeTime = 'couple of minutes ago';
		} else if(delta < (45*60)) {
	    		relativeTime = (parseInt(delta / 60)).toString() + ' minutes ago';
		} else if(delta < (90*60)) {
	    		relativeTime = 'an hour ago';
	  	} else if(delta < (24*60*60)) {
	    		relativeTime = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
	  	} else if(delta < (48*60*60)) {
	    		relativeTime = '1 day ago';
	  	} else {
	    		relativeTime = (parseInt(delta / 86400)).toString() + ' days ago';
	  	}
		return relativeTime;
	}



	
	/**
	 * Establece defaults del plugin
	 */
	$.fn.twitterReader.defaults = {
		timeRefresh: 60,
		css:{valor:1}
	};

})(jQuery);