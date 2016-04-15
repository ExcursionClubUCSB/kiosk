/**
* JavaScript Compiler
**/

function jsManifest(manifestObj, Manifest) {
	manifestObj.pre('<script type="text/javascript">');
	manifestObj.merge('\n\n/************************\n** ', Manifest.FILENAME_EXT, '\n************************/\n');
	manifestObj.post('</script>');
};

exports.compiler = function(utils) {
	var Manifest = utils.Manifest;

	var js = new Manifest();

	var dir = this.name;
	var specs = this.specs;
	var patterns = this.ptns;

	// scan through specs
	if(specs.merge) {
		jsManifest(js, Manifest);
	}
	else {
		js.link('<script type="text/javascript" src="',Manifest.RELATIVE_PATH,'"></script>\n');
	}

	// build output from pattern manifest
	for(var i=patterns.length-1; i>=0; i--) {
		var pattern = patterns[i];
		if(pattern.specs.merge) {
			var pkg = new Manifest();
			jsManifest(pkg, Manifest);

			pkg.add(pattern.name, dir, pattern.specs);
			js.append(pkg.out());
		}
		else {
			js.add(pattern.name, dir, pattern.specs);
		}
	}

	// return output
	return {
		js: js.out(),
	};
};