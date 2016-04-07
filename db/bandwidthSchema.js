// ==== BandwidthSchema Models ====
//connection string 
var db = require('mongojsom')('honest',['bandwidth'])

module.exports = function(bandwidth){

	_schema = new db.Schema({
		date : new Date.now(),
		bandwidth : bandwidth
 	}),

 	_bandW = new db.Model('bandwidth', _schema);

	return {
		Bandwidth : _bandW
	}
}