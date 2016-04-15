(function() {
	var __func__ = 'MemberCard';
	
	var className = 'card-member';
	
	var container;
	
	var fadeOutDuration = parseFloat(CSS.card.member.$fadeOutDuration)*1000;
	
	var certifications = {
		'ocean-kayak': 'Kayaking',
		'sup': 'Stand-Up Paddle Boarding',
		'white-water-kayak': 'White Water Kayaking',
	};
	
	var construct = function(user, temporary) {
	
		UserAdmin.logout();
		
		$(container).children('.'+className+':not(.dead)').remove();
		
		var self = {
			
			dom: $('<div class="'+className+'"></div>').appendTo(container),
			
			template: function() {
				$('<div class="filler">member</div>')
					.appendTo(self.dom)
					.parent()
						.click(function(e) {
							e.stopPropagation();
							$(self.dom).empty();
							var input = $(
								'<div class="member-search">'
									+'<input type="text" class="empty" value="Enter Name or Phone or Email"></input>'
								+'</div>'
							)
								.appendTo(self.dom)
								.children('input')[0];
							
							new UserSearch(input, 'member-search-results');
						});
						
				new UserGear();
			},
			
			create: function(user) {
				if((user.type != 'member') && (user.type != 'staff')) {
					return global.error('ERROR: Member exception. ',user.type,' is not staff or member');
				}
				if(user.status == 'banned') {
					// user banned from club
					return global.error('That user has been permanently banned from the club');
				}
				var userExpired = (Timestamp(user.expires) <= Timestamp());
				if(!userExpired || user.type == 'staff') {
					$(self.dom).addClass('active');
					if(!UserAdmin.hasStage()) {
						new UserGear(user, temporary);
					}
				}
				else {
					$(self.dom).addClass('error');
					global.warn('User\'s membership has expired');
					
					if(!UserAdmin.hasStage()) {
						new UserGear(user, temporary, true);
					}
				}
				
				var certs = '';
				for(var e in certifications) {
					certs += '<span class="user-cert-'+e+''+(user['certified-'+e]?' certified':'')+'" cert="'+e+'"><img src="resource/cert.'+e+'.png"/></span>';
				}
				certs += '<span class="user-wristband '+(user['uid'].length?' has':'')+'"><img src="resource/wristband.png"/></span>';
				
				var editIcon = function(editType) {
					return '<span class="edit-icon" edit="'+editType+'"></span>';
				};
				
				$('<div class="card-data-user">'
					+'<div class="user-name">'+editIcon('fullname')+user.fullname+'</div>'
					+'<div class="user-phone">'+editIcon('phone')+Phone.format(user.phone)+'</div>'
					+'<div class="user-email">'+editIcon('email')+Email.link(user.email, 'user-email')+'</div>'
					+'<div class="user-expires">'
						+'membership expire'+(userExpired?'d':'s')+': '+(new Timestamp(user.expires)).format('m/d/yy')
						+'<span class="extend-icon"></span>'
					+'</div>'
					+'<div class="user-cert">'
						+certs
					+'</div>'
				+'</div>')
					.appendTo(self.dom);
					
				$(self.dom).click(function() {
					new global();
					instance = false;
				});
			},
			
			authorize: function() {
				// certifications
				$(self.dom).find('.user-cert>span[class|="user-cert"]')
					.addClass('authorized')
					.click(function(e) {
						e.stopPropagation();
						cert = $(this).attr('cert');
						global.prompt('Certify '+user.fullname+' for '+certifications[cert], function(staff) {
							$.getJSON('member.certify.php?email='+user.email+'&cert='+cert+'&staff='+staff.id, function() {
								$(self.dom).find('.user-cert-'+cert).addClass('certified');
							});
						});
					});
					
				// wristband
				$(self.dom).find('.user-cert>span.user-wristband')
					.addClass('authorized')
					.click(function(e) {
						e.stopPropagation();
						cert = $(this).attr('');
						var promptMsg = user.uid.length
							? 'Confirm '+user.fullname+' has payed <em>$5.00</em> for a new wristband'
							: 'Approve free wristband for '+user.fullname;
						global.prompt(promptMsg, function(staff) {
							MessageHandler.wristband(user, staff, function() {
								$(self.dom).find('.user-cert-wristband').addClass('certified');
							});
						});
					});
					
				// edit membership
				/**
				$(self.dom).find('.edit-icon')
					.addClass('authorized')
					.click(function(e) {
						e.stopPropagation();
						var field = $(this).attr('edit');
						MessageHandler.nicePrompt(
							// construct
							function() {
								$('<span>Edit user\'s '+field+':</span>'
									+'<input type="text" value="'+user[field]+'" style="margin-top:45px;"></input>'
								).appendTo(this);
							},
							// success
							function() {
								
							}
						);
					});
				/**/
					
				// extend membership
				$(self.dom).find('.extend-icon')
					.addClass('authorized')
					.click(function(e) {
						e.stopPropagation();
						MessageHandler.prompt('Confirm '+user.fullname+' has payed <em>$40.00</em> for a 1 year extension', function() {
							$.getJSON('member.extend.php?id='+user.id, function(json) {
								if(json.length) {
									MessageHandler.info(user.fullname+'\'s membership has been extended by 1 year: '
										+(new Date(parseInt(json[0].expires)*1000)).toDateString()
									);
									self.update();
								}
								else {
									MessageHandler.error('Server Error. User\'s membership was not extended.');
								}
							})
						});
					});
			},
			
			searchMember: function(e) {
				
			},
			
			update: function() {
				$.getJSON('member.resolve.php?id='+user.id, function(user) {
					user.exists = true;
					user.tagType = 'user';
					new MemberCard(user);
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
			getUid: function() {
				return user.uid;
			},
			
			getDom: function() {
				 return self.dom;
			},
			
			getId: function() {
				return user.id;
			},
			
			authorize: function() {
				if(StaffCard.hasUser()) {
					self.authorize();
					UserGear.authorize();
				}
			},
		});
		
		if(temporary) {
			setTimeout(function() {
				global.destroySlow();
			}, fadeOutDuration*0.5);
		}
		else {
			public.authorize();
		}
		
		return public;
	};
	
	
	var instance;
	
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			if(!arguments.length) {
				instance = false;
			}
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
			new global();
		}
	};
	
	
	
	$.extend(global, {
		
		authorize: function() {
			return (instance && instance.authorize());
		},
		
		getId: function() {
			return (instance && instance.getId());
		},
		
		isUser: function(user) {
			return (instance && (instance.getUid() == user.uid));
		},
		
		hasUser: function() {
			return !!instance;
		},
		
		destroy: function() {
			new global();
			instance = false;
		},
		
		destroySlow: function() {
			if(instance) {
				UserGear.destroySlow();
				
				var clone = instance.getDom();
				$(clone).addClass('dead');
				
				setTimeout(function() {
					$(clone).remove();
				}, fadeOutDuration);
				
				new global();
				instance = false;
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
		
		prompt: MessageHandler.prompt,
	});
})();