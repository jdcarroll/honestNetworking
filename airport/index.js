const spawn = require('child_process').spawn;
const airport = spawn('airport', ['-s']);
const utils = require('../utils');

module.exports = function(socket){
	console.log('airport running:');
	var returnArray = [];
	var promise = new Promise((resolve, reject) => {
		airport.stdout.on('data', (data) => {
			var str = utils.ab2str(data);
			var dataArray = [];
			console.log('airport.stdout running:');
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
				if(item[0] == ''){
					console.log('running');
					item.splice(0, 1)
				}
				if(item[item.length - 1] == ''){
					item.splice(item.length -1, 1)
				}
				if(item[6] == '--'){
					item.splice(6,1);
				}

				if(item[0] == 'BHNDG1670A7EF2-5G'){
					console.log('item:',item)
				}
				
				if (item[0] != 'SSID' || item[0] != undefined){
					var returnObj = {
						ssid: item[0],
						bssid: item[1],
						rssi: item[2],
						channel: item[3],
						ht: item[4],
						cc: item[5],
						security : item[6]
					}
					if(item.length > 8){
						for(var i = 7; i > item.length; i++){
							returnObj.security += item[i];
						}
						 1
					}
				}

				// console.log('item:',returnObj);
				if(returnObj){returnArray.push(returnObj);}

			})

			console.log(returnArray);		
			resolve(returnArray)
		})
	}).then((values) => {
		console.log('airport.stdout.socket running:')
		socket.emit('wifi', values);
	})
	
}
