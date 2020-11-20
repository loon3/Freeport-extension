//chrome.storage.local.set({key: value}, function() {
//          console.log('Value is set to ' + value);
//        });
//      
//        chrome.storage.local.get(['key'], function(result) {
//          console.log('Value currently is ' + result.key);
//        });

function newPassphrase()
{    
    m = new Mnemonic(128);
    m.toWords();
    var str = m.toWords().toString();
    var res = str.replace(/,/gi, " ");
    var phraseList = res; 
    
    return phraseList
}

function encryptPassphrase(passphrase, password)
{   
    var encrypted = CryptoJS.AES.encrypt(passphrase, password);
    return encrypted
}

function decryptPassphrase(passphrase_encrypted, password) 
{           
    var passphrase_decrypted = CryptoJS.AES.decrypt(passphrase_encrypted, password); 
    var passphrase_decrypted_text = false
    
    try {
        passphrase_decrypted_text = passphrase_decrypted.toString(CryptoJS.enc.Utf8);
    }
    catch(err) {
        console.log(err.message);
    }

    //check if correct password
    if (passphrase_decrypted_text) {            
        var results = {status:"success", passphrase: passphrase_decrypted_text}
    } else {
        var results = {status:"error", passphrase: ""}
    }
    
    return results   
}


function checkPassphrase()
{
     
    thisBrowser.storage.local.get(['passphrase'], function(result) {
        
        if(!result.passphrase){
        
            var mnemonic = newPassphrase()    
            var selectManual = false

            var passphraseDialogInit = new BootstrapDialog({
                title: 'Welcome to Freeport',
                cssClass: 'modal-nofade',
                closable: false,
                message: function(dialog){
                    var $message = $('<div></div>').load('../html/modal/dialog-passphrase-new.html', function(){
                        $(this).find("#dialogPassphraseNew-passphrase").html(mnemonic)
                    })

                    return $message
                },

                buttons: [{
                    label: "Continue",
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        
                        if(selectManual){
                            mnemonic = dialogItself.getModalBody().find('input').val()
                        }
                        
                        passphraseDialogEncrypt.open()
                        dialogItself.close();
                    }
                },
                {
                    id: 'manual-btn',
                    label: 'Enter Existing Passphrase',
                    cssClass: 'btn-secondary',
                    action: function(dialogItself){
                        
                        selectManual = true

                        $message = $('<div></div>').load('../html/modal/dialog-passphrase-manual.html')
                        
                        passphraseDialogInit.setMessage($message);
                            
                        var $button = this; 
                        $button.addClass("hide");

                    }
                }
                ]
            });

            var passphraseDialogEncrypt = new BootstrapDialog({
                title: 'Enter New Collection Password',
                cssClass: 'modal-nofade',
                closable: false,
                message: $('<div></div>').load('../html/modal/dialog-aes-new.html'),
                buttons: [{
                    label: 'Encrypt and Continue',
                    cssClass: 'btn-primary',
                    action: function(dialogItself) {
                        var password = dialogItself.getModalBody().find("#password-first").val();
                        var password_check = dialogItself.getModalBody().find("#password-second").val();
                        if(password.length > 0 && password == password_check){
                            var passphrase_encrypted = encryptPassphrase(mnemonic, password)
                            thisBrowser.storage.local.set({passphrase: passphrase_encrypted.toString()}, function() {
                                initInventory(mnemonic)
                                dialogItself.close()
                            });
                        }

                    }
                }]
            });

            passphraseDialogInit.open();

        } else {

            unlockInventory()

        }
    
    
    });
    

    

    
}  


function unlockInventory(){
    var checkUnlocked = $("#body").data("passphrase")
    
    if(checkUnlocked == null){
        var passphraseDialogDecrypt = new BootstrapDialog({
            title: 'Enter Password',
            cssClass: 'modal-nofade',
            closable: false,
            message: $('<div></div>').load('../html/modal/dialog-aes.html'),
            buttons: [
                {
                    id: 'decrypt-passphrase-btn',
                    label: 'Unlock Collection',
                    cssClass: 'btn-primary',
                    action: function(dialogItself) { 
                        var password = dialogItself.getModalBody().find('input').val()

                        if(password.length > 0){
                            thisBrowser.storage.local.get(['passphrase'], function(result) {
                                if(result.passphrase){
                                    var passphrase = localStorage.getItem("mnemonic")          

                                    var passphrase_decrypted = decryptPassphrase(result.passphrase, password)

                                    if(passphrase_decrypted.status == "success"){   
                                        thisBrowser.storage.local.get(['address'], function(result) {
                                            //console.log(result)
                                            if(!result.address){
                                                initInventory(passphrase_decrypted.passphrase)     
                                            } else {
                                                //console.log(result.address)
                                                initInventory(passphrase_decrypted.passphrase, result.address)
                                            }
                                        })
                                    } else {
                                        console.log("wrong password!")
                                        BootstrapDialog.show({
                                            title: 'Wrong Password',
                                            message: 'Freeport will close.',
                                            closable: false,
                                            buttons: [{
                                                label: 'OK',
                                                action: function(dialogRef){
                                                    chrome.tabs.getCurrent(function(tab) {
                                                        chrome.tabs.remove(tab.id, function() { });
                                                    });
                                                }
                                            }]
                                        });

                                    }

                                    dialogItself.close()

                                }
                            })
                        }
                    }
                },
                {
                    label: 'Reset',
                    cssClass: 'btn-secondary',
                    action: function(dialogItself) {  
                        resetInventoryModal()
                    }
                }
            ]
        });
        passphraseDialogDecrypt.open()
    } else {
        $("#body").css("display","inline")
        gotoTab("collect")
    }
   
}

function initInventory(passphrase, address){
    
    var appManifest = chrome.runtime.getManifest()
    
    $("#app-version").html("v"+appManifest.version)
    
    $("#body").css("display","inline")
    $("#body").data("passphrase", passphrase)  
    
    if(!address){
        var address = getAddressPassphrase(passphrase, 0)
    }
    $("#body").data("address", address)
    $("#header-address").html("<div id='header-address-forclick' style='display: inline-block'>"+address+"</div>")
    
    checkRegistry(address, function(registry){
        if(!registry.error){
            $("#header-address").append("<div id='header-address-twitter-link' data-twitter='"+registry.twitter.username+"' style='display: inline-block; font-weight: normal; background-color: #fff; margin-left: 8px; padding: 0 4px 0 5px; border: 1px solid #000;'>@"+registry.twitter.username+" <i class='fa fa-twitter'></i></div>")
        } else {
            $("#header-address").append("<div id='header-address-twitter-link' style='display: inline-block; font-weight: normal; background-color: #fff; margin-left: 8px; padding: 0 4px 0 5px; border: 1px solid #000;'><i class='fa fa-twitter'></i></div>")
        }
    })

    thisBrowser.storage.local.set({'address': address}, function() {

        $(".jumbotron-tab-container").addClass("hide")
        $(".jumbotron-tab-container-content").addClass("hide")
        $("#page-container-collect-content").removeClass("hide")

        $("#page-container-collect-content").html("<div align='center'><i class='fa fa-spinner fa-spin fa-3x fa-fw'></i></div>")
	 getBtcUsdRate(function(usdRate){
		$("#body").data("usd_btc", usdRate)
	
        getFeeUpdate2(function(fee, feeRecommendedPriority, feeRecommendedEconomy){
            getAddressBalance(address, function(data){
                
                if(!data.balance){data.balance = 0};
                
                var balance = parseInt(data.balance) / 100000000

                $("#body").data("balance_btc", data.balance)
                $("#body").data("fee_btc", fee)
                $("#body").data("fee_btc_recommended_priority", feeRecommendedPriority)
			    $("#body").data("fee_btc_recommended_economy", feeRecommendedEconomy)

                $("#header-balance-btc").html(balance)

                buttonSplash()

                //startWebsocket(address, BC_API_TOKEN)
                getUnconfirmed(address, function(data){
                    updateUnconfirmed(data)
                })

                //refresh after 5 min idle
                idleCheck()
            })
        })
	})
    })
        
    
    
}



