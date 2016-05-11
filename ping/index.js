//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// ping - ping the subnet to mimic a broadcast request to gain all devices on the network
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// requuire modules
var shell = require('shelljs');// perform command line action
var arp = require('../arp');// next step in chain
var ping = function(server_interface, socket){
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// Determine broadcast address
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	var octet;
	if(server_interface.subnetRange.length === 3){
		octet = '.255';
	}
	if(server_interface.subnetRange.length === 2){
		octet = '.255.255';
	}
	if(server_interface.subnetRange.length === 1){
		octet = '255.255.255';
	}
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// Create broadcast address
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	var prep = server_interface.subnetRange.toString();
	broadcast = prep.replace(/,/g,'.');
	server_interface.broadcast = broadcast + octet;
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// execute command for 3 seconds
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	shell.exec("ping " + broadcast + octet ,{ async: true, silent: true, timeout: 3000 });
	// pass server object and the socket along the chain
	arp(server_interface, socket);
}

module.exports = ping;