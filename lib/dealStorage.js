/**
 * Reading tsseUserGroup object from the file,
 * writing tsseUserGroup object to the file 
 * 
 * tsseUserGroup is an object that stores and manages user and group data
 * 
 */
const fs = require('fs');
const path = require('path');

/**
 * Check an object whether a Map object
 * 
 * @param {object} val - an object
 * @return {boolean} true  If val is a Map object, otherwise false
 */
function isMap(val) {
  return val instanceof Map && Object.prototype.toString.call(val).slice(8, -1) === 'Map';
}

/**
 * Reads tsseUserGroup content from the file  
 * returns a tsseUserGroup object if the file exists
 * otherwise returns a new Map object
 *
 * @param {string} groupDataPath - A path that stores tsseUserGroup data
 */
function readTsseUserGroup(groupDataPath = '') {
  var groupDataDir = groupDataPath;

  if (groupDataPath === '') 
    groupDataDir = __dirname;
  
  var storedFile = path.join(groupDataDir, 'user-group.json');
  
  if ( !fs.existsSync(storedFile) ) {
    return new Map();
  } else {
    var storedContent = fs.readFileSync(storedFile, 'utf8');
    try {
      var contentJson = JSON.parse(storedContent);
      return new Map(contentJson);
    } catch(e) {
      return new Map();
    }
  }
}

/**
 * Writes tsseUserGroup object to a file
 * 
 * @param {map} userGroup - A tsseUserGroup object
 * @param {string} groupDataPath - A path that stores tsseUserGroup data
 * @return {boolean} true  Writing file succeeds, otherwise false
 */
function writeTsseUserGroup(userGroup, groupDataPath = '') {
  var groupDataDir = groupDataPath;

  if (groupDataPath === '') 
    groupDataDir = __dirname;

  if ( isMap(userGroup) ) {
    var storedFile = path.join(groupDataDir, 'user-group.json');
    var content = '';
    
    try {
      content = JSON.stringify( [...userGroup] );      
      fs.writeFileSync(storedFile, content);
      return true; 
    } catch(e) {
      return false; 
    }
  }
  return false;
}

/**
 * Module exports
 * @public
 */
module.exports.readTsseUserGroup = readTsseUserGroup;
module.exports.writeTsseUserGroup = writeTsseUserGroup;
