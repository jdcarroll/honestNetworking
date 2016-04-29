var honestApp = angular.module('honest', ["ui.router"])
	
honestApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('login', {
			url: "/login",
			templateUrl: "views/login.html"
		})
		.state('dashboard', {
			url: "/dashboard",
			templateUrl: "views/dashboard/dashboard.html"
		})
		.state('dashboard.overview', {
			url: "/overview",
			templateUrl: "views/dashboard/overview.html",
			controller: 'overviewCtrl'
		})
		.state('dashboard.settings', {
			url: "/settings",
			templateUrl: "views/dashboard/settings.html",
			controller: 'settingsCtrl'
		})
		.state('dashboard.devices', {
			url: "/devices",
			templateUrl: "views/dashboard/devices.html",
			controller: 'devicesCtrl'
		})
		.state('dashboard.server', {
			url: "/server",
			templateUrl: "views/dashboard/server.html",
			controller: 'netStatCtrl'
		});
		$urlRouterProvider.otherwise('dashboard/overview');
})






var socket = io()
// socket.on('connection', function(serverInfo){
// 	console.log(serverInfo);
// });

// socket.on('stream', function(packetStream){
// 	console.log(packetStream)
// })



// socket.on('bandwidth', function(bandwidth){
// 	console.log('hello from appjs bandwidth')
// 	// console.log(bandwidth)
// })

// socket.on('namp', function(report){
// 	console.log(report);
// })