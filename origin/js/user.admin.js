(function() {
	
	var __func__ = 'UserAdmin';
	
	var className = 'user-admin';
	
	var container;
	
	var instance;
	
	var buttons = {
		'Check in/out Gear for myself': function() {
			var user = UserAdmin.getUser();
			global.logout();
			new MemberCard(user);
			StaffCard.nudge();
		},
		
		'Show checked out Gear': function() {
			global.logout();
			new GearList();
		},
		
	};
	
	var construct = function(user) {
		
		var self = {
			dom: $('<div class="'+className+'">'
					+'<div class="'+className+'-title"><span>Administration</span></div>'
					+'<div class="'+className+'-body">'
					+'</div>'
				+'</div>'
				).appendTo(container).get(0),
			
			create: function() {
				for(var e in buttons) {
					$('<button class="'+className+'-body-button">'+e+'</button>')
						.appendTo($(self.dom).children('.'+className+'-body'))
						.click(buttons[e]);
				}
			},
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			hasStage: function() {
				return true;
			},
			logout: function() {
				$(self.dom).remove();
			},
			getUser: function() {
				return user;
			},
		});
		
		
		StaffCard.bind('destroy', global.logout);
		StaffCard.nudge();
		
		self.create();
		
		
		return public;
		
	};
	
	
	
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			global.logout();
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
			instance = false;
		}
	};
	
	
	
	$.extend(global, {
		
		getUser: function() {
			return (instance && instance.getUser());
		},
		
		hasStage: function() {
			return (instance && instance.hasStage());
		},
		
		logout: function() {
			console.log('Admin logging out');
			(instance && instance.logout());
			instance = false;
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