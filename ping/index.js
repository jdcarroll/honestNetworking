// ping.js

var shell = require('shelljs');

var ping = function(server_interface){
	if(server_interface.subnetRange.length == 3){
		var octet = '.255'
	}
	if(server_interface.subnetRange.length == 2){
		var octet = '.255.255'
	}
	if(server_interface.subnetRange.length == 1){
		var octet = '255.255.255'
	}
	var prep = server_interface.subnetRange.toString();
	broadcast = prep.replace(/,/g,'.');
	interface.broadcast = broadcast + octet;
	shell.exec("ping " + broadcast + octet ,{ silent: true, timeout: 3000 });
	var arp = require('../arp')(server_interface);
}

module.exports = ping;