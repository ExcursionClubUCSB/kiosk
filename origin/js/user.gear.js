(function() {
	
	var __func__ = 'UserGear';
	
	var instance;
	
	var container;
	
	
	var checkedOutClassName = 'checked-out';
	var rentalCartClassName = 'rental-cart';
	
	var checkoutHideDuration = 1200;
	
	var fadeOutDuration = parseFloat(CSS.gear.block.$fadeOutDuration)*1000;
	
	var construct = function(user, dead, returnsOnly) {
		
		console.log('new User Gear');
		
		GearBrowser.destroy();
		
		if(!user) {
			$('.'+checkedOutClassName+':not(.dead)').remove();
			$('.'+rentalCartClassName).remove();
			return false;
		}
		else {
			$('.'+checkedOutClassName+':not(.dead)').remove();
			$('.'+rentalCartClassName).remove();
		}
		
		var items   = {};
		
		var rentals = [];
		var outGear = [];
		
		var target = outGear;
		
		var self = {
			
			out: $('<div class="'+checkedOutClassName+' ">'
				+'<div class="'+checkedOutClassName+'-title">'
					+'<button class="open-rental">Rent more</button>'
					+'<span>Checked Out</span>'
				+'</div>'
				+'<div class="'+checkedOutClassName+'-body"></div>'
			+'</div>')
				.appendTo(container)[0],
				
			cart: dead || returnsOnly? false: $('<div class="'+rentalCartClassName+'">'
				+'<div class="'+rentalCartClassName+'-title">'
					+'<button class="open-browser">Gear &gt;</button>'
					+'<span>Renting...</span>'
				+'</div>'
				+'<div class="'+rentalCartClassName+'-body"></div>'
			+'</div>').appendTo(container)[0],
			
			presentCheckout: function() {
				if(!$('.checkout.date').length) {
					$(
						'<select class="checkout date">'
							+'<option value="14">+2 weeks</option>'
							+'<option value="10">+10 days</option>'
							+'<option value="7">+7 days</option>'
							+'<option value="7">+5 days</option>'
							+'<option value="3" selected>+3 days</option>'
							+'<option value="2">+2 days</option>'
							+'<option value="1">+1 day</option>'
						+'</select>'
					)
					.appendTo(container);
				}
				
				$(
					'<button class="checkout">checkout</button>'
				)
				.appendTo(container)
				.click(function() {
					console.log('presentCheckout()');
					if(StaffCard.hasUser()) {
						var staffId = StaffCard.getId();
						var memberId = MemberCard.getId();
						
						var i = rentals.length;
						var goal = (1 << i) - 1
						var count = 0;
						while(i--) {
							var item = rentals[i].getItem();
							$.ajax({
								url: 'gear-rental.checkout.php',
								type: 'GET',
								data: {
									'gearId': item.id,
									'catalog': item.catalog,
									'uid':     item.uid,
									'detail': item.detail || '',
									'memberId': memberId,
									'expectedBack': Math.floor((new Date()).getTime() * 0.001) + 60*60*24*parseInt($('.checkout.date').val()),
									'staffId': staffId,
									'image': item.image,
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
											
											StaffCard.destroy();
											
											new MemberCard(user, true);
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
			
			presentFinish: function() {
				$(
					'<button class="finish">finish</button>'
				)
				.appendTo(container)
				.click(function() {
					console.log('presentFinish()');
					$(this).remove();
					StaffCard.destroy();
					MemberCard.destroy();
				});
			},
			
			rentalMode: function() {
				$(self.out).hide();
				target = rentals;
			},
			
		};
		
		if(self.cart) {
			self.cartBody = $(self.cart).find('.rental-cart-body');
			
			$(self.cart).find('button.open-browser').click(function(e) {
				console.log('button.open-browser()');
				e.stopPropagation();
				if(!GearBrowser.isOpen()) {
					new GearBrowser(self.cart);
				}
				else {
					new GearBrowser();
				}
			});
		}
		
		$(self.out).find('button.open-rental').click(function(e) {
			console.log('buttn.open-rental()');
			e.stopPropagation();
			self.rentalMode();
		});
		
		
		var public = function() {
			
		};
		
		$.extend(public, {
			
			authorize: function() {
				if(StaffCard.hasUser() && !dead) {
					$(self.out).addClass('authorized')
						.find('.gear-item').click(function() {
							console.log('.gear-item()');
							StaffCard.nudge();
							public.checkin($(this).attr('uid'), this);
						});
					StaffCard.bind('destroy', function() {
						$(self.out).removeClass('authorized')
							.find('.gear-item').unbind('click');
					});
				}
			},
			
			rent: function(item) {
				
				if(public.hasItem(item)) {
					UserGear.highlight(json);
					return global.warn('Item was already scanned');
				}
				
				if(target == outGear) {
					if(!StaffCard.hasUser()) {
						MessageHandler.prompt('let '+user.fullname+' check-out more gear', function(tag) {
							new StaffCard(tag);
							public.authorize();
							global.info('Now scan any Gear you want to check out');
						});
						return;
					}
					else {
						self.rentalMode();
					}
				}
				
				rentals.push(new GearItem(item, self.cartBody));
				
				items[item.uid] = item;
				
				public.readyCheck();
				StaffCard.nudge();
				
				return true;
			},
			
			checkin: function(query, dom) {
				
				if(!StaffCard.hasUser()) {
					global.error('Need a Staffer to check in gear');
					return true;
				}
				
				if(!dom) {
					dom = $(self.out).find('.gear-item[uid="'+query.uid+'"]').get(0);
					if(!dom) {
						global.error('Gear was not checked back in properly');
					}
				}
				
				var uids;
				var i;
				
				if(typeof query === 'string') {
					uids = query.split(';');
					i = uids.length;
				}
				else {
					uids = [query.uid];
					i = 1;
				}
				
				var goal = (1 << i) - 1;
				var down = 0;
				while(i--) {
					var uid = uids[i];
					$.ajax({
						url: 'gear-rental.checkin.php',
						data: {
							uid: items[uid].uid,
							memberId: user.id,
							catalog: items[uid].catalog,
						},
						success: (function() {
							var uid = this.uid;
							var index = this.index;
							
							return function() {
								var k = outGear.length;
								while(k--) {
									var item_k = outGear[k].getItem();
									if(item_k.uid == uid) {
										outGear.splice(k, 1);
										break;
									}
								}
								
								down |= (1 << index);
								if(down == goal) {
									$(dom).slideUp();
									if(!outGear.length) {
										self.presentFinish();
									}
								}
							};
						}).apply({index:i, uid:items[uid].uid}),
					});
				}
				
				return true;
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
			
				var i = target.length;
				while(i--) {
					var item = target[i].getItem();
					var match = true;
					for(var e in crt) {
						if(item[e] != crt[e]) {
							match = false;
							break;
						}
					}
					if(match) {
						found.push(target[i]);
					}
				}
				
				return found;
			},
			
			destroySlow: function() {
				var clone = $(self.out).addClass('dead')[0];
				setTimeout(function() {
					$(clone).remove();
				}, fadeOutDuration);
			},
			
		});
		
		$.getJSON('gear-rental.lookup.php?member='+user.id, function(json) {
			var i = json.length;
			if(json.length) {
				while(i--) {
					var item = json[i];
					$.extend(item, {
						id: item.gearId,
						info: {
							title: item.text,
						},
						image: item.image || 'unknown.png',
						uid: item.uid,
					});
					
					outGear.push(new GearItem(item, $(self.out).find('.'+checkedOutClassName+'-body')[0]));
					items[item.uid] = item;
				}
				target = outGear;
				
				if(!dead) {
					public.authorize();
				}
			}
			else {
				self.rentalMode();
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
		
		destroySlow: function() {
			return (instance && instance.destroySlow());
		},
		
		authorize: function() {
			return (instance && instance.authorize());
		},
		
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
			if(item.checkedOut === '0') {
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
		error: MessageHandler.error,
		
		//
		warn: MessageHandler.warn,
		
		info: MessageHandler.info,
	});
})();