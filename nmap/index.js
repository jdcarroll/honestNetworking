var shell = require('shelljs');
var parseString = require('xml2js').parseString;
var db = require('mongojs')('honest',['devices']);

var computer = function(ip){
	shell.exec("nmap -vv -A " + ip + " -oX -", {silent:true}, function(code, stdout, stderr){
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
			hostname : []
		}
		try{
			portData[0].port.forEach(function(e){
				// console.log('$:',e)
				// console.log('service:',e.service)
				e.service.forEach(function(a){
					// console.log(a.$);
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
					device.ports = portData;
				})
			})
			console.log('Device---------------------------------------------------------')
			console.log(device);
		}catch(e){
			console.log('device not active');
		}
	})
 });
}

computer('10.63.63.253');

module.exports = computer
