//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Network.js
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// require modules
var os = require('os'); // node operating sysytem handle
var pcap = require('pcap2'); // node packet sniffer library
var ipaddr = require('ipaddr.js'); // subnet calculation library
var db = require('mongojsom')('honest',['usageBandwidth','bandwidth','packets','devices']);// DB Connection
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// local modules
var ping = require('../ping'); // first step in discovery
var serverObject = require('../serverObject'); // create the server object
var utils = require('../utils'); // utilities
var config = require('../configVars');
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
module.exports = (function(){
	
// Define The Server network Schema for the local network
	_serverObject = new Promise(serverObject.build)
	.then(serverObject.getInterface),
// define the packet object that sniffs the network for all activity accross the network
	_packet = {
		bandwidth : {
			// calculate the total bandwidth usage of the server
			total : function(data){	
				// take packet data from sniffer and push each packet into packet.chunk array
				_packet.chunk.push(data);
				// if chunk array size meets config buffer
				if(_packet.chunk.length === config.packet.bandwidth.chunk_size){
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					// calculate begining packet size and time
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					var start = _packet.chunk[0].pcap_header.tv_sec;
					var sMill = _packet.chunk[0].pcap_header.tv_usec;
					var startMill = sMill / config.packet.bandwidth.start_mill_dividend;
					var startTime = start + startMill;
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					// calculate end packet size and time
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					var end = _packet.chunk[9].pcap_header.tv_sec;
					var eMill = _packet.chunk[9].pcap_header.tv_usec;
					var endMill = eMill / config.packet.bandwidth.end_mill_dividend;
					var endTime = end + endMill;
					var time = endTime - startTime;				
					_packet.chunk.forEach(function(e){
						_packet.packetSize_total += e.pcap_header.len
					})
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					// bandwidth calculation
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					var bandwidth = (_packet.packetSize_total / time);
					var finishing_mbps = bandwidth / config.packet.bandwidth.finishing_mbps_dividend;
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					// clean up packet chunk array and reset packetSize_total
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					_packet.chunk = [];
					_packet.packetSize_total = 0;
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					// pass mbps off to set int function
					//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
					_packet.set_int(finishing_mbps);				
				} 
			}	
		},
		chunk : [],
		count : 0,
		
		counter : function(){
				// mbps total and divid by number of packets
				result = _packet.total / _packet.count;
				// reset counters
				_packet.total = 0;
				_packet.count = 0;
				// return bandwidth average
				return result;
		},
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// Nmap functionality for packet analysis when interface get configured
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		nMap : function(ip){
			// utils.debug('ip argument from nMap', ip);
			var opts = {
				range : ip
			}
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			// execute nmap chain here
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		},
		// array to store possible new nmap scans
		nMap_preStore : [],
		// function to push ipaddress into nmap scan array with a threshold of 10
		nMap_collectIp : function(ip){
			
			if(_packet.nMap_preStore.length === 0){
				_packet.nMap_preStore.push(ip);
			}
			if(_packet.nMap_preStore.length > 0){
				 _packet.nMap_preStore.forEach(function(e){
					if(ip !== e){
						if(_packet.nMap_preStore.length === config.nmapThreshold){
							/* Do Nothing
								The interface is not configured yet but this is place to execute
								_packet.nMap()
							 */
						}else{
							_packet.nMap_preStore.push(e);
							// _packet.nMap(e);
						}
					}else {
						/* Do Nothing */
					}
				})
			}
			
		},
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		packet_average : 0, 
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		// set _packet.pcapSession interface
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		pcapSession : '', //start with a blank storage variable 
		netcard : new Promise(function(resolve, reject){ // set to new promise
				resolve(_serverObject);// resolves the server object
			}).then(function(card){
				// consoles out the server object in debug mode
				utils.debug('serverObject netcard', card);
				// uses the serverObject name property as the net card to listen on
				_packet.pcapSession = new pcap.Session(card.name);
				// if any errors occur console then ouut in debug mode
			}).catch(function(err){
				utils.debug('netcard ERROR', err);
			}),
		packetSize_total : 0,
		total : 0,
		set_int : function(data){
			if(data !== 0){
				// take mbps and add it to packet.total
				_packet.total += data;
				// increment packet.count
				_packet.count ++;
			}
		}
	},
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IpAddr Function -
	// Determine weather the incoming packet or outgoing packet came from a local system
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	_packet.IpAddr = function(packet){
		// create promise to handle return of packet analysis
		var ipObj = new Promise(function(resolve, reject){
			// establish variable placeholders
			var destIp;
			var sendIp;
			var version;
			// try first incoming then try outgoing
				try {
					//incoming host
					destIp = packet.payload.payload.daddr.addr;
					sendIp = packet.payload.payload.saddr.addr;
					version = packet.payload.payload.version;
				}catch(err){
					// outgoing host
					destIp = packet.payload.dhost.addr;
					sendIp = packet.payload.shost.addr;
					version = "ARP";
				}
				// when finished data object blueprint
			 	var data = {
			 		destIp : destIp,
			 		sendIp : sendIp,
			 		version : version
			 	}

			 	// if data gets resolved 
				resolve(data);
				// if there is an error
				reject(data);
			})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// Honest App -
	// Currently only support IPv4 in future it will suport IPv6
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		ipObj.then(function(dataObject){
			// verifys that the packet is indeed IPv4
			if(dataObject.version !== 6 || dataObject.version !== 'ARP'){ 
				// sends down to calculate its subnet
				_packet.subnet(dataObject);
			}
		})
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// IpAddr Function -
	// if the function fails at any point console out in debug mode
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= 
		ipObj.catch(function(reason){
			utils.debug('IPaddr fail :', reason);
		})	
		
	},
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// Subnet Function - Calculate the subnet and determine address of local system
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= 
	_packet.subnet = function(packet){
		// packet subnet takes the packets as an argument
		new Promise(function(resolve, reject){
			resolve(_serverObject);// rsolve server object
		}).then(function(server_interface){
			// set range to serverobject netmask
			var range = ipaddr.IPv4.parse(server_interface.netmask).prefixLengthFromSubnetMask();
				if (packet) {
					var ipDestString = '';
					var ipSendString = '';
					var IPmatch = server_interface.subnetRange;
					// loop through ips in packet and check for matches
					for(var i = 0; i < packet.destIp.length; i++){
						if(packet.destIp[i] === IPmatch[i]){
							// if found in incoming packet send to nmap collection
							ipDestString = packet.destIp.toString();
							_packet.nMap_collectIp(ipDestString);
							break;
						}else if(packet.sendIp[i] === IPmatch[i]){
							// if found in outgoing packet send to nmap collection
							ipSendString = packet.sendIp.toString();
							_packet.nMap_collectIp(ipSendString);
						}
					}
				}else {/*Do Nothing*/}
		})
		

	},
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// activate the socket sniffer
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	_packet.listen = function(socket){
		// establish pcap session card to listen on
		_packet.netcard.then(function(){
			// run the interval for bandwidth
			setInterval(function(){
				// execute packet counter function
				var bandwidthAverage = _packet.counter();
				// assuming that bandwidth average exists 
				if(bandwidthAverage){
					// create blueprint object to contain bandwidth data
				 	data = {
						speed : bandwidthAverage / config.packet.listen.bandwidthAverage,
						time : Date.now()
					}
					// use socket to emit bandwidth data to the front end
				 	socket.emit('bandwidth', data);
				}
			}, config.packet.listen.interval);
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			// Pcap2 although better still has errors in parsing specific types of packets
			// therefore the session is wrapped in a try catch.
			// even though there are specific packet options that cause errors
			// for the purposes of what I need pcap2 to do everything works
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			try{
				_packet.pcapSession.on('packet', function(raw_packet){
					try{
						var packets = pcap.decode.packet(raw_packet);
						var bandwidth = _packet.bandwidth.total(packets);
						var subnet = _packet.subnet(packets);
						var ip = _packet.IpAddr(packets);
					}catch(err){
						utils.debug('network _packet.listen catch ERROR', err);
					}
							
				})
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			// I am simply using error catchin to prevent he session for dieing
			//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			}catch(err){
				utils.debug('packet.listen ERROR:', err);
			}
		}).catch(function(err){
			utils.debug('packet.listen Promise ERROR:', err);
		})

	}
	return {
		packet: _packet,
		server: _serverObject
	}
}())
