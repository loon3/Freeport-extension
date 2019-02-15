chrome.browserAction.onClicked.addListener(function(tab) {
// 	chrome.storage.local.get(['instances'], function(result) {  
// 		if (!result.instances || result.instances == 0){
// 			chrome.storage.local.set({'instances': 1}, function() {	
        			chrome.tabs.create({'url': chrome.extension.getURL('../html/tab.html')}, function(tab) {});
// 			})
// 		} else {
// 			window.alert("Freeport is already open!")
// 		}
// 	})
})
