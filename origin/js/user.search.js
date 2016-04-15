(function() {
	
	var __func__ = 'UserSearch';
	
	var datasetName = 'excursion/user';
	
	var construct = function(input, resultsClassName) {
		
		var text = '';
		
		
		var self = {
			
			
			
			results: $('<div class="'+resultsClassName+'"></div>').appendTo($(input).parent())[0],
			
			destroy: function() {
				$(self.results).remove();
			},
			
			select: function(user) {
				user.exists = true;
				user.tagType = 'user';
				self.destroy();
				new MemberCard(user);
			},
			
			program: function() {
			
				// get reference to the loop data
				var loop = this.data;
				
				// increment loop cycle counter
				loop.cycles += 1;
				
				// reference loop data locally
				var i = loop.index;
				var text = loop.text;
				var tiers = loop.tiers;
				var items = loop.items;
				
				var textLength = text.length;
				
				var regText = text.replace('.', '\\.');
				
				var a = new RegExp('^'+regText,'i');
				
				var b = new RegExp('[ \\.\\-_]'+regText,'i');
				
				var num_comparisons = 0;
				
				// while the thread runs
				while(this.runs()) {
					
					num_comparisons += 1;
					
					var test = items[i];
					
					var az, bz, cz, dz, zi;
					
					if( (a.test(test.phone) && (az=1)) || (a.test(test.fullname) && (az=2)) || (a.test(test.email) && (az=3)) ) {
						if(!tiers[0]) {
							tiers[0] = [];
						}
						if(!tiers[0][az]) {
							tiers[0][az] = [];
						}
						tiers[0][az].push(i);
					}
					else if( ((bz=b.exec(test.fullname)) && (bzi=2)) || ((bz=b.exec(test.email)) && (bzi=3)) ) {
						zi = bz.index + 1;
						if(!tiers[zi]) {
							tiers[zi] = [];
						}
						if(!tiers[zi][bzi]) {
							tiers[zi][bzi] = [];
						}
						tiers[zi][bzi].push(i);
					}
					/*
					else if(bz=b.exec(test.)) {
						var bzi = bz.index+1;
						if(!tiers[bzi]) {
							tiers[bzi] = [];
						}
						tiers[bzi].push(power+i);
						
						// ~5% faster than Math.max
						if(bzi > tiers.max) {
							tiers.max = bzi;
						}
					}*/
					
					i += 1;
					if(i === items.length) {
						i = 0;
						console.info(global,': search took ',loop.cycles,' cycles in ',((new Date()).getTime()-loop.start_time)+'ms');
						
						self.handleResults(tiers, items);
						return this.die();
					}
				}
				
				// store the value of the index back to the loop data
				loop.index = i;
				
				// continue executing this loop
				this.cycle();
			},
			
			
			search: function() {
				//var empty = !search_text.length;
				//var display = empty? 'none': 'block';
				
				search();
			},
			
			
			
			keydown: function(e) {
				
				search.interupt();
				
				if($(input).is('.empty')) {
					text = predict(e, '');
					
					console.log('input is empty');
					console.info('text is predicted to be: ',text);
					
					if(text.length) {
						$(input)
							.removeClass('empty')
							.val('');
					}
					else {
						return $(self.results).empty().hide();
					}
				}
				else {
					text = predict(e);
					
					console.info('text is predicted to be: ',text);
					
					if(!text.length) {
						$(input)
							.addClass('empty')
							.val('Enter a Name or Phone or Email');
						e.preventDefault();
						
						self.selectCenter();
						
						return $(self.results).empty().hide();
					}
				}
				
				// if the input field value is a substring of what is being typed
				if((input.value.length > text.length) && text.substr(0, input.value.length) == input.value) {
					// try to use the results of the last set
					search.data({
						items: search.lastResults() || self.getActiveMembers(),
					});
				}
				// otherwise start fresh
				else {
					search.data({
						items: self.getActiveMembers(),
					});
				}
				
				self.search();
			},
			
			
			
			keyup: function() {
				if(!$(input).is('.empty') && input.value !== text) {
					console.warn('input value: ',input.value,' !== ',text);
					search.interupt();
					search.data({
						text: input.value,
						items: self.getActiveMembers(),
					});
					self.search();
				}
			},
			
			
			handleResults: function(tiers, items) {
				var html = '';
				delete tiers.max;
				for(var e in tiers) {
					e = parseInt(e);
					var group = tiers[e];
					var x = group.length;
					while(x-- && x) {
						if(group[x]) {
							var set = group[x];
							var i = set.length;
							while(i--) {
								var user = items[set[i]];
								
								var phone = user.phone;
								var fullname = user.fullname;
								var email = user.email;
								
								if(x === 1) {
									phone = phone.substr(0,e)+'<em>'+phone.substr(e, text.length)+'</em>'+phone.substr(e+text.length);
								}
								if(x === 2) {
									fullname = fullname.substr(0,e)+'<em>'+fullname.substr(e, text.length)+'</em>'+fullname.substr(e+text.length);
								}
								if(x === 3) {
									email = email.substr(0,e)+'<em>'+email.substr(e, text.length)+'</em>'+email.substr(e+text.length);
								}
								
								html = '<div class="'+resultsClassName+'-item">'
									+'<span class="search-item-name">'+fullname+'</span>'
									+'<span class="search-item-email">'+email+'</span>'
									+'<span class="search-item-phone">'+phone+'</span>'
								+'</div>' + html;
							}
						}
					}
				}
				$(self.results).html(html).show()
					.find('.'+resultsClassName+'-item').click(function() {
						$.getJSON('member.resolve.php?email='+$(this).find('.search-item-email').text(), self.select);
					});
			},
			
			selectCenter: function() {
				input.selectionStart = input.selectionEnd = Math.floor($(input).val().length / 2);
			},
			
			
			
			update: function() {
				console.info(datasetName,' updated');
			},
			
			
			
			getActiveMembers: function() {
				return Database.get(datasetName);
			},
		};
		
		
		var predict = new InputPredictor();
		Database.subscribe(datasetName, self.update);
		var search = new ThreadedLoop(self.program, {
			cycleTime: 10,
			data: {
				cycles: 0,
				index: 0,
				text: '',
				tiers: {},
				items: Database.get(datasetName),
			},
			beforeStart: function() {
				this.data.text = text;
				this.data.results = false;
			},
		});
		
		
		var public = function() {
			
		};
		
		
		$.extend(public, {
			
		});
		
		$(input)
			.keydown(self.keydown)
			.keyup(self.keyup)
			.focus();
		self.selectCenter();
		
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