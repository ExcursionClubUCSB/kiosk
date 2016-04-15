(function() {
	
	var __func__ = 'GearBrowser';
	
	var instance = false;
	
	var GEAR = {
		'Sleeping Pad': 'Type:[Thermarest Foam/sptf.jpg],[Wenzel Air/spwa.jpg],[Other/unknown.png]',
		'Tent': function() {
			MessageHandler.info('All tents are tagged. Scan it\'s RFID tag');
		},
		'Sleeping Bag': 'x',
		'Climbing': {
			'Carabiner / ATC': 'climbing//Tape Color:[orange/lcao.jpg],[red/lcar.jpg],[green/lcag.jpg],[white/lcaw.jpg]',
			'Quickdraws': 'climbing//quantity',
			'Shoes': function() {
				MessageHandler.info('All climbing shoes are tagged. Scan it\'s RFID tag');
			},
			'Harness': function() {
				MessageHandler.info('All climbing harnesses are tagged. Scan it\'s RFID tag');
			},
			'Rope': function() {
				MessageHandler.info('All ropes are tagged. Scan it\'s RFID tag');
			},
			'Webbing': 'climbing',
			'Crash Pad': 'climbing',
			'Helmet': 'climbing',
		},
		'Backpack': 'description',
		'Surf Stuff': {
			'Surfboard': true,
			'Wetsuit': true,
		},
		'Snorkel / Diving': {
			'Fins': true,
			'Snorkel': true,
			'Mask': true,
		},
		'Fishing': {
			'Fishing Pole & Reel': true,
		},
		
		
		'Stoves': {
			'Double burner': true,
			'Snowpeak': true,
			'Jet Boild': true,
		},
		'Helmet': true,
		
		'Camping Gear': {
			'Cooler': true,
			'Table': true,
			'Canopy': true,
			'7-gallon Water Jug': true,
			'Water Filter': {
				'Gravity': true,
				'Pump Action': true,
				'Ultraviolet Steripen': true,
			},
			'Lantern': 'Lantern:[Black Diamond Lantern/clbd.jpg],[Propane Lanter/clpl.jpg],[Battery Lantern/cpbl.jpg]',
		},
		'Backpacking Supplies': {
			
		},
		'Snow Supplies': {
			'Snowshoes': true,
			'Crampons': true,
			'Ice Axes': true,
			'Tire Chains': true,
		},
	};
	
	var construct = function(container) {
		
		var node = GEAR;
		
		if(!container) {
			global.destroy();
			return false;
		}
		
		global.destroy(container);
		
		var gen = function() {
			var html = '';
			for(var e in node) {
				html += '<div class="gear-browser-item" item="'+e+'">'
					+e
				+'</div>';
			}
			return html;
		};
		
		var self = {
			dom: $('<div class="gear-browser">'
					+gen()
				+'</div>').appendTo(container)[0],
		};
		
		
		var itemClick = function(e) {
			var f = $(this).attr('item');
			var ref = node[f];
			if(typeof ref == 'function') {
				return ref();
			}
			if(typeof ref == 'object') {
				node = ref;
				$(self.dom).remove();
				var igen = gen();
				self.dom = $('<div class="gear-browser">'
					+igen
				+'</div>').appendTo(container)[0];
				$(self.dom).find('.gear-browser-item').click(itemClick);
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			else {
				if(typeof ref == 'string') {
					var mhpf, XX;
					
					switch(ref) {
					case 'x':
						XX = true;
						break;
						
					case 'quantity':
						mhpf = function(finish) {
							$('<span>Enter Quantity of:</span>'
								+'<p>'+$(owns).html()+'</p>'
								+'<input type="text" />'
								+'<button class="enter">enter</button>'
							).appendTo( this );
							var input = $(this).find('input').keydown( function(e) {
								if((DOM_VK_numeric.indexOf(e.which)===-1 ||  e.shiftKey) && DOM_VK_input.indexOf(e.which)===-1) {
									e.preventDefault();
								}
								else if(e.which == 13) {
									finish($(this).val());
								}
							}).focus().get(0);
							$(this).find('.enter').click( function() {
								finish($(input).val());
							});
						};
						break;
						
					case 'description':
						mhpf = function(finish) {
							$('<span>Enter Description of:</span>'
								+'<p>'+$(owns).html()+'</p>'
								+'<div>Make & Color:</div>'
								+'<input type="text" />'
								+'<button class="enter">enter</button>'
							).appendTo( this );
							$(this).find('input').keydown( function(e) {
								if(e.which == 13) {
									finish($(this).val());
								}
							}).focus().get(0);
							$(this).find('.enter').click( function() {
								finish($(input).val());
							});
						};
						break;
						
					default:
						var refSplit = ref.split(':');
						var p = refSplit[0];
						var csv = refSplit[1].split(',');
						var b = '';
						for(var i=0; i<csv.length; i++) {
							var m = /\[([^\/]+)\/([^\]]+)\]/.exec(csv[i]);
							if(m == null) return global.error('Invalid regex in gear browser');
							b += '<img src="photo/'+m[2]+'" itemval="'+m[1]+'" imgsrc="'+m[2]+'">';
						}
						mhpf = function(finish) {
							$('<span>Select Which:</span>'
								+'<p>'+p+'</p>'
								+b
							).appendTo( this );
							$(this).find('img').click(function() {
								finish( $(this).attr('itemval'), $(this).attr('imgsrc') );
							});
						};
						break;
					}
					
					if(mhpf) {
						var owns = this;
						MessageHandler.nicePrompt(mhpf, function(value, img) {
							UserGear.rent({
								catalog: 'custom',
								id: $(owns).attr('item'),
								image: img || 'unknown.png',
								info: {
									title: $(owns).html(),
									subtitle: (ref!='quantity'? value: ''),
								},
								uid: Math.ceil(Math.random()*4294967295 + 4294967295),
							});
						});
					}
					
					else if(XX) {
						UserGear.rent({
							catalog: 'custom',
							quickIncrement: true,
							id: $(this).attr('item'),
							image: 'unknown.png',
							info: {
								title: $(this).html(),
							},
							uid: Math.ceil(Math.random()*4294967295 + 4294967295),
						});
					}
				}
				else {
					UserGear.rent({
						catalog: 'custom',
						id: $(this).attr('item'),
						image: 'unknown.png',
						info: {
							title: $(this).html(),
						},
						uid: Math.ceil(Math.random()*4294967295 + 4294967295),
					});
				}
			}
			
			global.destroy(container);
		};
		
		
		$(self.dom).find('.gear-browser-item').click(itemClick);
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
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
		
		isOpen: function() {
			return !!instance;
		},
		
		destroy: function(container) {
			console.log('destroying', global);
			instance = false;
			container = container || document;
			$(container).find('.gear-browser').remove();
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