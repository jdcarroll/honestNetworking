// Devices.js
/* There are three ways that this app is going to capture devices accross the network.
We have multiple ways simply because each one is not full proof but together they make 
full enough attempts 

1. ping the subnet to add all devices to the servers arp table
	1-a. As soon as they are on the arp table we store the device and in the database
	and follow up with nmaps for each distinct mac address
	1-b. As soon as the initial nmap results come back we stor that in the database
	1-c. if the time that the last nmap was run for each device is less than 2weeks we run 
	a new nmap

2. list to packet data and do deep paket inspection for ip address accross the network.
	2-a. If a packet comes accross the wire that is not in the arp table we first ping
the ip. This will push its mac address to the arp table
	2-b. assuming that the mac address is not present in the arp table from step 1 we run
	an nmapscan of the device and store data in the database. */
//Dependancys
var arp = require('../arp');
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);
var nmap = require('../nmap');
var ping = require('../ping');

var device = function(socket){
	var subnet = global.honestServer.subnetRange.toString();
	var search = subnet.replace(/,/g,'.');
	var query = '{ip : {$regex: "^'+ search +'"}}';

	var get = new Promise(function(resolve, reject){
		db.devices.find({ip : {$regex: '^'+ search }}, function(err, docs){
			resolve(docs)
		})
	}).then(function(value){
		socket.emit('devices', value);
	})
	get.catch(function(err){
		console.log(err);
	})
}

module.exports = device