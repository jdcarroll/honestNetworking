honestApp.service('loginService', function($http, $window){
	return {
		loginUser: function(name, pw){
			var data = {
				username: name,
				password: pw
			}
			var cookie = {}
			$http({
				method: 'POST',
				data: data,
				url: './loginpost'
			}).then(function(response){
				d = new Date();
				var expire = "expires=" + toString(d.setTime(d.getTime() + 86400));
				var string = JSON.Stringify(response);
				cookie = document.cookie = string +";"+ expire
			}, function(response){
				cookie = { status : 404 }
				console.log(response)
			})

			return cookie

		}
	}
})