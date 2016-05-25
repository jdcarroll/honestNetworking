honestApp.controller('devicesCtrl', function($scope, $http, socket){
	var data = [];
	var ips = [];
	// console.log('Hi from device controller')
	socket.on('ping_status', function(data){
		// display status of device discovery

	})
	var count = 1;
	$scope.jeff = function(){
		
		if(data.length === 0){
			console.log(data.length);
			console.log('display = true');
			count = 0;
		}else{
			console.log('display = false');
			count = 1;
		}
		
	}

	
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