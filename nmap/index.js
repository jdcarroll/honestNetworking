// Nmap.js
// I want to simplify the port information section to enable ease of adding device 
// profiles to the app. I at this point am unsure how to do this.
/*
*	The Devices that I am discovering currently
	1. MacBook Pro
	2. ESPON Printers
	3. Apple TV
*/
var shell = require('shelljs');
var parseString = require('xml2js').parseString;
var db = require('mongojs')('honest',['devices']);
var utils = require('../utils');
var computer = function(computer){
	new Promise(function(resolve, reject){

			shell.exec("nmap -vv -A " + computer.ip + " -oX -", {silent:true}, function(code, stdout, stderr){
			// parsing standard out of nmap command to discover devices using
			// xml to JSON
			var device = {
 				cpe: [],
 				open_ports: [],
 				ip: computer.ip,
 				mac: computer.mac
 			}
			parseString(stdout, function mainScan(error, result){
				// if error exists and debug mode is on console error
				if (error){
					utils.debug('Parse String from Nmap:', error);
				}
					// try to JSONParse 
					var portData = result.nmaprun.host[0].ports;
					try{
						for(var i = 0; i < portData[0].port.length; i++){
							var portIterator = portData[0].port[i].service[0];
	// using port information to discover devices =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=						
							// add all open ports to device
							if(portIterator.$.name !== 'unknown'){
								device.open_ports.push(portIterator.$.name);
							}
							// MacBook Pro discovery Schema
							if(portIterator.$.name === 'afp'){
								device.type = portIterator.$.extrainfo.split(';');
								device.ostype = portIterator.$.ostype;
							}
							if(portIterator.$.name === 'vnc'){
								device.osType = portIterator.$.ostype;
							}
							if(portIterator.$.hostname){
								 device.hostname = portIterator.$.hostname;
							}

							// ESPON Printer Profile
							if(portIterator.$.name === 'upnp'){
								device.hostname = portIterator.$.product;
								device.cpe.push(portIterator.$.cpe);
								device.type = portIterator.$.devicetype;
									
							}
							if (portIterator.$.name === 'domain'){
								device.type = portIterator.$.name;
							}

							// add port extra info
							if(portIterator.$.extrainfo){
								device.info = portIterator.$.extrainfo;

								// Apple TV Profile
								if(device.info.includes('Apple TV')){
									device.hostname = 'Apple TV';
								}
							}
							if(portIterator.$.name === 'rtsp'){
								device.ostype = portIterator.$.ostype;
							}
							// Future to be discovered Profile
							if(portIterator.cpe){
								device.cpe.push(portIterator.cpe);
							}
	// using port information to discover devices =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=	
						}
					}catch(err){
						utils.debug('Cant Parse Nmap Scan Error' ,err)
					}
			})
			resolve(device);
		})
	}).then(function(device){
		if(device.cpe.length > 0){
			db.devices.insert(device, function(err, docs){
				if(err) { 
					utils.debug('failure to device insert into DB Nmap:', err);
				}
				utils.debug('Inserted object', device);
			})
		}
		
	})
}

module.exports = computer


