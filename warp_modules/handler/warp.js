// require filesystem
var fs = require('fs');

// requires mime for easy static hosting
var mime = require('mime');

// handler function
exports.handler = function(request, response, args, utils) {

	var warpDir = args[0];
	manifestFilePath = './manifest.txt';

	var WarpHandler = utils.WarpHandler;
	var warpHandler = new WarpHandler();
	warpHandler.setManifest(manifestFilePath);

	var warpServer = utils.WarpServer;
	var warpServer = new WarpServer();

	if(typeof this.groups[1] == 'undefined') {
		var code = (args[1] == 'temporary')? 302: 301;
		return utils.redirect(response, request.url+'/', code);
	}

	request.warp_url = '/'+this.groups[1];

	var cwd = process.cwd();
	process.chdir(warpDir);
		warpServer.handle(request, response, warpHandler);
	process.chdir(cwd);

	return true;
};