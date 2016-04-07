// DB Index.js Call all models here
var mongojs = require('mongojs');
var _user = require('./userSchema');
var _bandwidth = require('./bandwidthSchema');

module.exports = function(){
	
	
	return {
		User : _user,
		Bandwidth : _bandwidth
	}
}()


