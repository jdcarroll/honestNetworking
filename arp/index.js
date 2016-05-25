//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Arp - get all visable device objects containing ips and mac address and then compare to what is in the DB 
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// required modules
var shell = require('shelljs');// perform command line action
var db = require('mongojs')('honest',['devices']);// db connection
var nmap = require('../nmap'); // device discovery module
var utils = require('../utils');// utilities
// arp requires the server_interface and uses the socket to pass forward int he chain
var arp = function(server_interface, socket){
	var arpResults = new Promise(function(resolve, reject){
		// establishing container object that will hold every resolve by the promise
		var returnData = {};
		// shell.exec will execute the command
		shell.exec("arp -a", {silent:true}, function(code, stdout, stderr){ 
			// stdout is a string converting to array on new line
			var output = stdout.split('\n');
			// output data in debug mode when arp runs
			utils.debug('Arp Results', output);
			// getting rid of last element in array as it is extraneous
			output.pop();
			// establishing container array for all lines as pout from arp
			var result = [];
			// loop through each and parse each line
			output.forEach(function(e){
				// getting rid of extraneous spaces
				var item = e.split(' ');
				// cleaning up ip address and preping it for system
				var ipAddress = item[1].replace('(','');
				ipAddress = ipAddress.replace(')',"");
				var mask = ipAddress.split('.');
				// the system wants the ip address to be an array
				// looking for multicast addresses - strictly internal addressing
				if (mask[0] !== '224'){
					// defining the data object that will be passes into the returnData array
					var data = {
						ip : ipAddress,
						mac : item[3],
						iterface : item[5]
					}
					// looking for any broadcast addresses that may appear 
					if(ipAddress.includes(server_interface.broadcast)){
						// if found add broadcast property to return data object
						returnData.broadcast = data.ip;
						// only pass completely identifies objects to result
					}else if (data.mac !== '(incomplete)'){
						result.push(data);
					}
					// add property of devices to returnData object
					returnData.devices = result;
				}				
				
			});
			// resolve the entire data object 
			resolve(returnData)
		});
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// promise to check db for distinct mac addresses
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	var checkMacDb = new Promise(function(resolve, reject){
		db.devices.distinct('mac', {}, function(err, docs){
			if(err){ utils.debug('Arp db Check:', err); }
			resolve(docs);
		});
	});
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// once all promises are completed compare arp with db results
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	Promise.all([checkMacDb, arpResults]).then(function(arpCompareValues){
		var checkDbResults = arpCompareValues[0];
		var arpResults = arpCompareValues[1];
		macCompare = [];
		arpResults.devices.forEach(function(arpDiscoverMacs){
			macCompare.push(arpDiscoverMacs.mac);
		});
		// if found a new mac address pass the object to the nmap for scan
		var newNmaps = utils.arrayDiffOnce(checkDbResults, macCompare);
		newNmaps.forEach(function(newDevice){
			utils.debug('newDevice', newDevice);
			arpResults.devices.forEach(function(arpDevice){
				if( newDevice === arpDevice.mac ){
					nmap(arpDevice, socket);
				}
			});
		});
	// assuming that any one promise fails output the error in debug mode only
	}).catch(function(err){
		utils.debug('arp promise catch', err);
	})

}

module.exports = arp;

