var Hapi = require('hapi');
var routes = require('./routes');
var network = require('./network');
var pcap = require('pcap2');
var inert = require('inert');
var server = new Hapi.Server();
server.connection({ port: 4000 });

var io = require('socket.io')(server.listener);

server.register([require('inert')], (err) => {
	if (err){
		throw err
	}
	server.route([ 
			routes.public,
			routes.bower,
			routes.loginpost
		])

	io.on('connection', function (socket) {

	    socket.emit('connection', network.server.activeInterface());
	
	    var packetStream = network.packet.listen(socket);
	    
	    

	});
})

server.start(function () {
		console.log('Server is running at:', server.info.uri)
    });