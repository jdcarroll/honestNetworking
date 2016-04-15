// ping.js

var shell = require('shelljs');

var ping = function(broadcast){
	if(broadcast.length == 3){
		var octet = '.255'
	}
	if(broadcast.length == 2){
		var octet = '.255.255'
	}
	if(broadcast.length == 1){
		var octet = '255.255.255'
	}
	var prep = broadcast.toString();
	broadcast = prep.replace(/,/g,'.');
	shell.exec("ping " + broadcast + octet ,{ silent: true, timeout: 3000 });
	var arp = require('../arp');
}

module.exports = ping;