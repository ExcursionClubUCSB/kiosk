(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'SDB';

	var err_unknown = function(fn) {
		return this;
	};
	
	// print messages to console
	var print;
	(function() {
		var castArray = Array.prototype.slice;
		print = {
			warn: function() {
				var args = castArray.call(arguments);
				args.unshift(__func__+':');
				console.warn.apply(console, args);
			},
			error: function() {
				var args = castArray.call(arguments);
				args.unshift(__func__+':');
				console.error.apply(console, args);
				return prim(false, err_unknown);
			},
		};
	})();

	// build primitive chain function
	var prim = function(ready, error) {
		var noop = function(){};
		return {
			ready: ready || noop,
			error: error || noop,
		};
	};

	// escape a value
	var escapeValue = function(val) {
		return "'"+(val+'').replace(/(['])/g, '\\$1')+"'";
	};

	// escape irks
	var escapeIrks = function(val) {
		return (val+'').replace(/(['])/g, '\\$1');
	};

	var instance;

	var ss_prefix = './sdb/';
	
	var construct = function(fstr) {
		
		/**
		* private:
		**/

		// prepare to reference success/failure callbacks
		var fn_ready;
		var fn_error;
		
		// assert proper argument count
		var fargs = arguments;
		if(!fargs.length) {
			return print.error('no url given');
		}

		// replace values in formatted string
		var uri;
		(function() {
			var argi = 1;
			uri = fstr.replace(/(\?\?)/g, function() {
				if(typeof fargs[argi] == 'undefined') {
					print.warn('no argument given for substitution number: '+argi+'\nreplacing with empty string');
					return '';
				}
				return escapeIrks(fargs[argi++]);
			});
			uri = fstr.replace(/(\?)/g, function() {
				if(typeof fargs[argi] == 'undefined') {
					print.warn('no argument given for substitution number: '+argi+'\nreplacing with empty string');
					return '';
				}
				return escapeValue(fargs[argi++]);
			});
		})();

		// handling ready callback before/after response
		var handleSuccess = function() {
			if(!fn_ready) {
				var saved = {that: this, what: arguments};
				fn_ready = function(fn) {
					fn.apply(saved.that, saved.arguments);
				};
			}
			else {
				fn_ready.apply(this, arguments);
			}
		};

		// handling error callback before/after response
		var handleError = function(json) {
			if(json.error && json.error.code=='ER_CON_COUNT_ERROR') {
				// uh oh
			}
			if(!fn_error) {
				var saved = {that: this, what: arguments};
				fn_error = function(fn) {
					fn.apply(saved.that, saved.arguments);
				};
			}
			else {
				fn_error.apply(this, arguments);
			}
		};

		// execute ajax call
		$.ajax({
			url: ss_prefix+encodeURIComponent(uri),
			dataType: 'json',
			success: handleSuccess,
			error: handleError,
		})

		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator['ready'] = function(fn) {
				if(fn_ready) {
					fn_ready(fn);
				}
				else {
					fn_ready = fn;
				}
				return operator;
			};

			operator['error'] = function(fn) {
				if(fn_error) {
					fn_error(fn);
				}
				else {
					fn_error = fn;
				}
				return operator;
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
		

		expose['get'] = function(fstr) {
			return construct.apply({}, arguments);
		};
		
})(window);