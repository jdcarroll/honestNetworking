//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Speed Test - run a server side speed test to calculate bandwidth
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var db = require('mongojsom')('honest',['speedTest']);// db conncestion
var speedTest = require('speedtest-net');// speed test module
var utils = require('../utils');// utilities
var config = require('../configVars');// config vars
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// The test function
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var Test = function(socket){
	// configure the speed test alotted time 
	var _test = speedTest({maxTime: config.speedTest_maxtime});
	// wrapped in a try catch to handle any erros that could force the app to crash
	try{
		// when data get returned
		_test.on('data', function(data) {
			// send it off to the front end
			socket.emit('speed_test', data);
			// establish a time for the test
			data.date = Date.now();
			// store in database
			db.speedTest.save(data);
		})
	// if Error console out only in debug mode
	}catch(err){
		utils.debug('speedTest run error', err);
	}
	
}

module.exports = Test
