(function() {
	
	var __func__ = 'Database';
	
	
	var instance;
	
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
		});
		
		
		return public;
		
	};
	
	
	
	var global = window[__func__] = function() {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	
	
	var offline = {};
	var metadata = {};
	
	$.extend(global, {
		
		get: function(udn) {
			return (offline[udn] || []);
		},
		
		download: function(udn, opt) {
			
			opt = opt || {};
			
			metadata[udn] = {
				subscribers: [],
			};
			offline[udn] = {};
			
			var uri = udn.split('/');
			
			$.getJSON('json.database.php?db='+uri[0]+'&table='+uri[1], function(json) {
				offline[udn] = json;
				if(opt.ready) opt.ready.apply(opt.ready, []);
				
				var subscribers = metadata[udn].subscribers;
				var i = subscribers.length;
				while(i--) {
					subscribers[i].apply(subscribers[i], []);
				}
			});
			
			if(opt.every) {
				metadata[udn].interval = window.setInterval(function() {
					global.download(udn);
				}, opt.every)
			}
		},
		
		subscribe: function(udn, tome) {
			if(metadata[udn]) {
				metadata[udn].subscribers.push(tome);
			}
		},
		
		unsubscribeAll: function(udn) {
			if(metadata[udn]) {
				metadata[udn].subscribers.length = 0;
			}
		},
		
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