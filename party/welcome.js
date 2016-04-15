
var Db = require('../../lib/db.js');

exports.handler = function(request, response, parsedUrl) {

	var respond = function(a) {
		sdb.end();
		response.writeHead(200, {
			'Content-type': 'application/json',
			'charset': 'utf-8',
		});
		response.end(JSON.stringify(a));
		return true;
	};

	var url = decodeURIComponent(parsedUrl.path);
	var m = /^\/([^\/]+)\/(.*)$/.exec(url);
	if(!m) return respond('bad query');

	var sdb = new Db('excursion_services', function() {
		console.error('wtf');
	});

	sdb('access_log').insert({
		use: m[1],
		info: m[2],
		rfid: '',
		date: Math.floor((new Date()).getTime()/1000),
	},
		function(err) {
			console.error(err);
		},
		function(a) {
			respond(a);
		}
	);

	return true;
};