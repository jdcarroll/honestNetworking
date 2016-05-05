// Nmap.js

var shell = require('shelljs');
var parseString = require('xml2js').parseString;
var db = require('mongojs')('honest',['devices']);
var profiles = require('../profiles')

var computer = function(computer){
	new Promise(function(resolve, reject){

			shell.exec("nmap -vv -A " + computer.ip + " -oX -", {silent:true}, function(code, stdout, stderr){
			parseString(stdout, function(error, result){
				if (error){
					console.log('ERROR:',error);
				}
				try{
					var jsonData = JSON.stringify(result);
					var returnData = JSON.parse(jsonData);
					var portData = returnData.nmaprun.host[0].ports;
					for(var i = 0; i < portData[0].port.length; i++){
						var portIterator = portData[0].port[i].service[0];
						var device = {};

						// MacBook Pro discovery Schema
						if (portIterator.$.name === 'afp'){
							device = profiles.macBookPro(portIterator, computer);
						}

						// ESPON Printer Profile
						if(portIterator.$.name === 'upnp'){
							device = profiles.esponPrinter(portIterator, computer);
						}

						// Apple TV Profile
						if(portIterator.$.extrainfo.includes('Apple TV')){
							device = profiles.appleTV(portIterator, computer);
						}

						// Future to be discovered Profile
						if(port.cpe){
							device = profiles.futureDiscovery(portIterator, computer);
						}
						
					}
					resolve(device);
				}catch(err){
					console.log(err);
				}
			})
		})
	}).then(function(device){
		db.devices.insert(device, function(err, docs){
			if(err) { throw err }
			console.log('device inserted into Database:');
			console.log(device);
			console.log('===============================');
		})
	})
}

module.exports = computer






