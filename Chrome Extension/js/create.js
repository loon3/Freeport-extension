function pageCreateManage(address){
    
    $("#page-container-create-content").html("<div align='center'><i class='fa fa-spinner fa-spin fa-3x fa-fw'></i></div>")
    
    $("#page-container-create").addClass("hide")
    $("#page-container-create-content").removeClass("hide")
    
    var source_html = "https://xchain.io/api/issuances/"+address
    var collection = ""
    var cardImage, cardDivisible
    var assetArray = []
    
    $.getJSON( source_html, function( data ) { 
        //collection += "<div align='left' style='padding: 0 0 30px 0;'><button id='page-create-back-button' type='button' class='btn btn-xs btn-back'><- Back</button></div>"
        $("#leftbar-container").html("<div id='page-create-back-button-container' align='left' style='position: fixed; top: 50%; left: 0px; vertical-align: middle; transform: translateY(-50%);'><button id='page-create-back-button' type='button' class='btn btn-back'><i class='fa fa-arrow-left fa-2x'></i></button></div>")
        collection += "<h2>Manage My Created Items</h2><div class='row' style='padding-top: 20px;'>"
        
        if(parseInt(data.total) != 0){
        
            checkAnchors(address, function(anchors){

                console.log(anchors)

                for(var i=0; i < data.data.length; i++){

                    if(assetArray.indexOf(data.data[i]['asset']) == -1  && data.data[i]['description'] != "LOCK"){

                        assetArray.push(data.data[i]['asset']);

                        collection += "<div class='col-sm-6 col-md-4 col-lg-3 col-xl-2 issued-item' align='center' style='padding-top: 20px;' data-asset='"+data.data[i]['asset']+"'>"

                        cardImage = "../images/unknown.png"
                        cardAlias = data.data[i]['asset']

                        if(data.data[i]['description'].length >= 16){
                            var checkImgur = data.data[i]['description'].substring(0, 5);
                            if(checkImgur == "imgur"){
                                var descArray = data.data[i]['description'].split(";");
                                cardImage = "https://i.imgur.com/"+descArray[0].substring(6);
                                cardAlias = descArray[1]
                            }
                        }

                        cardDivisible = data.data[i]['divisible']

                        if(data.data[i]['locked']){
                            var lockedButton = "<button type='button' class='btn btn-info btn-block asset-lock-button' disabled><i class='fa fa-lock' aria-hidden='true'></i> Locked</button>"
                        } else {
                            var lockedButton = "<button type='button' class='btn btn-info btn-block asset-lock-button' data-asset='"+data.data[i]['asset']+"' data-alias='"+cardAlias+"' data-divisible='"+cardDivisible+"'><i class='fa fa-unlock' aria-hidden='true'></i> Unlocked</button>"
                        }

                        if(anchors[data.data[i]['asset']]){
                            var anchorButton = "<button type='button' class='btn btn-success btn-block image-anchor-button' disabled><i class='fa fa-anchor' aria-hidden='true'></i> Anchored</button>"
                        } else {
                            var anchorButton = "<button type='button' class='btn btn-success btn-block image-anchor-button' data-asset='"+data.data[i]['asset']+"' data-alias='"+cardAlias+"' data-imageurl='"+encodeURIComponent(cardImage)+"'><i class='fa fa-anchor' aria-hidden='true'></i> No Anchor</button>" 
                        }

                        collection += "<div style=''><img src='"+cardImage+"' width='110px'></div>"
                        collection += "<div class='lead' style='font-weight: bold; padding-top: 5px;'>"+cardAlias+"</div>"

                        collection += "<div>"
                        collection += "<div style='padding: 10px 10px 10px 10px; margin: auto; width: 100%; display: inline-block;'>"+lockedButton+"</div>"
                        collection += "<div style='padding: 0px 10px 20px 10px; margin: auto; width: 100%; display: inline-block;'>"+anchorButton+"</div>"
                        collection += "</div>"

                        collection += "</div>"

                    }
                } 

                collection += "</div>"

                $("#page-container-create-content").html(collection)
                
            })
        } else {
            collection += "<div class='col lead' align='center' style='margin: 25px 0 35px 0; padding: 20px; width: 100%; text-align: center;'>Nothing has been created from this address!</div>"
            collection += "</div>"
            $("#page-container-create-content").html(collection)
        }
        
        
    })
}

function lockAssetModal(asset, alias, address, divisible, fee_custom){
    
    feeRecommendedCallback2(function(fee_recommended_priority, fee_recommended_economy){
        
        var txfeebutton = addFeeButtons(fee_recommended_priority, fee_recommended_economy)
        

     var lockAssetDialog = new BootstrapDialog({
            title: "Lock Asset",
            cssClass: "modal-nofade",
            message: function(dialog){

                        //var $message = $('<div></div>').load('modal/dialog-upload-image.html', function(){})
                       
                        var $message = $("<div id='dialogLockAsset-container' align='center'></div>").html("<p class='lead'>"+alias+"</p><p class='small'>ID // "+asset+"</p><div style='color: #FFEB70; font-weight: bold; font-size: 18px;'><p>Locking will permanently prevent additional issuance of this asset.</p><p>Do you want to lock?</p></div><div align='center' style='margin-top: 20px;'>Current fee: <b><span class='dialog-transfee'>"+fee_custom+"</span> BTC</b></div><div align='center' class='dialog-txfeebutton'>"+txfeebutton+"</div>")
                        return $message

                    },
            buttons: [{
                id: 'dialogLockAsset-lock-btn',
                label: 'Lock',
                cssClass: 'btn-success',
                action: function(dialogItself) {
                    
                            var passphrase = $("#body").data("passphrase")
                            var transfee = (parseFloat($("#body").data("fee_btc")) * 100000000)/100000000

                            createIssuance_opreturn(address, asset, 0, divisible, "LOCK", transfee, passphrase, function(signedtx){
                                sendRawSignedTx(signedtx, function(status, txid){
                                    if (status == "success") {
                                        dialogItself.getModalBody().find('#dialogLockAsset-container').html("<div><div style='padding: 15px 0 15px 0; font-weight: bold; font-size: 18px;'>Transaction Sent!</div><i class='fa fa-check fa-3x' aria-hidden='true'></i></div><div style='padding: 15px 0 15px 0;'><a href='https://xchain.io/tx/"+txid+"' target='_blank'>View your Transaction</a></div>")  
                                        dialogItself.setClosable(false)
                                        $("body").data("sendTx", true)
                                    } else {
                                        dialogItself.getModalBody().find('#dialogLockAsset-container').html("Error")
                                    }   
                                })        
                            })            
                    
                            lockAssetDialog.getButton('dialogLockAsset-lock-btn').toggleEnable(false) 


                        }
                },
                {
                label: 'Close',
                cssClass: 'btn-default',
                action: function(dialogItself) {
                    
                    if($("body").data("sendTx") == true){
  
                        getUnconfirmed($("#body").data("address"), function(data){
                            updateUnconfirmed(data)
                        })

                        $("body").data("sendTx", false)

                    }
                    dialogItself.close()
                    
                }
            }]
        })

        lockAssetDialog.open() 
    })
}

function anchorImageModal(asset, alias, address, message, fee_custom){
    
    feeRecommendedCallback2(function(fee_recommended_priority, fee_recommended_economy){
        
        var txfeebutton = addFeeButtons(fee_recommended_priority, fee_recommended_economy)
        
        var anchorImageDialog = new BootstrapDialog({
            title: "Anchor Image",
            cssClass: "modal-nofade",
            message: function(dialog){

                        var $message = $("<div id='dialogAnchorImage-container' align='center'></div>").html("<p class='lead'>"+alias+"</p><p class='small'>ID // "+asset+"</p><div style='color: #000; font-weight: bold; font-size: 18px;'><p>Your image will be anchored by storing its unique fingerprint (image hash) in a bitcoin transaction.</p></div><div align='center' style='margin-top: 20px;'>Current fee: <b><span class='dialog-transfee'>"+fee_custom+"</span> BTC</b></div><div align='center' class='dialog-txfeebutton'>"+txfeebutton+"</div>")
                        return $message

                    },
            buttons: [{
                id: 'anchorImage-btn',
                label: 'Anchor',
                cssClass: 'btn-success',
                action: function(dialogItself) {
                    
                            var passphrase = $("#body").data("passphrase")
                            var transfee = (parseFloat($("#body").data("fee_btc")) * 100000000)/100000000
                
                            sendBroadcast_opreturn(address, message, 0, transfee, passphrase, function(signedtx){
                                sendRawSignedTx(signedtx, function(status, txid){
                                    if (status == "success") {
                                        dialogItself.getModalBody().find('#dialogAnchorImage-container').html("<div><div style='padding: 15px 0 15px 0; font-weight: bold; font-size: 18px;'>Transaction Sent!</div><i class='fa fa-check fa-3x' aria-hidden='true'></i></div><div style='padding: 15px 0 15px 0;'><a href='https://xchain.io/tx/"+txid+"' target='_blank'>View your Transaction</a></div>")  
                                        dialogItself.setClosable(false)
                                        $("body").data("sendTx", true)
                                    } else {
                                        dialogItself.getModalBody().find('#dialogAnchorImage-container').html("Error")
                                    }   
                                })        
                            }) 
                    
                            anchorImageDialog.getButton('anchorImage-btn').toggleEnable(false) 

                        }
                },
                {
                label: 'Close',
                cssClass: 'btn-secondary',
                action: function(dialogItself) {
                    
                    if($("body").data("sendTx") == true){
  
                        getUnconfirmed($("#body").data("address"), function(data){
                            updateUnconfirmed(data)
                        })

                        $("body").data("sendTx", false)

                    }
                    dialogItself.close()
                    
                }
            }]
        })

        anchorImageDialog.open() 
    })
}


function uploadFileImgur(dom, callback){
    
    var data = {success: false, message: ""}
    
    var $files = $(dom).get(0).files;

    if ($files.length) {

      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        data.message = "too big"
        callback(data)
      }

      // Begin file upload
      console.log("Uploading file to Imgur..");

      var apiUrl = 'https://api.imgur.com/3/image';
      var apiKey = '0662245ed0b1f3a';

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response_json) {
          
          var response = JSON.parse(response_json)
          console.log(response);
          
          if(response.success){
              data.success = true
              data.message = response.data.link
          } else {
              data.message = "upload error"
          }
          
          callback(data)
      });

    }
}

function uploadImgurModal_test(){
    
     var uploadImgurDialog = new BootstrapDialog({
            title: "Upload Image",
            cssClass: "modal-nofade",
            //message: $('<div></div>').load('html/dialog-send-asset.html'),
            message: function(dialog){

                        var $message = $('<div></div>').load('modal/dialog-upload-image.html', function(){})

                        return $message

                    },
            buttons: [{
                label: 'Close',
                cssClass: 'btn-default',
                action: function(dialogItself) {
                    dialogItself.close()
                }
            }]
        })

        uploadImgurDialog.open() 
    
}

function issueAssetModal(assetid, fee_custom){
    
    feeRecommendedCallback2(function(fee_recommended_priority, fee_recommended_economy){
        
        var txfeebutton = addFeeButtons(fee_recommended_priority, fee_recommended_economy)
        
        var btcbalance = $("#body").data("balance_btc")

        var assetIssueDialog = new BootstrapDialog({
        title: "Create Asset",
        cssClass: "modal-nofade",
        //message: $('<div></div>').load('html/dialog-send-asset.html'),
        message: function(dialog){
            
                    var $message = $('<div></div>').load('modal/dialog-issue-asset.html', function(){
                        $(this).find("#dialogIssueAsset-assetid").html(assetid)
                        $(this).find(".dialog-transfee").html(fee_custom)
                        $(this).find('.dialog-txfeebutton').html(txfeebutton)

                    })

                    return $message

                },
        buttons: [
        {
            id: 'dialogIssueAsset-create-btn',
            label: 'Create',
            cssClass: 'btn-success disabled',
            action: function(dialogItself) {

                    var passphrase = $("#body").data("passphrase")
                    var transfee = (parseFloat($("#body").data("fee_btc")) * 100000000)/100000000
                    
                    console.log(transfee)
                    
                    var add_from = $("#body").data("address")
                    var assetid = dialogItself.getModalBody().find('#dialogIssueAsset-assetid').text() 
                    var quantity = dialogItself.getModalBody().find('#dialogIssueAsset-qty').val()
                    
                    if(dialogItself.getModalBody().find("#dialogIssueAsset-isdivisible").is(':checked')){
                        var divisible = true
                    } else {
                        var divisible = false
                    }
                    
                    var description_name = dialogItself.getModalBody().find('#dialogIssueAsset-name').val()
                    var description_image = dialogItself.getModalBody().find('#dialogIssueAsset-image').val()
  
                    var description = "imgur/" + description_image.substr(20) + ";" +description_name
                    
                    console.log(description)
                    
                    if (description.length <= 41){
                        createIssuance_opreturn(add_from, assetid, quantity, divisible, description, transfee, passphrase, function(signedtx){
                            sendRawSignedTx(signedtx, function(status, txid){
                                if (status == "success") {
                                    dialogItself.getModalBody().find('#dialogIssueAsset-container').html("<div><div style='padding: 15px 0 15px 0; font-weight: bold; font-size: 18px;'>Transaction Sent!</div><i class='fa fa-check fa-3x' aria-hidden='true'></i></div><div style='padding: 15px 0 15px 0;'><a href='https://xchain.io/tx/"+txid+"' target='_blank'>View your Transaction</a></div>")  
                                    dialogItself.setClosable(false)
                                    $("body").data("sendTx", true)
                                } else {
                                    dialogItself.getModalBody().find('#dialogIssueAsset-container').html("Error")
                                }   
                            })        
                        })            
                    } else {
                        //error
                    }

                    dialogItself.getModalBody().find('#dialogIssueAsset-image').prop('disabled', true)
                    dialogItself.getModalBody().find('#dialogIssueAsset-name').prop('disabled', true)
                    dialogItself.getModalBody().find('#dialogIssueAsset-qty').prop('disabled', true)
                    dialogItself.getModalBody().find('#dialogIssueAsset-isdivisible').prop('disabled', true)
                    dialogItself.getButton('dialogIssueAsset-create-btn').toggleEnable(false) 




            }
        },
        {
            label: 'Close',
            cssClass: 'btn-default',
            action: function(dialogItself) {

                if($("body").data("sendTx") == true){
  
                    getUnconfirmed($("#body").data("address"), function(data){
                        updateUnconfirmed(data)
                    })
                    
                    $("body").data("sendTx", false)

                }
                dialogItself.close()

            }
        }]
        })

    //    assetIssueDialog.realize()   
    //    assetIssueDialog.enableButtons(false)	

        assetIssueDialog.open() 


    })
    
    
}

