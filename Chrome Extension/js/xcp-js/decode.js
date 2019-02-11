
function get_xcp_encoded(tx_id, callback) {
    
    var source_html = "https://blockchain.info/rawtx/"+tx_id+"?format=json&cors=true";
    
    var target_tx = new Array(); 
     
    $.getJSON( source_html, function( target_tx ) {
        
        var tx_index = target_tx.inputs[0].prev_out.tx_index;
        
        //console.log(tx_index);
                  
        $.each(target_tx['out'], function(i, item) {
            
            if ("addr3" in target_tx['out'][i]){
                var target_script = target_tx['out'][i].script;
                var haystack = target_script;
                
                //address_from_pubkeyhash(haystack.substring(70, 4));
    
                var finddata = haystack.substring(68, 6);
                
                finddata += haystack.substring(136, 74);
    
                var xcp_pubkey_data = finddata;
                
                console.log(xcp_pubkey_data);
                
                var source_html_tx_index = "https://blockchain.info/tx-index/"+tx_index+"?format=json&cors=true";
    
                    $.getJSON( source_html_tx_index, xcp_pubkey_data, function( data ) {
        
                        //console.log(data.hash);
                        //console.log(xcp_pubkey_data);
        
                        var xcp_decoded = xcp_rc4(data.hash, xcp_pubkey_data);
        
                        callback(data.hash, xcp_decoded);
        
                    });
                
            }
            
            
        });
            
    });
        
}

function get_xcp_encoded_opreturn(tx_id, callback) {
    
    
    var source_html = "https://chain.so/api/v2/get_tx/BTC/"+tx_id;
    //var source_html = "https://blockchain.info/rawtx/"+tx_id+"?format=json&cors=true";
    
    var target_tx = new Array(); 
     
    $.getJSON( source_html, function( target_tx ) {
        
        var tx_index = target_tx.data.inputs[0].from_output.txid;
        //var tx_index = target_tx.inputs[0].prev_out.tx_index;
        
        //console.log(tx_index);
                  
        $.each(target_tx.data.outputs, function(i, item) {
            
            if ((target_tx.data.outputs[i].address == "nonstandard")){
                var target_script = target_tx.data.outputs[i].script;
                var xcp_pubkey_data = target_script.substring(10);
                

                
                var source_html_tx_index = "https://chain.so/api/v2/get_tx/BTC/"+tx_index;
    
                    $.getJSON( source_html_tx_index, xcp_pubkey_data, function( data ) {
        
                        //console.log(data.hash);
                        //console.log(xcp_pubkey_data);
        
                        var xcp_decoded = xcp_rc4(data.data.txid, xcp_pubkey_data);

			            xcp_decoded = "1c"+xcp_decoded; //add first byte to simulate OP_CHECKMULTISIG
        
                        callback(data.data.txid, xcp_decoded);
        
                    });
                
            }
            
            
        });
            
    });
        
}
    

