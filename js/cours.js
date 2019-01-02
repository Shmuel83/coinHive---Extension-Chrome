var tempsEnMs = Date.now();
var url_priceNow = "https://min-api.cryptocompare.com/data/price?fsym=XMR&tsyms=";
var url_priceT = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=XMR&tsyms=EUR&ts="+tempsEnMs+"&extraParams=your_app_name";
var url_historyDay = "https://min-api.cryptocompare.com/data/histoday?fsym=XMR&tsym=";
lastUpdate = parseInt(localStorage.getItem("lastUpdate"));
var nowDate = new Date().getTime();
var intervalDate = lastUpdate + (3600*1000); //Update all hours maximum when user open popup

$(function() {

loadGraphCurrency();
$('input.autocomplete').autocomplete({
    data: {
      "USD": "media/lr.png",
      "EUR": "media/eu.png",
      "BTC": "media/BC_Logo_.png",
	  "JPY": "media/jp.png",
	  "GBP": "media/is.png",
	  "CHF": "media/ch.png",
	  "DKK": "media/dk.png",
	  "CAD": "media/ca.png",
	  "AUD": "media/au.png",
	  "INR": "media/mx.png",
	  "ILS": "media/il.png",
	  "TND": "media/dz.png"
    },
    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    onAutocomplete: function(val) {
      // Callback function when value is autcompleted.
    },
    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
  });
  
$("#modifyCurrency").click(function(e){
	currency = $('input.autocomplete').val();
	localStorage.removeItem("lastUpdate");
	intervalDate = 0;
	localStorage.setItem("currency",currency);
	loadGraphCurrency();
});
 });
 
 function drawCurrency(datas) {
 var dataCurrency = new google.visualization.DataTable();
        dataCurrency.addColumn('date', 'Exchange rate over a month');
        dataCurrency.addColumn('number', _currency);

		nbresult = datas.length;
		for(i=0;i<nbresult;i++) {
			dataCurrency.addRows([[new Date(datas[i].time*1000), datas[i].close]]);
		}

        var optionsCurrency = {
          title: 'Rate XMR/'+_currency,
          width: 500,
          height: 400,
		  titlePosition: 'out',
          hAxis: {
            gridlines: {count: 1, color: '#333'}		
          },
          vAxis: {
            gridlines: {color: 'none'},
			format: 'currency'
          }
        };

        var chartCurrency = new google.charts.Line(document.getElementById('divMonero'));

        chartCurrency.draw(dataCurrency,optionsCurrency);

      }
	  
function loadGraphCurrency() {
	_currency = localStorage.getItem("currency")  || "USD";
$('input.autocomplete').val(_currency);
if((!lastUpdate)|(nowDate > intervalDate )) {

$.getJSON(url_priceNow+_currency)
 .done(function(parser) {
	localStorage.setItem("priceNow", JSON.stringify(parser));
	$("#divCourses").html("1 XMR = "+parser[_currency]+" "+_currency);
	getWebsites();
	return "success";
  })
  .fail(function() {
	return "error";
  })
  .always(function() {
	return "complete";
  });
$.getJSON(url_historyDay+_currency)
 .done(function(parser) {
	localStorage.setItem("CurrencyHour",JSON.stringify(parser.Data));
	drawCurrency(parser.Data);
  });
  localStorage.setItem("lastUpdate", nowDate);
}
else {
	parser = JSON.parse(localStorage.getItem("priceNow"));
	$("#divCourses").html("1 XMR = "+parser[_currency]+" "+_currency);
	getWebsites();
	parser = JSON.parse(localStorage.getItem("CurrencyHour"));
}
}