window.addEventListener('beforeunload', function(event) {
	chrome.storage.local.set({'instances': 0}, function() {})
})


$( document ).ready(function() {   
    $(".jumbotron-tab-container").hide()
    
    checkPassphrase() 
    
    $(".nav-link").on('click', function(){
        var tabTitle = $(this).data('tab')
        gotoTab(tabTitle)
    })
    $("#header-btc-logo").on('click', function(){
        //btcViewModal()
        
        var btc_total = parseFloat($("#body").data("balance_btc")) / 100000000
        sendAssetModal("BTC", "../images/btc-icon.png", true, btc_total, $("#body").data("fee_btc"))
                    
    })
    $("#signMessageButton").on('click', function(){
        manualSignMessageModal($("#body").data("address"), $("#body").data("passphrase"))
    })
    
    $("#container-collect-button").on('click', function(){
        gotoTab("collect")
    })
    
    $("#container-create-button").on('click', function(){
        gotoTab("create")
    })
    
    $("#container-trade-button").on('click', function(){
        gotoTab("trade")
    })
    
    $("#page-collect-browse-select").on('click', function(){
        pageCollectBrowse()
    })
    $("#page-collect-search-select").on('click', function(){
        pageCollectSearchModal()
    })
    
    $("#page-collect-inventory-select").on('click', function(){ 
        pageCollectInventory($("#body").data("address"))
    })
    $("#page-container-collect-content").on('click', 'div.collection-item', function(){ 
        var url = $(this).data("url")
        window.open(url, '_blank', "width=800,height=600,top=50,left=50")
    }) 
    $("#page-container-collect-content").on('click', 'div.collection-item-asset', function(){ 
        var assetname = $(this).data("assetname")
        var assetimage = $(this).data("assetimage")
        var assetdivisible = $(this).data("divisible")
        var assetqty = $(this).data("quantity")
        var assetdescription = $(this).data("description")
        pageCollectAsset(assetname, assetimage, assetdivisible, assetqty, assetdescription)
        window.scrollTo(0,0);
    }) 
    $("#page-container-collect-content").on('click', 'div.collection-item-asset-end', function(){ 
        pageCollectSearchModal()
    }) 
    $("#page-container-collect-content").on('click', 'button.asset-send-button', function(){ 
        var assetname = $(this).data("asset")
        var assetimage = $(this).data("image")
        var assetdivisible = $(this).data("divisible")
        var assetqty = $(this).data("qty")

        chrome.storage.local.get(['fee_custom'], function(result) {
            sendAssetModal(assetname, assetimage, assetdivisible, assetqty, result.fee_custom)
        })
    }) 
    
    $("#body").on('click', 'button#page-inventory-back-button', function(){ 
        $("#leftbar-container").html("")
        pageCollectInventory($("#body").data("address"))
    }) 
    $("#body").on('click', 'button#page-collect-back-button', function(){ 
        $("#leftbar-container").html("")
        gotoTab("collect")
    }) 
    
    $("#body").on('click', 'button.unconfirmed-tx-dropdown-item', function(){ 
        var txid = $(this).data("txid")
        window.open("https://xchain.io/tx/"+txid);
    }) 
    
    $(document).on('click', '#header-address', function(){ 
        balanceClickModal($("#body").data("address"))
    }) 
    
    $(document).on("click", 'button#substitute-defaultfee-button', function (event) { 
        feeRecommendedCallback(function(fee_recommended){
            $("#body").data("fee_btc", fee_recommended)    
            $(".dialog-transfee").html(fee_recommended)
            $(".dialog-txfeebutton").hide() 
  
            chrome.storage.local.set({'fee_custom': fee_recommended}, function() {
                console.log("Tx fee set to "+fee_recommended)
            })
        })
    
    })
    $(document).on("click", '#page-settings-fee', function (event) { 
        txFeeModal()
    })
//    $(document).on("click", 'button#update-fee-button', function (event) { 
//        //closeAllModals()
//        txFeeModal()
//    })
//    
//    $(document).on("click", 'button#send-btc-button', function (event) { 
//        //closeAllModals()
//        
//        var btc_total = parseFloat($("#body").data("balance_btc")) / 100000000
//        sendAssetModal("BTC", "../images/btc-icon.png", true, btc_total, $("#body").data("fee_btc"))
//    })
    
    
    
    
    $("#page-settings-reset-select").on('click', function(){ 
        resetInventoryModal()
    }) 
    
    $("#page-settings-passphrase-select").on('click', function(){ 
        viewPassphraseModal()
    }) 
    
    $("#page-settings-address-select").on('click', function(){ 
        selectAddrDropdown($("#body").data("address"), getAddrArray())
    }) 
    
    $("body").on('click', 'a.address-select-new', function(){ 
        var newAddr = $(this).data("address")

        $('#address-select-modal').modal('hide');
        initInventory($("#body").data("passphrase"), newAddr) 
    })
    
    $("body").on('keyup', '#inputbox-decrypt', (function(event) {
        if (event.keyCode === 13) {
            $("#decrypt-passphrase-btn").click();
        }
    }))
    
    
    //ipfsInit()
       
    
})

function gotoTab(tabTitle){
    $("#leftbar-container").html("")
    $("#buttonsplash").hide()
    document.title = tabTitle.charAt(0).toUpperCase() + tabTitle.slice(1) + " - Freeport"
    $(".jumbotron-tab-container").hide()
    $(".jumbotron-tab-container-content").hide()
    $("#page-container-"+tabTitle).show()
    $(".nav-item").removeClass("active")
    $("#nav-"+tabTitle).parent().addClass("active")
    
    if(tabTitle == "collect"){
        pageCollectInventory($("#body").data("address"))
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function ipfsInit(){
    const IPFS = require('ipfs')
    const Buffer = require('buffer').Buffer

    const node = new IPFS({ repo: String(Math.random() + Date.now()) })
    node.once('ready', () => {
        console.log('IPFS node is ready')
    })
    
    node.on('ready', async () => {
      const version = await node.version()

      console.log('Version:', version.version)

      const filesAdded = await node.files.add({
        path: 'rarepepe.txt',
        content: Buffer.from('the rarest of all rares')
      })

      console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
    })    
}

function buttonSplash(){
    document.title = "Welcome to Freeport"
    $(".jumbotron-tab-container").hide()
    $(".jumbotron-tab-container-content").hide()
    $("#buttonsplash").show()
    $(".nav-item").removeClass("active")
}

function btcViewModal(){
    
    var btcBalance = parseInt($("#body").data("balance_btc")) / 100000000
    btcBalance = Number(btcBalance).toFixed(8).replace(/\.?0+$/,"")
    
    var btcFee = $("#body").data("fee_btc")
    
    var btcDialog = new BootstrapDialog({
        title: 'Bitcoin (BTC)',
        cssClass: 'modal-nofade',
        message: function(dialogItself){
            
                
            
//                var txfeebutton = "<div style='padding: 10px'><button id='send-btc-button' class='btn btn-warning btn-sm'>Send</button></div>"
//                
//                var qrbutton = "<div style='padding: 10px'><button id='update-fee-button' class='btn btn-info btn-sm'>Custom</button></div>"
            
                var txfeebutton = ""
                var qrbutton = ""
            
                var $message = $("<div id='dialogBtcView-container'><div class='row' align='center' style='padding: 20px 0 0 0;'><div class='col' align='center'><div style='font-weight: bold;'>Balance:</div><div style='font-size: 22px;'>"+btcBalance+"</div>"+txfeebutton+"</div><div class='col' align='center'><div style='font-weight: bold;'>Tx Fee:</div><div id='dialogBtcView-fee-custom' style='font-size: 22px;'>"+btcFee+"</div>"+qrbutton+"</div></div>")
             
                return $message
            },
        buttons: [
            {
                label: 'Send',
                cssClass: 'btn-primary',
                action: function(dialogItself) { 
                    
                    dialogItself.close()
                    
                    var btc_total = parseFloat($("#body").data("balance_btc")) / 100000000
                    sendAssetModal("BTC", "../images/btc-icon.png", true, btc_total, $("#body").data("fee_btc"))
                    

                }
            },
            {
                label: 'Custom Fee',
                cssClass: 'btn-info',
                action: function(dialogItself) { 
                    
                    txFeeModal()
                    
                    dialogItself.close()

                }
            },
            {
                label: 'Close',
                cssClass: 'btn-secondary',
                action: function(dialogItself) { 
                    
                    dialogItself.close()

                }
            }
        ]
    });
    btcDialog.open()

}

function manualSignMessageModal(address, passphrase){
    
    var manualSignMessageDialog = new BootstrapDialog({
            title: 'Sign Message',
            cssClass: "modal-nofade",
            message: $('<div></div>').load('modal/dialog-message-sign.html'),
            buttons: [{
                id: 'sign-btn',
                label: 'Sign',
                cssClass: 'btn-success',
                action: function(dialogItself) {

                    var msg = dialogItself.getModalBody().find('#dialogManualSign-message').val()
                       
                    signMessage(address, passphrase, msg, function(sig){
                        dialogItself.getModalBody().find('#dialogManualSign-container').html("<div style='font-weight: bold; text-align: left;'>Signature:</div><div style='padding: 10px 0 10px 0;' align='left'><samp style='word-wrap: break-word;'>"+sig+"</samp></div>")
                        
                        dialogItself.getButton('sign-btn').toggleEnable(false) 
                    })
                     

                    
                }
            },
            {
                label: 'Close',
                cssClass: 'btn-secondary',
                action: function(dialogItself) {  

                    dialogItself.close()

                }
            }]
    })

    manualSignMessageDialog.open() 


}

function balanceClickModal(currentaddr){

    var depositBtcDialog = new BootstrapDialog({
        title: 'Deposit all BTC and Assets Here',
        cssClass: "modal-nofade",
        message: function(dialog){
                var $message = $('<div align="center"></div>')
                $message.qrcode({   text: currentaddr,
                                    background: "#ffffff",
                                    foreground: "#000000"})
                $message.append('<div align="center" style="padding-top: 20px;font-weight:bold;">'+currentaddr+'</div>')
                return $message
            }
    });

    depositBtcDialog.open()    

}

function txFeeModal(){   
    
    var txfee = $("#body").data("fee_btc")
    var default_fee = $("#body").data("fee_btc_recommended")
    

    var txFeeDialog = new BootstrapDialog({
        title: "BTC Tx Fee",
        cssClass: "modal-nofade",
        message: function(dialog){
                var $message = $('<div></div>').load('modal/dialog-txfee.html', function(){
                    $(this).find("#dialogTxFee-current").html(txfee)
                    $(this).find("#dialogTxFee-default").html(default_fee)
                })
                
                return $message
            },
        buttons: [
            {
                label: 'Update',
                cssClass: 'btn-success',
                action: function(dialogItself) {
                    
                    var newfee = dialogItself.getModalBody().find('#dialogTxFee-new').val()
                    
                    var newfeeNum = parseFloat(newfee)
                    
                    if(isNaN(newfeeNum) == false && newfeeNum < 0.005 && newfeeNum >= min_tx_fee && $.isNumeric( newfeeNum ) == true) {
                        //console.log("good")
                        
                        chrome.storage.local.set({fee_custom: newfeeNum}, function() { 
                            $("#body").data("fee_btc", newfeeNum)
                            $("#dialogBtcView-fee-custom").html(newfeeNum)
                            console.log("fee updated to "+newfeeNum)
                            dialogItself.close()
                        })
                        
                        
                    } else {
                        //console.log("bad")
                        
                        var bad_fee_msg = "Must be between "+min_tx_fee+" and 0.005 BTC"
                        
                        dialogItself.getModalBody().find('#dialogTxFee-message').html(bad_fee_msg)
                    }
                    
                    
                } 
            },
            {
                label: 'Close',
                cssClass: 'btn-default',
                action: function(dialogItself) {

                    dialogItself.close()

                }
            }
        ]
    });

    txFeeDialog.open()    
}


function startWebsocket(address, bc_token){
    
    if(bc_token){
        var wsMsgTxUnconf = {event: "unconfirmed-tx", address: address, token: bc_token};
        var wsMsgTxConf = {event: "tx-confirmation", address: address, token: bc_token};
        var msgPing = {event: "ping", token: bc_token};
    } else {
        var wsMsgTxUnconf = {event: "unconfirmed-tx", address: address};
        var wsMsgTxConf = {event: "tx-confirmation", address: address};   
        var msgPing = {event: "ping"};
    }
    
    var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/main");

    ws.onopen = function (event) { 
        console.log("BlockCypher web socket open!")
        ws.send(JSON.stringify(wsMsgTxUnconf));
        ws.send(JSON.stringify(wsMsgTxConf));

        //ping every 50 sec to maintain connection  
        setInterval(function(){ws.send(JSON.stringify(msgPing))}, 55000)
    };

    ws.onmessage = function (event) {
        //console.log(event.data);
        wsEventHandler(event.data)
    }

    ws.onclose = function(){
        // connection closed, discard old websocket and create a new one in 5s
        ws = null
        setTimeout(startWebsocket(address), 5000)
    }

      
}

function wsEventHandler(data){
    if(data.hash){
        console.log("Transaction Found!")
        console.log("---")
        console.log("Confirmations: "+data.confirmations)
        console.log("Tx ID: "+data.hash)
        console.log("---")
    } else {
        console.log(data)
    }
}

function idleCheck(){
    var awayCallback = function() {
        console.log("away");
        location.reload(true)
    };
    var awayBackCallback = function() {
        console.log("back");
    };

    var idle = new Idle({
        onAway : awayCallback,
        onAwayBack : awayBackCallback,
        awayTimeout : 600000 //10 minutes
    }).start();
}

function closeAllModals(){
    $('.modal').modal('hide') // closes all active pop ups.
    //$('.modal-backdrop').remove() // removes the grey overlay.
}
