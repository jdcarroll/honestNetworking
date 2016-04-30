const spawn = require('child_process').spawn;
const airport = spawn('airport', ['-s']);
const utils = require('../utils');

module.exports = function(socket){
	airport.stdout.on('data', (data) => {
		var str = utils.ab2str(data);
		var dataArray = [];
		var returnArray = [];
		var returnObj = {};
		var splitStr = str.split(' ');
		splitStr.forEach((e) => {
			if(e != ''){
				dataArray.push(e)
			}
		})
		var strData = dataArray.toString();
		var prep = strData.split('\n')
			prep.forEach((e) => {
				var item = e.split(',');
				returnArray.push(item);
			})
		returnArray.forEach((e) => {
			console.log('length:',e.length);
			for(var i = 0; i < e.length; i++){

				if(e[i] == ''){
					delete e[i];
				}
				

			}
		})
		console.log(returnArray);

		// var str = utils.ab2str(data);
		// var dataArray = str.split('\n');
		// 'SSID,BSSID,RSSI,CHANNEL,HT,CC,SECURITY,(auth/unicast/group)',
		// var returnArray = [];
		// var baseArray = [];
		// var data = [];
		// dataObj = {}
		// dataArray.splice(0,1);
		// dataArray.forEach((e) => {
		// 	if(e == ''){
		// 		dataArray.splice(dataArray.indexOf(e), 1);
		// 	}
		})
}();

