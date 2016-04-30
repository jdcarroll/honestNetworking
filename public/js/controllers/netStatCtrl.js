honestApp.controller('netStatCtrl', function($scope, socket){
	socket.on('netstat', function(data){
		console.log(data);
		$scope.stats = data;
	})
	$scope.wifi = []
	socket.on('wifi', (data) => {
		console.log('data:', data)
		$scope.wifis = data;
	})
})