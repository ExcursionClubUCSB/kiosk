/**
* Bess Compiler
**/
require('./lib/util.jsol.js');
var parser = require('./lib/bess.parser-ie.js').parser;

var lastParseError = '';

// handle parse errors
parser.yy.parseError = function(e) {
	lastParseError = e;
};

exports.compiler = function(utils) {
	var Manifest = utils.Manifest;

	var bess = new Manifest();
	var css = '';
	var js = '';

	var dir = this.name;
	var specs = this.specs;
	var patterns = this.ptns;

	var parseError = '';

	bess.filterAfterMerge(function(data, file) {
		var out;
		try {
			out = parser.parse(data);
			css += '<style>\n'+out.css+'\n</style>';
			js += '<script type="text/javascript">\nvar CSS='+out.js+'\n</script>';
		} catch(e) {
			parseError = {
				module: 'Bess Parser',
				message: lastParseError.replace(/\t/g, ' '),
				source: file,
			};
		}
	});

	for(var i=patterns.length-1; i>=0; i--) {
		var pattern = patterns[i];

		bess.add(pattern.name, dir, pattern.specs);
	}

	bess.out();

	var delivery;
	if(parseError) {
		delivery = {
			error: parseError
		};
	}
	else {
		delivery = {
			css: css,
			js: js,
		};
	}

	return delivery;
};