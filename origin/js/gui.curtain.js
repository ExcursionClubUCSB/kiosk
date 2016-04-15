(function() {
	var __func__ = 'Curtain';
	
	var status = false;
	
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	$.extend(global, {
		
		open: function() {
			$('#curtain').remove();
			status = false;
		},
		
		close: function() {
			if(!status) {
				$('<div id="curtain"></div>').appendTo(document.body);
				status = true;
			}
		},
		
		toString: function() {
			return __func__+'()';
		},
	});
})();