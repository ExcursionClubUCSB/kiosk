
(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Static';
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {

	};
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
})(window);