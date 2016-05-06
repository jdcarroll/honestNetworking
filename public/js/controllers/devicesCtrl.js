honestApp.controller('devicesCtrl', function($scope, $http, socket){
	// console.log('Hi from device controller')
	socket.on('devices', function(devices){
		console.log(devices);
		$scope.devices = devices;
	})

	$http.get('/dashboard/devices').then(function(response) {
		console.log('/dashboard/devices');
        $scope.devices = response.data;
    }, function errorCallback(response) {
    	console.log(response);
  	});
})