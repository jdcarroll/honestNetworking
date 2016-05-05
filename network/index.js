// Network.js

var os = require('os');
var pcap = require('pcap2');
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);
var ipaddr = require('ipaddr.js');
var ping = require('../ping');

module.exports = function(){
	
// Define The Server network Schema for the local network
	_server = new Promise(function(resolve, reject){
		var interfaces = os.networkInterfaces();
		resolve(interfaces);
	}).then(function(os_interfaces){

		var activeInterface = '';
		var change = 0;
		var array = [];
		os_interfaces.en0.forEach(function(detected_interface){
				if(detected_interface.family == 'IPv4'){
				activeInterface = detected_interface;
			}
		})
		var change = 0;
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

	})
// define the packet object that sniffs the network for all activity accross the network
	_packet = {
		ipDeviceDetection : function(packet){
			try {
				var destIp = packet.payload.payload.daddr.addr.toString();
				var sendIp = packet.payload.payload.saddr.addr.toString();
				var subnet = global.honestServer.subnetRange.toString();
				var address = global.honestServer.address;
			
			} catch (err){
				
			}
		
		},
		chunk : [],
		nMap : function(ip){
			var opts = {
				range : ip
			}
		},
		nMap_preStore : [],
		nMap_collectIp : function(ip){
			if(_packet.nMap_preStore.length == 0){
				_packet.nMap_preStore.push(ip);
			}
			if(_packet.nMap_preStore.length > 0){
				 _packet.nMap_preStore.forEach(function(e){
					if(ip == e){
						/* Do Nothing */
					}else {
						if(_packet.nMap_preStore.length == 10){
							/* Do Nothing */
						}else{
							_packet.nMap_preStore.push(e);
							_packet.nMap(e);
						}
					}
				})
			}
			
		},
		packetSize_total : 0,
		pcapSession : new pcap.Session('en0'),
		bandwidth : {
			total : function(data){				
				_packet.chunk.push(data);
				if(_packet.chunk.length == 1000){
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
					var mbps = bandwidth / 1000000
					_packet.chunk = [];
					_packet.packetSize_total = 0;
					_packet.set_int(mbps);				
				}
				return 
			},	
		},

		count : 0,
		total : 0,
		packet_average : 0,
		set_int : function(data){
			if(data == 0){/* Do Nothing */}
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
				try {
					var destIp = packet.payload.payload.daddr.addr
					var sendIp = packet.payload.payload.saddr.addr
					var version = packet.payload.payload.version
				}catch(err){
					var destIp = packet.payload.dhost.addr;
					var sendIp = packet.payload.shost.addr;
					var version = "ARP"
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
			if(val.version == 6 || val.version == 'ARP'){ /* do nothing */ }
			else {
				_packet.subnet(val)
			}
		})
		ipObj.catch(function(reason){
			console.log('reasaon:', reason);
		})	
		
	},
	_packet.subnet = function(packet){
		var server_interface = global.honestServer
		var range = ipaddr.IPv4.parse(interface.netmask).prefixLengthFromSubnetMask();
		if (packet) {
			if (range <= 8){
			}
			if (range > 8 && range <= 16){
				var IPmatch = interface.subnetRange
				if ((packet.destIp[0] == IPmatch[0]) && (packet.destIp[1] == IPmatch[1])){
					var ipDestString = packet.destIp.toString()
					_packet.nMap_collectIp(ipDestString)
				}
				if ((packet.sendIp[0] == IPmatch[0]) && (packet.sendIp[1] == IPmatch[1])){
					var ipSendString = packet.sendIp.toString()
				}
			}
			if (range > 16){
				var IPmatch = interface.subnetRange
				if ((packet.destIp[0] === IPmatch[0]) && (packet.destIp[1] === IPmatch[1]) && (packet.destIp[2] === IPmatch[2])){
					var ipDestString = packet.destIp.toString()
					_packet.nMap_collectIp(ipDestString)
				}
				if ((packet.sendIp[0] == IPmatch[0]) && (packet.sendIp[1] == IPmatch[1]) && (packet.sendIp[2] == IPmatch[2])){
					var ipSendString = packet.sendIp.toString()
				}

			}
		} else {/*Do Nothing*/}

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
					var ip = _packet.IpAddr(packets);
					var dd = _packet.ipDeviceDetection(packets);
				}catch(err){
				}
				
				
			})
		}catch(err){
			console.log(err);
		}
	}
	return {
		packet: _packet,
		server: _server
	}
}()



