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
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);
var async = require('async');
var utils = require('../utils');
var server_interface = require('../network').server;
module.exports = {
	
	waterfall : function(response){
		async.waterfall([

			function(callback){
				// 1. create server object 
				server_interface.then(function(data){
					callback(null, data);
				});
			},

			function(serverObject, callback){
				// 2. grab the subnet range fom the serverObject
				var subnet = serverObject.subnetRange.toString().replace(/,/g,'.');
				callback(null, subnet);
			},

			function(subnet, callback){
				// 3. serach DB for all records within a give in subnet
				db.devices.find({ ip : { $regex: '^'+ subnet } }, function(err, docs){
					if (err) { utils.debug('Error from DB', err) }
					callback(null, docs);
					utils.debug('Success at pull devices from DB:', docs);
				})
			}

		], function(err, result){
			if(err){
				utils.debug('Waterfall Grab Device Failure', err);
			}
			// 4. pass forward the records from the DB to the front end
			response(result);
		})
	}
}