(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Approval';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;

	var selectElement = function(qs) {
		var qsr = $(qs);
		if(!qsr.length) return expose.error('selector returned empty set: ',qs);
		return qsr.get(0);
	};
	
	var construct = function(user, okay) {
		
		/**
		* private:
		**/
		// assure the selector returns an element
		var root = DOM_ROOT;

		var m_id = User().get('m_id');

		var finished = {
			renting: false,
			returning : false,
		};
		var doneRenting = function() {
			finished.renting;
			finished.returning && okay();
		};
		var doneReturning = function() {
			finished.returning = true;
			finished.renting && okay();
		};

		// returning
		var items = Rental().getReturnItems();
		var returnExpecting = items.length;
		var returnCounted = 0;
		var invalid = false;
		finished.returning = !items.length;

		for(var i=items.length-1; i>=0; i--) {
			var item = items[i];
			$.ajax({
				url: 'data/rental/return',
				type: 'POST',
				data: {
					who: -1,
					m_id: m_id,
					g_id: item.g_id,
					who_returned: user.m_id,
				},
				dataType: 'json',
				success: function(json) {
					if(json.error) {
						return Blip.error(json.error);
					}
					returnCounted += 1;
					Rental.returned(json.g_id);
					if(returnCounted == returnExpecting) {
						doneReturning();
						console.log('succes');
					}
				},
			});
		}

		// renting
		var items = Rental().getRentItems();
		var rentExpecting = items.length;
		var rentCounted = 0;
		var duration = Rental().getDurationHours();
		var invalid = false;
		finished.renting = !items.length;

		for(var i=items.length-1; i>=0; i--) {
			var item = items[i];
			$.ajax({
				url: 'data/rental/checkout',
				type: 'POST',
				data: {
					who: -1,
					m_id: m_id,
					g_id: item.g_id,
					who_rented: user.m_id,
					duration: duration,
				},
				dataType: 'json',
				success: function(json) {
					if(json.error) {
						return Blip.error(json.error);
					}
					rentCounted += 1;
					Rental.rented(json.g_id);
					if(rentCounted == rentExpecting) {
						doneRenting();
						console.log('succes');
					}
				},
			});
		}


		// construct the dom
		(function() {
			$(root).find('#approval-who')
				.html(user.fullname);
			$(root).find('#approval-date')
				.html((new Date()).format('mm/dd/yy @ h:MM TT'));
			$(root).show();
			setTimeout(function() {
				$(root).fadeOut(2500);
			}, 2500);
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