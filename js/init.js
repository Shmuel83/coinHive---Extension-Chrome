function initWebsites() {
listItem = new Array();
item = new Object();
$.ajax({
  url: 'https://coinhive.com/settings/sites',
  dataType: 'html'
})
.done(function( data ) {
var iBoucle = 0;
var iBoucleintern = 0;


	$(data).find(".nine.columns code, .nine.columns input").each(function(index){
   var myData = $(this).text();
   if(myData=="") {
	myData = $(this)[0].value;
   }
   iBoucle++;
   if(iBoucleintern==0) {
	item.name = myData;
   }
   if(iBoucleintern==1) {
	item.publicKey = myData;
   }
   if(iBoucleintern==2) {
	item.privateKey = myData;
   }
   iBoucleintern++;
   if(iBoucle%3==0) {
	nbitem = (iBoucle/3)-1;
	listItem[nbitem] = item;
	iBoucleintern = 0;
	item = new Object();
	localStorage.setItem("websites",JSON.stringify(listItem));
   }
   
	});

});
};
