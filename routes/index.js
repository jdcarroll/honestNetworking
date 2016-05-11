var network = require('../network');
var airport = require('../airport');
var devices = require('../devices');
var utils = require('../utils');
// console.log('server_interface from routes:',server_interface);
module.exports = (function(server_interface){
	// pass forward all files in the public directory
	_publicDir = {
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public'
			}
		}
	}
	// when you land on /dashboard/server bring wifis forward
	_server = {
		method : 'GET',
		path : '/dashboard/server',
		handler: function(req, res){
			var wifi = airport;
			res(wifi);
		}
	}

	_dashboard = {
		method: 'GET',
		path: '/dashboard',
		handler: function(req, res){
			// future plans to use this route but currently doing nothing with it because it is handled with sockets
		}
	}
	// grab all devices in the database and push forward
	_devices = {
		method: 'GET',
		path: '/dashboard/devices',
		handler: function(request, response){
			// because of the use of async.js I am passing the response into the waterfall object
			devices.waterfall(response);
			// this way I can execute the response from within the the waterfall object
		}
	}
	// push forward bower_components
	_bower = {
		method: 'GET',
		path: '/bower/{param*}',
		handler: {
			directory: {
				path: 'bower_components'
			}
		}
	}
	// to login as admin
	_loginpost = {
		method: 'POST',
		path: '/loginpost',
		handler: function(req, res){
			var user = {
				username : req.payload.username,
				password : req.payload.password
			}
			
			if (user.username === 'admin' && user.password === 'password'){
				var hash = 'dfgjfghnytfguhdfdfgndfgjdfgjsdfjhsrtuserakadfh';
				res(hash);
			}else {
				utils.debug('Failed User Attempt', user);
			}
		}
	}
	// export out all routes
	return {
		public : _publicDir,
		bower : _bower,
		loginpost: _loginpost,
		devices: _devices,
		server : _server
	}
}());