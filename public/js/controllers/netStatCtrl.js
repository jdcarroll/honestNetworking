honestApp.controller('netStatCtrl', function($scope, socket){
	socket.on('netstat', function(data){
		console.log(data);
	})
})