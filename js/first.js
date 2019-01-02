 //User connected
 cookie = localStorage.getItem("cookie");
 if(!cookie) {
	chrome.runtime.sendMessage({first: true});
 }