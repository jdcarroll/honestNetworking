honestApp.controller('loginCtrl', function($scope, loginService, socket, $location){
	$scope.data = {}

	$scope.login = function() {
		loginService.loginUser($scope.data.username, $scope.data.password)
			.success(function(data){
				$location.path('/dashboard')
			}).error(function(data){
				console.log('fail');
			})

		$scope.data = {}
	}
})