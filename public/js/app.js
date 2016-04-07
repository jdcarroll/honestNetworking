var honestApp = angular.module('honest', ["ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when("/", {
				templateUrl: 'views/login.html',
				controller: "loginCtrl"
			})
			.when("/dashboard", {
				templateUrl: 'views/dashboard.html',
				controller: "dashboardCtrl",
				resolve: {
					auth : function($location){
						if(localStorage.userInfo){
							$location.path('/dashboard')
						}else {
							$location.path('/')
						}
					}
				}
			})
	})






var socket = io()
console.log('connected');

socket.on('connection', function(serverInfo){
	console.log(serverInfo);
});

socket.on('stream', function(packetStream){
	console.log(packetStream)
})

socket.on('bandwidth', function(bandwidth){
	console.log(bandwidth)
})