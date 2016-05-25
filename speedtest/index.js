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
	// wrapped in a try catch to handle any errors that could force the app to crash
	try{
		// configure the speed test alotted time 
		var _test = speedTest({maxTime: config.speedTest_maxtime});
	
		// when data get returned
		_test.on('data', function(data) {
			// send it off to the front end
			socket.emit('speed_test', data);
			// establish a time for the test
			data.date = Date.now();
			// store in database
			db.speedTest.save(data);
		})

		_test.on('error', function(err){
			try{
				if(err.code === 'ENOTFOUND'){
					// Speed Test Server not found for speed test 
				    // should continue and move on to next test
				}
			}catch(err){
				// if any other error happend inform th user in debug mode
				utils.debug('speedTest Error', err);
			}
		})
	// if Error console out only in debug mode
	}catch(err){
		utils.debug('speedTest run error', err);
	}
	
}

module.exports = Test
