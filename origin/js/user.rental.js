(function() {
	
	var __func__ = 'UserRental';
	
	var instance;
	
	var container;
	
	
	var checkedOutClassName = 'checked-out';
	
	var checkoutHideDuration = 1200;
	
	var construct = function(user) {
		
		if(!user) {
			GearBrowser.destroy();
			$('.rental-cart').remove();
			return false;
		}
		
		var rentals = [];
		var items   = {};
		
		var self = {
			/*
			out: $('<div class="'+checkedOutClassName+'">'
				+'<div class="'+checkedOutClassName+'-title">Checked Out</div>'
				+'<div class="'+checkedOutClassName+'-body"></div>'
			+'</div>')
				.appendTo(container),
			*/
			cart: $('<div class="rental-cart">'
				+'<div class="rental-cart-title">'
					+'<button class="open-browser">Gear &gt;</button>'
					+'<span>Renting...</span>'
				+'</div>'
				+'<div class="rental-cart-body"></div>'
			+'</div>').appendTo(container)[0],
			
			presentCheckout: function() {
				$(
					'<button class="checkout">checkout</button>'
				)
				.appendTo(container)
				.click(function() {
					if(StaffCard.hasUser()) {
						var staffId = StaffCard.getId();
						var memberId = MemberCard.getId();
						
						var i = rentals.length;
						var goal = (1 << i) - 1
						var count = 0;
						while(i--) {
							console.info(rentals[i].getItem());
							$.ajax({
								url: 'gear-rental.checkout.php',
								type: 'GET',
								data: {
									'gearId': rentals[i].getItem().id,
									'detail': rentals[i].getItem().detail || '',
									'memberId': memberId,
									'staffId': staffId,
									'image': rentals[i].getItem().image,
								},
								success: (function() {
									var dom = this.dom;
									var index = this.index;
									return function() {
										dom.slideUp();
										count |= (1 << index);
										if(count === goal) {
											$('.checkout').slideUp(checkoutHideDuration*0.5);
											setTimeout(function() {
												$('.checkout').remove();
											}, checkoutHideDuration*0.5);
											
											new MemberCard();
											new StaffCard();
											
											new UserGear(user);
										}
									};
								}).apply({dom:rentals[i].getDom(), index: i}),
							});
						}
					}
					else {
						global.error('No staffer present');
					}
				});
			},
			revokeCheckout: function() {
				if($('.checkout').length) {
					$('.checkout').fadeOut(checkoutHideDuration);
					setTimeout(function() {
						$('.checkout').remove();
					}, checkoutHideDuration);
				}
			},
		};
		self.cartBody = $(self.cart).find('.rental-cart-body');
		$(self.cart).find('button.open-browser').click(function(e) {
			e.stopPropagation();
			if(!GearBrowser.isOpen()) {
				new GearBrowser(self.cart);
			}
			else {
				new GearBrowser();
			}
		});
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
			rent: function(item) {
				rentals.push(new GearItem(item, self.cartBody));
				items[item.uid] = item;
				
				public.readyCheck();
				StaffCard.nudge();
			},
			
			readyCheck: function() {
				if(StaffCard.hasUser()) {
					if(rentals.length) {
						self.presentCheckout();
					}
					else {
						self.revokeCheckout();
						// TODO
					}
				}
				else {
					self.revokeCheckout();
					// TODO
				}
			},
			
			hasItem: function(item) {
				return !!items[item.uid];
			},
			
			highlight: function(item) {
				
			},
			
			find: function(crt) {
				var found = [];
			
				var i = rentals.length;
				while(i--) {
					var item = rentals[i].getItem();
					var match = true;
					for(var e in crt) {
						if(item[e] != crt[e]) {
							match = false;
							break;
						}
					}
					if(match) {
						found.push(rentals[i]);
					}
				}
				
				return found;
			},
		});
		
		$.getJSON('gear-rental.lookup.php?member='+user.member, function(json) {
			var i = json.length;
			while(i--) {
				new GearItem(json[i], $(self.out).find('.'+checkedOutClassName+'-body')[0]);
			}
		});
		
		
		return public;
		
	};
	
	
	
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
		}
	};
	
	
	
	$.extend(global, {
		
		find: function(crt) {
			return (instance && instance.find(crt));
		},
		
		readyCheck: function() {
			return (instance && instance.readyCheck());
		},
		
		hasMember: function() {
			return !!instance;
		},
		
		hasItem: function(item) {
			return (instance && instance.hasItem(item));
		},
		
		highlight: function(item) {
			return (instance && instance.highlight(item));
		},
		
		//
		rent: function(item) {
			return (instance && instance.rent(item));
		},
		
		//
		checkin: function(item) {
			return (instance && instance.checkin(item));
		},
		
		//
		scan: function(item) {
			if(item.rental === '0') {
				return global.rent(item);
			}
			else {
				return global.checkin(item);
			}
		},
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		//
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
	});
})();