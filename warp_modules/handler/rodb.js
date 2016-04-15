
var mysql = require('./lib/mysql-pointer.js');
var rurl = require('./lib/rurl-get.js');

var error = function(str) {
	return JSON.stringify({
		error: str
	});
};

exports.handler = function(request, response, args) {

	var databaseName = args[0];
	try {
		var rodbs = decodeURIComponent(this.groups[1]);
	} catch(e) {
		response.end(
			error(e)
		);
	}

	var getter = rurl.instance();
	getter.connect(databaseName, function(err) {
		if(err) {
			response.end(
				error(err)
			);
			getter.end();
		}
		getter.exec(rodbs, function(err, result) {
			if(err) {
				response.end(
					error(err)
				);
			}
			else {
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify(result));
			}
			getter.end();
		});
	});

	return true;
};