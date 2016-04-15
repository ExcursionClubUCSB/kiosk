(function() {
	
	var __func__ = 'RfidScanner';
	
	var keyStrokeThreshold = 50;
	
	var instance;
	
	var construct = function() {
		
		var lastKeyStroke;
		var firstKeyStroke;
		var tagEntry = '';
		
		var self = {
			
			// submits a tag to the rfid handler
			submit: function(tag) {
				$.getJSON('rfid-tag.resolve.php?uid='+tag, RfidHandler);
			},
		};
		
		
		var public = function() {
		};
		
		
		$.extend(public, {
			
			submit: function(uid) {
				return self.submit(uid);
			},
		});
		
		
		$(document).keydown(function(e) {
			
			// if this isn't the first keystroke
			if(lastKeyStroke) {
				// reject it immediately if it exceeds the threshold
				if(lastKeyStroke() > keyStrokeThreshold) {
					lastKeyStroke = false;
					tagEntry = '';
				}
				else {
					console.log('last: ',lastKeyStroke());
				}
			}
			
			// record how long it takes in between keystrokes
			lastKeyStroke = new Timer();
			
			// if this is the first acceptable keystroke
			if(!tagEntry.length) {
				// record how long it takes to enter the whole tag
				firstKeyStroke = new Timer();
			}
			
			// if the enter key was pressed and the tag is at least 10 characters
			if(e.keyCode == 13 && tagEntry.length >= 10) {
				// submit the tag
				self.submit(tagEntry.substr(-10));
				
				// reset the variables
				console.log('first: ',firstKeyStroke());
				lastKeyStroke = false;
				tagEntry = '';
			}
			// otherwise, append this character to the entry
			else {
				tagEntry += String.fromCharCode(e.keyCode);
			}
		});
		
		
		return public;
	};
	
	
	
	var global = window[__func__] = function() {
		if(this !== window) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
	};
	
	
	
	$.extend(global, {
		
		simulate: function(uid) {
			return (instance && instance.submit(uid));
		},
		
		
		toString: function() {
			return __func__+'()';
		}
	});
	
	
})();
