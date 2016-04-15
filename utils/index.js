//utils.js

module.exports = {

	arrayDiffOnce : function(a1, a2) {
		console.log('hello from arr_diff')

	    var a = [], diff = [];

	    for (var i = 0; i < a1.length; i++) {
	    	
	        a[a1[i]] = true;
	    }

	    for (var i = 0; i < a2.length; i++) {
	        if (a[a2[i]]) {
	            delete a[a2[i]];
	        } else {
	            a[a2[i]] = true;
	        } 
	    }

	    for (var i = 0; i < a1.length; i++) {
	        if (a[a1[i]]) {
	            delete a[a1[i]];
	        } 
	    }
	    
	    for (var k in a) {
	        diff.push(k);
	    }

	    for( var i = 0; i < diff.length; i++){

	    	if (diff[a1[i]]) {
	    		delete diff[a1[i]];
	    	}
	    }

	    return diff;
	},

	getMatch: function(a, b) {
	    var matches = [];

	    for ( var i = 0; i < a.length; i++ ) {
	        for ( var e = 0; e < b.length; e++ ) {
	            if ( a[i] === b[e] ) matches.push( a[i] );
	        }
	    }
	    return matches;
	}

}