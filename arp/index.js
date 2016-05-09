// Arp.js

var shell = require('shelljs');
var db = require('mongojs')('honest',['devices']);
var nmap = require('../nmap');
var utils = require('../utils');
var arp = function(server_interface, socket){
	var arpResults = new Promise(function(resolve, reject){
		var returnData = {};
		shell.exec("arp -a", {silent:true}, function(code, stdout, stderr){ 
			var array = stdout.split('\n');
			array.pop();
			var result = [];
			array.forEach(function(e){
				var item = e.split(' ');
				
				var cut1 = item[1].replace('(','');
				cut1 = cut1.replace(')',"");
				var mask = cut1.split('.');

				if (mask[0] !== '224'){
					var data = {
						ip : cut1,
						mac : item[3],
						iterface : item[5]
					}
					if(cut1.includes(server_interface.broadcast)){
						returnData.broadcast = data.ip;
					}else if (data.mac !== '(incomplete)'){
						result.push(data);
					}
					returnData.devices = result;
				}				
				
			});
			resolve(returnData)
		});
	});

	var checkMacDb = new Promise(function(resolve, reject){
		db.devices.distinct('mac', {}, function(err, docs){
			if(err){ utils.debug('Arp db Check:', err); }
			resolve(docs);
		});
	});

	Promise.all([checkMacDb, arpResults]).then(function(arpCompareValues){
		var checkDbResults = arpCompareValues[0];
		var arpResults = arpCompareValues[1];
		macCompare = [];
		arpResults.devices.forEach(function(arpDiscoverMacs){
			macCompare.push(arpDiscoverMacs.mac);
		});

		var newNmaps = utils.arrayDiffOnce(checkDbResults, macCompare);
		utils.debug('new nmaps', newNmaps);
		newNmaps.forEach(function(newDevice){
			utils.debug('newDevice', newDevice);
			arpResults.devices.forEach(function(arpDevice){
				if( newDevice === arpDevice.mac ){
					nmap(arpDevice, socket);
				}
			});
		});

	}).catch(function(err){
		utils.debug('arp promise catch', err);
	})

}

module.exports = arp;

