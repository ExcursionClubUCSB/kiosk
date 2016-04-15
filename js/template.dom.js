(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Instance';
	
	var instance;
	var castArray = Array.prototype.slice;
	
	var construct = function(qs) {
		
		/**
		* private:
		**/
		var dom;
		
		// assure the selector returns an element
		(function() {
			var qsr = $(qs);
			if(!qsr.length) pcs.error('selector returned empty set: ',qs);
			else dom = qsr.get(0);
		})(); if(!dom) return false;
		
		
		// construct the dom
		(function() {
			
		})();
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
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
		
})(window);