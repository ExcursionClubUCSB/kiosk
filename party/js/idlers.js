
(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Idlers';
	
	var instance;
	var castArray = Array.prototype.slice;
	var timers = {};
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = {};

	var timeout = function(key) {
		(function() {
			var e = this.key;
			var t = timers[e];
			t.t_id = setTimeout(function() {
				timeout(e);
				if(t.fn() === false) expose.cancel(e);
			}, t.interval);
		}).apply({key:key});
	};
	
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};

		expose['add'] = function(key, interval, fn) {
			timers[key] = {
				interval: interval,
				fn: fn,
			};
			timeout(key);
		};

		expose['cancel'] = function(key) {
			clearTimeout(timers[key].t_id);
			delete timers[key];
		};

		expose['notify'] = function() {
			for(var e in timers) {
				clearTimeout(timers[e].t_id);
				timeout(e);
			}
		};
		
})(window);