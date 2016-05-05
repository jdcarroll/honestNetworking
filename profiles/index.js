module.exports = {

	macBookPro : function(port, computerObject){
		device = {
			mac: computerObject.mac,
			ip: computerObject.ip,
			cpe: []
		}

		var extrainfo = port.$.extrainfo.split(';');
		hostname = extrainfo[0].split(':');
		device.type = extrainfo;
		device.osType = port.$.ostype;
		device.hostname = hostname[1];
		if(port.cpe){ device.cpe.push(port.cpe) }
		return device
	},

	esponPrinter : function(port, computerObject){

		device = {
			mac: computerObject.mac,
			ip: computerObject.ip,
			cpe: []
		}

		device.hostname = port.$.product;
		device.cpe.push(port.$.cpe);
		device.info = port.$.extrainfo;
		device.type = port.$.devicetype;
		device.ostype = port.$.ostype;

		return device;
	},

	appleTV : function(port, computerObject){
		device = {
			mac: computerObject.mac,
			ip: computerObject.ip,
			cpe: []
		}

		device.hostname = 'Apple TV'
		device.type = port.$.extrainfo;
		device.ostype = port.$.ostype;
	},

	futureDiscovery : function(port, computerObject){
		device = {
			mac: computerObject.mac,
			ip: computerObject.ip,
			cpe: []
		}

		device.cpe.push(port.cpe);
	}
}



// 	// // Apple TV Profile --------------------------------------------------------
					// 	// if(a.$.extrainfo){
					// 	// 	device.info = a.$.extrainfo;
					// 	// 	if(device.info.includes('Apple TV')){
					// 	// 		device.hostname = 'Apple TV'
					// 	// 	}
					// 	// }
					// 	// if(a.$.name === 'rtsp'){
					// 	// 	device.type = a.$.extrainfo;
					// 	// 	device.ostype = a.$.ostype;
					// 	// }
					// 	// Apple TV Profile --------------------------------------------------------
					// })

// 	// Apple Mackbook Pro Profile ----------------------------------------------
					// 	if(a.$.name === 'afp'){
					// 		var test = a.$.extrainfo.split(';');
					// 		device.type = test;
					// 		device.ostype = a.$.ostype;
					// 	}
					// 	if(a.$.name === 'vnc'){
					// 		device.osType = a.$.ostype;
					// 	}
					// 	if(a.cpe){
					// 		device.cpe.push(a.cpe);
					// 	}
					// 	if(a.$.hostname){
					// 		 device.hostname = a.$.hostname;
					// 	}
					// 	// Apple Mackbook Pro Profile ----------------------------------------------
