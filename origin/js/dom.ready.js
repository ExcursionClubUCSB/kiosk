
$(document).ready(function() {
	
	MessageHandler(document.body);
	
	Database.download('excursion/user', {
		every: 1000*60*5, // 5 minutes
		ready: function() {
		
			MemberCard('.user_block');
			StaffCard('.user_block');
			
			UserGear('.action_block');
			UserAdmin('.action_block');
			
			GearList('.action_block');
			
			new RfidScanner();
			
			$(document).click(function() {
				console.log('document click');
				if(!MemberCard.hasUser()) {
					new MemberCard();
				}
				new GearBrowser();
			});
			
			Initialize();
			
		},
	});
	
});

(function() {
	var __func__ = 'Initialize';
	
	var todo = [];
	var init = false;
	
	var construct = function() {
		var self = {
			
		};
		var public = function() {
			
		};
		$.extend(public, {
			
		});
		return public;
	};
	var global = window[__func__] = function() {
		while(todo.length) {
			todo.pop()();
		}
		init = true;
	};
	$.extend(global, {
		toString: function() {
			return __func__+'()';
		},
		
		ready: function(method) {
			if(init) {
				method();
			}
			else {
				todo.push(method);
			}
		},
	});
})();