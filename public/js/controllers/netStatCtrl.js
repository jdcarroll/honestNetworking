honestApp.controller('netStatCtrl', function($scope, $http, socket){

	$http.get('/dashboard/server').then(function(response) {
        $scope.wifis = response.data;
    });

	socket.on('netstat', function(data){
		$scope.stats = data;
	})
	// socket.on('wifi', function(data){
	// 	$scope.wifis = data;
	// })
})
