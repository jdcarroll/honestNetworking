// Nmap.js

var shell = require('shelljs');
var parseString = require('xml2js').parseString;
var db = require('mongojs')('honest',['devices']);

var computer = function(computer){
	new Promise(function(resolve, reject){
			shell.exec("nmap -vv -A " + computer.ip + " -oX -", {silent:true}, function(code, stdout, stderr){
			console.log("running Nmap on:", computer.ip);
			parseString(stdout, function(error, result){
				if (error){
					console.log('ERROR:',error);
				}
				var jsonData = JSON.stringify(result);
				var returnData = JSON.parse(jsonData);
				var portData = returnData.nmaprun.host[0].ports;
				
				var hostname = [];
				var device = {
					cpe : [],
					hostname : [],
					port : []
				}
				try{
					portData[0].port.forEach(function(e){
						e.service.forEach(function(a){
							device.port.push(a.$);
							// iPhone Profile ---------------------------------
							//console.log(a.$);
							// iPhone Profile ---------------------------------

							// UPnP Profile ---------------------------------
							if(a.$.name == 'upnp'){
								device.hostname = a.$.product;
								device.cpe.push(a.$.cpe);
								device.info = a.$.extrainfo;
								device.type = a.$.devicetype;
								device.ostype = a.$.ostype;
								
							}
							// UPnP Profile ---------------------------------

							// Apple Mackbook Pro Profile ----------------------------------------------
							if(a.$.name == 'afp'){
								var test = a.$.extrainfo.split(';');
								device.type = test;
								device.osType = a.$.ostype;
							}
							if(a.$.name == 'vnc'){
								device.osType = a.$.ostype;
							}
							if(a.cpe){
								device.cpe.push(a.cpe);
							}
							if(a.$.hostname){
								 device.hostname.push(a.$.hostname);
							}
							if(a.$.extrainfo){
								device.info = a.$.extrainfo;
								if(device.info.includes('Apple TV')){
									device.hostname = 'Apple TV'
								}
							}
							// Apple Mackbook Pro Profile ----------------------------------------------
							
						})
					})
					device.mac = computer.mac;
					device.ip = computer.ip;
					resolve(device);
				}catch(err){
					// console.log(err);
				}
			})
		 });
	}).then(function(val){
		console.log( val.ip + ' Device---------------------------------------------------------')
		console.log(val);
		console.log('--------------------------------------------------------------------------')
		db.devices.insert(val, function(err, docs){
			if(err) {throw err}
		});
	})
}

module.exports = computer

