function create_order_data(sell_asset, sell_qty, buy_asset, buy_qty, expiration, callback){
    
    var prefix = "434e5452505254590000000a"; //CNTRPRTY + transaction id (10)

    var sell_asset_id = assetid(sell_asset); 
    var buy_asset_id = assetid(buy_asset); 
    
    var sell_asset_id_hex = padprefix(sell_asset_id, 16);
    var buy_asset_id_hex = padprefix(buy_asset_id, 16);
    
    if(expiration > 0 && expiration < 65535) {
        var expiration_hex = padprefix(parseInt(expiration).toString(16),4);
    } else {
        //default to 1000 blocks if out of allowable range
        var expiration_hex = padprefix((1000).toString(16),4);
    }
    
    var sell_qty_hex = padprefix((parseInt(sell_qty)).toString(16), 16);
    var buy_qty_hex = padprefix((parseInt(buy_qty)).toString(16), 16);
    
    console.log("sell_asset: "+sell_asset_id_hex)
    console.log("sell_qty: "+sell_qty_hex)
    console.log("buy_asset: "+buy_asset_id_hex)
    console.log("buy_qty: "+buy_qty_hex)
    console.log("expiration: "+expiration_hex)

    var data = prefix + sell_asset_id_hex + sell_qty_hex + buy_asset_id_hex + buy_qty_hex + expiration_hex + "0000000000000000";

    console.log(data)

    callback(data);
            
}


function createOrder_opreturn(add_from, sell_asset, sell_asset_div, sell_qty, buy_asset, buy_asset_div, buy_qty, expiration, transfee, mnemonic, callback) {
    
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
            console.log(scriptstring);

            var data_script = new bitcore.Script(scriptstring);
            //var transaction = new bitcore.Transaction();
            
            var feeSatoshis = transfee * 100000000
            console.log(feeSatoshis)
            
            var transaction = new bitcore.Transaction().fee(feeSatoshis);

            for (i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
            }

            console.log(total_utxo);

            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 

            transaction.addOutput(xcpdata_opreturn);

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
            }

            var privkey = getprivkey(add_from, mnemonic) 
            transaction.sign(privkey);

            var final_trans = transaction.uncheckedSerialize();

            console.log(final_trans)
            
            callback(final_trans);
 
        });
    
    });
    
}

function create_btcpay_data(order_txid_0, order_txid_1, callback){
    
    var prefix = "434e5452505254590000000b"; //CNTRPRTY + transaction id (11)

    var data = prefix + order_txid_0 + order_txid_1

    console.log(data)

    callback(data);  
   
}

function btcpay_opreturn(add_from, add_to, sell_qty, order_txid_0, order_txid_1, transfee, mnemonic, callback) {
    
    console.log(order_txid_0)
    console.log(order_txid_1)
    
    var amountremaining = (parseFloat(transfee)+parseFloat(sell_qty))/100000000;
    console.log(amountremaining)
    
    getutxos(add_from, mnemonic, amountremaining, function(total_utxo, satoshi_change){ 
            
        create_btcpay_data(order_txid_0, order_txid_1, function(datachunk_unencoded){
        
            if (datachunk_unencoded != "error") {
                
                var utxo_key = total_utxo[0].txid;
                
                var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

                var bytelength = datachunk_encoded.length / 2;
                
                var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded;      
                console.log(scriptstring);
                
                var data_script = new bitcore.Script(scriptstring);
                var transaction = new bitcore.Transaction().fee(transfee);

                for (i = 0; i < total_utxo.length; i++) {
                    transaction.from(total_utxo[i]);     
                }

                console.log(total_utxo);
                
                var btc_total_satoshis = sell_qty;
                transaction.to(add_to, btc_total_satoshis);

                var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 
                transaction.addOutput(xcpdata_opreturn);

                console.log(satoshi_change);

                if (satoshi_change > 5459) {
                    transaction.change(add_from);
                }
      
                var privkey = getprivkey(add_from, mnemonic);
                transaction.sign(privkey);

                var final_trans = transaction.uncheckedSerialize();
             
            } else {

                var final_trans = "error";

            }

            console.log(final_trans);
            
            callback(final_trans);
                      
        });
    
    });
    
}



function cancelOrder_opreturn(add_from, order_txid, transfee, mnemonic, callback) {
    
    getutxos(add_from, mnemonic, transfee, function(total_utxo, satoshi_change){ 
                     
        var utxo_key = total_utxo[0].txid;

        var datachunk_unencoded = "434e54525052545900000046"+order_txid;
        
        console.log(datachunk_unencoded);
        
        if (datachunk_unencoded.length == 88) {

            var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

            var bytelength = datachunk_encoded.length / 2;

            var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded;      
            console.log(scriptstring);

            var feeSatoshis = transfee * 100000000
            console.log(feeSatoshis)
            
            var data_script = new bitcore.Script(scriptstring);
            //var transaction = new bitcore.Transaction();
            var transaction = new bitcore.Transaction().fee(feeSatoshis);

            for (i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
            }

            console.log(total_utxo);

            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 

            transaction.addOutput(xcpdata_opreturn);

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
            }
            
            var privkey = getprivkey(add_from, mnemonic);
            transaction.sign(privkey);

            var final_trans = transaction.uncheckedSerialize();

        } else {

            var final_trans = "error";

        }

        console.log(final_trans);
        
        callback(final_trans);


    });
    
}

