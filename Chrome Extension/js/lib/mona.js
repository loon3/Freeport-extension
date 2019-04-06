const coininfo = require('coininfo');
var monacoinInfo = coininfo.monacoin.main.toBitcoinJS();
const monacoinNetwork = {
    messagePrefix: '\x19' + monacoinInfo.name + ' Signed Message:\n',
    bip32: {
        public: monacoinInfo.bip32.public,
        private: monacoinInfo.bip32.private
    },
    pubKeyHash: monacoinInfo.pubKeyHash,
    scriptHash: monacoinInfo.scriptHash,
    wif: monacoinInfo.wif
}


function testMona(passphrase_string, i){
    
    var passphrase_array = passphrase_string.split(" ")
    m = Mnemonic.fromWords(passphrase_array)
    
    var node = bitcoinjs.HDNode.fromSeedHex(m.toHex(), monacoinNetwork)
    
    var child = node.deriveHardened(0)
      .derive(0)
      .derive(i)
    
    var publickey = child.getAddress()

    return publickey
    
}