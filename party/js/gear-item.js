(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'GearItem';
	
	var instance;
	var castArray = Array.prototype.slice;

	var gearLabels = {};
	$.getJSON('resource/gear-labels.json', function(json) {
		gearLabels = json;
	});

	var gearDistinguish = {};
	$.getJSON('resource/gear-distinguish.json', function(json) {
		gearDistinguish = json;
	});

	var labeler = function(fstr, item) {
		var ms = fstr.match(/\$[a-z]+/g);
		if(!ms) return fstr;
		for(var i=ms.length-1; i>=0; i--) {
			var trg = ms[i].substr(1);
			var val = item[trg];

			if(typeof val == 'undefined') {
				if(typeof item.specs == 'string') {
					try {
						val = JSON.parse(item.specs)[trg];
					} catch(e) { return Blip.error('Malformed JSON found in gear'); }
				}
				else {
					val = item.specs[trg];
				}
			}
			fstr = fstr.replace(
				new RegExp(
					ms[i].replace(/\$/g, '\\$'), 'g'
				),
				val[0].toUpperCase() + val.substr(1)
			);
		}
		return fstr;
	};

	var properLabel = function(item) {
		var fstr = gearLabels[item.category];
		if(fstr) {
			return labeler(fstr, item);
		}
		else {
			return item.category;
		}
	};
	
	var construct = function(item, okay) {
		
		/**
		* private:
		**/
		var html = '';
		var self = {};

		var delem = function(thmbUrl) {
			html =
				'<div class="gear" g_id="'+item.g_id+'">'
					+'<span class="gear-img">'
						+'<img src="'+thmbUrl+'" />'
					+'</span>'
					+'<span class="gear-info">'
						+'<div class="gear-info-label">'
							+properLabel(item)
						+'</div>'
						+'<div class="gear-info-class table">'
							+'<div class="gear-info-class">'
								+'<span class="gear-info-class-category">'
									+item.category
								+'</span>'
								+'<span class="gear-info-class-department">'
									+item.department
								+'</span>'
							+'</div>'
						+'</div>'
					+'</span>'
				+'</div>';

			okay.apply(self, [html]);
		};
	
		if(typeof item.photo_id == 'string') {
			delem('/photos/thmb/'+item.photo_id+'.jpg');
		}
		else {
			DB.get('photo@(photo_id=?)', item.photo_id)
				.ready(function(photos) {
					if(!photos.length) thmbUrl = 'resource/unknown.png';
					else thmbUrl = '/photos/'+photos[0].thmb_url;

					delem(thmbUrl);
				});		
		}
			
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};

		expose['getDistinguisher'] = function(category) {
			return (function() {
				var dd = this.distinguisher;
				if(!dd) {
					console.error(category+' has no distinguisher');
					return function() {
						return category;
					};
				}
				return function(item) {
					return labeler(dd, item);
				};
			}).apply({distinguisher: gearDistinguish[category]});
		};
		
})(window);