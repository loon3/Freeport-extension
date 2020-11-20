function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Number.prototype.toTimeFormat = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var days   = Math.floor(sec_num / (3600*24));
    var hours   = Math.floor((sec_num - (days*(3600*24))) / 3600);
    var minutes = Math.floor((sec_num - (days*(3600*24)) - (hours * 3600)) / 60);
    var seconds = sec_num - (days*(3600*24)) - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (days < 10) {days = "0"+days;}

//    if (days > 0) {
        return days + "d " + hours + "h " + minutes + "m"
//    } else if (hours > 0) {
//        return hours + "h " + minutes + "m"
//    } else {
//        return minutes + "m"
//    }

    //return days+":"+hours+":"+minutes;

}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function isInt(n) {
   return n % 1 === 0;
}

function retr_dec(num) {
  return (num.split('.')[1] || []).length;
}

(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();



function gup(name) {
    var url = location.href
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
    var regexS = "[\\?&]"+name+"=([^&#]*)"
    var regex = new RegExp( regexS )
    var results = regex.exec( url )
    return results == null ? null : results[1]
}

function checkForUrlParams() {
    if(document.location.search.length) {
        // query string exists
        return true
    } else {
        // no query string exists
        return false
    }
}

function isABootstrapModalOpen() {
    return $('.modal.in').length > 0;
}

function collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function halfStringByWord(s){

    var middle = Math.floor(s.length / 2);
    var before = s.lastIndexOf(' ', middle);
    var after = s.indexOf(' ', middle + 1);

    if (middle - before < after - middle) {
        middle = before;
    } else {
        middle = after;
    }

    var s1 = s.substr(0, middle);
    var s2 = s.substr(middle + 1);
    
    var splitArray = [s1, s2]
    
    return splitArray
    

}

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function mnemonicToGc(mnemonic_string){
    
    var mnemonic_array = mnemonic_string.split(" ")
    
    //console.log(mnemonic_array)
    
    var m = Mnemonic.fromWords(mnemonic_array)
    var hex = m.toHex()
    
    //console.log(hex)
    var hex_array = chunkString(hex, 8)
    
    //console.log(hex_array)

    var gc = ""

    for(i=0; i < hex_array.length; i++){
        if((i+1) == hex_array.length){
            gc += hex_array[i]
        } else {
            gc += hex_array[i]+"-"
        }
    }

    return gc
}

function gcToMnemonic(gc){
	var gc_array = gc.split("-")
    var hex = gc_array.join("")
    m = Mnemonic.fromHex(hex);
    var str = m.toWords().toString()
    var res = str.replace(/,/gi, " ");

    return res
}

function getPepeImage(asset, callback){
    var source_html = window.location.pathname+"php/getPepeImage.php?asset="+asset;
    
    $.getJSON( source_html, function( data ) { 
        callback(data.img)
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasDuplicate(arr) {
    var i = arr.length, j, val;

    while (i--) {
        val = arr[i];
        j = i;
        while (j--) {
            if (arr[j] === val) {
                return true;
            }
        }
    }
    return false;
}

function css(selector, property, value) {
    for (var i=0; i<document.styleSheets.length;i++) {//Loop through all styles
        //Try add rule
        try { document.styleSheets[i].insertRule(selector+ ' {'+property+':'+value+'}', document.styleSheets[i].cssRules.length);
        } catch(err) {try { document.styleSheets[i].addRule(selector, property+':'+value);} catch(err) {}}//IE
    }
}

function removeDuplicateObjects( arr, prop ) {
  let obj = {};
  return Object.keys(arr.reduce((prev, next) => {
    if(!obj[next[prop]]) obj[next[prop]] = next; 
    return obj;
  }, obj)).map((i) => obj[i]);
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

function base64ToHex(str) {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        let tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1) tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}

function imageToHash(url, callback){
  toDataURL(url, function(dataUrl) {
      
    var hash_sha256 = toHexString(bitcoinjs.crypto.ripemd160(dataUrl))
    console.log(hash_sha256)
    callback(hexToBase64(hash_sha256))
    
  })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//function concatToStorage(storage_type, target, data){
//    
//    if(storage_type = "session"){
//        var existingData = $.parseJSON(sessionStorage.getItem(target))
//        existingData.push(data)
//        sessionStorage.setItem(target, existingData)
//    }
//    if(storage_type = "local") {
//        var existingData = $.parseJSON(localStorage.getItem(target))
//        existingData.push(data)
//        localStorage.setItem(target, existingData)
//    }
//    
//
//    
//}














