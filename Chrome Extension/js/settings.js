function getAddrArray(){
    var checkUnlocked = $("#body").data("passphrase")
    if(checkUnlocked != null){
        var passphrase_array = checkUnlocked.split(" ")
        m = Mnemonic.fromWords(passphrase_array)

        var node = bitcoinjs.HDNode.fromSeedHex(m.toHex(), NETWORK)
        var addrArray = new Array()

        for(var i=0;i < 6;i++){
            var child = node.deriveHardened(0)
              .derive(0)
              .derive(i)

            addrArray[i] = child.getAddress()
        
        }

        return addrArray
    }  
}

function selectAddrDropdown(address, addressArray){
    
    var selectAddrDialog = new BootstrapDialog({
        id: 'address-select-modal',
        title: 'Select Address',
        cssClass: 'modal-nofade',
        closable: false,
        message: function(dialog){
                    var $message = $('<div></div>').load('../html/modal/dialog-settings-address.html', function(){
                        
                        var dropdownHtml = ''
                        
                        for(var i=0;i < addressArray.length;i++){
                            
                            if(address == addressArray[i]){
                                dropdownHtml += '<a href="#" class="list-group-item list-group-item-action active">'+address+'</a>'
                            } else {
                                dropdownHtml += '<a href="#" class="address-select-new list-group-item list-group-item-action" data-address="'+addressArray[i]+'">'+addressArray[i]+'</a>'
                            }
                            
                        }
                                        
                        $(this).find("#dialog-settings-listgroup").html(dropdownHtml)
                        
     
                    })

                    return $message
                },
        buttons: [
            {
                label: 'Close',
                cssClass: 'btn-secondary',
                action: function(dialogItself) { 
                    
                            dialogItself.close()

                }
            }
        ]
    });
    selectAddrDialog.open()
    
    
}

function viewPassphraseModal(){
    
   var passphrase = $("#body").data("passphrase")
    
        BootstrapDialog.show({
            title: 'Your 12-word Passphrase (KEEP THIS A SECRET)',
            message: passphrase
        });
  
}

