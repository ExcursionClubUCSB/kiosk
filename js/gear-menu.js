(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'GearMenu';
	
	var instance;
	var castArray = Array.prototype.slice;
	var DOM_ROOT = document.body;


	var categoryMap = {
		'atc & carabiner': 'Carabiner + ATC',
	};

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
		var dom;

		// construct the dom
		(function() {
			$(root).removeClass('empty');

			$(root).find('.list-header').show().find('span').html('wants to rent:');

			dom = $(root).find('#gear-list-scroll').get(0);

			DB.get('gear@(limit!=1)').ready(function(items) {
				var grouped = {};
				for(var i=items.length-1; i>=0; i--) {
					var dept = items[i].department;
					var cat = items[i].category;
					if(!grouped[dept]) grouped[dept] = {};
					var subgroup = grouped[dept];
					if(!subgroup[cat]) subgroup[cat] = [];
					subgroup[cat].push(items[i]);
				}

				var floatList = '<div class="gear_menu">';

				for(var department in grouped) {
					var menuList = '';

					var set = grouped[department];
					for(var category in set) {
						var specList = '';

						var distinguisher = GearItem.getDistinguisher(category);
						var items = set[category];
						for(var i=items.length-1; i>=0; i--) {
							var item = items[i];
							var text = distinguisher(item);
							specList += '<div class="gear_menu-menu-list-item-speclist-item" g_id="'+item.g_id+'">'
								+'<div>'
									+'<img src="photos/thmb/'+item.photo_id+'.jpg"/>'
									+'<span class="caption">'+text+'</span>'
								+'</div>'
							+'</div>'
						}

						menuList += '<div class="gear_menu-menu-list-item">'
							+'<div class="gear_menu-menu-list-item-label">'+(categoryMap[category] || category[0].toUpperCase()+category.substr(1))+'</div>'
							+'<div class="gear_menu-menu-list-item-speclist">'
								+specList
							+'</div>'
						+'</div>';
					}

					floatList += '<div class="gear_menu-menu">'
						+'<div class="gear_menu-menu-label">'+department[0].toUpperCase()+department.substr(1)+'</div>'
						+'<div class="gear_menu-menu-list">'
							+menuList
						+'</div>'
					+'</div>';
				}

				floatList += '</div>';

				$(dom).html(floatList);


				$('.gear_menu-menu-label').click(function() {
					var menuList = $(this).siblings('.gear_menu-menu-list');
					$(root).find('.gear_menu-menu-list').not(menuList).slideUp();
					if(menuList.is(':visible')) {
						menuList.slideUp();
					}
					else {
						menuList.slideDown(450);
					}
				});


				$('.gear_menu-menu-list-item-label').click(function() {
					var specList = $(this).siblings('.gear_menu-menu-list-item-speclist');
					$(root).find('.gear_menu-menu-list-item-speclist').not(specList).slideUp();
					if(specList.is(':visible')) {
						specList.slideUp();
					}
					else {
						specList.slideDown(250);
					}
				});


				$('.gear_menu-menu-list-item-speclist-item').click(function() {
					DB.get('gear@(g_id=?)', $(this).attr('g_id'))
					.ready(function(gear) {
						Rental().add(gear[0]);
					});
				});

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
			operator['destroy'] = function() {
				$(root).addClass('empty');
				$(root).find('.list-header').hide();
				$(dom).empty();
			};
		
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