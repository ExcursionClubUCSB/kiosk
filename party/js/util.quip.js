(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Quip';
	
	var instance;
	var castArray = Array.prototype.slice;

	var defaultDuration = 800;
	var durationTypes = {
		fatal: 0,
		error: 2200,
		good: 1600,
		warn: 1600,
	};

	var queue = [];
	var busy = false;
	var n_timer;
	var f_timer;

	var next = function() {
		$('.blip-banner').remove();
		clearTimeout(f_timer);
		clearTimeout(n_timer);
		if(!queue.length) return busy = false;
		var msg = queue.shift();
		console.log(msg);
		$('<div class="blip-banner '+msg.type+'">'
				+msg.args[0]
			+'</div>').appendTo(document.body);

		var duration = msg.args[1] || durationTypes[msg.type] || defaultDuration;
		if(duration) n_timer = setTimeout(fade, duration);
	};

	var fade = function() {
		$('.blip-banner').addClass('retire');
		f_timer = setTimeout(function() {
			busy = false;
			next();
		}, 800);
	};
		

	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
	};
	
	
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['good'] = function() {
			queue.push({
				type: 'good',
				args: castArray.call(arguments),
			});
			next();
		};

		//
		expose['error'] = function() {
			queue.push({
				type: 'error',
				args: castArray.call(arguments),
			});
			next();
		};
		
		//
		expose['warn'] = function() {
			queue.push({
				type: 'warn',
				args: castArray.call(arguments),
			});
			next();
		};
		
})(window);