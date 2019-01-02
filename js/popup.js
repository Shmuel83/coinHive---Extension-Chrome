//Système d'onglet dans le popup
$(function() {
	$( "ul.tabs" ).tabs();

	var aCoinhive = localStorage.getItem('siteKey');
	if(!aCoinhive) {
		localStorage.setItem('siteKey',"nDTMLf7atZSpKHpuah2lSuVPG58J92un");
	}
	
	chrome.runtime.sendMessage({run: "isRunning"}, function(response) {
		if(response.isRunning) {
			console.log(response.isRunning);
			$("#startMinning").click();
		}
		else {			
			$("#configCPU").hide();
			initDashboard();
				
		}
		
	});
	$("#startMinning").click(function(e){
	domFriend = document.getElementById("friendKey");
	if(domFriend) {
		if(domFriend.disabled == false){
			_key = document.getElementById("friendKey").value;
			if( _key != "") {
				localStorage.setItem('siteKey',_key);
			}
		}
	}
		chrome.runtime.sendMessage({start: true}, function(response) {
			if(response.isRunning) {
				$("#startMinning").hide();
				$("#stopMinning").show();
				$("#configCPU").show();
				localStorage.setItem('autostart',true);
				$("#init").html("");
			}
		
		});
	});
	$("#stopMinning").click(function(e){
		chrome.runtime.sendMessage({stop: true}, function(response) {
			if(!response.isRunning) {
				$("#stopMinning").hide();
				$("#startMinning").show();
				initDashboard();
				$("#configCPU").hide();
				localStorage.setItem('autostart',false);
			}
		
		});
	});

	chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
                if (request.invoke) {
					console.log(request);
					localStorage.setItem('siteKey',"nDTMLf7atZSpKHpuah2lSuVPG58J92un");
					$("#stopMinning").click();
					$("#init").append("<h5 class='red-text text-darken-2'></h5>");
					Materialize.toast(chrome.i18n.getMessage('error_key'),4000,"red darken-4");
				}
            });
				//Translate text
				$("#start_minning").text(chrome.i18n.getMessage('start_minning'));
				$("#stop_minning").text(chrome.i18n.getMessage('stop_minning'));
				$("#button_refreshCurrency").text(chrome.i18n.getMessage('button_refreshCurrency'));
				$("label[for='autocomplete-input']").text(chrome.i18n.getMessage('inputCurrency'));
				$("label#textThrottle").text(chrome.i18n.getMessage('textthrottle'));
				$("label#textThreads").text(chrome.i18n.getMessage('textthreads'));
				
				//Event click refresh list websites
				$("#refresh").click(function(){
					$(".collection").html("");
					getWebsites();
				});
				//Init Select materialize Jquery
				storeThreads = localStorage.getItem('nbthreads') || navigator.hardwareConcurrency;
				nbthreads = navigator.hardwareConcurrency;
				$("#select_threads").append("<option value="+storeThreads+">"+storeThreads+"</option>");
				for(i=1;i<=nbthreads;i++) {
					if(i!=storeThreads) {
						$("#select_threads").append("<option value="+i+">"+i+"</option>");
					}
				}
				if(storeThreads != "Auto") {
					$("#select_threads").append("<option value='Auto'>Auto</option>");
				}
				$('select').material_select();
				
 });
 function initDashboard() {
 cookie = localStorage.getItem("cookie");
 if(cookie) {
	jsonCookie = JSON.parse(cookie);
			
				$("#user").text(chrome.i18n.getMessage('account')+jsonCookie.n);
				$("#init").append("<p>"+chrome.i18n.getMessage('account_mail')+jsonCookie.n+"</p><p>"+chrome.i18n.getMessage('initText')+"</p>");
				$("#init").append("<form id='listKey' action='#'></form>");
				_websites = JSON.parse(localStorage.getItem("websites"));
				if(_websites) {
					resultLength = _websites.length;
					for(i=0; i<resultLength; i++) {
						$("#listKey").append("<p><input name='group1' type='radio' id='"+_websites[i].name+"' nkey='"+_websites[i].publicKey+"' /><label for='"+_websites[i].name+"'>"+_websites[i].name+" : "+_websites[i].publicKey+"</label></p>");
					}
				}
				$("#listKey").append("<p><input name='group1' type='radio' id='Developeur' nkey='nDTMLf7atZSpKHpuah2lSuVPG58J92un' checked/><label for='Developeur'>"+chrome.i18n.getMessage('developer')+" : nDTMLf7atZSpKHpuah2lSuVPG58J92un</label></p><br/><div class='row'><div class='col s2'><input name='group1' type='radio' id='friend' /><label for='friend'>"+chrome.i18n.getMessage('friend')+"</label></div><div class='col s10'><input placeholder='"+chrome.i18n.getMessage('friend_placeholder')+"' id='friendKey' type='text' class='validate' disabled></div></div>");
				
			}
			else {
				$("#init").html("<p>"+chrome.i18n.getMessage('textFirstLog')+"<a href='https://coinhive.com/account/login'>"+chrome.i18n.getMessage('textlogin')+"</a>"+chrome.i18n.getMessage('textor')+"<a href='https://coinhive.com/account/signup'>"+chrome.i18n.getMessage('textsignup')+"</a>"+chrome.i18n.getMessage('textendlog'));
				$("#init").append("<form id='listKey' action='#'></form>");
				$("#listKey").append("<p><input name='group1' type='radio' id='Developeur' nkey='nDTMLf7atZSpKHpuah2lSuVPG58J92un'/><label for='Developeur'>"+chrome.i18n.getMessage('developer')+" : nDTMLf7atZSpKHpuah2lSuVPG58J92un</label></p><br/><div class='row'><div class='col s2'><input name='group1' type='radio' id='friend' /><label for='friend'>"+chrome.i18n.getMessage('friend')+"</label></div><div class='col s10'><input placeholder='"+chrome.i18n.getMessage('friend_placeholder')+"' id='friendKey' type='text' class='validate' disabled></div></div>");
				$("#init p a").click(function(e) {
					chrome.tabs.create({ url: this.href });
				})
			}
			nkey = localStorage.getItem('siteKey') || 'nDTMLf7atZSpKHpuah2lSuVPG58J92un';
			$("input[nkey='"+nkey+"']").click();
			$("input[type='radio']").click(function(e){
					radioChecked = $(this).attr("id");
					if(radioChecked=="friend") {
						document.getElementById("friendKey").disabled = false;
					}
					else {
						document.getElementById("friendKey").disabled = true;
						key = $(this).attr("nkey");
						localStorage.setItem('siteKey',key);
					}
				});
				
 }