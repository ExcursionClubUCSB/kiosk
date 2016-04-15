/**
* CSS Compiler
**/
exports.compiler = function(utils) {
	var Manifest = utils.Manifest;

	var css = new Manifest();

	var dir = this.name;
	var specs = this.specs;
	var patterns = this.ptns;

	css.pre('<style>');
	css.merge();
	css.post('</style>');

	for(var i=patterns.length-1; i>=0; i--) {
		var pattern = patterns[i];

		css.add(pattern.name, dir, pattern.specs);
	}

	return {
		css: css.out()
	};
};