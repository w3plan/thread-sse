const crypto = require('crypto');
const { nvali } = require('./validation');

/**
 * Gets sha256 hash to the string
 * 
 * @param {string} val - A string which is hashed
 * @return {string} A hexadecimal string, the length of 64 characters
 */
function getSha256Hash(val) {
  return crypto.createHash('sha256').update(val).digest('hex');
}

/**
 * Gets md5 hash to the string
 * 
 * @param {string} val - A string which is hashed
 * @return {string} A hexadecimal string, the length of 32 characters
 */
function getMd5Hash(val) {
  return crypto.createHash('md5').update(val).digest('hex');
}

/**
 * Generates a random string in the assigned length 
 * 
 * @param {integer} length  - A positive integer to assign the length of generated random string
 * @return {string} A random string
 */
function getRandomString(length) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';

  for ( var i = 0; i < length; i++ ) {
      result += randomChars.charAt( Math.floor( Math.random() * randomChars.length ) );
  }

  return result;
}

/**
 * Prepare Thread-SSE data before sending it
 * 
 * @param {string} id - The id between 1000 and 9999 to the value of tsseData
 * @param {string|number|boolean|null|array|json|others} bulk -
                        The item that contains the main content of Thread-SSE data
 * @param {string|number|boolean|null|array|json|others} tag - 
                        The aid item to Thread-SSE data
 * @return {object} A Thread-SSE data
 */
function prepareTsseData(id, bulk = '', tag = '') {
  var tsseData = {};

  tsseData.id = id;
  tsseData.bulk = bulk;
  tsseData.tag = tag;
  
  if (id === '3008' && bulk) {
    var start = (+bulk.split(',')[0]);
    var end = (+bulk.split(',')[1]);
    var step = (+bulk.split(',')[2]);
    var list = [];
    
    for (var i = start; i <= end; i += step) {
        list.push(i);
    }
    tsseData.tag = "array";
    tsseData.bulk = list;
    
  } else if (id === '3200' && bulk ) {
    
    if ( nvali.isOthers(bulk) ) {
      try {
        var util = require('util');
        
        tsseData.tag = bulk.constructor.name.toLowerCase();
        tsseData.bulk = util.inspect(bulk, false, 10, false, true, true);
      } catch(er) {
        console.log("The data can't be serialized.");
        return false;
      }
    } else {
      console.log("Data type isn't others.");
      return false;
    }
  } else if (['3000', '3002', '3004', '3006', '3008', '3010'].indexOf(id) !== -1) {
    tsseData.tag = 'array';
  } else if (['3100', '3110'].indexOf(id) !== -1) {
    tsseData.tag = 'json';
  } else if (id === '3300') {
    tsseData.tag = 'trace';
  } else if (id === '3310') {
    tsseData.tag = 'debug';
  } else if (id === '3320') {
    tsseData.tag = 'info';
  } else if (id === '3330') {
    tsseData.tag = 'notice';
  } else if (id === '3340') {
    tsseData.tag = 'warn';
  } else if (id === '3350') {
    tsseData.tag = 'error';
  } else if (id === '3360') {
    tsseData.tag = 'fatal';
  } else if (id === '3370') {
    tsseData.tag = 'alert';
  } else if (id === '3380') {
    tsseData.tag = 'emerg';
  } else if (id === '3400') {
    tsseData.tag = 'normalization';
  } else if (id === '3410') {
    tsseData.tag = 'text';
  } else if (id === '3420') {
    tsseData.tag = 'blob';
  } else if (id === '3430') {
    tsseData.tag = 'data url';
  } else if (id === '3450') {
    tsseData.tag = 'simple password';
  } else if (id === '3460') {
    tsseData.tag = 'complicate password';
  } else if (id === '8240') {
    tsseData.tag = 'clear cssText';
  }
  
  return tsseData;
}

/**
 * Module exports
 * @public
 */
module.exports.prepareTsseData = prepareTsseData;
module.exports.getRandomString = getRandomString;
module.exports.getSha256Hash = getSha256Hash;
module.exports.getMd5Hash = getMd5Hash;
