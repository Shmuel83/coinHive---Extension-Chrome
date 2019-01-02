var url_history = "http://coinhive.rodolphe-moulin.fr/cors_coinhive.php";
var url_payout = "http://coinhive.rodolphe-moulin.fr/cors_statcoinhive.php";
var xmrPending = 0;
let paymentMinimum = localStorage.getItem("paymentMinimum") || 0.5;
getStat();
var totalAverage=0;
function getWebsites() {
	xmrPending = 0;
	totalAverage=0;
	websites = JSON.parse(localStorage.getItem("websites"));
	$(".collection").html('<ul class="collapsible" data-collapsible="accordion"></ul>');
	if(websites) {
		resultLength = websites.length;
		for(i=0; i<resultLength; i++) {
			n = resultLength-i;
			getData(websites[i].name, websites[i].privateKey, n, function(j) {
				if(j==1) {
				
					$('.collapsible-header').click(function(){
						$('.collapsible-header').not($(this)).find('i').text("expand_more");
						$child = $(this).find('i');
						text = $($child).text();
						console.log($child);
						if(text=="expand_less") {
							$($child).text("expand_more");
						}
						else {
							$($child).text("expand_less");
						}
					});
				}
			});
		}
	}
	$('.collapsible').collapsible();
}
var payoutPer1MHashes = 0;
function getData(name,privateKey, num, callback) {
var priceNow = JSON.parse(localStorage.getItem("priceNow"));

  
  $.ajax({
        method: "GET",
        data: { private: privateKey },
        url: url_history, 
        success: function(response){
			avarage = response.history[0].hashesPerSecond;
			l = response.history.length;
			for(i=1;i<l;i++) {
				avarage = (avarage+response.history[i].hashesPerSecond)/2; 
			}
            $(".collapsible").append("<li><div class='collapsible-header' style='padding-bottom:0!important'><div class='row'><div class='col s11'><b>"+name+"</b> : "+response.hashesPerSecond+" hash/s, Total = "+response.hashesTotal+" hash, "+chrome.i18n.getMessage('pending')+response.xmrPending+" xmr</div><div class='col s1'><i class='material-icons'>expand_more</i></div></div></div><div class='collapsible-body' style='padding-bottom:0!important;padding-top:0!important''><span>"+chrome.i18n.getMessage('paid')+response.xmrPaid+", Average = "+avarage+" hash/s</span></div></li>");
			xmrPending =  response.xmrPending + xmrPending;
			totalAverage = totalAverage + avarage;
			if(priceNow) {
				_currency = localStorage.getItem("currency") || "USD";
				priceconvert = (priceNow[_currency] * xmrPending).toFixed(2);
				$("#divConvert").html(chrome.i18n.getMessage('totalPending')+xmrPending+" XMR = "+priceconvert+" "+_currency);
			}
			timeTohalfXMR = ((((paymentMinimum-xmrPending)*1000000)/payoutPer1MHashes)/totalAverage).toFixed(0);
			_timeTohalfXMR = " s";
			if(timeTohalfXMR>60) {	//Soon !!
				_timeTohalfXMR = " min";
				timeTohalfXMR = (timeTohalfXMR/60).toFixed(2);
				if(timeTohalfXMR>60) {
				_timeTohalfXMR = " hours";
				timeTohalfXMR = (timeTohalfXMR/60).toFixed(2);
					if(timeTohalfXMR>24) {
						_timeTohalfXMR = " days";
						timeTohalfXMR = (timeTohalfXMR/24).toFixed(2);
						if(timeTohalfXMR>30) {
							_timeTohalfXMR = " months";
							timeTohalfXMR = (timeTohalfXMR/30).toFixed(2);
							if(timeTohalfXMR>12) { // Courageous !!!
								_timeTohalfXMR = " years";
								timeTohalfXMR = (timeTohalfXMR/12).toFixed(2);
							}
						}
					}
				}
			}
						
			$("#average").html("Total Average : "+totalAverage+" Hash/s. You will have "+paymentMinimum+"XMR in "+timeTohalfXMR+_timeTohalfXMR);
			return callback(num);
		},
        dataType: "json",
    });
}
function getStat() {
	$.ajax({
        method: "GET",
        url: url_payout,
		dataType: "json",
        success: function(response){
			payoutPer1MHashes = response.payoutPer1MHashes;
		}
		})
}

