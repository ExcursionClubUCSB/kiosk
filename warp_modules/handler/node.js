
var path = require('path');
var url = require('url');

exports.handler = function(request, response, dargs, utils, service) {

	var args = utils.filter(dargs, this.groups);

	var relPath = args[0];

	var parsedUrl = url.parse('/'+this.groups[1], true);

	var absPath = path.resolve(relPath);
	var dirName = path.dirname(absPath);

	var cwd = process.cwd();
	process.chdir(dirName);

	var handler = require(absPath).handler;
	var retval = handler.apply(this, [request, response, parsedUrl, utils, service]);
	process.chdir(cwd);
	
	return retval;
};