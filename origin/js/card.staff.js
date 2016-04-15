(function() {
	var __func__ = 'StaffCard';
	
	var className = 'card-staff';
	var idleTimeoutDuration = 25 * 1000;
	
	var container;
	
	var idleTimeout = 0;
	
	var construct = function(user, locked) {
		
		$(container).children('.'+className+':not(.dead)').remove();
		
		var self = {
			
			dom: $('<div class="'+className+'"></div>').appendTo(container),
			
			template: function() {
				$(self.dom).append('<div class="filler">staff</div>')
					.click(function() {
						global.warn('You need a staffer to sign you out!');
					});
			},
			
			create: function(user) {
				if(user.type !== 'staff') {
					// user is not staff
					return global.error('User is not staff');
				}
				if(user.status !== 'active') {
					return global.error('Staffer not active');
				}
				
				$(self.dom).addClass('active');
				
				$('<div class="card-data-user">'
					+'<div class="user-name">'+user.fullname+'</div>'
					+'<div class="user-email">'+Email.link(user.email, 'user-email')+'</div>'
					+'<div class="user-expires">staff</div>'
				+'</div>')
					.appendTo(self.dom)
					.parent()
						.click(function(e) {
							global.destroy();
						});
			},
		};
		
		if(!user) {
			self.template();
		}
		else {
			self.create(user);
		}
		
		
		var public = function() {
			
		};
		
		
		
		$.extend(public, {
			
			nudge: function(stayAwakeDuration) {
				if(!locked) {
					if(idleTimeout) clearTimeout(idleTimeout);
					idleTimeout = setTimeout(global.destroy, stayAwakeDuration? stayAwakeDuration: idleTimeoutDuration);
				}
			},
			
			getDom: function() {
				 return self.dom;
			},
			
			getUser: function() {
				return user;
			},
			
			getId: function() {
				return user.id;
			},
			
		});
		
		return public;
	};
	
	
	var instance;
	
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			listeners.clear();
			instance = construct.apply(this, arguments);
			if(jqs) {
				if(MemberCard.hasUser()) {
					MemberCard.authorize();
				}
				else {
					new UserAdmin(jqs);
				}
			}
			UserGear.readyCheck();
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
			new global();
			instance = false;
		}
	};
	
	
	var listeners = new Listener();
	
	$.extend(global, {
		
		bind: listeners.bind,
		
		nudge: function() {
			if(instance) {
				instance.nudge.apply(this, arguments);
			}
		},
		
		getUser: function() {
			return (instance && instance.getUser());
		},
		
		getId: function() {
			return (instance && instance.getId());
		},
		
		hasUser: function() {
			return !!instance;
		},
		
		destroy: function() {
			clearTimeout(idleTimeout);
			listeners('destroy');
			if(instance) {
				var clone = instance.getDom();
				$(clone).addClass('dead');
				setTimeout(function() {
					$(clone).remove();
				}, parseFloat(CSS.card.staff.$fadeOutDuration)*1000);
			}
			new global();
			instance = false;
			UserGear.readyCheck();
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