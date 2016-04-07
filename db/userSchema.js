// ==== UserSchema Models ====
//connection string 
var db = require('mongojsom')('honest',['users'])
module.exports = function(){

	_schema = new db.Schema({
		username: String,
		password: String
	}),

	_User = new db.Model('users', _schema)

	return {
		user : _User
	}
}()