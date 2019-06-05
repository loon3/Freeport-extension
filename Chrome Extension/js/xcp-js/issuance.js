 //createIssuance_opreturn("address", "asset", 0, "false", "LOCK", 0.0003, "passphrase")



function create_new_assetid() {
         
        var assetid = "A111";
          
        for (var i = 1; i < 18; i++) {
            assetid += randomIntFromInterval(0,9);
        };
    
    //26^12 + 1 and 256^8
    
        var lowerlimit = BigIntegerSM(26).pow(12);
        lowerlimit = BigIntegerSM(lowerlimit).add(1);
    
        var upperlimit = BigIntegerSM(256).pow(8);
    
        //console.log(BigIntegerSM.toJSValue(lowerlimit));
        //console.log(BigIntegerSM.toJSValue(upperlimit));
        
        return assetid;
    
}

function uniqueAssetCheck(resolve, reject) {

    var assetid = create_new_assetid()
    //console.log(assetid)

    var source_html = "https://xchain.io/api/asset/"+assetid;

    $.getJSON( source_html, function( data ) {
        if(data.error) { //asset is unique
            resolve(assetid);
        } else { 
            reject()  
        }  
    });

}

function getUniqueAsset(callback){
    
    new Promise((r, j) => {
        uniqueAssetCheck(r, j);
    }).then((result) => {
        callback(result)
    });
    
}

function is_asset_unique(add_from, assetid, quantity, divisible, description, callback){
    
    var checkdiv = "no";
    
    var source_html = "https://xchain.io/api/asset/"+assetid;
    
    $.getJSON( source_html, function( data ) {
        
        console.log(data.success);
        
        if(data.error) { //asset is unique
            
            callback(assetid, checkdiv);
            
        } else { //asset is not unique
            
            var issue_addr = data.issuer;
            
            if(add_from == issue_addr) {
                
                checkDivisibility(assetid, function(result){       
            
                    callback(assetid, result);
                    
                });
                
            } else {
            
                callback("error", checkdiv);
                
            }
            
        }
        
    });
    
}


function create_asset_unique(add_from, assetid_new, quantity, divisible, description, callback){
    
    if (assetid_new == "A") {
    
        var newasset = create_new_assetid();
        
    } else {
        
        var newasset = assetid_new;
        
    }
    
    is_asset_unique(add_from, newasset, quantity, divisible, description, function(assetid_unique, checkdiv){
              
        if (assetid_unique != "error") {
            
            if(checkdiv != "no"){
                
                divisible = checkdiv;
                
            }
            
            console.log("Divisible: "+divisible);
            
            console.log("Unique Asset ID: "+assetid_unique);

            var issuance_data = create_issuance_data_opreturn(assetid_unique, quantity, divisible, description);

            console.log(issuance_data);
            console.log(issuance_data.length);

            callback(issuance_data);

            
        } else {
            
            callback("error");
            
        }
        
    });

}






function create_issuance_data_opreturn(asset, quantity, divisible, description) {
    
    //max 22 character description for single OP_CHECKMULTISIG output
    //divisible asset quantity must be less than 184467440737.09551615 and non-divisible less than 18446744073709551615 to be stored as an 8-byte hexadecimal
    
    if (divisible == true || divisible == "true") {
        var quantity_int = parseFloat(quantity).toFixed(8) * 100000000;
        var divisible_hex = "01000000000000000000";
    } else {
        var quantity_int = parseFloat(quantity); 
        var divisible_hex = "00000000000000000000";
    }
    
    quantity_int = Math.round(quantity_int);
    
    
    if (quantity_int <= 18446744073709551615) {
    
        if (description.length <= 41) {

            var cntrprty_prefix = "434e545250525459"; 
            var trans_id = "00000014";

            var descriptionlength = description.length;
            var descriptionlength_hex = padprefix(descriptionlength.toString(16),2);
            
            var assetid_prepad = assetid(asset);

            var assetid_hex = padprefix(assetid_prepad,16);

            var quantity_hex = padprefix(quantity_int.toString(16),16);

            var description_hex = bin2hex(description);

            var issuance_tx_data = cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + descriptionlength_hex + description_hex;
            
            console.log(issuance_tx_data.length);

            if(issuance_tx_data.length <= 160){
                return issuance_tx_data;
            } else {
                
                var error = "error";
                return error;
                
            }

        } else {

            var error = "error";
            return error;

        }
        
    
    }
    
}





function createIssuance_opreturn(add_from, assetid, quantity, divisible, description, transfee, mnemonic, callback) {
        
    var amountremaining = (parseFloat(transfee)*100000000)/100000000;
        
    getutxos(add_from, mnemonic, amountremaining, function(total_utxo, satoshi_change){ 
            
        var datachunk_unencoded = create_issuance_data_opreturn(assetid, quantity, divisible, description);
        
        if (datachunk_unencoded != "error") {

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
            tx.addOutput(bitcoinjs.script.fromASM(scriptstring), 0)

            console.log(satoshi_change);
            if (satoshi_change > 5459) {
                tx.addOutput(add_from, satoshi_change)
            }

            var privkey = getprivkey(add_from, mnemonic); 
            var key = bitcoinjs.ECPair.fromWIF(privkey, NETWORK);
            tx.sign(0, key);

            var final_trans = tx.buildIncomplete().toHex();

            callback(final_trans)  //push raw tx to the bitcoin network

        } else {

            var final_trans = "error";

        }

        console.log(final_trans);
        
    });
    
    
}


function create_issuance_data(assetid, quantity, divisible, description) {
    
    //max 22 character description for single OP_CHECKMULTISIG output
    //divisible asset quantity must be less than 184467440737.09551615 and non-divisible less than 18446744073709551615 to be stored as an 8-byte hexadecimal
    
    if (divisible == true || divisible == "true") {
        var quantity_int = parseFloat(quantity).toFixed(8) * 100000000;
        var divisible_hex = "01000000000000000000";
    } else {
        var quantity_int = parseFloat(quantity); 
        var divisible_hex = "00000000000000000000";
    }
    
    quantity_int = Math.round(quantity_int);
    
    
    if (quantity_int <= 18446744073709551615) {
    
        if (description.length <= 22) {

            var cntrprty_prefix = "434e545250525459"; 
            
            var trans_id = "00000014";
            //test short
            //var trans_id = "14";
            
            var descriptionlength = description.length;
            var descriptionlength_hex = padprefix(descriptionlength.toString(16),2);

            var initiallength = parseFloat(descriptionlength) + 39;
            var initiallength_hex = padprefix(initiallength.toString(16),2);

            var assetid_prehex = decToHex(assetid);

            console.log(assetid_prehex);
            console.log(assetid_prehex.substr(2));

            var assetid_hex = padprefix(assetid_prehex.substr(2),16);

            var quantity_hex = padprefix(quantity_int.toString(16),16);

            var description_hex_short = bin2hex(description);
            var description_hex = padtrail(description_hex_short, 44);

            var issuance_tx_data = initiallength_hex + cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + descriptionlength_hex + description_hex;

            return issuance_tx_data;

        } else if (description.length > 22 && description.length <= 75) {

            var cntrprty_prefix = "434e545250525459"; 
            var trans_id = "00000014";

            //var descriptionlength = 41;
            var descriptionlength = description.length;
            var descriptionlength_hex = padprefix(descriptionlength.toString(16),2);

            var initiallength = 61;
            var initiallength_hex = padprefix(initiallength.toString(16),2);

            //var secondlength = 27;
            var secondlength = descriptionlength - 14;
            var secondlength_hex = padprefix(secondlength.toString(16),2);


            var assetid_prehex = decToHex(assetid);

            console.log(assetid_prehex);
            console.log(assetid_prehex.substr(2));

            var assetid_hex = padprefix(assetid_prehex.substr(2),16);

            var quantity_hex = padprefix(quantity_int.toString(16),16);

            var description_hex_short_a = bin2hex(description.substr(0,22));
            var description_hex_a = padtrail(description_hex_short_a, 44);

            var description_hex_short_b = bin2hex(description.substr(22));
            var description_hex_b = padtrail(description_hex_short_b, 106);

            var issuance_tx_data_a = initiallength_hex + cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + descriptionlength_hex + description_hex_a;

            var issuance_tx_data_b = secondlength_hex + cntrprty_prefix + description_hex_b;

            console.log("msig output 1 length: "+issuance_tx_data_a.length);
            console.log("msig output 2 length: "+issuance_tx_data_b.length);

            var issuance_tx_data = [issuance_tx_data_a, issuance_tx_data_b];

            return issuance_tx_data;

        }
        
    if (description.length > 75) {
        
        var error = "error";
        return error;
        
    }
    
    }
    
}


//function createIssuance(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs) {
//       
//    //var mnemonic = $("#newpassphrase").html();
//    
//    var privkey = getprivkey(add_from, mnemonic);
//     
//    var source_html = "https://"+INSIGHT_SERVER+"/api/addr/"+add_from+"/utxo";
//    var total_utxo = new Array();   
//       
//    $.getJSON( source_html, function( data ) {
//        
//        var amountremaining = parseFloat(msig_total) + parseFloat(transfee);
//        
//        if (msig_outputs > 1) {
//        
//            amountremaining += ((msig_outputs - 1) * msig_total);
//        
//        }
//        
//        data.sort(function(a, b) {
//            return b.amount - a.amount;
//        });
//        
//        $.each(data, function(i, item) {
//            
//             var txid = data[i].txid;
//             var vout = data[i].vout;
//             var script = data[i].scriptPubKey;
//             var amount = parseFloat(data[i].amount);
//             
//             amountremaining = amountremaining - amount;            
//             amountremaining.toFixed(8);
//    
//             var obj = {
//                "txid": txid,
//                "address": add_from,
//                "vout": vout,
//                "scriptPubKey": script,
//                "amount": amount
//             };
//            
//             total_utxo.push(obj);
//              
//             //dust limit = 5460 
//            
//             if (amountremaining == 0 || amountremaining < -0.00005460) {                                 
//                 return false;
//             }
//             
//        });
//    
//        var utxo_key = total_utxo[0].txid;
//        
//        if (amountremaining < 0) {
//            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
//        } else {
//            var satoshi_change = 0;
//        }
//    
//        create_asset_unique(assetid, quantity, divisible, description, function(datachunk_unencoded){
//        
//            if (datachunk_unencoded != "error") {
//                
//                if ($.isArray(datachunk_unencoded) == false) {
//        
//                    var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
//                    var address_array = addresses_from_datachunk(datachunk_encoded);
//
//                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
//
//                    var scriptstring = "OP_1 33 0x"+address_array[0]+" 33 0x"+address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
//                    console.log(scriptstring);
//                    var data_script = new bitcore.Script(scriptstring);
//
//                    var transaction = new bitcore.Transaction();
//
//                    for (i = 0; i < total_utxo.length; i++) {
//                        transaction.from(total_utxo[i]);
//                    }
//
//                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
//
//                    var xcpdata_msig = new bitcore.Transaction.Output({script: data_script, satoshis: msig_total_satoshis}); 
//
//                    transaction.addOutput(xcpdata_msig);
//
//                    if (satoshi_change > 5459) {
//                        transaction.to(add_from, satoshi_change);
//                    }
//
//                    transaction.sign(privkey);
//
//                    var final_trans = transaction.serialize();
//                    
//                } else {
//                    
//                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
//                    
//                    var transaction = new bitcore.Transaction();
//
//                    for (i = 0; i < total_utxo.length; i++) {
//                        transaction.from(total_utxo[i]);
//                    }
//
//                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
//                    
//                    
//                    var first_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[0]);
//                    var first_address_array = addresses_from_datachunk(first_datachunk_encoded);
//                    
//                    var second_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[1]);
//                    var second_address_array = addresses_from_datachunk(second_datachunk_encoded);
//
//                    var first_scriptstring = "OP_1 33 0x"+first_address_array[0]+" 33 0x"+first_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
//                    console.log(first_scriptstring);
//                    var first_data_script = new bitcore.Script(first_scriptstring);
//                    
//                    var second_scriptstring = "OP_1 33 0x"+second_address_array[0]+" 33 0x"+second_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
//                    console.log(second_scriptstring);
//                    var second_data_script = new bitcore.Script(second_scriptstring);
//
//                    
//
//                    var xcpdata_msig_first = new bitcore.Transaction.Output({script: first_data_script, satoshis: msig_total_satoshis});
//                    var xcpdata_msig_second = new bitcore.Transaction.Output({script: second_data_script, satoshis: msig_total_satoshis}); 
//
//                    transaction.addOutput(xcpdata_msig_first);
//                    transaction.addOutput(xcpdata_msig_second);
//
//                    if (satoshi_change > 5459) {
//                        transaction.to(add_from, satoshi_change);
//                    }
//
//                    transaction.sign(privkey);
//
//                    var final_trans = transaction.serialize();
//                    
//                }
//
//            } else {
//
//                var final_trans = "error";
//
//            }
//
//            console.log(final_trans);
//        
//            //sendBTCissue(final_trans);  //uncomment to push raw tx to the bitcoin network
//            
//        });
//
//    });
//    
//}
