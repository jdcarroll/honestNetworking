honestApp.controller('settingsCtrl', function($scope, socket, $http){
	$scope.addUser = function(){
		var data = $scope.user;
		$http.post('/addUser', data).success(function(data, status){
			
		})


	}
})