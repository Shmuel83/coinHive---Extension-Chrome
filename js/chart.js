$(function() {
drawChartCPU();
iThrottle = (100*(1-localStorage.getItem('Throttle'))).toFixed(0);
$("#valueTrhottle").text(iThrottle+chrome.i18n.getMessage('showCPU'));
$("#throttle").val(iThrottle);
google.charts.load('current', {'packages':['gauge','line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {	

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Hash/s', 0]
        ]);

        var options = {
          width: 120, height: 120,
          redFrom: 0.9, redTo: 1,
          yellowFrom:0.7, yellowTo: 0.9,
          minorTicks: 1,
		  max: 1
        };

        var chart = new google.visualization.Gauge(document.getElementById('chartHash'));

        chart.draw(data, options);
        
		
		var options = optionRefresh();
        setInterval(function() {
          chrome.runtime.sendMessage({rate: true}, function(response) {
		  if(response.rRate>options.max) {
			localStorage.setItem('maxCounter',response.rRate.toFixed(2));
			options = optionRefresh();
		  }
		  data.setValue(0, 1, response.rRate.toFixed(2));
          chart.draw(data, options);
		  
		  totalHashes = c_totalHashes = response.rTotalHash;
		  if((totalHashes/1000) > 1) {
				c_totalHashes = (totalHashes/1000).toFixed(2).toString() + "k";
				if((totalHashes/1000000) > 1) {
					c_totalHashes = (totalHashes/1000000).toFixed(2).toString() + "M";
				}
			}
		siteKey = localStorage.getItem("siteKey");
		  $("#totalHash").html("<p>"+chrome.i18n.getMessage('totalHash')+c_totalHashes+"</p><p>"+chrome.i18n.getMessage('currentKey')+siteKey+"</p>");
		  })
        }, 2000);
		
		if(localStorage.getItem("CurrencyHour")) {
			google.charts.setOnLoadCallback(drawCurrency(JSON.parse(localStorage.getItem("CurrencyHour"))));
		}
      }
	  
	  function drawChartCPU() {

		
		var mycpu = new CpuMeter();
		setInterval(function() {
			mycpu.getInfo(function (e) {
			if(e.cpuUsage) {
				$("#gauge").html("CPU : "+e.cpuUsage+"%");
			}
			})
			
		},5000);
      }
	  
	 })
function optionRefresh() {
	var maxCounter = localStorage.getItem('maxCounter');
		if(!maxCounter) {
			maxCounter = 0.1;
		}
		_redfrom = maxCounter*0.9;
		_yellowfrom = maxCounter*0.7;
        var options = {
		  redFrom: _redfrom, redTo: maxCounter,
          yellowFrom:_yellowfrom, yellowTo: _redfrom,
          max: maxCounter
        };
		return options;
}
//Modification Throttle
$("#throttle").on('change',function() {
	newVal = $("#throttle").val();
	iThrottle = 1-(newVal/100);
    localStorage.setItem('Throttle',iThrottle);
	chrome.runtime.sendMessage({Throttle: iThrottle});
	$("#valueTrhottle").text(newVal+chrome.i18n.getMessage('showCPU'));
});
$("#select_threads").on('change',function() {
	newVal = $("#select_threads").val();
    localStorage.setItem('nbthreads',newVal);
	chrome.runtime.sendMessage({Threads: newVal});
});