(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'User';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;

	var selectElement = function(qs) {
		var qsr = $(qs);
		if(!qsr.length) return expose.error('selector returned empty set: ',qs);
		return qsr.get(0);
	};
	
	var construct = function(user, showRentalOkay) {

		/**
		* private:
		**/
		// assure the selector returns an element
		var root = DOM_ROOT;
		var rental;
		var rentals = [];
		var gearlist;
		var gearmenu;

		var rentalMode = function() {
			gearmenu && gearmenu.destroy();
			gearmenu = null;

			DB.get('rental@(m_id=?,status=0)', user.m_id)
			.ready(function(jsonRentals) {
				rentals = jsonRentals;
				if(rentals.length) {
					gearlist = new ShowRentals(rentals, showRentalOkay);
					gearlist.onMoreClick(function() {
						gearlist.destroy();
						gearlist = null;
						gearmenu = new GearMenu(user);
					});
				}
				else {
					gearmenu = new GearMenu(user);
				}
			});
		};

		// check if the user is authorized to checkout gear
		(function() {
			$.ajax({
				url: 'data/rental/authorize',
				type: 'POST',
				data: {
					who: -1,
					m_id: user.m_id,
				},
				dataType: 'json',
				success: function(json) {
					var error = json.error;
					if(error) {
						Blip.error(error.help || JSON.stringify(error));
					}
					else if(json.okay) {
						rental = new Rental();
					}
					else {
						Blip.error('Unknown error');
					}
				},
			});
		})();

		// construct the dom
		(function() {
			$(root).removeClass('empty');

			$(root).find('#user-info')
				.html(
					'<div class="user-fullname">'+user.fullname+'</div>'
					+'<div class="user-email">'+user.email+'</div>'
					+'<div class="user-phone">'+Format.phone(user.phone)+'</div>'
				);

			$(root).find('#user-status')
				.html(
					'<div class="user-since">'
						+'<span class="user-since-label">joined:</span>'
						+'<span class="user-since-date">'
							+Format.date(user.date_joined*1000)
						+'</span>'
					+'</div>'

					+((user.type == 'member') ?
						'<div class="user-expires">'
							+'<span class="user-expires-label">expires:</span>'
							+'<span class="user-expires-date">'
								+Format.date(user.date_expires*1000)
							+'</span>'
						+'</div>' : ''
					)
				);

			rentalMode();

			$(root).click(function() {
				operator.destroy();
			});
		})();
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator['hasChanges'] = function() {
				return !!Rental.getRentItems().length || !!Rental.getReturnItems().length;
			};

			operator['get'] = function(at) {
				return user[at];
			};

			operator['rentalMode'] = rentalMode;

			operator['destroy'] = function() {

				$(root).find('#user-info').empty();
				$(root).find('#user-status').empty();

				$(root).addClass('empty');

				rental && rental.destroy();
				gearlist && gearlist.destroy();
				gearmenu && gearmenu.destroy();


				instance = false;
			};
		

		Idlers.add('user', 1000*60*5, function() {
			instance.destroy();
			return false;
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function(peek) {
		if(this !== namespace) {
			// if there already is a user
			if(instance) {

				// if the list has been modified
				if(instance.hasChanges()) {

					// and this new user is a staff/super user
					if(peek.type != 'member' && peek.status == 'active') {

						// checkout gear
						new Approval(peek, function() {
							instance.rentalMode();
						});
						return;
					}

					// new user is not super user
					else {

						// user is already signed in!
						if(peek.m_id == instance.get('uid')) {
							return Blip.warn(instance.get('fullname')+' is already signed in!');
						}

						// different user
						return Blip.warn(instance.get('fullname').split(/ /)[0]+' has not been checked out yet!');
					}
				
					// nothing has changed (no new rentals)
				}

				else {
					instance.destroy();
				}
			}

			// finally otherwise, replace member
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

		expose['get'] = function(at) {
			return instance && instance.get(at);
		};
		
})(window);