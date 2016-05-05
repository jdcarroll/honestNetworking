var db = require('mongojsom')('honest',['speedTest'])
var speedTest = require('speedtest-net');
var Test = function(socket){
	var _test = speedTest({maxTime: 5000});
	_test.on('data', function(data) {
		socket.emit('speed_test', data);
		data.date = Date.now();
		db.speedTest.save(data);
	})
	_test.on('error', function(err) {
	  console.log(err);
	})
}

module.exports = Test
