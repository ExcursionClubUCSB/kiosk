(function() {
	
	var __func__ = 'Listener';
	
	
	
	var construct = function() {
		
		var my = {
			listeners: {},
		};
		
		
		var public = function(eventType) {
			var l = my.listeners;
			if(l[eventType]) {
				var set = l[eventType];
				var i = set.length;
				while(i--) {
					set[i].apply({}, []);
				}
			}
		};
		
		
		$.extend(public, {
			bind: function(eventType, handler) {
				var l = my.listeners;
				if(!l[eventType]) {
					l[eventType] = [];
				}
				l[eventType].push(handler);
			},
			clear: function() {
				delete my.listeners;
				my.listeners = {};
			},
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
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		//
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
	});
})();