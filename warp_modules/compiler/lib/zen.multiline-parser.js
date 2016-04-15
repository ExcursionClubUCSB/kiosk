// var s='div\n\ta\n\tb\n\t\tba\n\t\tbb\n\t\tbc\n\tc\n\t\tca\nspan\n\tspan_a\ne';
//     0123 4 56 7 89 0 1 234 5 6 78
//                  p
//                  m . .
//   b:            []
// t: 1, nt: 1

// b: div>(a+b

exports.collapseMultilineZen = function(s) {
	var b = '';

	var p = 0;
	var nt = 0;
    var t = 0;
    var regex = /(?:\r?\n)+(\t*)/g;

    var looping = true;
    while(looping) {
    	var m = regex.exec(s);
    	if(m == null) {
    		m = {
    			index: s.length,
    			0: '',
    			1: '',
    		};
    		looping = false;
    	}

    	b += s.substr(p, m.index-p);
    	p = m.index+m[0].length;

    	t = nt;
    	var nt = m[1].length;
    	if(nt == t) {
    		b += '+';
    	}
    	else if(nt > t) {
    		b += '>(';
    	}
    	else {
    		for(var i=nt; i<t; i++) {
    			b += ')';
			}
			b += '+';
    	}
	}

	return b.replace(/\++$/,'');
};