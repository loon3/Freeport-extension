// window.addEventListener('beforeunload', function(event) {
// 	chrome.storage.local.set({'instances': 0}, function() {})
// })


$( document ).ready(function() {  
    
   
    $(".jumbotron-tab-container").addClass("hide")
    
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
    
    $("#container-market-button").on('click', function(){
        gotoTab("market")
    })
    
    $("#page-collect-browse-select").on('click', function(){
        pageCollectBrowse()
    })
    
    $("#page-container-create-manage-button").on('click', function(){
        pageCreateManage($("#body").data("address"))
    })
    
    $("#page-container-collect-content").on('click', 'div#page-collect-search-select', function(){
        pageCollectSearchModal()
    })
    
    $("#page-collect-inventory-select").on('click', function(){ 
        pageCollectInventory($("#body").data("address"))
    })
    $("#page-container-collect-content").on('click', 'div.collection-item', function(){ 
        var url = $(this).data("url")
        window.open(url, '_blank', "width=800,height=600,top=50,left=50")
    }) 
    
    $("#page-container-collect-content").on('change', 'input#imageToggle', function(){ 
        //console.log($(this).is(":checked"))
        if($(this).is(":checked")){
            $(".collection-asset-images").removeClass("hide")
        } else {
            $(".collection-asset-images").addClass("hide")
        }
    }) 
    
    
    $("#page-container-collect-content").on('click', 'div.collection-item-asset', function(){ 
         
        var assetname = $(this).data("assetname")
        var assetimage = $(this).data("assetimage")
        var assetdivisible = $(this).data("divisible")
        var assetqty = $(this).data("quantity")
        var assetdescription = $(this).data("description")
        var assetalias = $(this).data("alias")
        var assetcollection = $(this).data("collection")

        
        var ypos = window.scrollY
        console.log(ypos)

        pageCollectAsset(assetname, assetimage, assetdivisible, assetqty, assetdescription, assetalias, assetcollection, ypos)
        //window.scrollTo(0,0);

    }) 
    $("#page-container-collect-assetview").on('click', 'div.collection-item-asset-end', function(){ 
        pageCollectSearchModal()
    }) 
    $("#page-container-collect-assetview").on('click', 'button.asset-send-button', function(){ 
        var assetname = $(this).data("asset")
        var assetimage = $(this).data("image")
        var assetdivisible = $(this).data("divisible")
        var assetqty = $(this).data("qty")

        chrome.storage.local.get(['fee_custom'], function(result) {
            sendAssetModal(assetname, assetimage, assetdivisible, assetqty, result.fee_custom)
        })

    }) 
    
    $("#page-container-collect-assetview").on('click', 'button.asset-tweet-who-button', function(){ 
        var asset = $(this).data("asset")
        var url = "https://twitter.com/hashtag/"+asset
        window.open(url, '_blank', "width=800,height=600,top=50,left=50")
    }) 
    
    $("#page-container-collect-assetview").on('click', 'button.asset-tweet-share-button', function(){
        var asset = $(this).data("asset")
        var alias = $(this).data("alias")
        var image = $(this).data("image")
        var shareText = alias+"%0A"+encodeURI(image)+"%0A%23"+asset+"%0A%0A"+encodeURI("Issue Cryptogoods on Bitcoin... Freeport.io")
        var shareUrl = "http://twitter.com/intent/tweet?text="+shareText
        window.open(shareUrl, '_blank', "width=800,height=600,top=50,left=50")
    }) 
    

    $("#page-container-create").on('click', 'li#page-container-create-new-button', function(){ 
        chrome.storage.local.get(['fee_custom'], function(result) {
            
            var btc_total = parseFloat($("#body").data("balance_btc")) / 100000000
            var fee_set = parseFloat(result.fee_custom)
            
            if(btc_total < fee_set){
                BootstrapDialog.show({
                    title: 'Not Available',
                    message: 'You must deposit enough BTC to pay transaction fee.'
                });
            } else {
                getUniqueAsset(function(assetid){
                    issueAssetModal(assetid, result.fee_custom)
                })
            }
        })
    })
    
  
    
    $("#body").on('click', 'button#page-inventory-back-button', function(){ 
        $("#leftbar-container").html("")
//        pageCollectInventory($("#body").data("address"))
        $("#page-container-collect-assetview").addClass("hide")
        $("#page-container-collect-content").removeClass("hide")
        var ypos = $(this).data("ypos")
        window.scrollTo(0,ypos);

    }) 
    $("#body").on('click', 'button#page-create-back-button', function(){ 
        $("#leftbar-container").html("")
        gotoTab("create")
    }) 
    $("#body").on('click', 'button#page-collect-back-button', function(){ 
        $("#leftbar-container").html("")
        gotoTab("collect")
    }) 
    
    $("#body").on('click', 'button.unconfirmed-tx-dropdown-item', function(){ 
        var txid = $(this).data("txid")
        window.open("https://xchain.io/tx/"+txid);
    }) 
    
     $("#body").on('click', 'button.asset-lock-button', function(){ 
        var asset = $(this).data("asset")
        var alias = $(this).data("alias")
        var divisible = $(this).data("divisible")
        var address = $("#body").data("address")
        
        chrome.storage.local.get(['fee_custom'], function(result) {
            lockAssetModal(asset, alias, address, divisible, result.fee_custom)
        })
    }) 
     
     $("#body").on('click', 'button.image-anchor-button', function(){ 
        var asset = $(this).data("asset")
        var alias = $(this).data("alias")
        var address = $("#body").data("address")
        
        var imageUrl = decodeURIComponent($(this).data("imageurl"))
        
        chrome.storage.local.get(['fee_custom'], function(result) {
            imageToHash(imageUrl, function(messageImage){
                
                var messageAsset = hexToBase64(decToHex(asset.substr(1)).substr(2))
                var message = "A:"+messageAsset+";I:"+messageImage
                
                console.log(message)
                
                anchorImageModal(asset, alias, address, message, result.fee_custom)
                
                //sendBroadcast_opreturn($("#body").data("address"), message, 0, result.fee_custom, $("#body").data("passphrase"), function(rawtx){console.log(rawtx)})
            
            })
        })
    }) 
    
    $(document).on('click', '#header-address-forclick', function(){ 
        balanceClickModal($("#body").data("address"))
    }) 
    
    
    $(document).on('click', '#header-address-twitter-link', function(){
        
        if($("#header-address-twitter-link").data("twitter")){
            disconnectTwitterModal($(this).data("twitter"), $("#body").data("address"), $("#body").data("passphrase"))
        } else {
            connectTwitterModal($("#body").data("address"), $("#body").data("passphrase"))
        }
        
    })
    
    //container-collect-issuer-twitter
    $("#page-container-collect-assetview").on('click', 'div#container-collect-issuer-twitter', function(){ 
        var twitterUsername = $(this).data("twitter")
        var url = "http://twitter.com/"+twitterUsername
        window.open(url, '_blank', "width=800,height=600,top=50,left=50")
    }) 
    
    $(document).on("click", 'button.substitute-defaultfee-button', function (event) { 

	var feetype = $(this).data("feetype")
console.log(feetype)
		
        feeRecommendedCallback2(function(fee_recommended_priority, fee_recommended_economy){

		if(feetype == "priority"){
			var fee_recommended = fee_recommended_priority
		}else{
			var fee_recommended = fee_recommended_economy
		}

            $("#body").data("fee_btc", fee_recommended)    
            $(".dialog-transfee").html(fee_recommended)
            $(".dialog-txfeebutton").addClass("hide") 
  
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
    
    $("body").on('keyup', '.dialogIssueAsset-field-req', (function(event) {
        
        var qty = parseFloat($("#dialogIssueAsset-qty").val())
        var name = $("#dialogIssueAsset-name").val()
        
        console.log(qty)
        
        if (qty > 0 && qty < 18446744073709551615 && name.length > 0) {
            $("#dialogIssueAsset-create-btn").removeClass('disabled')
        } else {
            $("#dialogIssueAsset-create-btn").addClass('disabled')
        }
    }))
    
    $("body").on('change', '#imgur-file-upload[type=file]', function(){ 
        
        $("#dialogIssueAsset-imgur-file-upload-container").addClass("hide")
        $("#dialogIssueAsset-imgur-file-upload-spinner").html("<i class='fa fa-spinner fa-spin fa-3x fa-fw'></i>")

        var dom = this
        
        setTimeout(function(){
        
            uploadFileImgur(dom, function(data){
                console.log(data)
                if(data.success){

                    $("#dialogIssueAsset-imgur-file-upload-spinner").addClass("hide")

                    $("#dialogIssueAsset-form-container").removeClass("hide")
                    $("#dialogIssueAsset-header").removeClass("hide")

                    $("#dialogIssueAsset-image-container").html("<img src='"+data.message+"' style='width: 100%; max-width: 400px;'>")
                    $("#dialogIssueAsset-image").val(data.message)
                }
            })
            
        }, 2000)
    });
    
    
    //ipfsInit()
       
    
})



function gotoTab(tabTitle){
    $("#leftbar-container").html("")
    $("#buttonsplash").addClass("hide")
    document.title = tabTitle.charAt(0).toUpperCase() + tabTitle.slice(1) + " - Freeport"
    $(".jumbotron-tab-container").addClass("hide")
    $(".jumbotron-tab-container-content").addClass("hide")
    $("#page-container-"+tabTitle).removeClass("hide")
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
    $(".jumbotron-tab-container").addClass("hide")
    $(".jumbotron-tab-container-content").addClass("hide")
    $("#buttonsplash").removeClass("hide")
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
            closable: false,
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

function checkRegistry(address, callback){
    var source_html = "https://freeport.io/api/collection/"+address
    
    var noresult = {error:"Not found"}
    
    $.getJSON( source_html, function( data ) {
        callback(data)
    }).fail(function(){
        callback(noresult)
    })
}

function connectTwitterModal(address, passphrase){
    
    var connectTwitterDialog = new BootstrapDialog({
            title: 'Twitter',
            cssClass: "modal-nofade",
            closable: false,
//            message: $('<div></div>').load('modal/dialog-twitter-connect.html'),
            message: $('<div></div>').load('modal/dialog-twitter-connect-share.html'),
            buttons: [{
                id: 'connect-twitter-btn',
                label: 'Continue',
                cssClass: 'btn-success',
                action: function(dialogItself) {

                    var msg = (dialogItself.getModalBody().find('#dialogTwitterConnect-handle').val()).toLowerCase()
                       
                    signMessage(address, passphrase, msg, function(sig){
//                        dialogItself.getModalBody().find('#dialogTwitterConnect-container').html("<div style='font-weight: bold; padding-bottom: 10px; text-align: left;'>Paste the following text in a Direct Message to <a href='https://twitter.com/FreeportApp' target='_blank'>@FreeportApp</a> <div id='link-twitter-about-tooltip' style='display: inline-block;' data-toggle='tooltip' data-placement='right' title='Below is your Twitter Username signed by your Collection Address. Freeport will store this in a public record for collectors to verify you as an asset creator.'><i class='fa fa-question-circle-o fa-1' aria-hidden='true'></i></div></div><div style='padding: 10px; background-color:#333;' align='left'><samp style='word-wrap: break-word;'>LINK_ADDRESS:"+address+";LINK_SIG:"+sig+"</samp></div><div style='font-weight: bold; padding: 10px 0 10px 0; text-align: left;'>May take up to 15 minutes to create link after Direct Message is sent.</div>")
                        
//                        $('#link-twitter-about-tooltip').tooltip()
//                        dialogItself.getButton('connect-twitter-btn').addClass("hide") 
                        
                        var sig_encoded = encodeURI(sig).replace("+", "%2B");
                    
                        dialogItself.getModalBody().find('#dialogTwitterConnect-container').html("<p class='lead'>Freeport will display your twitter name alongside digital items you create.</p><p style='font-style: italic;'>May take several minutes to establish link.</p>")
                        var shareText = encodeURI("Verifying my @FreeportApp creator address.")+"%0A%0A"+"Address:"+address+"%0A"+"Signature:"+sig_encoded
                        var shareUrl = "http://twitter.com/intent/tweet?text="+shareText
                        window.open(shareUrl, '_blank', "width=800,height=600,top=50,left=50")
                        
                        dialogItself.getButton('connect-twitter-btn').addClass("hide") 

                        //dialogItself.close()
                    })
                     

                    
                }
            },
            {
                label: 'Close',
                cssClass: 'btn-secondary',
                action: function(dialogItself) {  

                    dialogItself.close()
                    
//                    var counter = 0
//                    
//                    var checkRegistryInterval = setInterval(function(){  
//                        console.log("testing interval...")
//                        checkRegistry(address, function(registry){
//                            if(!registry.error && $("#body").data("address") == address){
//                                $("#header-address-twitter-link").html("@"+registry.twitter.username+" <i class='fa fa-twitter'></i>")
//                                $("#header-address-twitter-link").data("twitter", registry.twitter.username)
//                                
//                                clearInterval(checkRegistryInterval)
//                            }
//                            
//                            counter++
//                            if(counter >= 5){
//                                clearInterval(checkRegistryInterval)
//                            }
//
//                        })
//                    }, 60000);


                }
            }]
    })

    connectTwitterDialog.open() 

    
}


function disconnectTwitterModal(user, address, passphrase){
    
    var disconnectTwitterDialog = new BootstrapDialog({
            title: 'Unlink Twitter',
            cssClass: "modal-nofade",
            closable: false,
           // message: $('<div></div>').load('modal/dialog-twitter-disconnect.html'),
        
            message: function(dialogItself){
                        var $message = $('<div></div>').load('modal/dialog-twitter-disconnect.html', function(){
                            $(this).find("#dialogTwitterConnect-handle").val(user)
                        })
                        
                        return $message
                    },
            buttons: [{
                id: 'connect-twitter-btn',
                label: 'Unlink',
                cssClass: 'btn-info',
                action: function(dialogItself) {

                    signMessage(address, passphrase, user, function(sig){
                        dialogItself.getModalBody().find('#dialogTwitterConnect-container').html("<div style='font-weight: bold; padding-bottom: 10px; text-align: left;'>Paste the following text in a Direct Message to <a href='https://twitter.com/FreeportApp' target='_blank'>@FreeportApp</a></div><div style='padding: 10px; background-color:#ccc;' align='left'><samp style='word-wrap: break-word;'>UNLINK_ADDRESS:"+address+";UNLINK_SIG:"+sig+"</samp></div><div style='font-weight: bold; padding: 10px 0 10px 0; text-align: left;'>May take several minutes to update after Direct Message is sent.</div>")
                        
                        dialogItself.getButton('connect-twitter-btn').addClass("hide") 
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

    disconnectTwitterDialog.open() 

    
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

    var txFeeDialog = new BootstrapDialog({
        title: "BTC Tx Fee",
        cssClass: "modal-nofade",
        message: function(dialog){
                var $message = $('<div></div>').load('modal/dialog-txfee.html', function(){
                    $(this).find("#dialogTxFee-current").html(txfee)
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
                cssClass: 'btn-secondary',
                action: function(dialogItself) {

                    dialogItself.close()

                }
            }
        ]
    });

    txFeeDialog.open()    
}

function addFeeButtons(fee_recommended_priority, fee_recommended_economy){
    var btc_usdRate = $("#body").data("usd_btc")
    var fee_recommended_priority_usdRate = (parseFloat(fee_recommended_priority) * parseFloat(btc_usdRate)).toFixed(2) 
    var fee_recommended_economy_usdRate = (parseFloat(fee_recommended_economy) * parseFloat(btc_usdRate)).toFixed(2) 

    var txfeebutton = "<div style='padding: 20px;' class='row'><div class='col-6'><button class='substitute-defaultfee-button btn btn-danger btn-sm' data-feetype='priority'>Use priority fee (~20 min)<br><b>"+fee_recommended_priority+" BTC / $"+fee_recommended_priority_usdRate+"</b></button></div><div class='col-6'><button class='btn btn-primary btn-sm substitute-defaultfee-button' data-feetype='economy'>Use economy fee (~3 hrs)<br><b>"+fee_recommended_economy+" BTC / $"+fee_recommended_economy_usdRate+"</b></button></div><div class='col-12 small' style='font-style: italic; padding-top: 20px;'>Fees are paid in BTC, equivalent amount in USD for reference only.</div></div>"
    
    return txfeebutton
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


