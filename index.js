var Hapi = require('hapi');
var routes = require('./routes');
var network = require('./network');
var pcap = require('pcap2');
var inert = require('inert');
var server = new Hapi.Server();
server.connection({ port: 4000 });
var Test = require('./speedtest');
var io = require('socket.io')(server.listener);
var nmap = require('libnmap');
var users = require('./users');
var devices = require('./devices');
var netstat = require('./netstat');
server.register([require('inert')], (err) => {
	if (err){
		throw err
	}
	server.route([ 
			routes.public,
			routes.bower,
			routes.loginpost,
			routes.addUser
		])

})

io.on('connection', function (socket) {
	socket.emit('connection', global.honestServer);

	devices(socket);

	netstat(socket);

	var packetStream = network.packet.listen(socket);

	setInterval(function(){
		Test(socket)
	}, 10000)

});



server.start(function () {
		network.server;
		console.log('Server is running at:', server.info.uri)
    });

// query: { EIO: '3', transport: 'polling', t: 'LGS22jw' } } }
//  query: { EIO: '3', transport: 'polling', t: 'LGS22jv' } } }