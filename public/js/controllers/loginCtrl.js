honestApp.controller('loginCtrl', function($scope, loginService, $location){
	$scope.data = {}

	$scope.login = function() {
		var cookie = loginService.loginUser($scope.data.username, $scope.data.password)
			.success(function(data){
				$location.path('dashboard/overview')
			}).error(function(data){
			})

			if(cookie !== { status : 404 }){
				$location.path('dashboard/overview')
			}else{
				// console.log('fail');
			}

		$scope.data = {}
	}
})