//utils.js

module.exports = {

	arrayDiffOnce : function(a1, a2) {

		returnArray = [];

    for (var i = 0; i < a2.length; i++){
        if (a1.indexOf(a2[i]) === -1){
            returnArray.push(a2[i]);
        }
    }
    return returnArray 
	},

	getMatch: function(a, b) {
	    var matches = [];

	    for ( var i = 0; i < a.length; i++ ) {
	        for ( var e = 0; e < b.length; e++ ) {
	            if ( a[i] === b[e] ) matches.push( a[i] );
	        }
	    }
	    return matches;
	},

	ab2str: function(buf) {
	  return String.fromCharCode.apply(null, new Uint16Array(buf));
	},

	debug : function(title, obj) {
    if (process.env.DEBUG) console.log('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n',
    								   title, '\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n',
    								    obj, '\n===========================================\n\n');
  }
	
}