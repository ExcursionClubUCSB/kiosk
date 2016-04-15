window.Phone = {
	format: function(str) {
		return '('+str.substr(0,3)+') '+str.substr(3,3)+'-'+str.substr(6,4);
	},
};

window.Email = {
	link: function(str, classes) {
		return '<a href="javascript:void(0)" class="'+classes+'">'+str+'</a>';
	},
};