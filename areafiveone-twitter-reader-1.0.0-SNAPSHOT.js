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
// Objetivo: 	Plugin que incrusta una componente para lectura del Twitter RSS
// Version: 	1.0.0-SNAPSHOT

/**
 * Inicia closure
 */
(function($) {

	var ONE 	= 1;
	var COMMAND 	= 'command';
	var CSS 	= 'css';
	
	/**
	 *  Metodos principales
	 */
	var methods = {
		/**
		 * Inicia la calculadora
		 * @param {array} [options] Recibe el arreglo de opciones del plugin
		 */		
		init : function(options){
			debug("Se invoco el metodo init");
		}
	};

	/**
	 * Plugin jQuery valle del bit que sirve remarcar los componentes
	 * @param {array} [options] Recibe el arreglo de opciones del plugin
	 * @return {object} 
	 */
	$.fn.twitterReader = function(options, result) {
		// Permite crear un solo elemento
		if($(this).size() == ONE){
			// inicializacion de opciones del plugin antes de contruir el plugin
			var opts = $.fn.twitterReader.defaults;
			
			// Verifica si la funcion ha sido definida
			if($.isFunction(options)){
				result = options;
				options = {};
				opts = $.extend({}, opts, {"result":result});
			}
			
			// verifica si las opciones viene en el closure, sino
			// le asigna valores por default
			var _options = !options ? opts : options;
			if(_options.hasOwnProperty(COMMAND) && !_options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts.css, opts.result);
			}else if(!_options.hasOwnProperty(COMMAND) && _options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts.command, opts.result);
			}else if(!_options.hasOwnProperty(COMMAND) && !_options.hasOwnProperty(CSS)){
				_options = $.extend({}, opts);
			}else{
				_options = opts;
			}
			
			// itera y reformatea cada elemento que coincide con el elemento
			return this.each(function() {
				// Ejecuta los comandos
				if((typeof(_options.command) === 'string') && methods[_options.command]) {
					return methods[_options.command].apply($(this), [_options]);
				}else{
					return methods['init'].apply($(this), [_options]);
				}
			});		
		}else{
			$(this).text("Plugin require only ONE element!");
		}
	};	
	
	/**
	 * Escribe en el log
	 * @param {object} $object El objeto que va escribirse en el log
	 * @return {void}
	 */
	function debug($object) {
		if (window.console && window.console.log)
			window.console.log($object);
	};
	
	/**
	 * Construye la interfaz de usuario
	 * @return {string} HTML de la interfaz de usuario
	 */
	$.fn.twitterReader.buildUi = function() {
		return "";
	};
	
	/**
	 * Establece los defaults del plugin
	 */
	$.fn.twitterReader.defaults = {
		command: 'init'
	};

})(jQuery);