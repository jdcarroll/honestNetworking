//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Airport - Grab all visible wifis in the area
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//require modules
const spawn = require('child_process').spawn;// create a seperate thread to run command line tools on
const airport = spawn('airport', ['-s']);// Command to run
const utils = require('../utils');// utilities
// create a promise that returns all wifi's
module.exports = new Promise((resolve, reject) => {
	// container that holds the result
	var returnArray = [];
	// defines what to do when airport comes back with results
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	// Gets rid of formatting space from the result
	//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	airport.stdout.on('data', (data) => {
		// converts array buffer data to string
		var str = utils.ab2str(data);
		// another container
		var dataArray = [];
		// split result on empty space
		var splitStr = str.split(' ');
		// push each element in to dataArray
		splitStr.forEach((e) => {
			if(e !== ''){
				dataArray.push(e)
			}
		})
		// convert entire array into a string and get ready to parse data
		var strData = dataArray.toString();
		// split on new line
		var prepDataForArray = strData.split('\n');
		// get to the parsing
		prepDataForArray.forEach((wifiString) => {
			// split on comma
			var item = wifiString.split(',');
			// get rid of any extra space from first item in the array
			if(item[0] === ''){
				item.splice(0, 1)
			}
			// get rid of any extra space from last item in the array
			if(item[item.length - 1] === ''){
				item.splice(item.length -1, 1)
			}
			// get rid of styling dash from commanline
			if(item[6] === '--'){
				item.splice(6,1);
			}
			//create the object if the first line is defined and is Not SSID
			if (item[0] !== 'SSID' || item[0] !== undefined){
				var returnObj = {
					ssid: item[0],
					bssid: item[1],
					rssi: item[2],
					channel: item[3],
					ht: item[4],
					cc: item[5],
					security : item[6]
				}
				// add special secuirty labels to security property
				if(item.length > 8){
					for(var i = 7; i > item.length; i++){
						returnObj.security += item[i];
					}
				}
			}
			// if the return object exsists push it into return array
			if(returnObj){returnArray.push(returnObj);}
		});
		//resolve the array
		resolve(returnArray);
	});
	// if for what ever reason the promise fails 
 }).catch(function(err){
 	utils.debug('airport cant rsolve promise', err);
 });
