var spawn = require('child_process').spawn;
var netstat = spawn('netstat', ['-w10']);

module.exports = function(socket){
	netstat.stdout.on('data', function(data){
		console.log('stdout: ' + data);
		socket.emit('netstat', data);
	})
}
