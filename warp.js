
var SERVER_ADDR = '192.168.0.200';
//var SERVER_ADDR = '127.0.0.1';

// require filesystem
var fs = require('fs');

// extend function
function __() {
	var obj = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		var arg = arguments[i];
		for(var e in arg) {
			obj[e] = arg[e];
		}
	}
	return obj;
}
/**
* Manifest Class builds a long string containing the merged contents of the files given
**/

// require filesystem
var fs = require('fs');

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Manifest';
	
	var instance;


	var castArray = Array.prototype.slice;
	
	var construct = function(initPrePost) {
		
		/**
		* private:
		**/
		var echoMerge = true;

		var resolver = [];
		var directory = {};

		if(typeof initPrePost == 'undefined') initPrePost = '\n';
		var finalPre = initPrePost;
		var finalOut = '';
		var finalPost = initPrePost;
		
		var mFilter;
		var mFinalFilter;
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/

			operator['filterNext'] = function(filter) {
				mFilter = filter;
			};

			operator['filterAfterMerge'] = function(filter) {
				mFinalFilter = filter;
			};

			operator['add'] = function(pattern, dir, specs) {
				var b = '';

				// if this pattern points to a location
				if(pattern[0] == '.') {
					// if this pattern is a real path
					if(fs.existsSync(pattern)) {
						var stat = fs.statSync(pattern);

						// if this path is a directory
						if(stat.isDirectory()) {

							// and there is a manifest in the directory
							if(fs.existsSync(pattern+'/manifest.txt')) {

								// read the manifest file and treat each line as a pattern
								var manifest = fs.readFileSync(pattern+'/manifest.txt', 'utf-8');
								var mPtn = manifest.split(/(?:\r?\n)+/);

								var xFilter = mFilter;
								for(var i=0; i<mPtn.length; i++) {
									mFilter = xFilter;

									// add each pattern under this directory
									operator.add(mPtn[i], pattern, specs);
								}

								mFilter = null;
								return;
							}
							// manifest file does not exists, ignore
							else {
								mFilter = null;
								return;
							}
						}
						// this path is a file, treat as a pattern
						else {
							var splitPattern = pattern.split(/\//g);
							dir = splitPattern.slice(0,-1).join('/');
							pattern = splitPattern.slice(-1)[0];
						}
					}
				}
				// pattern points to local file
				else {
					dir = './'+dir;
				}

				pattern = pattern
					.replace(/\./g, '\\.')
					.replace(/\-/g, '\\-')
					.replace(/\//g, '\\/')
					.replace(/\(/g, '\\(')
					.replace(/\)/g, '\\)')
					.replace(/\+/g, '\\+')
					.replace(/\{/g, '\\{')
					.replace(/\}/g, '\\}')
					.replace(/\*/g, '.*');

				pattern = new RegExp('^'+pattern+'$', 'i');

				var indicies = [];
				var files = {};
				var allFiles = fs.readdirSync(dir);

				// iterate over all the files, insert them to index by their name length
				for(var i=allFiles.length-1; i>=0; i--) {
					var sFile = allFiles[i];
					if(pattern.test(sFile) && !directory[sFile]) {
						var sFileLen = sFile.length;
						if(!files[sFileLen]) {
							files[sFileLen] = [];
							indicies.push(sFileLen);
						}
						files[sFileLen].push(sFile);
						directory[sFile] = true;
					}
				}

				// sort the indicies of the list
				indicies.sort(function(a,b){return a-b});

				// build string
				var indiciesLen = indicies.length;
				for(var ii=0; ii<indiciesLen; ii++) {
					var index = indicies[ii];

					var fileList = files[index];
					var fileListLen = fileList.length;
					for(var f=fileListLen-1; f>=0; f--) {
						var file = fileList[f];
						var path = dir+'/'+file;

						for(var i=resolver.length-1; i>=0; i--) {
							var resolve = resolver[i];
							switch(typeof resolve) {
								case 'string':
									b += resolve;
									break;

								case 'number':
									switch(resolve) {
										case expose['FILENAME']:
											b += file.substr(0, file.lastIndexOf('.'));
											break;
										case expose['FILENAME_EXT']:
											b += file;
											break;
										case expose['RELATIVE_PATH']:
											b += path;
											break;
										case expose['ABSOLUTE_PATH']:
											b += 'abs{'+file+'}';
											break;
									}
									break;

								default:
									expose.warn('failed to understand argument: ',resolve);
									break;
							}
						}

						if(echoMerge) {
							var data = fs.readFileSync(path, 'utf-8');
							if(mFilter) {
								var realpath = fs.realpathSync(path);
								data = mFilter(data, realpath);
							}
							b += data;
						}
					}
				}

				mFilter = null;
				finalOut += b;
			};

			operator['append'] = function() {
				for(var i=0; i<arguments.length; i++) {
					finalOut += arguments[i];
				}
			};

			operator['out'] = function(delim) {
				if(typeof delim == 'undefined') delim = '\n';
				var fOut = finalOut;
				if(mFinalFilter) fOut = mFinalFilter(fOut);
				return finalPre+delim+fOut+finalPost+delim;
			};

			operator['link'] = function() {
				echoMerge = false;
				resolver = castArray.call(arguments).reverse();
			};

			operator['merge'] = function() {
				echoMerge = true;
				resolver = castArray.call(arguments).reverse();
			};

			operator['pre'] = function(text) {
				finalPre += text;
			};

			operator['post'] = function(text) {
				finalPost += text;
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/

		// constants
		var constInt = 0;
		expose['FILENAME']      = constInt++;
		expose['FILENAME_EXT']  = constInt++;
		expose['RELATIVE_PATH'] = constInt++;
		expose['ABSOLUTE_PATH'] = constInt++;
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = castArray.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
/**
* Manages compilers for output
**/

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Modules';
	var warpDir = './warp_modules';
	var configFile = warpDir+'/module_config.js';
	
	// prepare a hash to hold the handlers
	var handlers = {};
	
	// prepare a hash to hold the compilers
	var compilers = {};
	var sectionOrder = {};

	// attempt to acquire the module config file
	var moduleConfig = require(configFile).config;

	// explores the manifest modules of a particular interest
	var exploreModule = function(sub) {
		var obj = {};

		var files = fs.readdirSync(warpDir+'/'+sub);
		if(!files) return expose.error('failed to read directory: '+warpDir+'/'+sub);

		for(var i=files.length-1; i>=0; i--) {
			var file = files[i];
			if(file[0] == '.') continue;
			
			var fpath = warpDir+'/'+sub+'/'+file;
			var stat = fs.statSync(fpath);
			if(!stat) return expose.error('failed to stat file: '+fpath);
			
			if(stat.isDirectory()) continue;

			var attempt = require(fpath);
			if(attempt && attempt[sub]) {
				var name = file.split(/\./g).slice(0,-1).join('.');
				obj[name] = attempt[sub];
			}
			else {
				console.warn('failed to inclue handler file: '+compilerFile);
			}
		}

		return obj;
	};
	

	// parse the compilers manifest
	(function() {
		
		// setup request handlers
		handlers = exploreModule('handler');

		// comiler order definition
		sectionOrderDef = moduleConfig.sections;
		for(var i=0; i<sectionOrderDef.length; i++) {
			// commit this compiler alias to the order object
			sectionOrder[sectionOrderDef[i]] = '';
		}

		// setup `dir` target compilers
		compilers = exploreModule('compiler');
		
	})();
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = {};
	
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};

		// handles aliasing of compilers
		expose['getCompiler'] = function(alias) {
			if(compilers[alias]) {
				return compilers[alias];
			}
			else {
				return false;
			}
		};

		// returns a clone of the compiler order object
		expose['getSectionOrder'] = function() {
			return __({}, sectionOrder);
		};

		// handles aliasing of handlers
		expose['getHandler'] = function(alias) {
			if(handlers[alias]) {
				return handlers[alias];
			}
			else {
				return false;
			}
		};

		expose['error'] = function() {
			console.error.apply(this, arguments);
			process.exit(1);
		};
		
})(global);

/**
* WarpHandler class
**/

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'WarpHandler';
	
	var instance;
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var manifestFilename = null;
		var manifestMTime = 0;
		var cachedRules = {};
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};

			operator['getRules'] = function() {
				if(!manifestFilename) return expose.warn('no manifest file given');
				try {
					var stat = fs.statSync(manifestFilename);
				} catch(e) {
					stat = false;
				}
				if(!stat) return expose.error('failed to get stat for manifest file: `',manifestFilename,'`');
				if(stat.mtime.getTime() != manifestMTime) {
					manifestMTime = stat.mtime.getTime();
					var data = fs.readFileSync(manifestFilename)+'';
					cachedRules = ManifestParser.parse(data);
					cachedRules.virgin = true;
				}
				return cachedRules;
			};

			operator['setManifest'] = function(filename) {
				manifestFilename = filename;
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
// requires http for server
var http = require('http');


(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'WarpServer';
	
	var instance;
	var LN_CACHE_LENGTH = 255;
	
	var construct = function() {
		
		/**
		* private:
		**/
		var cache = [];

		var compilerError = function(error, response) {
			var formattedError = error.message
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
			response.end(
				'<h1>Error thrown by: '+error.module+'</h1><br />'
				+'<h2>in file: "'+error.file+'"</h2><br />'
				+'<pre>'+formattedError+'</pre>'
			);
		};

		var execMatch = function(match, request, response) {
			var terminal = false;

			var service = (function() {
				var match = this.match;
				var response = this.response;
				return function() {
					response.writeHead(200, {'Content-Type': 'text/html'});
					var sections = Modules.getSectionOrder();

					var subs = match.subs;
					for(var i=subs.length-1; i>=0; i--) {
						var sub = subs[i];
						var uses = sub.name.split(/\//)[0];

						var compiler = Modules.getCompiler(uses);
						if(compiler) {
							var out = compiler.apply(sub, [OB_COMPILER_UTILS]);
							if(out.error) {
								return compilerError(out.error, response);
							}
							for(var e in out) {
								sections[e] += out[e];
							}
						}
						else {
							response.end('<h1>Error</h1><br /><h3>compiler not found: "'+sub.name+'"</h3>');
						}
					}

					var output = '';
					for(var e in sections) {
						output += sections[e];
					}
					response.end(output);
				};
			}).apply({match:match,response:response});

			// try spec handlers first
			var specs = match.specs;
			for(var i=specs.length-1; i>=0; i--) {
				var spec = specs[i];
				var handler = Modules.getHandler(spec.name);
				if(handler) {
					var retval = handler.apply(match, [request, response, spec.args, OB_COMPILER_UTILS, service]);
					if(retval) {
						terminal = true;
						break;
					}
				}
				else {
					response.end('<h1>Error</h1><br /><h3>handler not found: "'+spec.name+'"</h3>');
					terminal = true;
					break;
				}
			}

			// static file serving..?
			// then treat this as a warp directory
			if(!terminal) {
				service();
			}
			
		};
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};

			// handle an incoming request
			operator['handle'] = function(request, response, warpHandler) {
				var rules = warpHandler.getRules();

				var url;

				if(!request.warp_url) {
					console.log(' '+request.method+' '+request.url);
					url = request.url;
				}
				// attempts to forward url pointer for warp_urls
				else {
					url = request.url = request.warp_url;
				}

				var match = false;
				var matchFound = false;

				// if these rules are not new
				// and search for the request url in the cache
				if(!rules.virgin) {
					var cacheIndex = cache.indexOf(url);
					if(cacheIndex != -1) {
						match = cache[cacheIndex];
						matchFound = true;
					}
				}
				// no match found: rules are new or it was a cache miss
				if(!matchFound) {
					rules.virgin = false;

					// start trying to match
					for(var i=rules.length-1; i>=0; i--) {
						var test = rules[i];
						var groups = test.regex.exec(url);
						if(groups) {
							match = {
								specs: test.specs,
								subs: test.subs,
								groups: groups,
							};
							break;
						}
					}

					// when the buffer fills, cycle off the front
					if(cache.push(match) >= LN_CACHE_LENGTH) {
						cache.unshift();
					}
				}

				// if a proper match was found
				if(match) {

					execMatch(match, request, response);

				}
				else {
					response.writeHead(404, {'Content-Type': 'text/plain'});
					response.end('Not Found\n');
				}
			};


			// create a new server instance
			operator['launch'] = function(warpHandler, port) {

				// create the server instance
				var server = http.createServer(function(request, response) {
					operator.handle(request, response, warpHandler);
				});

				// handle server startup errors
				server.on('error', function(e) {
					if(e.code == 'EADDRINUSE') {
						server.listen(++port, SERVER_ADDR);
					}
				});

				// emit print message when port is settled
				server.on('listening', function() {
					console.log('server running at http://'+SERVER_ADDR+':'+port);
				});

				// attempt to listen to the port
				port = port || 2314;
				server.listen(port, SERVER_ADDR);
			};
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	var OB_COMPILER_UTILS = {
		Manifest: Manifest,
		WarpHandler: WarpHandler,
		WarpServer: expose,
		redirect: function(response, url, code) {
			response.writeHead(code || 302, {
				'Location': url,
			});
			response.end();
		},
		callback: function() {

		},
		filter: function(args, groups) {
			var mod = [];
			for(var i=0; i<args.length; i++) {
				mod.push(
					args[i].replace(/\$([0-9]+)/g, function(a, b) {
						return groups[b];
					})
				);
			}
			return mod;
		},
	};
	
	/**
	* public static:
	**/
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
var ManifestParser={};(function(exports, module){/* Jison generated parser */
var warp = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"grammar":3,"rules":4,"EOF":5,"rule":6,"rulePattern":7,"specs":8,"subs":9,"URL":10,"RGX":11,"sub":12,"SUB":13,"uspecs":14,"ptns":15,"PTN":16,"SPC":17,"specArgs":18,"ARG":19,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",10:"URL",11:"RGX",13:"SUB",16:"PTN",17:"SPC",19:"ARG"},
productions_: [0,[3,2],[4,2],[4,0],[6,3],[7,1],[7,1],[9,2],[9,0],[12,3],[15,3],[15,0],[8,3],[8,0],[14,3],[14,0],[18,2],[18,0]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:
			return $$[$0-1];
		
break;
case 2:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 3:
			this.$ = [];
		
break;
case 4:
			this.$ = {
				regex: $$[$0-2],
				specs: $$[$0-1],
				subs: $$[$0],
			};
		
break;
case 5:
			this.$ = genRegex($$[$0]);
		
break;
case 6:
			var rgx = /^\. +\/(.*)\/(i?g?m?)$/.exec($$[$0]);
			var org = rgx[1];
			var mod = rgx[2];
			this.$ = new RegExp(org, mod);
		
break;
case 7:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 8:
			this.$ = [];
		
break;
case 9:
			this.$ = {
				name: $$[$0-2],
				specs: $$[$0-1],
				ptns: $$[$0], 
			};
		
break;
case 10:
			this.$ = $$[$0];
			this.$.push({
				name: $$[$0-2],
				specs: $$[$0-1],
			});
		
break;
case 11:
			this.$ = [];
		
break;
case 12:
			this.$ = $$[$0];
			this.$.push({
				name: $$[$0-2].substr(1).toLowerCase(),
				args: $$[$0-1].reverse(),
			});
		
break;
case 13:
			this.$ = [];
		
break;
case 14:
			this.$ = $$[$0];
			this.$[$$[$0-2].substr(1).toLowerCase()] = $$[$0-1].reverse();
		
break;
case 15:
			this.$ = {};
		
break;
case 16:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 17:
			this.$ = [];
		
break;
}
},
table: [{3:1,4:2,5:[2,3],6:3,7:4,10:[1,5],11:[1,6]},{1:[3]},{5:[1,7]},{4:8,5:[2,3],6:3,7:4,10:[1,5],11:[1,6]},{5:[2,13],8:9,10:[2,13],11:[2,13],13:[2,13],17:[1,10]},{5:[2,5],10:[2,5],11:[2,5],13:[2,5],17:[2,5]},{5:[2,6],10:[2,6],11:[2,6],13:[2,6],17:[2,6]},{1:[2,1]},{5:[2,2]},{5:[2,8],9:11,10:[2,8],11:[2,8],12:12,13:[1,13]},{5:[2,17],10:[2,17],11:[2,17],13:[2,17],17:[2,17],18:14,19:[1,15]},{5:[2,4],10:[2,4],11:[2,4]},{5:[2,8],9:16,10:[2,8],11:[2,8],12:12,13:[1,13]},{5:[2,15],10:[2,15],11:[2,15],13:[2,15],14:17,16:[2,15],17:[1,18]},{5:[2,13],8:19,10:[2,13],11:[2,13],13:[2,13],17:[1,10]},{5:[2,17],10:[2,17],11:[2,17],13:[2,17],16:[2,17],17:[2,17],18:20,19:[1,15]},{5:[2,7],10:[2,7],11:[2,7]},{5:[2,11],10:[2,11],11:[2,11],13:[2,11],15:21,16:[1,22]},{5:[2,17],10:[2,17],11:[2,17],13:[2,17],16:[2,17],17:[2,17],18:23,19:[1,15]},{5:[2,12],10:[2,12],11:[2,12],13:[2,12]},{5:[2,16],10:[2,16],11:[2,16],13:[2,16],16:[2,16],17:[2,16]},{5:[2,9],10:[2,9],11:[2,9],13:[2,9]},{5:[2,15],10:[2,15],11:[2,15],13:[2,15],14:24,16:[2,15],17:[1,18]},{5:[2,15],10:[2,15],11:[2,15],13:[2,15],14:25,16:[2,15],17:[1,18]},{5:[2,11],10:[2,11],11:[2,11],13:[2,11],15:26,16:[1,22]},{5:[2,14],10:[2,14],11:[2,14],13:[2,14],16:[2,14]},{5:[2,10],10:[2,10],11:[2,10],13:[2,10]}],
defaultActions: {7:[2,1],8:[2,2]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};


// extend function
function __() {
	var obj = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		var arg = arguments[i];
		for(var e in arg) {
			obj[e] = arg[e];
		}
	}
	return obj;
}

function genRegex(pattern) {
	return new RegExp('^'
		+pattern
			.replace(/(\[\.\-\/\(\)\+\{\}])/g, '\\$1')
			.replace(/[\*]/g, '(.*)')
			.replace(/\/\(\.\*\)([^\/]|$)/g, '(?:\/(.*)|)$1')
		+'$', 'i');
}/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin('il_spcs0'); return 10; 
break;
case 1: this.begin('il_spcs0'); return 11; 
break;
case 2: this.begin('pugs0'); return 17; 
break;
case 3: this.begin('sub'); 
break;
case 4: 
break;
case 5: this.begin('prgs'); 
break;
case 6: return 17; 
break;
case 7: this.popState(); this.begin('sub'); 
break;
case 8: this.popState(); 
break;
case 9: this.begin('prgs'); 
break;
case 10: return 19; 
break;
case 11: this.popState(); this.begin('args0'); 
break;
case 12: this.popState(); 
break;
case 13: return 19; 
break;
case 14: 
break;
case 15: this.popState(); 
break;
case 16: this.begin('il_spcs1'); return 13; 
break;
case 17: this.begin('pugs1'); return 17; 
break;
case 18: this.begin('ptn'); 
break;
case 19: 
break;
case 20: this.popState(); 
break;
case 21: this.begin('prgs'); 
break;
case 22: return 17; 
break;
case 23: this.popState(); this.begin('ptn'); 
break;
case 24: this.popState(); 
break;
case 25: this.popState(); this.popState(); 
break;
case 26: this.begin('prgs'); 
break;
case 27: return 19; 
break;
case 28: this.popState(); this.begin('args1'); 
break;
case 29: this.popState(); 
break;
case 30: this.popState(); this.popState(); 
break;
case 31: return 19; 
break;
case 32: 
break;
case 33: this.popState(); 
break;
case 34: this.popState(); this.popState(); 
break;
case 35: this.begin('il_spcs2'); return 16; 
break;
case 36: 
break;
case 37: this.popState(); 
break;
case 38: this.popState(); this.popState(); 
break;
case 39: this.begin('pugs2'); return 17; 
break;
case 40: this.begin('prgs'); 
break;
case 41: return 17; 
break;
case 42:  
break;
case 43: this.popState(); 
break;
case 44: this.popState(); this.popState(); 
break;
case 45: this.popState(); this.popState(); this.popState(); 
break;
case 46: this.begin('prgs'); 
break;
case 47: return 19; 
break;
case 48: this.popState(); this.begin('args2'); 
break;
case 49: this.popState(); 
break;
case 50: this.popState(); this.popState(); 
break;
case 51: this.popState(); this.popState(); this.popState(); 
break;
case 52: return 19; 
break;
case 53: 
break;
case 54: this.popState(); 
break;
case 55: this.popState(); this.popState(); 
break;
case 56: this.popState(); this.popState(); this.popState(); 
break;
case 57: return 19; 
break;
case 58: this.popState(); 
break;
case 59:  
break;
case 60: return yy_.yytext; 
break;
case 61: return 5; 
break;
}
};
lexer.rules = [/^(?:([\/]([^ \t\r\n:])*))/,/^(?:([\.][ ]*[\/](?:[^\r\n\/\\]|\\[^\r\n])+[\/][i]?[g]?[m]?))/,/^(?:([:][a-z]+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:\()/,/^(?:([:][a-z]+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:\()/,/^(?:((?:[^\r\n\)\\]|\\[^\r\n])+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^\r\n]+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:(([^ \t\r\n:])+))/,/^(?:([:][a-z]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:\()/,/^(?:([:][a-z]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:\()/,/^(?:((?:[^\r\n\)\\]|\\[^\r\n])+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^\r\n]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^ \r\n:]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([:][a-z]+))/,/^(?:\()/,/^(?:([:][a-z]+))/,/^(?:(\r?\n\t\t[\t]))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:\()/,/^(?:((?:[^\r\n\)\\]|\\[^\r\n])+))/,/^(?:(\r?\n\t\t[\t]))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^\r\n]+))/,/^(?:(\r?\n\t\t[\t]))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:((?:[^\r\n\)\\]|\\[^\r\n])+))/,/^(?:\))/,/^(?:([ \t])+)/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"sub":{"rules":[16,17,18,19,20,59,60,61],"inclusive":true},"ptn":{"rules":[35,36,37,38,39,59,60,61],"inclusive":true},"prgs":{"rules":[57,58,59,60,61],"inclusive":true},"il_spcs0":{"rules":[5,6,7,8,59,60,61],"inclusive":true},"il_spcs1":{"rules":[21,22,23,24,25,59,60,61],"inclusive":true},"il_spcs2":{"rules":[40,41,42,43,44,45,59,60,61],"inclusive":true},"pugs0":{"rules":[9,10,11,12,59,60,61],"inclusive":true},"pugs1":{"rules":[26,27,28,29,30,59,60,61],"inclusive":true},"pugs2":{"rules":[46,47,48,49,50,51,59,60,61],"inclusive":true},"args0":{"rules":[13,14,15,59,60,61],"inclusive":true},"args1":{"rules":[31,32,33,34,59,60,61],"inclusive":true},"args2":{"rules":[52,53,54,55,56,59,60,61],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,59,60,61],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = warp;
exports.Parser = warp.Parser;
exports.parse = function () { return warp.parse.apply(warp, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}})(ManifestParser);
/**
* Warp Console
**/

var program = require('commander');

(function() {
	var cwd = process.cwd();

	var warpHandler = new WarpHandler();
	var warpServer = new WarpServer();

	// establish handler options
	warpHandler.setManifest('manifest.txt');

	program
		.option('-p, --port <port>', 'specify the port', Number, 0);

	program
		.command('host')
		.action(function() {
			var port = program.port || null;
			warpServer.launch(warpHandler, port);
		});

	program
		.command('out')
		.action(function() {
			var rules = warpHandler.getRules();

			var target = '/'+argv[++i];
			var file = argv[++i];

			var match;
			for(var ri=rules.length-1; ri>=0; ri--) {
				var rule = rules[ri];
				if(rule.regex.test(target)) {
					match = rule;
					break;
				}
			}
			if(match) {
				var outdir = './out';
				if(fs.existsSync(outdir)) {
					try {
						var stats = fs.lstatSync(outdir);
						if(!stats.isDirectory()) {
							console.error(outdir+' already exists but is not a valid directory');
							process.exit(1);
						}
					} catch(e) {
						console.error('failed to create/open output directory: '+outdir);
						process.exit(1);
					}
				}
				else {
					fs.mkdirSync(outdir);
				}

				fs.writeFileSync(outdir+'/'+file, rule.exec(), 'utf-8');

			}
		});

	program.parse(process.argv);

})();
