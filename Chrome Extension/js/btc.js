function getBrowser() {
  if (typeof chrome !== "undefined") {
    if (typeof browser !== "undefined") {
      return browser;
    } else {
      return chrome;
    }
  } 
}

var thisBrowser = getBrowser()

var bitcoinjs = require('bitcoinjs-lib')
var bitcoinMessage = require('bitcoinjs-message')

const NETWORK = bitcoinjs.networks.bitcoin
const default_txsize_byte = 264
const min_tx_fee = 0.000001

var BC_API_TOKEN = false

const observer = lozad(); // lazy loads elements with default selector as '.lozad'



function getBtcUsdRate(callback){

    var source_html = "https://api.coindesk.com/v1/bpi/currentprice.json"
       
    $.getJSON( source_html, function( data ) {
        callback(data.bpi.USD.rate_float)
    })

}

function isValidAddress(address) {
      
    try {
      bitcoinjs.address.toOutputScript(address, NETWORK)
    } catch(e) {  
      return false
    } 
    
    return true
    
}

function getAddressPassphrase(passphrase_string, i){
    
    var passphrase_array = passphrase_string.split(" ")
    m = Mnemonic.fromWords(passphrase_array)
    
    var node = bitcoinjs.HDNode.fromSeedHex(m.toHex(), NETWORK)
    
    var child = node.deriveHardened(0)
      .derive(0)
      .derive(i)
    
    var publickey = child.getAddress()

    return publickey
    
}

function getPrivKeyPassphrase(passphrase_string, i){
 
    var passphrase_array = passphrase_string.split(" ")
    m = Mnemonic.fromWords(passphrase_array)
    
    var node = bitcoinjs.HDNode.fromSeedHex(m.toHex(), NETWORK)
    
    var child = node.deriveHardened(0)
      .derive(0)
      .derive(i)
    
    var privatekey = child.keyPair.toWIF()

    return privatekey
    
}

function getprivkey(inputaddr, inputpassphrase){

    var array = inputpassphrase.split(" ");
    var m = Mnemonic.fromWords(array)

    var node = bitcoinjs.HDNode.fromSeedHex(m.toHex(), NETWORK)

    //only 505 child keys deep
    for (var i = 0; i < 505; i++) {
        var child = node.deriveHardened(0)
          .derive(0)
          .derive(i)

        var pubkey = child.getAddress()

        if (inputaddr == pubkey) {
            var privkey = child.keyPair.toWIF()
            break;
        }
    }

    return privkey
    
}

function getAddressBalance(address, callback){
    var source_html = "https://api.blockcypher.com/v1/btc/main/addrs/"+address+"/balance"
       
    $.getJSON( source_html, function( data ) {
//        "balance": 4433416
//        "unconfirmed_balance": 0,
        callback(data)
    })
  
}

function getAddressBroadcasts(address, callback){
    var source_html = "https://xchain.io/api/broadcasts/"+address
       
    $.getJSON( source_html, function( data ) {
        callback(data)
    })
}   

function checkBroadcasts(data, callback){
    
    var result = []
    
    var message, type, asset, imageHash
    
    if(data.data.length > 0){
        
        for(var i=0; i < data.data.length; i++){
            console.log(data.data[i])
            if(data.data[i]['text'].indexOf('A:') > -1 && data.data[i]['text'].indexOf('I:') > -1 && data.data[i]['text'].indexOf(';') > -1){
                type = "asset-imagehash"
                message = data.data[i]['text'].split(";")

                asset = message[0].replace("A:", "");
                asset = "A"+hexToDec(base64ToHex(asset))

                imageHash = message[1].replace("I:", "");
                imageHash = base64ToHex(imageHash)

                result.push({type: type, data: {asset: asset, imageHash: imageHash}})
            }
        }
            
    } 
        
    callback(result)
    
}

function checkAnchors(address, callback){
    getAddressBroadcasts(address, function(data){ 
        checkBroadcasts(data, function(result){
            console.log(result)
            
            var anchors = []
            
            for(var i=0; i < result.length; i++){
                if(result[i]['type'] == "asset-imagehash"){
                    anchors[result[i]['data']['asset']] = result[i]['data']['imageHash']
                }
            }
            
            callback(anchors)
        })
    })
}

function getFeeUpdate(callback){
    var source_html = "https://bitcoinfees.earn.com/api/v1/fees/recommended" 
    $.getJSON( source_html, function( data ) {  
        var fee_recommended = (parseInt(data.fastestFee) * default_txsize_byte) / 100000000
        chrome.storage.local.set({fee_recommended: fee_recommended}, function() {  
            chrome.storage.local.get(['fee_custom'], function(result) {
                if(!result.fee_custom){   
                    chrome.storage.local.set({fee_custom: fee_recommended})
                    callback(fee_recommended, fee_recommended)
                } else {
                    callback(result.fee_custom, fee_recommended)
                }   
                
            })
        });   
    })  
}

function feeRecommendedCallback(callback){ 
    chrome.storage.local.get(['fee_recommended'], function(result) {        
        callback(result.fee_recommended)
    })
}

function getFeeUpdate2(callback){
    var source_html = "https://api.blockcypher.com/v1/btc/main"
    $.getJSON( source_html, function( data ) {  

        var fee_recommended_priority = (parseInt(parseInt(data.high_fee_per_kb)/1000) * default_txsize_byte) / 100000000
        var fee_recommended_economy = (parseInt(parseInt(data.low_fee_per_kb)/1000) * default_txsize_byte) / 100000000

        chrome.storage.local.set({fee_recommended_priority: fee_recommended_priority, fee_recommended_economy: fee_recommended_economy}, function() {  
            chrome.storage.local.get(['fee_custom'], function(result) {
                if(!result.fee_custom){   
                    chrome.storage.local.set({fee_custom: fee_recommended_priority})
                    callback(fee_recommended_priority, fee_recommended_priority, fee_recommended_economy)
                } else {
                    callback(result.fee_custom, fee_recommended_priority, fee_recommended_economy)
                }   

            })
        });   
    })  
}

function feeRecommendedCallback2(callback){ 
    chrome.storage.local.get(['fee_recommended_priority'], function(resultp) {      
	chrome.storage.local.get(['fee_recommended_economy'], function(resulte) {          
        callback(resultp.fee_recommended_priority, resulte.fee_recommended_economy)
    	})
    })

}

function getutxos(add_from, mnemonic, amountremaining, callback){

    var privkey = getprivkey(add_from, mnemonic);     
    var source_html = "https://api.blockcypher.com/v1/btc/main/addrs/"+add_from+"?unspentOnly=1&includeScript=1"
    
    var total_utxo = new Array();  
    var satoshi_change = 0;
       
    $.getJSON( source_html, function( data ) {
        
        if(!data.txrefs){
            if(data.unconfirmed_txrefs){
                data = data.unconfirmed_txrefs
            } else {
                callback(total_utxo, satoshi_change);
            }
        } else {
            data = data.txrefs
        }

        console.log(amountremaining);
        console.log(data);

        if(!data){
            callback(total_utxo, satoshi_change);
        }
        
        data.sort(function(a, b) {
            return b.value - a.value
        });

        $.each(data, function(i, item) {
            
             var txid = data[i].tx_hash
             var vout = data[i].tx_output_n
             var script = data[i].script
             var amount = (parseFloat(data[i].value)/100000000).toFixed(8)
             
             amountremaining = amountremaining - amount;            
             amountremaining.toFixed(8);
    
             var obj = {
                "txid": txid,
                "address": add_from,
                "vout": vout,
                "scriptPubKey": script,
                "amount": amount
             };
             
             total_utxo.push(obj);
             
             //REMOVED 
             //dust limit = 5460          
             //if (amountremaining == 0 || amountremaining < -0.00005460) {    
              
             if (amountremaining <= 0) { 
                 return false;
             }
             
        });
        
        if (amountremaining < 0) {
            satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        }
        
        console.log(total_utxo)
        console.log(satoshi_change)
        
        callback(total_utxo, satoshi_change);
        
    })
    
}

function enhancedSendXCP_opreturn_test(add_from, add_to, asset, asset_total, memo, memo_type_hex, transfee, mnemonic, callback){
    
    var amountremaining = (parseFloat(transfee)*100000000)/100000000;
        
    getutxos(add_from, mnemonic, amountremaining, function(total_utxo, satoshi_change){ 

        create_xcp_enhanced_send_data_opreturn(add_to, asset, asset_total, memo, memo_type_hex, function(datachunk_unencoded){
        
            if(total_utxo.length == 0){callback("error")}            

            var datachunk_encoded = xcp_rc4(total_utxo[0].txid, datachunk_unencoded);
            var scriptstring = "OP_RETURN "+datachunk_encoded;
            
            var feeSatoshis = parseInt(transfee * 100000000)

            var tx = new bitcoinjs.TransactionBuilder(NETWORK);   

            //inputs
            for (i = 0; i < total_utxo.length; i++) {  
                tx.addInput(total_utxo[i].txid, total_utxo[i].vout) 
            }
            console.log(total_utxo);

            //outputs            
//            var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
//            console.log(btc_total_satoshis);

            //tx.addOutput(add_to, btc_total_satoshis)

            ret = bitcoinjs.script.fromASM(scriptstring)
            tx.addOutput(ret, 0)

            console.log(satoshi_change);
            if (satoshi_change > 5459) {
                tx.addOutput(add_from, satoshi_change)
            }

            var privkey = getprivkey(add_from, mnemonic); 
            var key = bitcoinjs.ECPair.fromWIF(privkey, NETWORK);
            tx.sign(0, key);


            var final_trans = tx.build().toHex();

            console.log(final_trans)
            callback(final_trans)  //push raw tx to the bitcoin network

        })

    })    

}


function sendRawSignedTx(rawtx, callback) {
    
    var pushtx = {
      tx: rawtx
    };
  
    $.post('https://api.blockcypher.com/v1/btc/main/txs/push', JSON.stringify(pushtx)).then(function(d) {
        console.log(d)
        callback("success", d.tx.hash)
    })
    .fail(function(response) {
        callback("error", "") //otherwise, some other code was returned
    });
  
}

function signMessage(address, passphrase, msg, callback){
 
    var privkey = getprivkey(address, passphrase) 
    var keyPair = bitcoinjs.ECPair.fromWIF(privkey)
    var privateKeyBuffer = keyPair.d.toBuffer(32);

    var signature = bitcoinMessage.sign(msg, privateKeyBuffer, keyPair.compressed)
    console.log(signature.toString('base64'))
      
    callback(signature.toString('base64'))
 
 }

function getUnconfirmed(address, callback){
    
        var source_html = "https://api.blockcypher.com/v1/btc/main/addrs/"+address
    
        //console.log("wait 2 seconds")
        setTimeout(function(){
         
            $.getJSON( source_html, function( data ) { 

                //console.log("get unconfirmed")

                var txs = new Array()
                var txData = new Object()
                
                var txHash

                if(data.unconfirmed_n_tx > 0 && data.unconfirmed_txrefs){
                    for(var i=0; i < data.unconfirmed_txrefs.length; i++)  {
                        txHash = data.unconfirmed_txrefs[i]["tx_hash"]
//                        txs.push(txHash)
                        
                        txData[txHash] = data.unconfirmed_txrefs[i]
                        
                    }

//                    txs = txs.filter(function(item, pos, self) {
//                        return self.indexOf(item) == pos;
//                    })
                }

                getUnconfirmedXCP(address, txData, function(txs_parsed){
                    callback(txs_parsed)
                })

            }).fail(function() { callback(0) })
        
        }, 1000)
}



function getUnconfirmedXCP(address, txDataBTC, callback){
    
    var source_html = "https://xchain.io/api/mempool/"+address;

    $.getJSON( source_html, function( data ) { 

       // console.log(data)
        
        var btc_txs = Object.keys(txDataBTC)
        //console.log(btc_txs)
        var txs_parsed = new Array()
        var xcp_tx_hashes = new Array()
        var xcp_txs = data.data
        var txtype
        
        for(var j=0; j < data.total; j++){
            txtype = xcp_txs[j].tx_type
            if(txtype == "Send"){
                if(address == xcp_txs[j].destination){
                    txtype = "Receive"
                }
            }
            
            xcp_tx_hashes.push(xcp_txs[j].tx_hash)
            txs_parsed.push({data: xcp_txs[j], txid: xcp_txs[j].tx_hash, txtype: txtype})  
        }
        
        var remaining_txs = btc_txs.diff(xcp_tx_hashes)
        
        for(var i=0; i < remaining_txs.length; i++){
            txs_parsed.push({data: txDataBTC[remaining_txs[i]], txid: remaining_txs[i], txtype: "BTC"}) 
        }
        
        callback({data: txs_parsed, count: txs_parsed.length})

    })
}

function updateUnconfirmed(data){
    
    var address = $("#body").data("address")
    
    //load unconfirmed
    $("#unconfirmed-tx-dropdown-count").html(data.count)
    if(data.count > 0){
        $("#unconfirmed-tx-dropdown-button").removeClass("btn-dark").addClass("btn-danger")
    } else {
        $("#unconfirmed-tx-dropdown-button").removeClass("btn-danger").addClass("btn-dark") 
    }
    
    var txDisplay = "<div style='margin: -8px 0 -8px 0;'>"
    
    for(var i=0; i < data.count; i++){
        
        txDisplay += "<button class='dropdown-item unconfirmed-tx-dropdown-item' type='button' style='border-bottom: 1px solid #fff;' data-txid='"+data.data[i].txid+"'>"
        txDisplay += "<div style='padding: 10px 0 10px 0'>"
        txDisplay += "<div class='row' style='margin-bottom: 5px; font-size: 12px;'><div class='col-3' style='font-weight: bold;'>Tx Type:</div><div class='col-9' style='text-align: left;'>"+data.data[i].txtype+"</div></div>"

        if(data.data[i].txtype == "Send" || data.data[i].txtype == "Receive"){
            
            if(data.data[i].txtype == "Send"){var isSend = true} else {var isSend = false}
            
            txDisplay += "<div class='row' style='font-size: 12px'>"
            
            if(isSend){
                txDisplay += "<div class='col-3' style='font-weight: bold;'>Sent:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.asset+"</div>"
            } else {
                txDisplay += "<div class='col-3' style='font-weight: bold;'>Received:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.asset+"</div>"
            }
            
            txDisplay += "</div>"
            txDisplay += "<div class='row' style='margin-bottom: 5px; font-size: 12px;'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Amount:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.quantity+"</div>"
            txDisplay += "</div>"  
            txDisplay += "<div class='row' style='font-size: 12px; margin-bottom: 5px;'>"
            
            if(isSend){
                txDisplay += "<div class='col-3' style='font-weight: bold;'>Sent To:</div><div class='col-9' style='text-align: left; vertical-align: bottom;'>"+data.data[i].data.destination+"</div>"
            } else {
                txDisplay += "<div class='col-3' style='font-weight: bold;'>Received From:</div><div class='col-9' style='text-align: left; vertical-align: bottom;'>"+data.data[i].data.source+"</div>"
            }
            
            txDisplay += "</div>" 
            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>TX ID:</div><div class='col-9' style='text-align: left;'>"+(data.data[i].txid).slice(0, 32)+"...</div>"
            txDisplay += "</div>"
            txDisplay += "</div>" 
            txDisplay += "</button>" 
            
        } else if(data.data[i].txtype == "Order"){ 

            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Get:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.get_asset+"</div>"
            txDisplay += "</div>"
            txDisplay += "<div class='row' style='margin-bottom: 5px; font-size: 12px;'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Amount:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.get_quantity+"</div>"
            txDisplay += "</div>"  
            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Give:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.give_asset+"</div>"
            txDisplay += "</div>"
            txDisplay += "<div class='row' style='margin-bottom: 5px; font-size: 12px;'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Amount:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.give_quantity+"</div>"
            txDisplay += "</div>"  
            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>TX ID:</div><div class='col-9' style='text-align: left;'>"+(data.data[i].txid).slice(0, 32)+"...</div>"
            txDisplay += "</div>"
            txDisplay += "</div>" 
            txDisplay += "</button>"   
            
        } else if(data.data[i].txtype == "BTC"){
            
            //console.log(data)
            
            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>Sent/Received:</div><div class='col-9' style='text-align: left;'>BTC</div>"
            txDisplay += "</div>"
            
//            txDisplay += "<div class='row' style='margin-bottom: 5px; font-size: 12px;'>"
//            txDisplay += "<div class='col-3' style='font-weight: bold;'>Amount:</div><div class='col-9' style='text-align: left;'>"+data.data[i].data.quantity+"</div>"
//            txDisplay += "</div>"  
//            txDisplay += "<div class='row' style='font-size: 12px; margin-bottom: 5px;'>"
//            
//            if(isSend){
//                txDisplay += "<div class='col-3' style='font-weight: bold;'>Sent To:</div><div class='col-9' style='text-align: left; vertical-align: bottom;'>"+data.data[i].data.destination+"</div>"
//            } else {
//                txDisplay += "<div class='col-3' style='font-weight: bold;'>Received From:</div><div class='col-9' style='text-align: left; vertical-align: bottom;'>"+data.data[i].data.source+"</div>"
//            }
//            
//            txDisplay += "</div>" 
            txDisplay += "<div class='row' style='font-size: 12px'>"
            txDisplay += "<div class='col-3' style='font-weight: bold;'>TX ID:</div><div class='col-9' style='text-align: left;'>"+(data.data[i].txid).slice(0, 32)+"...</div>"
            txDisplay += "</div>"
            txDisplay += "</div>" 
            txDisplay += "</button>"             
            
        } else {
            
        }
        
    }
    
    txDisplay += "</div>"
    
    if(data.count == 0){
        txDisplay = '<button class="dropdown-item unconfirmed-tx-dropdown-item" type="button" style="text-align: center;" disabled>No unconfirmed transactions</button>'
    }

    $("#unconfirmed-tx-dropdown").html(txDisplay)
    

    
    
}


function sendBTC_test(add_from, add_to, sendtotal, transfee, mnemonic, callback){
 
    var amountremaining = ((parseFloat(sendtotal) * 100000000) + (parseFloat(transfee)*100000000))/100000000;
        
    getutxos(add_from, mnemonic, amountremaining, function(total_utxo, satoshi_change){ 
 
        if(total_utxo.length == 0){callback("error")}            

        var sendtotal_satoshis = parseFloat(sendtotal).toFixed(8) * 100000000  
        sendtotal_satoshis = Math.round(sendtotal_satoshis)

        var feeSatoshis = parseInt(transfee * 100000000)

        var tx = new bitcoinjs.TransactionBuilder(NETWORK);   

        //inputs
        for (i = 0; i < total_utxo.length; i++) {  
            tx.addInput(total_utxo[i].txid, total_utxo[i].vout) 
        }
        console.log(total_utxo);

        //outputs            
        tx.addOutput(add_to, sendtotal_satoshis)

        console.log(satoshi_change);
        if (satoshi_change > 5459) {
            tx.addOutput(add_from, satoshi_change)
        }

        var privkey = getprivkey(add_from, mnemonic); 
        var key = bitcoinjs.ECPair.fromWIF(privkey, NETWORK);
        tx.sign(0, key);


        var final_trans = tx.build().toHex();

        console.log(final_trans)
        callback(final_trans)  //push raw tx to the bitcoin network     

    })    

}

function createOrder_opreturn_test(add_from, sell_asset, sell_asset_div, sell_qty, buy_asset, buy_asset_div, buy_qty, expiration, transfee, mnemonic, callback) {
    
    console.log(sell_qty)
    
    if(sell_asset_div == 1 || sell_asset_div == "yes" ){
        sell_qty = Math.round(sell_qty * 100000000);
        console.log(sell_qty)
    } else {
        sell_qty = parseInt(sell_qty);   
    }
    
    
    if(buy_asset_div == 1 || buy_asset_div == "yes" ){
        buy_qty = Math.round(buy_qty * 100000000);
    } else {
        buy_qty = parseInt(buy_qty);
    } 
    console.log(buy_qty)     
    
    
    getutxos(add_from, mnemonic, transfee, function(total_utxo, satoshi_change){ 
        
        create_order_data(sell_asset, sell_qty, buy_asset, buy_qty, expiration, function(datachunk_unencoded){
        
            var utxo_key = total_utxo[0].txid
            var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

            var bytelength = datachunk_encoded.length / 2;

            var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded; 
            var scriptstring2 = "OP_RETURN "+datachunk_encoded;
            console.log(scriptstring);

            
            var feeSatoshis = transfee * 100000000
            console.log(feeSatoshis)
            
            var transaction = new bitcore.Transaction().fee(feeSatoshis);
            var tx = new rarest.bitcoin.TransactionBuilder(NETWORK_BJS); 

            for (i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
                tx.addInput(total_utxo[i].txid, total_utxo[i].vout) 
            }

            console.log(total_utxo);

            var data_script = new bitcore.Script(scriptstring);
            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 
            transaction.addOutput(xcpdata_opreturn);
            
            ret = rarest.bitcoin.script.fromASM(scriptstring2)
            tx.addOutput(ret, 0)

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
                tx.addOutput(add_from, satoshi_change)
            }

            //bitcore
            var privkey = getprivkey(add_from, mnemonic) 
            transaction.sign(privkey)
            //rarest
            var key = rarest.bitcoin.ECPair.fromWIF(privkey, NETWORK_BJS);
            tx.sign(0, key);

            var final_trans_rarest = tx.build().toHex();
            var final_trans_bitcore = transaction.uncheckedSerialize()

            console.log(final_trans_rarest)
            console.log(final_trans_bitcore)

            if(final_trans_rarest == final_trans_bitcore){console.log("same")}
            
            //callback(final_trans);
 
        });
    
    });
    
}
