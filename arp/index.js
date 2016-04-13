var shell = require('shelljs');
var db = require('mongojs')('honest',['devices']);

var arp = new Promise(function(resolve, reject){
	var returnData = {};
	shell.exec("arp -a", {silent:true}, function(code, stdout, stderr){ 
		
		var array = stdout.split('\n');
		array.pop();
		var result = [];
		array.forEach(function(e){
			var item = e.split(' ');
			
			var cut1 = item[1].replace('(','');
			var cut2 = cut1.replace(')',"");
			var data = {
				ip : cut2,
				mac : item[3],
				iterface : item[5]
			}
			if(cut2.includes('255')){
				returnData.broadcast = data.ip;
			}else if (data.mac != '(incomplete)'){
				result.push(data);
			}
			returnData.devices = result;
			resolve(returnData)
		})
	})
})

arp.then(function(val){
	db.devices.find(function(err, docs){
		if(docs.length == 0){
			val.devices.forEach(function(e){
				db.devices.save(e);
			})
		}else {
			console.log('-------------------------------------------------');
			console.log(docs)
		}
	})
})


module.exports = arp;

