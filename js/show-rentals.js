(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'ShowRentals';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;

	var selectElement = function(qs) {
		var qsr = $(qs);
		if(!qsr.length) return expose.error('selector returned empty set: ',qs);
		return qsr.get(0);
	};
	
	var construct = function(rentals, okay) {
		
		/**
		* private:
		**/
		// assure the selector returns an element
		var root = DOM_ROOT;
		var dom = $(root).find('#gear-list-scroll').get(0);
		$(dom).empty();
		var moreButton;

		// return item
		var returnItem = function(g_id) {
			DB.get('gear@(g_id=?)', g_id)
				.ready(function(items) {
					Rental().returns(items[0]);
					$(dom).find('[g_id="'+g_id+'"]').eq(0).slideUp('normal', function() {
						$(this).remove();
					});
				});
		};

		var rentalSum = rentals.length;
		var accounted = 0;

		var addItem = function(item) {
			new GearItem(item, function(html) {
				accounted += 1;
				if(accounted == rentalSum) {
					rentalSum = -1;
					okay && okay();
				}

				var elem = $(html).insertBefore(moreButton);
				if(item.limit != 1) {
					$(elem).addClass('returnable');
					$(elem).click(function(e) {
						if($(this).hasClass('selected')) {

							// return this item (place it in "returning" section)
							returnItem($(elem).attr('g_id'));
						}
						else {
							$('.selected').removeClass('selected');
							$(elem).addClass('selected');
							e.stopPropagation();
							Idlers.notify();
						}
					});
				}
				else {
					$(elem).addClass('scannable');
					$(elem).click(function(e) {
						if($(this).hasClass('selected')) {
							// Blip the warning
							Blip.warn('That gear item must be scanned to be returned');
						}
						else {
							$('.selected').removeClass('selected');
							$(elem).addClass('selected');
							e.stopPropagation();
							Idlers.notify();
						}
					});
				}
			});
		};

		// construct the dom
		(function() {

			$(root).removeClass('empty');

			// $(dom).html('<div class="list-header"><span>has checked out:</span></div>');
			$(root).find('.list-header').show().find('span').html('has checked out:');

			moreButton = $('<button class="theme-bg-carbon" style="display:none;">rent more gear</button>').appendTo(dom).get(0);

			console.log('new show rentals');

			for(var i=rentals.length-1; i>=0; i--) {
				DB.get('gear@(g_id=?)', rentals[i].g_id)
					.ready(function(gears) {
						if(!gears.length) {
							return Blip.error('Gear item missing from database!');
						}
						var item = gears[0];

						addItem(item);
					});
			}
		})();
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator['add'] = addItem;

			operator['destroy'] = function() {
				$(root).addClass('empty');
				$(root).find('.list-header').hide();
				$(dom).empty();
			};

			operator['onMoreClick'] = function(fn) {
				$(moreButton).show();
				$(moreButton).click(fn);
			};

			operator['returns'] = function(g_id) {
				returnItem(g_id);
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