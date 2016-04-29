honestApp.controller('devicesCtrl', function($scope, socket){
	// console.log('Hi from device controller')
	socket.on('devices', function(devices){
		$scope.devices = devices;
		$scope.devices.forEach(function(e){
			// console.log('hostname type:', e.hostname)

		})
		// console.log($scope.devices);

		if (typeof($scope.devices.hostname) == 'object'){
			// console.log($scope.devices.hostname);
		}
	})
})