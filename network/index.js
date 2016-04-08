var os = require('os');
var pcap = require('pcap2');
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);
var ipaddr = require('ipaddr.js');
var nmap = require('libnmap');

module.exports = function(){

// Define The Server network Schema for the local network
	_server = new Promise(function(resolve, reject){

				var interfaces = os.networkInterfaces();
				resolve(interfaces);
			}).then(function(val){

				var activeInterface = ''
				var change = 0;
				var array = []
				val.en0.forEach(function(e){
						if(e.family == 'IPv4'){
						activeInterface = e;
					}
				})
				var change = 0;
				var localAddress = [];
				var la = activeInterface.address.split('.')
				la.forEach(function(e){
					change = Number(e);
					localAddress.push(change);
				})
				activeInterface.address = localAddress
				returnValue = val;
				var globalInterface = {
					address : localAddress,
					netmask : activeInterface.netmask,
					family : activeInterface.family,
					mac : activeInterface.mac,
					internal : activeInterface.internal,
					classA : [ localAddress[0] ],
					classB : [ localAddress[0], localAddress[1] ],
					classC : [ localAddress[0], localAddress[1], localAddress[2] ]
				}
				global.honestServer = globalInterface 
				resolve(activeInterface);
			}) 

// define the packet object that sniffs the network for all activity accross the network
	_packet = {
		chunk : [],
		nMap : function(ip){
			console.log('nmap kickoff')
			var opts = {
				range : ip
			}
			console.log('fail after opts')
			nmap.scan(opts, function(err, report){
				console.log('scan started...');
				if (err) throw new Error(err);

				for (var item in report){
					console.log(JSON.stringify(report[item]));
				}
			})
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
				if(_packet.chunk.length == 10){
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

					return {
						bandwidth: mbps
					}
				}
			}
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
			console.log('===============================')
			console.log('ipDest')
			console.log('-------------------------------')
			console.log(packet);
			console.log(reason);
			console.log('===============================')
		})	
		
	},
	_packet.subnet = function(packet){
		var interface = global.honestServer
		var range = ipaddr.IPv4.parse(interface.netmask).prefixLengthFromSubnetMask();
		if (packet) {
			if (range <= 8){
			console.log('A class subnet')
			}
			if (range > 8 && range <= 16){
				console.log('B class subnet')
			}
			if (range > 16){
				console.log('C class subnet')
				var IPmatch = interface.classC
				if ((packet.destIp[0] == IPmatch[0]) && (packet.destIp[1] == IPmatch[1]) && (packet.destIp[2] == IPmatch[2])){
					var ipDestString = packet.destIp.toString()
					_packet.nMap_collectIp(ipDestString)
				}
				if ((packet.sendIp[0] == IPmatch[0]) && (packet.sendIp[1] == IPmatch[1]) && (packet.sendIp[2] == IPmatch[2])){
					var ipSendString = packet.sendIp.toString()
					// console.log('sendIp:',packet.sendIp)
					// console.log('sendIp:',ipSendString)
				}

			}
		} else {/*Do Nothing*/}

		// if(interface.netmask == '255.0.0.0'){
		// 	// A class Subnet =======================================
		// }
		// if(interface.netmask == '255.255.192.0'){
		// 	// B class Subnet =======================================
		// }
		// if(interface.netmask == '255.255.255.0'){
		// 	// C class Subnet =======================================
		// 	console.log('C class Subnet =======================================')
		// 	var addr = interface.address.split(".");
		// 	addr.pop();
		// 	var IPmatch = addr[0] + "." + addr[1] + "." + addr[2]
		// 	return IPmatch
		// }
	},
// activate the socket sniffer 
	_packet.listen = function(socket){
		_packet.pcapSession.on('packet', function(raw_packet){
			var packets = pcap.decode.packet(raw_packet);
			var bandwidth = _packet.bandwidth.total(packets);
			var ip = _packet.IpAddr(packets);
			_packet.subnet(ip);
			socket.emit('stream', packets);
			// if(bandwidth) { 
			// 	data = {
			// 		speed : bandwidth,
			// 		time : Date.now()
			// 	}
			// 	socket.emit('bandwidth', data);

			// 	db.usageBandwidth.save(data);
			// }
		})
	}
// returned functions to main Server or index.js
	return {
		packet: _packet,
		server: _server
	}
}()