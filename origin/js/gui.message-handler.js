(function() {
	
	var __func__ = 'MessageHandler';
	
	var container;
	var stage;
	
	var construct = function() {
		
		var self = {
			
		};
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
		});
		
		
		return public;
		
	};
	
	
	
	var global = window[__func__] = function(jqs) {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			var jqsr = $(jqs);
			if(!jqsr.length) return global.error('"',jqs,'" selector returned empty set');
			container = jqsr[0];
			stage = $('<div class="message-stage"></div>').appendTo(container).hide()[0];
		}
	};
	
	
	var fadeOut;
	
	
	$.extend(global, {
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			clearTimeout(fadeOut);
			var light = '#ffb0b0';
			var color = 'red';
			var final = 'maroon';
			$(stage)
				.stop()
				.css('opacity', 1)
				.show()
				.html(Array.cast(arguments).join(' '))
				.removeClass('info')
				.removeClass('warn')
				.addClass('error')
				.animate({backgroundColor:light},60)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:light},70)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:final},1020);
				
			fadeOut = setTimeout(function() {
				$(stage).fadeOut();
			}, 2500);
		},
		
		//
		warn: function() {
			clearTimeout(fadeOut);
			var light = '#ffffb0';
			var color = 'yellow';
			var final = '#FFDAB9';
			$(stage)
				.stop()
				.css('opacity', 1)
				.show()
				.html(Array.cast(arguments).join(' '))
				.removeClass('info')
				.removeClass('error')
				.addClass('warn')
				.animate({backgroundColor:light},60)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:light},70)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:final},1020);
				
			fadeOut = setTimeout(function() {
				$(stage).fadeOut();
			}, 2300);
		},
		
		info: function() {
			clearTimeout(fadeOut);
			var light = '#dadaff';
			var color = '#ADD8E6';
			var final = '#ADD8E6';
			
			$(stage)
				.stop()
				.css('opacity', 1)
				.show()
				.html(Array.cast(arguments).join(' '))
				.removeClass('warn')
				.removeClass('error')
				.addClass('info')
				.animate({backgroundColor:light},60)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:light},70)
				.animate({backgroundColor:color},80)
				.animate({backgroundColor:final},1020);
				
			fadeOut = setTimeout(function() {
				$(stage).fadeOut();
			}, 3200);
		},
		
		prompt: function(text, success) {
			//success(StaffCard.getUser());
			
			$('#prompt').remove();
			Curtain.close();
			$('<div id="prompt">'
					+'<span>Staff approval is required to:</span>'
					+'<p>'+text+'</p>'
					+'<div class="scannable">Scan to approve</div>'
					+'<button class="abort">Cancel</button>'
				+'</div>'
			)
				.appendTo(document.body)
				.find('.abort')
					.click(function() {
						$('#prompt').remove();
						Curtain.open();
						RfidHandler.release();
					});
			RfidHandler.bind(function(tag) {
				if(tag.type == 'staff' && tag.status == 'active') {
					$('#prompt').remove();
					Curtain.open();
					RfidHandler.release();
					success(tag);
				}
			});
			
		},
		
		
		
		wristband: function(user, staff, success) {
			
			$('#prompt').remove();
			Curtain.close();
			$('<div id="prompt" class="wristband">'
					+'<span>Scanning new wristband for:</span>'
					+'<p>'+user.email+'</p>'
					+'<div class="scannable">Scan Wristband Now</div>'
					+'<button class="abort">Cancel</button>'
				+'</div>'
			)
				.appendTo(document.body)
				.find('.abort')
					.click(function() {
						$('#prompt').remove();
						Curtain.open();
						RfidHandler.release();
					});
			RfidHandler.bind(function(tag) {
				if(tag.exists || !tag.error) {
					global.warn('Tag already exists. You need to scan an unused wristband!');
				}
				else {
					$('#prompt').html('<span class="locked">Hold on</span>');
					$.getJSON('member.activate.php?id='+user.id+'&uid='+json+'&staff='+staff.id, function(json) {
						$('#prompt').remove();
						Curtain.open();
						RfidHandler.release();
						
						if(json.error) {
							global.error(json.error);
						}
						else {
							success(json);
						}
					});
				}
			});
			
		},
		
		
		nicePrompt: function(construct, success) {
			$('#prompt-nice').remove();
			Curtain.close();
			var pn = $('<div id="prompt-nice">'
					+'<button class="abort">Cancel</button>'
				+'</div>')
				.appendTo(document.body).get(0);
			$(pn)
				.find('.abort')
					.click(function() {
						$('#prompt-nice').remove();
						Curtain.open();
					});
			
			construct.apply(pn, [function() {
				$('#prompt-nice').remove(); Curtain.open();
				success.apply({}, arguments);
			}]);
		},
	});
})();