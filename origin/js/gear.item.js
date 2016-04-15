(function() {
	
	var __func__ = 'GearItem';
	
	
	var construct = function(item, container, display) {
		
		
		var self = {
			dom: $('<div class="gear-item"></div>').appendTo(container),
			create: function() {
				var em = $(
					'<div class="item-image">'
						+'<img src="photo/'+item.image+'"></img>'
					+'</div>'
					+'<div class="item-info'+(item.classB?' '+item.classB:'')+'">'
						+GearInfo(item, display)
					+'</div>'
				)
					.appendTo(self.dom);
				if(item.click) {
					$(em).click(function(e) {
						GearList.logout();
						item.click.apply(item, [item, e]);
					});
				}
			},
		};
		
		
		var public = function() {
			
		};
		
		
		item.num = 1;
		
		$.extend(public, {
			getDom: function() {
				return self.dom;
			},
			
			getItem: function() {
				return item;
			},
		});
		
		self.create();
		
		$(container)[0].scrollTop = $(container)[0].scrollHeight;
		
		item.uidStr = item.uid;
		
		if(item.catalog == 'custom') {
			var found = UserGear.find({
				catalog: 'custom',
				id: item.id,
			});
			if(found && found.length) {
				var merge = found[0];
				console.log(found[0]);
				$(merge.getDom()).remove();
				item.num += merge.getItem().num;
				item.uidStr = item.uid+';'+merge.getItem().uidStr;
				$(self.dom).find('.item-info-title').html('<em>'+item.num+'x</em> '+item.info.title+'s');
			}
		}
		
		$(self.dom).attr('uid', item.uidStr)
		
		return public;
		
	};
	
	
	
	var global = window[__func__] = function() {
		if(this !== window) {
			var instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			
		}
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