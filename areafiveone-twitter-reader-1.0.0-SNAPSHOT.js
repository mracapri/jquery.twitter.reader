// The MIT License
// 
// Copyright (c) 2011 Valle del Bit - Area 51
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


// Autor: 		Mario Rivera Angeles (lis.mario.rivera@gmail.com)
// Twitter:  	twitter.com/mra_capri
// Objetivo: 	Plugin que incrusta una componente de lectura de Twitter para RSS
// Version: 	1.0.0-SNAPSHOT

/**
 * Inicia closure de plugin
 */
(function($) {
	/**
	 *  Constantes del plugin
	 */
	var EMPTY = " ";
	var ONE = 1;
	var TWITTER = "http://twitter.com/statuses/user_timeline/";
	var FORMAT = ".json";
	var FIRST_ELEMENT = 0;
	var DAY = 0;	
	var TAG_SPAN = "<span/>";
	var TAG_TABLE = "<table/>";
	var TAG_TR = "<tr/>";
	var TAG_HR = "<hr/>";
	var COMMAND = "command";
	var CSS = "css";
	var TWITTER_USER = "twitterUser";
	var TIME_REFRESH = "timeRefresh";
	var NUMBER_OF_TWITS = "numberOfTwits";
	var CALLBACK_FUNCTION = "result";
	var ESASING = 2000;

	/**
	 *  Variables
	 */
	var imageAvatar = "";
	var numberOfNewTwits = 0;
	var firstFeching = true;
	var firstFechingValues = new Array();
	var lastFechingValues = new Array();
	
	/**
	 *  Metodos principales
	 */
	var methods = {
		/**
		 * Inicia TwitterReader
		 * @param {array} [options] Recibe el arreglo de opciones del plugin
		 */		
		init : function(options){
			var html = $.fn.twitterReader.buildUi(options);
			$(html).appendTo(this);
		}
	};

	/**
	 * Plugin jQuery de area51 que tiene como objetivo presentar un top twitt
	 * @param {array} [options] Recibe el arreglo de opciones del plugin
	 * @return {object} 
	 */
	$.fn.twitterReader = function(options) {

		// inicializacion de opciones del plugin antes de contruir el plugin
		var opts = $.fn.twitterReader.defaults;

		// verifica si las opciones vienen en closure, sino
		// le asigna valores por default
		var _options = !options ? opts : options;

		if(_options.hasOwnProperty(TWITTER_USER)){
			// asignacion de propiedades del plugin
			for(key in $.fn.twitterReader.defaults){
				if(!_options.hasOwnProperty(key)){
					_options[key] = $.fn.twitterReader.defaults[key];
				}
			}

			// itera y reformatea cada elemento que coincide con el elemento
			return this.each(function() {
				return methods['init'].apply($(this), [_options]);
			});		
		}else{
			$(this).text("Plugin requiere usuario de twitter con timeline publico");
		}

	};	
	
	/**
	 * Escribe en el log
	 * @param {object} $object El objeto escribira en el log de la consola
	 * @return {void}
	 */
	function debug($object) {
		if (window.console && window.console.log)
			window.console.log($object);
	};


	/**
	 * Dibuja los twits en el contenedor
	 * @param {array} $data Twits consultados
	 * @return {object} $container Contenedor principal
	 */
	$.fn.twitterReader.drawTwitsInContainer = function(data,container){
		$.each(data, function(key, value){
			firstFechingValues[key] = value;
			var created = $(TAG_SPAN).text($.fn.twitterReader.relativeTime(value.created_at));
			var textFormated = $.fn.twitterReader.convertUrlToLink(value.text);
			var twit = $(TAG_TR).html(textFormated).appendTo(container).hide();
			$(created).appendTo(twit);
			$(TAG_HR).appendTo(twit);
			$(twit).fadeIn(ESASING);
		});
	}
	
	/**
	 * Construye la interfaz del contenedor
	 * @return {string} HTML de la interfaz de usuario
	 */

	$.fn.twitterReader.buildUi = function(options) {
	
		// Define el contenedor
		var container = $(TAG_TABLE);
		
		// Carga los twits al iniciar el componente
		$.fn.twitterReader.fetchTwits(options, function(data){
			$.fn.twitterReader.drawTwitsInContainer(data, container);
		});
		
		// Cada cierto tiempo hace pull al timeline del usuario establecido
		$(container).everyTime(options[TIME_REFRESH], function(){
			$.fn.twitterReader.fetchTwits(options, function(data){
				$.each(data, function(key, value){
					lastFechingValues[key] = value;
				});
				
				// Id del prime twit para copararlo con la nueva lista
				var firstIdTwit = firstFechingValues[0].id;					
				// Buscamos el id en la ultima lista de valores
				$.each(lastFechingValues, function(key, value){	
					lastFechingValues[key] = value;
					if(lastFechingValues[key].id == firstIdTwit){
						numberOfNewTwits = key - 0;
					}
				});
				
				// Obteniendo el indice para refrescar a partir de ahi
				var indexToRefresh = lastFechingValues.length - numberOfNewTwits;
				// Removiendo twits
				var indexTwitsAdd = numberOfNewTwits - 1;
				
				// Limpia la ultima lista de datos obtenidos
				if(numberOfNewTwits > 0){					
					// Refresca los ultimos twits en el componente
					for(var indexRefresh = indexToRefresh;
						indexRefresh < lastFechingValues.length; indexRefresh++, indexTwitsAdd--){
						$(container).find("tr").eq(indexRefresh).hide(ESASING).remove();
						var created = $(TAG_SPAN).text($.fn.twitterReader.relativeTime(lastFechingValues[indexTwitsAdd].created_at));
						var textFormated = $.fn.twitterReader.convertUrlToLink(lastFechingValues[indexTwitsAdd].text);
						var newTwit = $(TAG_TR).html(textFormated + EMPTY).fadeIn(ESASING).prependTo(container).hide();
						$(created).appendTo(newTwit);
						$(TAG_HR).appendTo(newTwit);
						$(newTwit).fadeIn(ESASING);
					}
					firstFechingValues = [];
					firstFechingValues = lastFechingValues;
					numberOfNewTwits = 0;
					lastFechingValues = [];
				}else{					
					// Recarga los twits
					$.fn.twitterReader.fetchTwits(options, function(data){
						$(container).find("tr").hide(ESASING).remove();
						$.fn.twitterReader.drawTwitsInContainer(data, container);
					});
				}
				
				// Ejecuta el callback al refrescar los datos
				if($.isFunction(options[CALLBACK_FUNCTION])){
					options.result();
				}				
			});
		});
		return container;
	};

	/**
	 * Obtener datos del timeline del usuario
	 * @return {arrya} Twits del usuario
	 */
	$.fn.twitterReader.fetchTwits = function(options, resultFecthed) {
		var url = TWITTER + options[TWITTER_USER] + FORMAT + "?count=" + options[NUMBER_OF_TWITS] + "&callback=?";
		debug(url);
		$.getJSON(url, resultFecthed);
	};	
				
	/**
	 * Reemplaza las URLs por links
	 * @return {string} Cadena formateada
	 */
	$.fn.twitterReader.convertUrlToLink = function(text) {
		return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(text){
			return text.link(text);
		});
	};				

	/**
	 * Establece el tiempo relativo del twit
	 * @return {string} HTML de la interfaz de usuario
	 */
	$.fn.twitterReader.relativeTime = function(timeValue) {

		var DAY		= 1;
		var MONTH	= 2;
		var YEAR 	= 5;
		var HOUR 	= 3;
		var timeValues = timeValue.split(EMPTY);
		timeValue = timeValues[DAY] + EMPTY + timeValues[MONTH] + ", " + timeValues[YEAR] + EMPTY + timeValues[HOUR];
		var parsedDate = Date.parse(timeValue);
		var relativeTo = (arguments.length > ONE) ? arguments[ONE] : new Date();
		var delta = parseInt((relativeTo.getTime() - parsedDate) / 1000);
		delta = delta + (relativeTo.getTimezoneOffset() * 60);
		
		// Establece el tiempo de creacion del twit
		var relativeTime = '';		
		if (delta < 60) {
			relativeTime = ' hace un minuto';
		} else if(delta < 120) {
			relativeTime = ' hace un par de minutos';
		} else if(delta < (45 * 60)) {
	    	relativeTime = ' hace ' + (parseInt(delta / 60)).toString() + ' minutos';
		} else if(delta < (90 * 60)) {
	    	relativeTime = ' hace una hora';
	  	} else if(delta < (24 * 60 * 60)) {
	    	relativeTime = ' hace ' + (parseInt(delta / 3600)).toString() + ' horas';
	  	} else if(delta < (48 * 60 * 60)) {
	    	relativeTime = ' hace un dia';
	  	} else {
	    	relativeTime = ' hace ' + (parseInt(delta / 86400)).toString() + ' dias';
	  	}
		return relativeTime;
	}
	
	/**
	 * Establece defaults del plugin
	 */
	$.fn.twitterReader.defaults = {
		numberOfTwits: 	10,
		timeRefresh: 	30000,
		result: function(){}
	};

})(jQuery);