var network = require('../network');
var airport = require('../airport');
var devices = require('../devices');
// console.log('server_interface from routes:',server_interface);
module.exports = (function(server_interface){

	_publicDir = {
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public'
			}
		}
	}

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
			res(network.server.activeInterface());
		}
	}

	_devices = {
		method: 'GET',
		path: '/dashboard/devices',
		handler: function(request, response){
			console.log('/dashboard/devices------------');
			// because of the use of async.js I am passing the response into the waterfall object
			devices.waterfall(response);
			// this way I can execute the response from within the the waterfall object
			console.log('------------------------------');
		}
	}

	_addUser = {
		method: 'POST',
		path: '/addUser',
		handler: function(req, res){
			console.log(req.payload);
		}
	}

	_bower = {
		method: 'GET',
		path: '/bower/{param*}',
		handler: {
			directory: {
				path: 'bower_components'
			}
		}
	}

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
				console.log(user);
			}
		}
	}

	return {
		public : _publicDir,
		bower : _bower,
		loginpost: _loginpost,
		addUser: _addUser,
		devices: _devices,
		server : _server
	}
}());