// main server dependacy libraries
var os = require('os');
var utils = require('../utils');
var ipaddr = require('ipaddr.js');
// main server object it builds the object and calculates subnet range 
var _server = {
	// uses node to grabe system network card information 
	build : function(resolve, reject){
		var interfaces = os.networkInterfaces();
		resolve(interfaces);
	},
	getInterface : function(os_interfaces){
		var activeInterface = '';
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// Grab the active interface on the system
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// os_interfaces is an object with properties that are arrays and contain objects
		for (prop in os_interfaces){
			if(os_interfaces.hasOwnProperty(prop)){
				os_interfaces[prop].forEach(function (detected_interface){
					// If the netCard contains IPv4
					if(detected_interface.family === 'IPv4'){
						// then I know that this is the active card
						activeInterface = detected_interface;
						activeInterface.netCardName = prop;
					}
				})
			}
		}
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// prepare globalInterface.address for the rest of the system
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// establishing an array as a container to do the prep work
		var localAddress = []; 
		// split the current active interface address from a string to an array
		var localAddressLoop = activeInterface.address.split('.');
		// establish a int var to contain new int value
		var change = 0;
		// loop through each portion of the address and change to int value
		localAddressLoop.forEach(function(octet){
			change = Number(octet);
			localAddress.push(change);
		})
		// reassign active interface address to new value
		activeInterface.address = localAddress
		// create initial returnable object
		var globalInterface = {
			address : localAddress,
			name : activeInterface.netCardName,
			netmask : activeInterface.netmask,
			family : activeInterface.family,
			mac : activeInterface.mac,
			internal : activeInterface.internal
		}
		// add last property of global object subnet range
		var range = ipaddr.IPv4.parse(globalInterface.netmask).prefixLengthFromSubnetMask();
			utils.debug('range', range);
			// A class subnet
			if(range <= 8){
				globalInterface.subnetRange = [
					globalInterface.address[0]
				]

			}
			// B class Subnet
			if(range > 8 && range <= 17){
				globalInterface.subnetRange = [
					globalInterface.address[0],
					globalInterface.address[1]
				]
			}
			// C class subnet
			if(range >= 18 ){
				globalInterface.subnetRange = [
					globalInterface.address[0],
					globalInterface.address[1],
					globalInterface.address[2]
				];

			}
		// return finished server object
		return globalInterface;
	}
}

module.exports = _server;
