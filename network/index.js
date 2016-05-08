// Network.js

var os = require('os');
var pcap = require('pcap2');
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);
var ipaddr = require('ipaddr.js');
var ping = require('../ping');
var utils = require('../utils');

module.exports = (function(){
	
// Define The Server network Schema for the local network
	_server = new Promise(function(resolve, reject){
		var interfaces = os.networkInterfaces();
		resolve(interfaces);
	}).then(function(os_interfaces){

		var activeInterface = '';
		var change = 0;
		var array = [];
		os_interfaces.en0.forEach(function(detected_interface){
				if(detected_interface.family === 'IPv4'){
				activeInterface = detected_interface;
			}
		})
		var localAddress = [];
		var localAddressLoop = activeInterface.address.split('.');
		localAddressLoop.forEach(function(octet){
			change = Number(octet);
			localAddress.push(change);
		})
		activeInterface.address = localAddress
		returnValue = os_interfaces;
		var globalInterface = {
			address : localAddress,
			netmask : activeInterface.netmask,
			family : activeInterface.family,
			mac : activeInterface.mac,
			internal : activeInterface.internal
		}
		var range = ipaddr.IPv4.parse(globalInterface.netmask).prefixLengthFromSubnetMask();
			if(range <= 8){
				globalInterface.subnetRange = [
					globalInterface.address[0]
				]

			}
			if(range > 8 && range <= 23){
				globalInterface.subnetRange = [
					globalInterface.address[0],
					globalInterface.address[1]
				]
			}
			if(range >= 24 ){
				globalInterface.subnetRange = [
					globalInterface.address[0],
					globalInterface.address[1],
					globalInterface.address[2]
				];

			}
		return globalInterface;

	}),
// define the packet object that sniffs the network for all activity accross the network
	_packet = {
		chunk : [],
		nMap : function(ip){
			var opts = {
				range : ip
			}
		},
		nMap_preStore : [],
		nMap_collectIp : function(ip){
			if(_packet.nMap_preStore.length === 0){
				_packet.nMap_preStore.push(ip);
			}
			if(_packet.nMap_preStore.length > 0){
				 _packet.nMap_preStore.forEach(function(e){
					if(ip !== e){
						if(_packet.nMap_preStore.length === 10){
							/* Do Nothing */
						}else{
							_packet.nMap_preStore.push(e);
							_packet.nMap(e);
						}
					}else {
						/* Do Nothing */
					}
				})
			}
			
		},
		packetSize_total : 0,
		pcapSession : new pcap.Session('en0'),
		bandwidth : {
			total : function(data){				
				_packet.chunk.push(data);
				if(_packet.chunk.length === 1000){
					var mbps = 0;
					var start = _packet.chunk[0].pcap_header.tv_sec;
					var sMill = _packet.chunk[0].pcap_header.tv_usec;
					var startMill = sMill / 1000000;
					var startTime = start + startMill;
					var end = _packet.chunk[9].pcap_header.tv_sec;
					var eMill = _packet.chunk[9].pcap_header.tv_usec;
					var endMill = eMill / 1000000;
					var endTime = end + endMill;
					var time = endTime - startTime;				
					_packet.chunk.forEach(function(e){
						_packet.packetSize_total += e.pcap_header.len
					})
					var bandwidth = (_packet.packetSize_total / time)
					var finishing_mbps = bandwidth / 1000000
					_packet.chunk = [];
					_packet.packetSize_total = 0;
					_packet.set_int(finishing_mbps);				
				}
				return 
			}	
		},

		count : 0,
		total : 0,
		packet_average : 0,
		set_int : function(data){
			if(data === 0){/* Do Nothing */}
			else{
				_packet.total += data;
				_packet.count ++;
			}
		},
		counter : function(){
				result = _packet.total / _packet.count;
				_packet.total = 0;
				_packet.count = 0;
				return result;
		}
	},
	_packet.IpAddr = function(packet){
		var ipObj = new Promise(function(resolve, reject){
			var destIp;
			var sendIp;
			var version;

				try {
					destIp = packet.payload.payload.daddr.addr
					sendIp = packet.payload.payload.saddr.addr
					version = packet.payload.payload.version
				}catch(err){
					destIp = packet.payload.dhost.addr;
					sendIp = packet.payload.shost.addr;
					version = "ARP"
				}
			 	var data = {
			 		destIp : destIp,
			 		sendIp : sendIp,
			 		version : version
			 	}
				resolve(data);
				reject(data);
			})

		ipObj.then(function(val){
			if(val.version === 6 || val.version === 'ARP'){ /* do nothing */ }
			else {
				_packet.subnet(val)
			}
		})
		ipObj.catch(function(reason){
			console.log('reasaon:', reason);
		})	
		
	},
	_packet.subnet = function(packet){
		// packet subnet takes the packets as an argument
		new Promise(function(resolve, reject){
			resolve(_server);
		}).then(function(server_interface){
			var range = ipaddr.IPv4.parse(server_interface.netmask).prefixLengthFromSubnetMask();
				if (packet) {
					var ipDestString = '';
					var ipSendString = '';
					var IPmatch = server_interface.subnetRange;

					for(var i = 0; i < packet.destIp.length; i++){
						if(packet.destIp[i] === IPmatch[i]){
							ipDestString = packet.destIp.toString();
							_packet.nMap_collectIp(ipDestString);
							break;
						}else if(packet.sendIp[i] === IPmatch[i]){
							ipSendString = packet.sendIp.toString();
							_packet.nMap_collectIp(ipSendString);
						}
					}
				}else {/*Do Nothing*/}
		})
		

	},
// activate the socket sniffer 
	
	_packet.listen = function(socket){
		setInterval(function(){
			 var bandwidthAverage = _packet.counter()
			 
			 if(bandwidthAverage){

			 	data = {
					speed : bandwidthAverage / 10000,
					time : Date.now()
				}
			 	socket.emit('bandwidth', data);
			 }
			 
		}, 3000);
		try{
			_packet.pcapSession.on('packet', function(raw_packet){
				try{
					var packets = pcap.decode.packet(raw_packet);
					var bandwidth = _packet.bandwidth.total(packets);
					var subnet = _packet.subnet(packets);
					var ip = _packet.IpAddr(packets);
				}catch(err){
					utils.debug('packet pcapSession ERROR:', err);
				}			
			})
		}catch(err){
			utils.debug('packet.listen ERROR:', err);
		}
	}
	return {
		packet: _packet,
		server: _server
	}
}())



