const spawn = require('child_process').spawn;
const netstat = spawn('netstat', ['-w10']);

module.exports = function(socket){
	netstat.stdout.on('data', (data) => {
		var realStr = ab2str(data);
		var dataArray = realStr.split(' ');
		var returnArray = [];
		dataArray.forEach(function(e){
			if (e != ''){
				returnArray.push(e);
			}
		})
		if(returnArray[0] != 'input'){
			var returnObj = {
				packetsIn : returnArray[0],
				errsIn : returnArray[1],
				bytesIn : returnArray[2],
				packetsOut : returnArray[3],
				errsOut : returnArray[4],
				bytesOut : returnArray[5]
			}
			socket.emit('netstat', returnObj);
		}
		
	})
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
