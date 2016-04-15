(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Rental';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;

	var selectElement = function(qs) {
		var qsr = $(qs);
		if(!qsr.length) return expose.error('selector returned empty set: ',qs);
		return qsr.get(0);
	};
	
	var construct = function() {
		
		/**
		* private:
		**/
		// assure the selector returns an element
		var root = DOM_ROOT;

		var rentList = [];
		var returnList = [];

		var rentListDom;
		var returnListDom;

		var findRentItem = function(g_id, fn) {
			for(var i=rentList.length-1; i>=0; i--) {
				if(rentList[i].g_id == g_id) {
					fn(i, rentList[i]);
					break;
				}
			}
		};

		var findReturnItem = function(g_id, fn) {
			for(var i=returnList.length-1; i>=0; i--) {
				if(returnList[i].g_id == g_id) {
					fn(i, returnList[i]);
					break;
				}
			}
		};

		// construct the dom
		(function() {
			$(root).find('#rent-label')
				.html(
					'<span class="rent-label"></span>'
					);

			$(root).find('#rent-list-scroll')
				.html(
					'<div class="rent-section renting">'
						+'<div class="list-header">'
							+'<span>Renting:</span>'
							+'<select>'
								+'<option value="24">1 day</option>'
								+'<option value="48" selected>2 days</option>'
								+'<option value="72">3 days</option>'
								+'<option value="120">5 days</option>'
								+'<option value="168">7 days</option>'
								+'<option value="240">10 days</option>'
								+'<option value="336">2 weeks</option>'
							+'</select>'
						+'</div>'
					+'</div>'
					+'<div class="rent-section returning">'
						+'<div class="list-header"><span>wants to return:</span></div>'
					+'</div>'
					);

			rentListDom = $(root).find('#rent-list .renting').get(0);
			returnListDom = $(root).find('#rent-list .returning').get(0);
		})();
		
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator['add'] = function(item) {

				// empty list, make sure the dom is showing
				$(root)
					.removeClass('empty')
					.find('#rent-list-scroll .renting').show();

				// this gear limits 1 per item
				if(item.limit == 1) {

					// check that it is not already being checked out
					for(var i=rentList.length-1; i>=0; i--) {

						// this gear already appears in the list
						if(rentList[i].g_id == item.g_id) {
							return Blip.warn('Gear was already scanned for renting')
						}
					}

					// gear was not yet added
				}

				// or no limit to gear, add it to the list
				rentList.push(item);

				// add the item's dom to the layout
				new GearItem(item, function(html) {
					$(html)
						.appendTo(rentListDom)
						.click(function(e) {
							e.stopPropagation();
							var this_item = this;
							$('.gear.selected').removeClass('selected');
							$('.gear-remove_item').remove();
							$(this_item).addClass('selected');
							$('<span class="gear-remove_item">X</span>')
								.appendTo(this_item)
								.click(function() {
									var g_id = $(this_item).attr('g_id');

									// find this item in the list and remove it
									findRentItem(g_id, function(i) {
										rentList.splice(i, 1);
									});

									$(this_item).slideUp('normal', function() {
										$(this_item).remove();
									});
								});
						});
				});
			};

			operator['rented'] = function(g_id) {
				$(rentListDom).find('.gear[g_id="'+g_id+'"]').remove();
				var item;
				findRentItem(g_id, function(i, v) {
					item = v;
					rentList.splice(i, 1);
				});
				!rentList.length && $(root).find('#rent-list-scroll .renting').hide();
				// ShowRentals().add(item);
			};

			operator['getRentItems'] = function() {
				return rentList;
			};

			operator['getReturnItems'] = function() {
				return returnList;
			};

			operator['getDurationHours'] = function() {
				return 24 * 3;
			};

			operator['returns'] = function(item) {
				$(root)
					.removeClass('empty')
					.find('#rent-list-scroll .returning').show();

				// add this item to the return list
				returnList.push(item);

				new GearItem(item, function(html) {
					$(html)
						.appendTo(returnListDom)
						.click(function(e) {
							e.stopPropagation();
							var this_item = this;
							$('.gear.selected').removeClass('selected');
							$('.gear-remove_item').remove();
							$(this_item).addClass('selected')
							$('<span class="gear-remove_item">X</span>')
								.appendTo(this_item)
								.click(function() {
									var g_id = $(this_item).attr('g_id');

									// find the item in the return list and remove it
									var item;
									findReturnItem(g_id, function(i, v) {
										item = v;
										returnList.splice(i, 1);
									});

									$(this_item).slideUp('normal', function() {
										$(this_item).remove();
									});

									ShowRentals().add(item);
								});
						});
				});
			};

			operator['returned'] = function(g_id) {
				$(returnListDom).find('.gear[g_id="'+g_id+'"]').remove();
				findReturnItem(g_id, function(i) {
					returnList.splice(i, 1);
				});
				!returnList.length && $(root).find('#rent-list-scroll .returning').hide();
			};

			operator['destroy'] = function() {
				rentList.length = 0;
				returnList.length = 0;
				$(root).find('#rent-label').empty();
				$(root).find('#rent-list-scroll').empty();
				$(root).addClass('empty');
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

		expose['add'] = function() {
			if(instance) {
				instance.add.apply(this, arguments);
			}
			else {
				Blip.warn('Must scan a user first');
			}
		};

		expose['getRentItems'] = function() {
			return (instance && instance.getRentItems()) || [];
		};

		expose['getReturnItems'] = function() {
			return (instance && instance.getReturnItems()) || [];
		};

		expose['rented'] = function(g_id) {
			return instance && instance.rented(g_id);
		};

		expose['returned'] = function(g_id) {
			return instance && instance.returned(g_id);
		};
		
})(window);