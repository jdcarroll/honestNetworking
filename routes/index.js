var network = require('../network');
module.exports = function(){

	_publicDir = {
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public'
			}
		}
	}

	_dashboard = {
		method: 'GET',
		path: '/dashboard',
		handler: function(req, res){
			res(network.server.activeInterface())
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
			
			if (user.username == 'Jeff' && user.password == 'Jeff'){
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
		loginpost: _loginpost
	}
}()