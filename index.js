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
var airport = require('./airport');
var options = require('./options');
const Good = require('good');
var interface = network.server;
server.register([require('inert')], (err) => {
	if (err){
		throw err
	}
	server.route([ 
			routes.public,
			routes.bower,
			routes.loginpost,
			routes.addUser,
			routes.server
		])

})

// server.register({
//     register: require('good'),
//     options: options
// }, (err) => {

//     if (err) {
//         console.error(err);
//     }

// });
io.on('connection', function (socket) {
	socket.emit('connection', global.honestServer);

	// devices(socket, interface);
	netstat(socket);

	var packetStream = network.packet.listen(socket);

	setInterval(function(){
		Test(socket);
	}, 10000)

});
server.start(function () {
		
		console.log('Server is running at:', server.info.uri)
    });
