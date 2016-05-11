//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// NETSTAT - the purpose of this function is to present network stats to the front end
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// using nodes child_process.spawn to mimic multithreading and provide a balanced cpu load
const spawn = require('child_process').spawn;
// netstat -w10 to provide output every 10 seconds
const netstat = spawn('netstat', ['-w10']);
const utils = require('../utils');
const process = require('process');
// the honest netstat function takes the socket as an arguement to provide a data stream to the font end
module.exports = function(socket){
	// I only care about standard out and not any errors because since its a stream every single attempt will start from scratch providing a restart after every 10 seconds
	netstat.stdout.on('data', (data) => {
		// utils.ab2str converts array buffer data to human readable messages
		var realStr = utils.ab2str(data);
		// getting rid of spaces from output
		var netstatStream = realStr.split(' ');
		// assigning array container
		var returnArray = [];
		// looping through the array and pushing all data elements into the return array
		netstatStream.forEach(function(netstatData){
			if (netstatData !== ''){
				returnArray.push(netstatData);
			}
		})
		// first line of netstat is presentation data.  I am ignoring this because of html
		if(returnArray[0] !== 'input'){
			// converting array to object with properties for ease of parsing with angular
			var returnObj = {
				packetsIn : returnArray[0],
				errsIn : returnArray[1],
				bytesIn : returnArray[2],
				packetsOut : returnArray[3],
				errsOut : returnArray[4],
				bytesOut : returnArray[5]
			}
			// finally using socket to push to the front end
			socket.emit('netstat', returnObj);
		}
		
	})
}
