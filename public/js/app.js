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






var socket = io();