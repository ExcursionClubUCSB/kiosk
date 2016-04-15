(function() {
	
	var __func__ = 'GearInfo';
	
	var basic = function(obj, display) {
		var html = '';
		console.log('basic(',obj,',',display,')');
		var info = obj.info;
		for(var e in info) {
			if(display != 'detail') {
				if(e == 'user') continue;
			}
			html += '<div class="item-info-'+e+'">'
						+info[e]
					+'</div>';
		}
		return html;
	};
	
	var split = function(str) {
		var obj = {};
		var arr = str.split(';');
		var i = Math.min(arr.length, arguments.length-1);
		while(i--) {
			if(arr[i].length && arr[i] != ' ') {
				obj[arguments[i+1]] = arr[i];
			}
		}
		return obj;
	};
	
	var methods = {
	
		'custom': function(item, display) {
			return basic(item, display);
		},
		
		'climbing shoe': function(item, display) {
			var type = split(item.type, 'm','w');
			var sub = [];
			if(type.m) {
				sub.push('size '+type.m+' mens');
			}
			if(type.w) {
				sub.push('size '+type.w+' womens');
			}
			
			item.info = item.info || {};
			$.extend(item.info, {
				title: item.catalog+'s',
				subtitle: sub.join('. '),
			});
			
			return basic(item, display);
		},
		
		'climbing harness': function(item, display) {
			
			var type = split(item.type, 'size');
			var size = '';
			switch(type.size) {
				case 'sml': size = 'small'; break;
				case 'med': size = 'medium'; break;
				case 'lrg': size = 'large'; break;
			}
			
			item.info = item.info || {};
			$.extend(item.info, {
				title: item.catalog,
				subtitle: size,
			});
			
			return basic(item, display);
		},
		
		'climbing rope': function(item, display) {
			var type = split(item.type, 'length', 'diameter');
			var spec = split(item.specs, 'color', 'elasticity');
			
			item.info = item.info || {};
			$.extend(item.info, {
				title: type.length+' '+item.catalog,
				subtitle: spec.elasticity+' '+type.diameter,
			});
			
			return basic(item, display);
		},
		
		'camping tent': function(item, display) {
			
			item.info = item.info || {};
			$.extend(item, {
				info: {
					title: item.type+' person '+item.catalog,
					subtitle: item.make+' '+item.specs,
				},
			});
			
			return basic(item, display);
		},
		
		'backpack': function(item, display) {
		
			item.info = item.info || {};
			$.extend(item.info, {
				title: item.catalog[0].toUpperCase()+item.catalog.substr(1),
				subtitle: item.make+' '+item.type,
			});
			
			return basic(item, display);
		},
		
		'sleeping bag': function(item, display) {
		
			var type = split(item.type, 'rating', 'zipper');
		
			item.info = item.info || {};
			$.extend(item.info, {
				title: item.catalog[0].toUpperCase()+item.catalog.substr(1),
				subtitle: item.make+' <b>'+type.rating.replace('*','&deg;')+'</b>'+(type.zipper?' <span style="font-size:9pt">'+(type.zipper)+'</span>':''),
			});
			
			return basic(item, display);
		},
	};
	
	
	var construct = function(item) {
		
		return methods[item.catalog].apply(this, arguments);
		
	};
	
	
	
	var global = window[__func__] = function() {
		return construct.apply(this, arguments);
	};
	
	
	
	$.extend(global, {
		
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