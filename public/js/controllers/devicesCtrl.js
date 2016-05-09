honestApp.controller('devicesCtrl', function($scope, $http, socket){
	// console.log('Hi from device controller')
	socket.on('newDeviceSocket', function(device){
		$scope.devices += device;
	})

	$http.get('/dashboard/devices').then(function(response) {
        $scope.devices = response.data;
    }, function errorCallback(response) {
    	console.log(response);
  	});
})