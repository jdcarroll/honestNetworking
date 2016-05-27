honestApp.controller('devicesCtrl', function($scope, $http, socket){

	var data = [];
	var ips = [];
	socket.on('newDeviceSocket', function(device){
		if(ips.indexOf(device.ip)=== -1){
			data.push(device);
			ips.push(device.ip);
			$scope.devices += device;
		}
		
	})

	$http.get('/dashboard/devices').then(function(response) {
		
		response.data.forEach(function(device){
			if(ips.indexOf(device.ip)=== -1){
				data.push(device);
				ips.push(device.ip);
			}
		})
        $scope.devices = data;
    }, function errorCallback(response) {
    	console.log(response);
  	});
})