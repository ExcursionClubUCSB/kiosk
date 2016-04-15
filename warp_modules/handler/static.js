// require filesystem
var fs = require('fs');

// requires mime for easy static hosting
var mime = require('mime');

// require node path
var node_path = require('path');

// handler function
exports.handler = function(request, response, args) {
	var points = args[0];

	target = points?
		points+'/'+decodeURIComponent(this.groups[1]) :
		decodeURIComponent(request.url);

	var path = node_path.resolve(process.cwd()+'/'+target);

	fs.readFile(path, 'binary', function(err, data) {
		if(err) {        
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
			return;
		}

		response.writeHead(200, {"Content-Type": mime.lookup(path)});
		response.write(data, "binary");
		response.end();
	});
	return true;
};