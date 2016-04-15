(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'RootInstance';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;

	var selectElement = function(qs) {
		var qsr = $(qs);
		if(!qsr.length) return expose.error('selector returned empty set: ',qs);
		return qsr.get(0);
	};
	
	var construct = function(user) {
		
		/**
		* private:
		**/
		// assure the selector returns an element
		var root = DOM_ROOT;

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
			if(arguments.length) {
				DOM_ROOT = selectElement(arguments[0]) || DOM_ROOT;
			}
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
			return false;
		};
		
		//
		expose['warn'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(window);