var mysql = require('mysql');
var parser = require('./rurl-parser.js').parser;

var parseError;

// handle parse errors
parser.yy.parseError = function(e) {
	parseError = e;
};

exports.instance = function() {

	var db = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
	});

	return {
		connect: function(databaseName, fn) {
			db.query("USE "+databaseName, function(err, res) {
				fn(err, res);
			});
		},
		exec: function(input, fn) {
			parseError = false;
			try {
				var query = parser.parse(input);
			} catch(e) { parseError = true; }
			if(parseError) return fn('malformed rurl syntax');

			db.query(query.sql, function(err, res) {
				fn(err, res);
			});
		},
		end: function() {
			db.end();
		},
	};
};
