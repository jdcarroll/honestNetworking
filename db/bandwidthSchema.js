// ==== BandwidthSchema Models ====
//connection string 
var db = require('mongojsom')('honest',['bandwidth'])

db.on('connect', function () {
    console.log('database connected')
})

module.exports = function bandwidth(bandwidth){

	_schema = new db.Schema({
		date : new Date.now(),
		bandwidth : bandwidth
 	}),

 	_bandW = new db.Model('bandwidth', _schema);

	return {
		Bandwidth : _bandW
	}
}

