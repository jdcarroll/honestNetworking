// ping.js

var shell = require('shelljs');
var arp = require('../arp');
var ping = function(server_interface){
	var octet
	if(server_interface.subnetRange.length === 3){
		octet = '.255';
	}
	if(server_interface.subnetRange.length === 2){
		octet = '.255.255';
	}
	if(server_interface.subnetRange.length === 1){
		octet = '255.255.255';
	}
	var prep = server_interface.subnetRange.toString();
	broadcast = prep.replace(/,/g,'.');
	server_interface.broadcast = broadcast + octet;
	shell.exec("ping " + broadcast + octet ,{ async: true, silent: true, timeout: 3000 });
	arp(server_interface);
}

module.exports = ping;