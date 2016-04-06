var os = require('os');
var pcap = require('pcap2');

module.exports = function(){

// Define The Server network Schema for the local network
	_server = {
		activeInterface: function(){
			var interfaces = os.networkInterfaces();
			var activeInterface = ''
			interfaces.en0.forEach(function(e){
				if(e.family == 'IPv4'){
					activeInterface = e;
				}
			})
			return activeInterface;
		}
	},
// define the packet object that sniffs the network for all activity accross the network
	_packet = {
		chunk : [],
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
		},
		IpAddr : function(packet){
			console.log('daddr:',packet.payload.payload.daddr)
			console.log('saddr:',packet.payload.payload.saddr)
		},
		subnet : function(){
			
		}
	},
// activate the socket sniffer 
	_packet.listen = function(socket){
		_packet.pcapSession.on('packet', function(raw_packet){
			var packets = pcap.decode.packet(raw_packet);
			var bandwidth = _packet.bandwidth.total(packets);
			var ip = _packet.IpAddr(packets);
			socket.emit('stream', packets);
			socket.emit('bandwidth', bandwidth);
		})
	}
// returned functions to main Server or index.js
	return {
		packet: _packet,
		server: _server
	}
}()