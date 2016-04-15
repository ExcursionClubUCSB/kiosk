(function() {
	
	var __func__ = 'RfidHandler';
	
	
	var global = window[__func__] = function() {
		global.handle.apply(this, arguments);
	};
	
	
	var bound = false;
	
	$.extend(global, {
		
		// handle a tag scan response
		handle: function(json) {
			
			console.log('handling ',json);
			
			if(bound && typeof bound == 'function') {
				console.log('bound to ',bound);
				return bound(json);
			}
			
			// check the tag exists
			if(!json.exists) {
				return global.error('Tag was not found in the system!');
			}
			
			// switch on the type of tag
			switch(json.tagType) {
				
				case 'gear':
					if(MemberCard.hasUser()) {
						UserGear.scan(json);
					}
					else {
						var rentals = json.rentals;
						var userId;
						var i = rentals.length;
						while(i--) {
							if(rentals[i].status == 'out') {
								userId = rentals[i].memberId;
								break;
							}
						}
						
						var user;
						if(userId) {
							var db = Database.get('excursion/user');
							var i = db.length;
							while(i--) {
								if(db[i].id == userId) {
									user = db[i];
								}
							}
						}
						else {
							global.info('That Gear isn\'t checked out');
							setTimeout(function() {
								global.warn('Enter a <u>Member</u> before checking out gear');
							}, 2500);
							return;
						}
						
						if(user) {
							new MemberCard(user);
						}
						else {
							return global.error('Member associated with rental was removed from database!');
						}
					}
					break;
				
				case 'user':
				
					if(json.type == 'member') {
						if(!MemberCard.isUser(json)) {
							new MemberCard(json);
						}
						else {
							global.warn('You already scanned');
						}
						break;
					}
					else if(json.type == 'staff') {
						// if a member is scanned
						if(MemberCard.hasUser()) {
							
							// and the member is not this staffer
							if(!MemberCard.isUser(json)) {
								
								// set the staffer
								new StaffCard(json);
							}
							// the staffer is trying to sign themself out..
							else {
								new StaffCard(json);
								//global.error('You must have another staffer sign you out');
							}
							
						}
						// member hasn't scanned yet, allow staffer to perform administrativ operations
						else {
							new StaffCard(json);
						}
						break;
					}
				default:
					return global.error('tagType not found: ',json.tagType);
			}
			
		},
		
		bind: function(forward) {
			bound = forward;
		},
		
		release: function() {
			bound = false;
		},
		
		error: MessageHandler.error,
		
		warn: MessageHandler.warn,
		
		info: MessageHandler.info,
		
		toString: function() {
			return __func__+'()';
		},
	});
})();