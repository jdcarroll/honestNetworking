var db = require('mongojsom')('honest',['bandwidth']);
var ipaddr = require('ipaddr.js');

var p1 = new Promise(function(resolve, reject){
		var data = db.bndwidth.find({ bandwidth : 2.247 },function(err, docs){
		console.log('docs:', docs)
		console.log('err:', err)
		resolve(docs)
		reject(err)
	})
})

p1.then(function(val){
	console.log('i fulfilled a promise. and here is the data:', val)
}).catch(
	function(reason){
		console.log('reason:', reason);
	}
)

console.log(ipaddr.IPv4.parse('255.255.255.0').prefixLengthFromSubnetMask())