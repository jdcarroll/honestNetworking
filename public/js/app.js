var socket = io()
console.log('connected');

socket.on('connection', function(serverInfo){
	console.log(serverInfo);
});

socket.on('stream', function(packetStream){
	console.log(packetStream)
})

socket.on('bandwidth', function(bandwidth){
	console.log(bandwidth)
})