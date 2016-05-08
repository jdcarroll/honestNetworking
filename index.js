// Main Server File
var Hapi = require('hapi');
var routes = require('./routes');
var network = require('./network');
var pcap = require('pcap2');
var inert = require('inert');
var server = new Hapi.Server();
	// Server Connection Port
	server.connection({ port: 4000 });
var Test = require('./speedtest');
var io = require('socket.io')(server.listener);
var nmap = require('libnmap');
var users = require('./users');
var ping = require('./ping');
var netstat = require('./netstat');
var airport = require('./airport');
var options = require('./options');
const Good = require('good');
var utils = require('./utils');
var inert = require('inert');
// Determine if debug mode is turned on
utils.debug('Is Debug Mode On?', process.env.DEBUG);

// create promise to establish server object
var defineInterfacePromise = new Promise(function(resolve, reject){

	var server_interface = network.server;
	resolve(server_interface);

// Kick off server after server object is established
}).then(function(server_interface){

	
	server.register([inert], (err) => {
		// show error if inert fails and debug mode is on
		if (err){
			utils.debug('Faliure to grab inert:', err);
		}
	// server routes
		server.route([ 
			routes.public,
			routes.bower,
			routes.loginpost,
			routes.addUser,
			routes.devices,
			routes.server
		])

	})
	// url record tracking 
	server.register({
	    register: Good,
	    options: options
	}, (err) => {

	    if (err) {
	        utils.debug('Server Route:', console.error(err));
	    }

	});
	// socket connection established
	io.on('connection', function (socket) {
		socket.emit('connection', server_interface);
		netstat(socket);
		var packetStream = network.packet.listen(socket);

		// Speed Test Interval
		setInterval(function(){
			// wrapped it a try catch only to prevent crash on falure
			try {
				ping(server_interface);
				Test(socket);
			}catch(err){
				utils.debug('SpeedTest', err);
			}
		}, 10000)

	});
	// start the actual server and console server info
	server.start(function () {		
		console.log('Server is running at:', server.info.uri);
    });
});
// Error handling for server object promis failure
defineInterfacePromise.catch(function(err){
	utils.debug('Define Interface Promise:', err);
});
