honestApp.controller('loginCtrl', function($scope, loginService, $location){
	$scope.data = {}

	$scope.login = function() {
		var cookie = loginService.loginUser($scope.data.username, $scope.data.password)
			.success(function(data){
				// console.log(data);
				$location.path('/dashboard')
			}).error(function(data){
				// console.log(data)
				// console.log('fail');
			})

			if(cookie != { status : 404 }){
				$location.path('/dashboard')
			}else{
				// console.log('fail');
			}

		$scope.data = {}
	}
})