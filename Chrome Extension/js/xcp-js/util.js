//from convert-type.js

function hex2bin(hex) {

        var bytes = [];
        var str;
        
        for (var i = 0; i < hex.length - 1; i += 2) {

                var ch = parseInt(hex.substr(i, 2), 16);
                bytes.push(ch);

        }

        str = String.fromCharCode.apply(String, bytes);
        return str;
    
};

function bin2hex(s) {

        // http://kevin.vanzonneveld.net

        var i, l, o = "",
                n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
        }

        return o;
    
}; 

function reverseBytes(s) {
    var a = s.match(/../g);             // split number in groups of two
    a.reverse();                        // reverse the groups
    var s2 = a.join("");
    return s2;
}


function removeA(arr) {
    		var what, a = arguments, L = a.length, ax;
    		while (L > 1 && arr.length) {
        		what = a[--L];
        		while ((ax= arr.indexOf(what)) !== -1) {
        		    arr.splice(ax, 1);
        		}
    		}
    		return arr;
}


function conv_floating_pt(value_array) {
	    var buffer = new ArrayBuffer(8);
		var bytes = new Uint8Array(buffer);
		var doubles = new Float64Array(buffer); 

		bytes[7] = "0x" + value_array[0];
		bytes[6] = "0x" + value_array[1];
		bytes[5] = "0x" + value_array[2];
		bytes[4] = "0x" + value_array[3];
		bytes[3] = "0x" + value_array[4];
		bytes[2] = "0x" + value_array[5];
		bytes[1] = "0x" + value_array[6];
		bytes[0] = "0x" + value_array[7];

		var value_final = doubles[0];

		return value_final;
}



// Convert a JavaScript number to IEEE-754 Double Precision
// value represented as an array of 8 bytes (octets)
//
// http://cautionsingularityahead.blogspot.com/2010/04/javascript-and-ieee754-redux.html
 
function toIEEE754(v, ebits, fbits) {
 
    var bias = (1 << (ebits - 1)) - 1;
 
    // Compute sign, exponent, fraction
    var s, e, f;
    if (isNaN(v)) {
        e = (1 << bias) - 1; f = 1; s = 0;
    }
    else if (v === Infinity || v === -Infinity) {
        e = (1 << bias) - 1; f = 0; s = (v < 0) ? 1 : 0;
    }
    else if (v === 0) {
        e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
    }
    else {
        s = v < 0;
        v = Math.abs(v);
 
        if (v >= Math.pow(2, 1 - bias)) {
            var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
            e = ln + bias;
            f = v * Math.pow(2, fbits - ln) - Math.pow(2, fbits);
        }
        else {
            e = 0;
            f = v / Math.pow(2, 1 - bias - fbits);
        }
    }
     
    // Pack sign, exponent, fraction
    var i, bits = [];
    for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = Math.floor(f / 2); }
    for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = Math.floor(e / 2); }
    bits.push(s ? 1 : 0);
    bits.reverse();
    var str = bits.join('');
     
    // Bits to bytes
    var bytes = [];
    while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
    }
    return bytes;
}
 

function   toIEEE754Double(v) { return   toIEEE754(v, 11, 52); }


//from hex2dec-cs.js


/**
 * A function for converting hex <-> dec w/o loss of precision.
 *
 * The problem is that parseInt("0x12345...") isn't precise enough to convert
 * 64-bit integers correctly.
 *
 * Internally, this uses arrays to encode decimal digits starting with the least
 * significant:
 * 8 = [8]
 * 16 = [6, 1]
 * 1024 = [4, 2, 0, 1]
 */

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x, y, base) {
  var z = [];
  var n = Math.max(x.length, y.length);
  var carry = 0;
  var i = 0;
  while (i < n || carry) {
    var xi = i < x.length ? x[i] : 0;
    var yi = i < y.length ? y[i] : 0;
    var zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
  if (num < 0) return null;
  if (num == 0) return [];

  var result = [];
  var power = x;
  while (true) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str, base) {
  var digits = str.split('');
  var ary = [];
  for (var i = digits.length - 1; i >= 0; i--) {
    var n = parseInt(digits[i], base);
    if (isNaN(n)) return null;
    ary.push(n);
  }
  return ary;
}

function convertBase(str, fromBase, toBase) {
  var digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return null;

  var outArray = [];
  var power = [1];
  for (var i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  var out = '';
  for (var i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}

function decToHex(decStr) {
  var hex = convertBase(decStr, 10, 16);
  return hex ? '0x' + hex : null;
}

function hexToDec(hexStr) {
  if (hexStr.substring(0, 2) === '0x') hexStr = hexStr.substring(2);
  hexStr = hexStr.toLowerCase();
  return convertBase(hexStr, 16, 10);
}

//from rc4.js

function rc4(key, str) {
	
    //https://gist.github.com/farhadi/2185197
    
    var s = [], j = 0, x, res = '';
	for (var i = 0; i < 256; i++) {
		s[i] = i;
	}
	for (i = 0; i < 256; i++) {
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
	}
	i = 0;
	j = 0;
	for (var y = 0; y < str.length; y++) {
		i = (i + 1) % 256;
		j = (j + s[i]) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
		res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
	}
	return res;
    
}

//from transactions.js

function randomIntFromInterval(min,max) {

    return Math.floor(Math.random()*(max-min+1)+min); 
    
}

function padprefix(str, max) {   
    
    str = str.toString();
    return str.length < max ? padprefix('0' + str, max) : str;   
    
}

function padtrail(str, max) {

    while (str.length < max) {
        str += "0";
    }
    return str;
}

function hex_byte() {

    var hex_digits = "0123456789abcdef";
    var hex_dig_array = hex_digits.split('');
    
    var hex_byte_array = new Array();
        
    for (a = 0; a < 16; a++){
        for (b = 0; b < 16; b++){            
            hex_byte_array.push(hex_dig_array[a] + hex_dig_array[b]);           
        }
    }
    
    return hex_byte_array;
   
}

function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

function checkIfHtml(input){
    return /<[a-z/][\s\S]*>/i.test(input)
}

function isHex(h) {
    if(h.length % 2 == 0){
        var a = parseInt(h,16);
        return (a.toString(16) === h)
    } else {
        return false
    }   
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};