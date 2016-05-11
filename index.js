//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Main Server File
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// require modules
var Hapi = require('hapi');// server framework
var pcap = require('pcap2');// packet sniffer
var inert = require('inert');// displays static content with hapi
var Good = require('good');// logging routes module for backend
var config = require('./configVars'); // system object variables
var server = new Hapi.Server();// create the Hapi server objecgt
	// Server Connection Port
	server.connection({ port: config.server_port });// create server connection port
var Test = require('./speedtest');// speed test module
var io = require('socket.io')(server.listener);// connet hapi with sockets

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// local app modules 
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

var ping = require('./ping'); // ping module for discover chain
var netstat = require('./netstat');// netstat module for server network performance
var airport = require('./airport');// wifi discover module
var options = require('./options');// logging options
var routes = require('./routes');// created routes
var network = require('./network');// creates peacket and server objects
var utils = require('./utils');// basic uiltites

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// mongojs build bson error
//[Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND'
// this error does not prevent the app from running
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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
				Test(socket);
			}catch(err){
				utils.debug('SpeedTest', err);
			}
		}, config.speedTestInterval);
		// ping needs to have its own interval to compensate for nmap run time
		// there might be a better way to handle this
		setInterval(function(){
			try{
				ping(server_interface, socket);
			}catch(err){
				utils.debug('Ping kickoff Error', err);
			}
		}, config.pingInterval);

	});
	// start the actual server and console server info
	server.start(function () {		
		console.log('Server is running at: localhost:'+config.server_port);
    });
});
// Error handling for server object promis failure
defineInterfacePromise.catch(function(err){
	utils.debug('Define Interface Promise:', err);
});
