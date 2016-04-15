var test = function(string){
	new Promise(function(resolve, reject){
		console.log(string);
	})
}

test('Hello')