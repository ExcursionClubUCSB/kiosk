(function() {
	
	var passkeys = {
		'blake': 'blake.regalia@gmail.com',
		'emil' : 'ecakiryan@yahoo.com',
		'pault': 'paultarnold@umail.ucsb.edu',
		'mikeb': 'tablepost998@yahoo.com',
	};
	
	var alldown = [];
	var timeout = 0;
	
	$(document).keydown(function(e) {
		var char = String.fromCharCode(e.which);
		var i = alldown.indexOf(char);
		if(i !== -1) return;
		alldown.push(char);
		var k = alldown.join('').toLowerCase();
		console.log(k);
		if(passkeys[k]) {
			$.getJSON('user.resolve.php?email='+passkeys[k], function(json) {
				new StaffCard(json);
			});
		}
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			alldown.length = 0;
		}, 4000);
	});
	$(document).keyup(function(e) {
		var i;
		while((i=alldown.indexOf(String.fromCharCode(e.which))) !== -1) {
			alldown.splice(i, 1);
		};
	});
	
})();