/**
* HTML Compiler
**/
var zenCoding = require('./lib/kit.zen.js');
var zenCustom = require('./lib/zen.multiline-parser.js');

exports.compiler = function(utils) {
	var Manifest = utils.Manifest;

	var head = new Manifest();
	var body = new Manifest();

	var dir = this.name;
	var specs = this.specs;
	var patterns = this.ptns;

	head.merge('\n');

	body.merge();
	body.pre('<body>');
	body.post('</body>');

	// if the directive has a head argument, include the standard head with optional title
	if(specs.title || specs.charset || specs['content-type']) {
		var title = (specs.title && specs.title[0]) || 'Warp Server';
		var contentType = (specs['content-type'] && specs['content-type'][0]) || 'text/html';
		var charset = 'charset='+((specs.charset && specs.charset[1].toUpperCase()) || 'UTF-8');
		var metaContentType = contentType+'; '+charset;
		var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
			+'\n<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US">'
			+'\n<head>'
			+'\n<title>'+title+'</title>'
			+'\n<meta http-equiv="Content-Type" content="'+metaContentType+'" />'
			+'\n';
		head.append(html);
	}

	// build output from the pattern manifest
	for(var i=patterns.length-1; i>=0; i--) {
		var pattern = patterns[i];
		var opts = pattern.specs;

		var msect = body;
		if(opts.head) {
			msect = head;
		}
		if(opts.zen) {
			msect.filterNext(
				function(data) {
					return zenCoding.zc(
						zenCustom.collapseMultilineZen(data)
					);
				}
			);
		}

		// grab file contents specified by this pattern
		msect.add(pattern.name, dir, opts);
	}

	// return built output
	return {
		head: head.out(),
		body: body.out(),
	};
};