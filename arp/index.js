// Arp.js

var shell = require('shelljs');
var db = require('mongojs')('honest',['devices']);
var nmap = require('../nmap');
var utils = require('../utils');
var arp = new Promise(function(resolve, reject){
	var returnData = {};
	shell.exec("arp -a", {silent:true}, function(code, stdout, stderr){ 

		var array = stdout.split('\n');
		array.pop();
		var result = [];
		var str = global.honestServer.subnetRange.toString();
		var broadcast = str.replace(/,/g,'.');
		array.forEach(function(e){
			var item = e.split(' ');
			
			var cut1 = item[1].replace('(','');
			var cut2 = cut1.replace(')',"");

			var data = {
				ip : cut2,
				mac : item[3],
				iterface : item[5]
			}

			if(cut2.includes(broadcast + '.255')){
				returnData.broadcast = data.ip;
			}else if (data.mac != '(incomplete)'){
				result.push(data);
			}
			returnData.devices = result;
			
		})

		resolve(returnData)
	})
})

var checkMacDb = new Promise(function(resolve, reject){
	db.devices.distinct('mac', {}, function(err, docs){
		resolve(docs)
	})

});

Promise.all([checkMacDb, arp]).then(function(values){
	var checkDbResults = values[0]
	var arpResults = values[1]
	macCompare = []
	arpResults.devices.forEach(function(e){
		macCompare.push(e.mac);
	})
	var newNmaps = utils.arrayDiffOnce(checkDbResults, macCompare);
	newNmaps.forEach(function(e){
		arpResults.devices.forEach(function(d){
			if( e == d.mac ){
				nmap(d);
			}
		})
	})
	for (var i = 0; i < arpResults.devices.length; i++){

	}

}).catch(function(err){
	console.log(err);
})



module.exports = arp;

