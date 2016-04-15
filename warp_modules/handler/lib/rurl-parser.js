/* Jison generated parser */
var rurlParser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"grammar":3,"grammarLine":4,"EOF":5,"tableStatement":6,"table":7,"WORD":8,"TICKED_STRING":9,"tableOperation":10,"limitClauseOptional":11,"@":12,"selectSomething":13,"columnList":14,"selectAfterColumnOptional":15,"whereStatement":16,"selectGroupByOptional":17,"selectGroupBy":18,"selectGroupByMore":19,",":20,"whereStatementOptional":21,"(":22,"whereStatementClausesOptional":23,")":24,"whereStatementClauses":25,"column":26,"whereComparativeOperator":27,"value":28,"whereStatementMore":29,"whereLogicalOperator":30,"&":31,"^":32,";":33,"=":34,"!":35,"<":36,"orEqualTo":37,">":38,"columnDeclarationsGroup":39,"{":40,"columnDeclarationList":41,"}":42,"columnDeclaration":43,"columnDeclarationListMore":44,"columnDeclarationSpecial":45,"columnDeclarationSpecialFunc":46,"columnDeclarationSpecialFuncValue":47,"NUMBER":48,"columnModifyGroup":49,"columnModifyList":50,"columnSetString":51,"columnModifyListMore":52,"columnListOptional":53,"columnListGroup":54,"columnListMore":55,".":56,"limitClause":57,"~":58,"limitClauseMaxOptional":59,"QUOTED_STRING":60,"expression":61,"concatenation":62,"[":63,"concatValue":64,"]":65,"FREE_STRING":66,"numericValue":67,"expressionMore":68,"arithmeticOperator":69,"functionCall":70,"FUNCTION_CALL":71,"functionValue":72,"arguments":73,"argument":74,"argumentsMore":75,"+":76,"-":77,"*":78,"/":79,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"WORD",9:"TICKED_STRING",12:"@",20:",",22:"(",24:")",31:"&",32:"^",33:";",34:"=",35:"!",36:"<",38:">",40:"{",42:"}",48:"NUMBER",51:"columnSetString",56:".",58:"~",60:"QUOTED_STRING",63:"[",65:"]",66:"FREE_STRING",71:"FUNCTION_CALL",76:"+",77:"-",78:"*",79:"/"},
productions_: [0,[3,2],[4,1],[7,1],[7,1],[6,3],[10,2],[13,2],[13,2],[15,2],[15,0],[17,1],[17,0],[18,2],[19,2],[19,0],[21,1],[21,0],[16,3],[23,1],[23,0],[25,4],[29,2],[29,0],[30,1],[30,1],[30,1],[30,1],[27,1],[27,2],[27,2],[27,2],[27,1],[37,1],[37,0],[39,3],[41,2],[44,2],[44,0],[43,2],[45,2],[45,0],[46,3],[46,0],[47,1],[49,3],[50,4],[52,2],[52,0],[53,1],[53,0],[54,3],[14,2],[55,2],[55,0],[26,1],[26,1],[26,1],[11,1],[11,0],[57,3],[59,2],[59,0],[28,1],[28,1],[28,1],[62,3],[64,2],[64,2],[64,0],[61,2],[68,3],[68,0],[67,1],[67,1],[67,1],[70,3],[72,1],[72,0],[73,2],[75,3],[75,0],[74,1],[69,1],[69,1],[69,1],[69,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:
			var g = $$[$0-1];
			
			
			var compileSql = function() {
				
				var sqlA = "";
				var sqlB = "";
				var sqlA1 = "";
				var sqlA2 = "";
				var sqlX = "";
				
				var srcTarget = " `"+g.tableName+"` ";
				
//				console.log(g);
				// select
				if(g.select) {
					var s = g.select;
					sqlA += "SELECT";
					
					if(s.columnList) {
						sqlA += " "+expandColumnList(s.columnList, false, s.where);
					}
					else {
						sqlA += " *";
					}
					
					if(s.where) {
						sqlB += "WHERE "+expandWhere(s.where);
					}
					if(s.group) {
						sqlB += " GROUP BY `"+s.group.join("`,`")+"`";
					}
					
					sqlA += " FROM";
				}
				
				if(g.where) {
					sqlB += " WHERE ("+expandWhere(g.where)+")";
				}
				
				if(g.limitMax) {
					sqlB += " LIMIT ";
					if(g.limitMin) {
						sqlB += g.limitMin+", ";
					}
					sqlB += g.limitMax;
				}
				
				var sqlFinal = sqlX.length? sqlX: sqlA+srcTarget+sqlB;
				return {
					sql: sqlFinal,
				};
			};
			
			return compileSql();
		
break;
case 4:
			this.$ = stripped($$[$0]);
		
break;
case 5:
			this.$ = __($$[$0-1], $$[$0], {
				tableName: $$[$0-2],
			});
		
break;
case 6:
			this.$ = {
				select: $$[$0],
			};
		
break;
case 7:
			this.$ = __($$[$0-1], $$[$0]);
		
break;
case 8:
			this.$ = __($$[$0-1], $$[$0]);
		
break;
case 9:
			this.$ = __($$[$0-1], $$[$0]);
		
break;
case 10:
			this.$ = false;
		
break;
case 11:
			this.$ = {
				group: $$[$0],
			};
		
break;
case 12:
			this.$ = false;
		
break;
case 13:
			$$[$0].push($$[$0-1]);
			this.$ = $$[$0];
		
break;
case 14:
			this.$ = $$[$0];
		
break;
case 15:
			this.$ = [];
		
break;
case 17:
			this.$ = {
				where: '*',
			};
		
break;
case 18:
			this.$ = $$[$0-1]
		
break;
case 20:
			this.$ = {
				where: '*',
			};
		
break;
case 21:
			$$[$0].push({
				column: $$[$0-3],
				using: $$[$0-2],
				value: $$[$0-1],
			});
			this.$ = {
				where: $$[$0],
			};
		
break;
case 22:
			$$[$0].where.push($$[$0-1]);
			this.$ = $$[$0].where;
		
break;
case 23:
			this.$ = [];
		
break;
case 29:
			this.$ = '!=';
		
break;
case 30:
			if($$[$0]) {
				this.$ = '<=';
			}
			else {
				this.$ = '<';
			}
		
break;
case 31:
			if($$[$0]) {
				this.$ = '>=';
			}
			else {
				this.$ = '>';
			}
		
break;
case 34:
			this.$ = false;
		
break;
case 35:
			this.$ = {
				columnDeclarations: $$[$0-1],
			};
		
break;
case 36:
			$$[$0].push($$[$0-1]);
			this.$ = $$[$0];
		
break;
case 37:
			this.$ = $$[$0];
		
break;
case 38:
			this.$ = [];
		
break;
case 39:
			if($$[$0]) {
				this.$ = __($$[$0], {
					name: $$[$0-1],
				});
			}
			else {
				this.$ = {
					name: $$[$0-1],
				};
			}
		
break;
case 40:
			this.$ = {
				type: $$[$0-1],
				typeArg: $$[$0],
			};
		
break;
case 41:
			this.$ = false;
		
break;
case 42:
			this.$ = $$[$0-1];
		
break;
case 43:
			this.$ = false;
		
break;
case 45:
			this.$ = $$[$0-1];
		
break;
case 46:
			$$[$0].push({
				set: $$[$0-3],
				value: $$[$0-1],
			});
			this.$ = {
				modifyColumns: $$[$0],
			};
		
break;
case 47:
			this.$ = $$[$0];
		
break;
case 48:
			this.$ = [];
		
break;
case 50:
			this.$ = [];
		
break;
case 51:
			this.$ = $$[$0-1];
		
break;
case 52:
			$$[$0].push($$[$0-1]);
			this.$ = {
				columnList: $$[$0],
			};
		
break;
case 53:
			this.$ = $$[$0].columnList;
		
break;
case 54:
			this.$ = [];
		
break;
case 56:
			this.$ = ticks(stripped($$[$0]));
		
break;
case 57:
			this.$ = {
				selectWhereColumns: true,
			};
		
break;
case 59:
			this.$ = {};
		
break;
case 60:
			if($$[$0]) {
				this.$ = __($$[$0], {
					limitMin: $$[$0-1],
				});
			}
			else {
				this.$ = {
					limitMax: $$[$0-1],
				};
			}
		
break;
case 61:
			this.$ = {
				limitMax: $$[$0],
			};
		
break;
case 62:
			this.$ = false;
		
break;
case 63:
			this.$ = stripped($$[$0]);
		
break;
case 66:
			this.$ = {
				sql: "CONCAT("+$$[$0-1].join(",")+")"
			};
		
break;
case 67:
			this.$ = $$[$0];
			this.$.unshift($$[$0-1]);
		
break;
case 68:
			this.$ = $$[$0];
			this.$.unshift(irks($$[$0-1]));
		
break;
case 69:
			this.$ = [];
		
break;
case 70:
			if(!$$[$0]) this.$ = $$[$0-1];
			else this.$ = $$[$0-1]+""+$$[$0];
		
break;
case 71:
			this.$ = $$[$0-2]+""+$$[$0-1]+""+$$[$0];
		
break;
case 72:
			this.$ = "";
		
break;
case 76:
			this.$ = {
				sql: $$[$0-2]+""+$$[$0-1]+")",
			};
		
break;
case 78:
			this.$ = "";
		
break;
case 79:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 80:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 81:
			this.$ = [];
		
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:[1,5],9:[1,6]},{1:[3]},{5:[1,7]},{5:[2,2]},{10:8,12:[1,9]},{12:[2,3]},{12:[2,4]},{1:[2,1]},{5:[2,59],11:10,57:11,58:[1,12]},{8:[1,18],9:[1,19],13:13,14:14,16:15,22:[1,17],26:16,56:[1,20]},{5:[2,5]},{5:[2,58]},{48:[1,21]},{5:[2,6],58:[2,6]},{5:[2,10],15:22,16:23,22:[1,17],58:[2,10]},{5:[2,12],8:[1,26],17:24,18:25,58:[2,12]},{5:[2,54],20:[1,28],22:[2,54],55:27,58:[2,54]},{8:[1,18],9:[1,19],23:29,24:[2,20],25:30,26:31,56:[1,20]},{5:[2,55],8:[2,55],9:[2,55],20:[2,55],22:[2,55],34:[2,55],35:[2,55],36:[2,55],38:[2,55],56:[2,55],58:[2,55],65:[2,55],66:[2,55]},{5:[2,56],8:[2,56],9:[2,56],20:[2,56],22:[2,56],34:[2,56],35:[2,56],36:[2,56],38:[2,56],56:[2,56],58:[2,56],65:[2,56],66:[2,56]},{5:[2,57],8:[2,57],9:[2,57],20:[2,57],22:[2,57],34:[2,57],35:[2,57],36:[2,57],38:[2,57],56:[2,57],58:[2,57],65:[2,57],66:[2,57]},{5:[2,62],20:[1,33],59:32},{5:[2,7],58:[2,7]},{5:[2,12],8:[1,26],17:34,18:25,58:[2,12]},{5:[2,8],58:[2,8]},{5:[2,11],58:[2,11]},{5:[2,15],19:35,20:[1,36],58:[2,15]},{5:[2,52],22:[2,52],58:[2,52]},{8:[1,18],9:[1,19],14:37,26:16,56:[1,20]},{24:[1,38]},{24:[2,19]},{8:[1,44],27:39,34:[1,40],35:[1,41],36:[1,42],38:[1,43]},{5:[2,60]},{48:[1,45]},{5:[2,9],58:[2,9]},{5:[2,13],58:[2,13]},{8:[1,26],18:46},{5:[2,53],22:[2,53],58:[2,53]},{5:[2,18],8:[2,18],58:[2,18]},{8:[1,54],28:47,48:[1,53],60:[1,48],61:49,62:50,63:[1,52],67:51,70:55,71:[1,56]},{8:[2,28],48:[2,28],60:[2,28],63:[2,28],71:[2,28]},{34:[1,57]},{8:[2,34],34:[1,59],37:58,48:[2,34],60:[2,34],63:[2,34],71:[2,34]},{8:[2,34],34:[1,59],37:60,48:[2,34],60:[2,34],63:[2,34],71:[2,34]},{8:[2,32],48:[2,32],60:[2,32],63:[2,32],71:[2,32]},{5:[2,61]},{5:[2,14],58:[2,14]},{20:[1,65],24:[2,23],29:61,30:62,31:[1,63],32:[1,64],33:[1,66]},{20:[2,63],24:[2,63],31:[2,63],32:[2,63],33:[2,63]},{20:[2,64],24:[2,64],31:[2,64],32:[2,64],33:[2,64]},{20:[2,65],24:[2,65],31:[2,65],32:[2,65],33:[2,65]},{20:[2,72],24:[2,72],31:[2,72],32:[2,72],33:[2,72],68:67,69:68,76:[1,69],77:[1,70],78:[1,71],79:[1,72]},{8:[1,18],9:[1,19],26:74,56:[1,20],64:73,65:[2,69],66:[1,75]},{20:[2,73],24:[2,73],31:[2,73],32:[2,73],33:[2,73],76:[2,73],77:[2,73],78:[2,73],79:[2,73]},{20:[2,74],24:[2,74],31:[2,74],32:[2,74],33:[2,74],76:[2,74],77:[2,74],78:[2,74],79:[2,74]},{20:[2,75],24:[2,75],31:[2,75],32:[2,75],33:[2,75],76:[2,75],77:[2,75],78:[2,75],79:[2,75]},{8:[1,54],24:[2,78],28:79,48:[1,53],60:[1,48],61:49,62:50,63:[1,52],67:51,70:55,71:[1,56],72:76,73:77,74:78},{8:[2,29],48:[2,29],60:[2,29],63:[2,29],71:[2,29]},{8:[2,30],48:[2,30],60:[2,30],63:[2,30],71:[2,30]},{8:[2,33],48:[2,33],60:[2,33],63:[2,33],71:[2,33]},{8:[2,31],48:[2,31],60:[2,31],63:[2,31],71:[2,31]},{24:[2,21]},{8:[1,18],9:[1,19],25:80,26:31,56:[1,20]},{8:[2,24],9:[2,24],56:[2,24]},{8:[2,25],9:[2,25],56:[2,25]},{8:[2,26],9:[2,26],56:[2,26]},{8:[2,27],9:[2,27],56:[2,27]},{20:[2,70],24:[2,70],31:[2,70],32:[2,70],33:[2,70]},{8:[1,54],48:[1,53],67:81,70:55,71:[1,56]},{8:[2,83],48:[2,83],71:[2,83]},{8:[2,84],48:[2,84],71:[2,84]},{8:[2,85],48:[2,85],71:[2,85]},{8:[2,86],48:[2,86],71:[2,86]},{65:[1,82]},{8:[1,18],9:[1,19],26:74,56:[1,20],64:83,65:[2,69],66:[1,75]},{8:[1,18],9:[1,19],26:74,56:[1,20],64:84,65:[2,69],66:[1,75]},{24:[1,85]},{24:[2,77]},{20:[1,87],24:[2,81],75:86},{20:[2,82],24:[2,82]},{24:[2,22]},{20:[2,72],24:[2,72],31:[2,72],32:[2,72],33:[2,72],68:88,69:68,76:[1,69],77:[1,70],78:[1,71],79:[1,72]},{20:[2,66],24:[2,66],31:[2,66],32:[2,66],33:[2,66]},{65:[2,67]},{65:[2,68]},{20:[2,76],24:[2,76],31:[2,76],32:[2,76],33:[2,76],76:[2,76],77:[2,76],78:[2,76],79:[2,76]},{24:[2,79]},{8:[1,54],28:79,48:[1,53],60:[1,48],61:49,62:50,63:[1,52],67:51,70:55,71:[1,56],74:89},{20:[2,71],24:[2,71],31:[2,71],32:[2,71],33:[2,71]},{20:[1,87],24:[2,81],75:90},{24:[2,80]}],
defaultActions: {3:[2,2],5:[2,3],6:[2,4],7:[2,1],10:[2,5],11:[2,58],30:[2,19],32:[2,60],45:[2,61],61:[2,21],77:[2,77],80:[2,22],83:[2,67],84:[2,68],86:[2,79],90:[2,80]},
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


/* global functions for use in the semantic actions */


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

function stripped(str) {
	return str.substr(1, str.length-2);
}

function stripAndQuote(str) {
	return "'"
		+str
			.substr(1, str.length-2)
			.replace(/\\(.)/g, function(a,b){return b;})
			.replace(/'/g, "\\'")
		+"'";
}

function irks(str) {
	if(str.sql) return str.sql;
	return "'"
		+str
			.replace(/\\(.)/g, function(a,b){return b;})
			.replace(/'/g,"\\'")
		+"'";
}

function ticks(str) {
	return "`"
		+str
			.replace(/\\(.)/g, function(a,b){return b;})
			.replace(/`/g,"\\`")
		+"`";
}

function expandDatabaseOptions(opt) {
	var q = "";
	var i = opt.length;
	while(i--) {
		var e = opt[i];
		q += e.set.toUpperCase()+" "+e.value;
	}
	return q;
}

function expandSetValues(upd, useSet) {
	var ba = [], bb = [];
	var i = upd.length;
	while(i--) {
		ba.push(ticks(upd[i].set));
		bb.push(upd[i].value);
	}
	return (useSet? "SET (": "(")+ba.join(",")+") VALUES ("+bb.join(",")+")";
}

function expandTableOptions(opt) {
	return "("+expandColumnDeclarations(opt.columnDeclarations)+")";
}

function expandColumnDeclarations(decls, prefix) {
	prefix = prefix? prefix+" ": "";
	var b = [];
	var i = decls.length;
	while(i--) {
		var d = decls[i];
		var sq = prefix+"`"+d.name+"` ";
		sq += d.type? d.type.toUpperCase(): "VARCHAR(255)";
		if(d.typeArg) sq += "("+d.typeArg+")";
		b.push(sq);
	}
	return b.join(", ");
}

function expandColumnList(list, prefix, where) {
	prefix = prefix? prefix+" ": "";
	
	// first scan through all select fields and assure uniqueness via hash
	var cols = {};
	list.reverse();
	for(var i=0; i<list.length; i++) {
		if(list[i].selectWhereColumns) {
			for(var j=0; j<where.length; j++) {
				cols[where[i].column] = true;
			}
		}
		else {
			cols[list[i]] = true;
		}
	}
	
	// then push all keys in hash to array
	var colarr = [];
	for(var e in cols) {
		colarr.push(e);
	}
	return prefix+"`"+colarr.join("`, "+prefix+"`")+"`";
}

function expandWhere(where) {
	var translation = {',':'AND', ';':'OR', '&':'AND', '^':'OR'};
	var precedence = {',':1, ';':1, '&':2, '^':2};
	var q = "";
	if(!where || !where.length || where === '*') {
		return "1";
	}
	var i = where.length;
	q += "(";
	var level = -1;
	var b = [];
	while(i--) {
		var c = where[i];
//		console.log('where: ',c);
		if(typeof c === "string") {
			var tran = translation[c],
				prec = precedence[c];
			
			if(prec >= level) {
				b.push(tran);
			}
			else if(prec < level) {
				q += b.join(" ")+") "+tran+" (";
				b.length = 0;
			}
			level = prec;
		}
		else {
			var column = ticks(c.column);
			if(c.value) {
				// standard
				if(c.using) {
					b.push(column+" "+c.using.toUpperCase()+" "+irks(c.value));
				}
				// no operator given, assume this means exactly equal to
				else {
					b.push(column+" = "+irks(c.value));
				}
			}
			// no value given, assume this means not empty string
			else {
				b.push(column+" != ''");
			}
		}
	}
	q += b.join(" ")+") ";
	return q;
}
/* Jison generated lexer */
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
case 0: return 9; 
break;
case 1: return 66; 
break;
case 2: this.begin('INITIAL'); return yy_.yytext; 
break;
case 3: this.begin('concat'); return yy_.yytext; 
break;
case 4: 
break;
case 5:
break;
case 6: this.begin('expression'); return 48; 
break;
case 7: this.begin('INITIAL'); return yy_.yytext; 
break;
case 8: this.begin('INITIAL'); return yy_.yytext; 
break;
case 9: this.begin('INITIAL'); return yy_.yytext; 
break;
case 10: this.begin('INITIAL'); return yy_.yytext; 
break;
case 11: this.begin('INITIAL'); return yy_.yytext; 
break;
case 12: return 71; 
break;
case 13: return 8; 
break;
case 14:return 60;
break;
case 15: this.begin('where'); return yy_.yytext; 
break;
case 16: this.popState(); return yy_.yytext; 
break;
case 17: return yy_.yytext; 
break;
case 18: return 5; 
break;
}
};
lexer.rules = [/^(?:([`]((?:[^`\\]|\\.)*)[`]))/,/^(?:((?:[^`\]\\]|\\.))+)/,/^(?:\])/,/^(?:\[)/,/^(?:(\r?\n\t*)+)/,/^(?: )/,/^(?:([0-9])+)/,/^(?:\))/,/^(?:,)/,/^(?:;)/,/^(?:&)/,/^(?:\^)/,/^(?:([a-zA-Z_])([a-zA-Z_0-9])*\()/,/^(?:([a-zA-Z_])([a-zA-Z_0-9])*)/,/^(?:(([']((?:[^'\\]|\\.)*)['])|(["]((?:[^"\\]|\\.)*)["])))/,/^(?:\()/,/^(?:\))/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"expression":{"rules":[4,5,6,7,8,9,10,11,13,14,15,16,17,18],"inclusive":true},"concat":{"rules":[0,1,2,4,5,6,13,14,15,16,17,18],"inclusive":true},"where":{"rules":[0,4,5,6,12,13,14,15,16,17,18],"inclusive":true},"INITIAL":{"rules":[0,3,4,5,6,13,14,15,16,17,18],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = rurlParser;
exports.Parser = rurlParser.Parser;
exports.parse = function () { return rurlParser.parse.apply(rurlParser, arguments); }
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
}