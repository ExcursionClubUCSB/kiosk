

(function() {
	var __func__ = 'InputPredictor';
	var construct = function() {
		var self = {
			
		};
		var public = function(e, val) {
			var node = e.target;
			var phrase = (typeof val !== 'undefined')? val: node.value;
			
			var chr = (e.shiftKey)? DOM_VK_KEY[e.keyCode]: DOM_VK_key[e.keyCode];
			
			var selmin = Math.min(node.selectionStart, node.selectionEnd);
			var selmax = Math.max(node.selectionStart, node.selectionEnd);
			
			
			if(chr) {
				phrase = phrase.substr(0,selmin) + chr + phrase.substr(selmax);
			}
			else {
				if(selmin !== selmax) {
					if((DOM_VK[e.keyCode] === 'BACKSPACE') || (DOM_VK[e.keyCode] === 'DELETE')) {
						phrase = phrase.substr(0,selmin) + phrase.substr(selmax);
					}
				}
				// no text selected and non-character key pressed
				else {
					if(DOM_VK[e.keyCode] === 'BACKSPACE') {
						phrase = (selmin===0)? phrase: phrase.substr(0,selmin-1) + phrase.substr(selmin);
					}
					else if(DOM_VK[e.keyCode] === 'DELETE') {
						phrase = phrase.substr(0,selmin) + ((selmax===phrase.length)? '': phrase.substr(selmin+1));
					}
				}
			}
			
			return phrase;
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		
	});
})();