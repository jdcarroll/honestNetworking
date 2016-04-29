var shell = require('shelljs');
var arp = new Promise(function(resolve, reject){
	var returnData = {};
	shell.exec("top -oX -", {silent:true}, function(code, stdout, stderr){ 
		console.log(stdout)
	})
}).catch(function(err){
	console.log(err)
})