(function() {
	
	var __func__ = 'GearList';
	
	var instance = false;
	var container = false;
	
	var stayLoggedInDuration = 1000*60*5;
	
	var construct = function() {
		
		$('.gear-list').remove();
		
		var out = [];
		
		var self = {
			dom: $('<div class="gear-list">'
				+'<div class="gear-list-title"></div>'
				+'<div class="gear-list-filter"></div>'
				+'<div class="gear-list-body"></div>'
			+'</div>')
				.appendTo(container),
				
			create: function() {
				$.getJSON('gear-rental.lookup.php', function(json) {
					var i = json.length;
					var body = $(self.dom).find('.gear-list-body').get(0);
					
					var users = Database.get('excursion/user');
					
					while(i--) {
					
						var item = json[i];
					
						var wdate = (item.expectedBack != '0');
						var ddate = wdate? item.expectedBack: item.date;
						ddate = new Date(ddate*1000).toDateString();
						
						$.extend(item, {
							id: item.gearId,
							info: {
								title: item.text,
								date: wdate? 'due: '+ddate: 'taken: '+ddate,
							},
							classB: 'gear-list-item',
							image: item.image || 'unknown.png',
							uid: item.uid,
							click: function(it) {
								$.getJSON('member.resolve.php?email='+it.email, function(json) {
									new MemberCard(json);
								});
							},
						});
						
						var m = users.length;
						while(m--) {
							if(users[m].id == item.memberId) {
								item.info.user = users[m].fullname;
								item.email = users[m].email;
								break;
							}
						}
						
						out.push(new GearItem(item, body, 'detail'));
					}
				});
			},
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			logout: function() {
				$(self.dom).remove();
			},
		});
		
		self.create();
		StaffCard.bind('destroy', global.logout);
		StaffCard.nudge(stayLoggedInDuration);
		
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
			instance = false;
		}
	};
	
	
	
	$.extend(global, {
		
		logout: function() {
			return (instance && instance.logout());
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