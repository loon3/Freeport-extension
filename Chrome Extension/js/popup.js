$( document ).ready(function() {
    checkForOpenTabs()
    $("#popup-button-collect").on('click', function(){     
        chrome.tabs.create({ url: "html/tab.html?tab=Collect" });
    })
    $("#popup-button-create").on('click', function(){
        chrome.tabs.create({ url: "html/tab.html?tab=Create" });
    })
    $("#popup-button-trade").on('click', function(){
        chrome.tabs.create({ url: "html/tab.html?tab=Trade" });
    })
    $("#popup-button-settings").on('click', function(){
        chrome.tabs.create({ url: "html/tab.html?tab=Settings" });
    })
    
//    $("#popup-button-collect").on('click', function(){     
//        chrome.tabs.create({ url: "html/tab.html" }, function(){
//            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//              chrome.tabs.sendMessage(tabs[0].id, {showpage: "Collect"});
//            });
//        });
//    })

})

function checkForOpenTabs(){
    
    var chromeid = chrome.runtime.id
    
    params = {}
    chrome.tabs.query(params, function(results){
        console.log(results)
        for(var i = 0; i < results.length; i++){
            var firstsplit = (results[i].url).split("//")
            var secondsplit = firstsplit[1].split("/")
            
            if(chromeid == secondsplit[0]){
                //$(".popup-button").prop('disabled', true)
                if(results[i].active == true){
                    window.close();
                } else {
                    chrome.tabs.update(results[i].id, {active: true});
                }
                
            }
        }
    })
}



