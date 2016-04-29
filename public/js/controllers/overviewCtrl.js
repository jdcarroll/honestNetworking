honestApp.controller('overviewCtrl', function($scope, socket){
	var canvas = document.getElementById('updating-chart'),
	    ctx = canvas.getContext('2d'),
	    startingData = {
	      labels: [1,2,3,4,6,7],
	      datasets: [
	          {
	              fillColor: "rgba(151,187,205,0.2)",
	              strokeColor: "rgba(151,187,205,1)",
	              pointColor: "rgba(151,187,205,1)",
	              pointStrokeColor: "#fff",
	              data: [65, 59, 80, 81, 56, 55, 40]
	          }
	      ]
	    },
	    latestLabel = startingData.labels[6];

	canvas.style.width = '100%';
	canvas.style.height = '100%';
	// Reduce the animation steps for demo clarity.
	var myLiveChart = new Chart(ctx).Line(startingData, {animationSteps: 20});

	socket.on('speed_test', function(speed){
		// console.log('speed test results')
		$scope.speedTest = speed;
		// console.log(speed)
	})

	socket.on('bandwidth', function(bandwidth){
		// console.log('hello from overviewCtrl bandwidth');
		format = timeConverter(bandwidth.time);
		myLiveChart.addData([bandwidth.speed], format.time);
		myLiveChart.removeData();
	})

	function timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var _time = hour + ':' + min + ':' + sec ;
	  var _day = { date: date, month: month, year: year }
	  return {
	  	  time : _time,
	  	  date : _day

	  }
	}

	var unixTimestamp = Date.now();
	$scope.day = timeConverter(unixTimestamp);



	
	// setInterval(function(){
	// 	var unixTimestamp = Date.now();
	// 	format = timeConverter(unixTimestamp);
	//   // Add two random numbers for each dataset
	//   myLiveChart.addData([Math.random() * 100, Math.random() * 100], format.time);
	//   // Remove the first point so w$scope.day = format.date
	//   myLiveChart.removeData();
	// }, 1000);	
})