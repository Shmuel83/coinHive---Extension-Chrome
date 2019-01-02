paymentMinimum = document.getElementsByName('paymentMinimum')[0].value;
if(paymentMinimum) {
	chrome.runtime.sendMessage({paymentMinimum: paymentMinimum});
}