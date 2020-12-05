// market.js

function pageMarketInventory(address){
    
    $("#page-container-market-content").html("<div align='center'><i class='fa fa-spinner fa-spin fa-3x fa-fw'></i></div>")
    
    $("#page-container-market").addClass("hide")
    $("#page-container-market-content").removeClass("hide")
    
    var source_html = "https://digirare.com/api/wallet/"+address
    
    $.getJSON( source_html, function( data ) {
        pageCollectInventoryXchain(address, data)
    }).fail(function(){
        var emptyData = {data: []}
    })
}