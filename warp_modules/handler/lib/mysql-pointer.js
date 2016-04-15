// require mysql database
var mysql      = require('mysql');


(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'MySQL_Pointer';
	
	var instance;
	
	
	var construct = function(database) {
		
		/**
		* private:
		**/
		var tableName;
		var connection;
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		(function() {
			connection = mysql.createConnection({
				host     : 'localhost',
				user     : 'root',
				password : '',
			});
		})();
		
		/**
		* public:
		**/
			operator['useTable'] = function(name) {
				tableName = name;
			};
			
			operator['insert'] = function(obj, fn) {
				connection.query('INSERT INTO '+target+' SET ?', obj, fn);
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
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(exports);