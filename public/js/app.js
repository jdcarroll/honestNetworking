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

// socket.on('connection', function(serverInfo){
// 	console.log(serverInfo);
// });

// socket.on('stream', function(packetStream){
// 	console.log(packetStream)
// })

// socket.on('speed_test', function(speed){
// 	console.log(speed)
// })

// socket.on('bandwidth', function(bandwidth){
// 	console.log(bandwidth)
// })

socket.on('namp', function(report){
	console.log(report);
})