/**
 * Thread SSE server-side
 * 
 * Requires Node.js version 6.4.0 and up. 
 *
 * (c) Copyright 2020-present Richard Li <richard.li@w3plan.net>
 * License: MIT
 */
const fs = require('fs');
const path = require('path');

const { TSSE_REQUEST_POST, TSSE_RENEW_POST, TSSE_CONNECTION, TSSE_SERVICE_PREFIX, TSSE_SHARED_DATA, TSSE_CLIENT_LIB } = require('./lib/constants');
const { getSha256Hash, getMd5Hash, getRandomString, prepareTsseData } = require('./lib/transform');
const { tsseTokens, tsseCollection } = require('./lib/collections');
const { validateTsseData } = require('./lib/validation');
const { AccessControl } = require('./lib/access-control');

/**
 * Checks the request object
 * 
 * @param {object} request - A request object
 * @return {boolean} true if the argument is a request object, otherwise false  
 */
function isRequest(request) {
  if (typeof request === 'object' && request.url && request.headers) {
    return true;
  }
  return false;
}

/**
 * Checks the response object
 * 
 * @param {object} response - A response object
 * @return {boolean} true if the argument is a response object, otherwise false  
 */
function isResponse(response) {
  if (typeof response === 'object' && response.writeHead && response.write) {
    return true;
  }
  return false;
}

/**
 * Gets the path prefix of Thread-SSE service
 * 
 * @return {string} A path prefix of Thread-SSE service
 */
function getTsseServicePrefix() {
  return TSSE_SERVICE_PREFIX;
}

/**
 * Gets the path of Thread-SSE connection
 * 
 * @return {string} A path
 */
function getConnectionPath() {
  return TSSE_CONNECTION;
}

/**
 * Gets the working path of shared data
 * 
 * @return {string} A path
 */
function getsharedDataPath() {
  return TSSE_SHARED_DATA;
}

/**
 * Gets the file MIME type
 *  
 * @param {string} file - The file path
 * @return {string}   A MIME type of the file
 */
function getMime( file ) {
  var ext = path.extname(file).toLowerCase();
  var mime = 'text/html';
    
  if (TSSE_CLIENT_LIB.includes( path.basename(file).toLowerCase() )) {
    mime = 'text/javascript';
  } else if ( ext === '.css') {
    mime = 'text/css';
  } else if ( ext === '.xml') {
    mime = 'text/xml';
  } else if ( ext === '.xhtml') {
    mime = 'application/xhtml+xml';
  } else if ( ext === '.png') {
    mime = 'image/png';
  } else if ( ext === '.gif') {
    mime = 'image/gif';
  } else if ( ext === '.svg') {
    mime = 'image/svg+xml';
  } else if ( ext === '.ico') {
    mime = 'image/vnd.microsoft.icon';
  } else if ( ['.jpg', '.jpeg'].includes(ext) ) {
    mime = 'image/jpeg';
  } else if ( ['.tif', '.tiff'].includes(ext) ) {
    mime = 'image/tiff';
  }

  return mime;
}

/**
 * Gets the the client id from the request object
 *  
 * @param {object} request - A request object
 * @return {string} A path of the client id is existing, otherwise null
 */
function getClientId(request) {
  
  if ( !isRequest(request) ) {
    console.log("The argument isn't a request object.");
    return false;
  }

  var re = new RegExp("_tsse_cid=([^;]+)");
  var val = re.exec(request.headers.cookie);
  
  return (val !== null) ? decodeURIComponent(val[1]) : null;
}

/**
 * Gets sha256 hash string of the client id
 * 
 * @param {object} request - A request object
 * @return {string} A hexadecimal hash string
 */
function getCid(request) {
  var cid = getClientId(request);
  
  if (cid && cid !== null) {
    var val = tsseTokens.get(cid);

    if ( typeof val !== "undefined" ) {
      return cid;
    }
  }
  
  return getSha256Hash( getRandomString(64) );
}

/**
 * Deletes the mapping of client id and the key of Thread-SSE data
 * 
 * @param {string} tsseKey - A key of Thread-SSE data
 * @return {boolean}  true if deletes successful, otherwise false
 */
function removeFromTsseTokens(tsseKey) {
  var entries = tsseTokens.entries();
  for (let [key, val] of entries) {
    if (val === tsseKey) {
      tsseTokens.delete(key);
      return true;
    }
  }
  return false;
}

/**
 * Gets the service path from the request object
 *  
 * @param {object} request - A request object
 * @return {string} A path if the client id is existing, otherwise an empty string
 */
function getTsseServicePath(request) {
  var cid = getClientId(request);

  if (cid && cid !== null) {
    var ptk = tsseTokens.get(cid);
        
    if ( typeof ptk !== "undefined" ) {
      return TSSE_SERVICE_PREFIX + ptk;
    }
  }

  return '';
}

/**
 * Responds Thread-SSE client library, style and graphs
 * 
 * @param {object} request - A request object
 * @param {object} response - A response object
 * @param {string} filePath - The path of Thread-SSE client library, style and graph files
 * @return {boolean} true if succeed, otherwise false
 */
function libStyleGraph(request, response, filePath) {

  if ( !isRequest(request) ) {
    console.log("The first argument isn't a request object.");
    return false;
  }
  
  if ( !isResponse(response) ) {
    console.log("The second argument isn't a response object.");
    return false;
  }
  
  var fullFilePath = path.join(__dirname, filePath);
  
  if ( fs.existsSync(fullFilePath) && !fs.statSync(fullFilePath).isDirectory() ) {
    var mime = getMime(filePath);    
    var head = {
      'Content-Type': mime
    };
    
    try {
      response.writeHead(200, head);
    } catch(e) {
      console.log("Server can't send a response header, the file wasn't sent.");
      console.log(e.message);
      return false;
    }
    
    try {
      var readStream = fs.createReadStream(fullFilePath);

      readStream.on('open', function () {
        readStream.pipe(response);
      });
    } catch(e) {
      console.log("Server can't send the file content.");
      console.log(e.message);
      return false;
    }
  } else {
    console.log( filePath + " doesn't exist.");
    return false;
  }
  
  return true;
}

/**
 * Responds Thread-SSE client to the request
 * 
 * @param {object} request - A request object
 * @param {object} response - A response object
 * @param {string} content - The content of Thread-SSE client file
 * @param {boolean=} isHttps - Set secure flag to cookie if the protocol is HTTPS or HTTP/2
 * @return {boolean}   true to send succeeded, otherwise false 
 */
function responseClient(request, response, content, isHttps = false) {
  
  if ( !isRequest(request) ) {
    console.log("The first argument isn't a request object.");
    return false;
  }
  
  if ( !isResponse(response) ) {
    console.log("The second argument isn't a response object.");
    return false;
  }
  
  if ( content.length > 20 && RegExp(TSSE_CLIENT_LIB.join("|")).test(content) ) {
    var cid = getCid(request);
    var end = '; path=/; SameSite=Strict; HttpOnly';
    
    if ( isHttps ) {
      end = '; path=/; SameSite=Strict; Secure; HttpOnly';
    }

    var head = {
                 'Content-Type': 'text/html; charset=utf-8',
                 'Set-Cookie': '_tsse_cid=' + cid + end
                };
    
    try {
      response.writeHead(200, head);
      response.write(content);
      response.end();
    } catch(e) {
      console.log("Server can't send the content.");
      return false;
    }

  } else {
    console.log("The content doesn't include Thread-SSE client library.");
    return false;
  }

  return true;
}

/**
 * Prepares the Thread-SSE connection or extends another 25 minutes to the connection
 * 
 * @param {object} request - A request object
 * @param {object} response - A response object
 */
function setTsseConnection(request, response) {
  
  if ( !isRequest(request) ) {
    console.log("The first argument isn't a request object.");
    return false;
  }
  
  if ( !isResponse(response) ) {
    console.log("The second argument isn't a response object.");
    return false;
  }
  
  // read data from HTTP post
  if (request.method.toUpperCase() === 'POST') {
    var postBd = '';

    request.on('data', function (chunk) {
      postBd += chunk;
    });
    
    request.on('end', function () {
      var ptk = 'ptk=';
      var cid = getClientId(request);
      
      if (cid && cid !== null) {

        if (postBd === TSSE_REQUEST_POST) {
          var tsseKey = tsseTokens.get(cid);
          
          if (typeof tsseKey !== "undefined") {
            var tsseVal = tsseCollection.get(tsseKey);
            tsseVal.isExpired = true;
            tsseCollection.set(tsseKey, tsseVal);
          }
          
          tsseKey = getMd5Hash( getRandomString(32) );
          tsseTokens.set(cid, tsseKey);

          tsseCollection.set(tsseKey, {
            'lastId': '0',
            'tsseData': {
                          'id': '0',
                          'bulk': '',
                          'tag': '',
                          'dt': null 
                        },
            'user': '',
            'isExpired': false,
            'cdt': Math.round(new Date().getTime() / 1000) 
          });

          ptk = 'ptk=' + TSSE_SERVICE_PREFIX + tsseKey;

        } else if (postBd === TSSE_RENEW_POST) { 
          var tsseKey = tsseTokens.get(cid);

          if (typeof tsseKey !== "undefined") {
            var tsseVal = tsseCollection.get(tsseKey);
            var csecond = Math.round(new Date().getTime() / 1000);

            if ( csecond - tsseVal.cdt > 1 && csecond - tsseVal.cdt < 1440 ) {
              tsseVal.cdt += 1500;
              tsseCollection.set(tsseKey, tsseVal); 
            }
          }
        }
      }

      response.writeHead(200);
      response.write(ptk);
      response.end();
    });

  } else {
    libStyleGraph(request, response, "/public/img/tsse-logo-200x175.jpg");
  }
}

/**
 * Provides Thread-SSE service to the coming connections
 * 
 * @param {string} servicePath - The service path of Thread-SSE connection
 * @param {object} response - A response object
 * @param {boolean} isHttp2 - false if the protocol is HTTP/2, otherwise true 
 * @return {boolean} false if failed
 */
function tsseServer(servicePath, response, isHttp2 = false) {
  var fields = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  };
  
  if ( !isHttp2 ) fields.Connection = 'keep-alive';
 
  try {
    // disable the existing Node.js idle timeout
    response.socket.setTimeout(0);
    response.writeHead(200, fields);
  } catch(e) {
    console.log("The service can't send a response header, no Thread SSE for " + servicePath);
    return false;
  }
  
  var tsseKey = servicePath.replace(TSSE_SERVICE_PREFIX, '');
  
  var tsseVal = null;
  var eid = 0;
  
  var intervalId = setInterval( function() {
    tsseVal = tsseCollection.get(tsseKey);
    
    if (typeof tsseVal === "undefined") {
      return false;
    }

    if (tsseVal.isExpired) {
      tsseVal.tsseData = { 'id': '8990', 'bulk': '', 'tag': '', 'dt': new Date().toISOString() };
      tsseCollection.set(tsseKey, tsseVal);
    }
    
    if ( tsseVal.lastId !== tsseVal.tsseData.id) {
      tsseVal.lastId = tsseVal.tsseData.id;
      tsseCollection.set(tsseKey, tsseVal);
      
      var notifStr = JSON.stringify(tsseVal.tsseData);
      var notifBlock = 'data: ' + notifStr + '\n\n';
      eid += 1;
      
      try {
        response.write('event: tsse-event\n');
        response.write('id: ' + eid + '\n');
        response.write(notifBlock);

        if ( tsseVal.tsseData.id === '8990') {
          clearInterval(intervalId);
          
          response.end();

          tsseCollection.delete(tsseKey);
          
          removeFromTsseTokens(tsseKey);
        }
      } catch(e) {

        if ( isHttp2 ) {
          console.log("Thread SSE client may be closed.");
        } else {
          console.log("Thread SSE can't send data.");
        }
        //console.log(e.message);
        return false;
      }
    }
  }, 200);
}

/**
 * Updates Thread-SSE data to the specific Thread-SSE connection user  
 * Thread-SSE uses this function sending updated data to the client 
 * 
 * @param {string} servicePath - The service path of Thread-SSE connection
 * @param {string} user - The login name that is using the Thread-SSE connection, 
                          An empty string to all the visitors
 * @param {string} id - The id between 1000 and 9999 to the value of tsseData
 * @param {string|number|boolean|null|array|json|others} bulk -
                        The item that contains the main content of Thread-SSE data
 * @param {string|number|boolean|null|array|json|others} tag - 
                        The aid item to Thread-SSE data
 * @return {boolean} false if failed, otherwise true
 */
function updateTsseData(servicePath, user, id, bulk = '', tag = '') {

  if (id < 1000 || id > 9999) {
    console.log("Invalid Thread-SSE Data Id: " + id);
    return false;
  }
  
  id = id + '';
  var tsseData = prepareTsseData(id, bulk, tag);
  
  if ( validateTsseData(tsseData.id, tsseData.bulk, tsseData.tag) ) {
    tsseData.dt = new Date().toISOString();
    
    try {
      JSON.stringify(tsseData);
    } catch(e) {
      console.log("Failed to create Thread SSE data.");
      return false;
    }
    
    var tsseKey = servicePath.replace(TSSE_SERVICE_PREFIX, '');
    var tsseValue = tsseCollection.get(tsseKey);

    if (typeof tsseValue === "undefined") {
      console.log("Invalid service path.");
      return false;
    }
    
    if (tsseValue.tsseData.id === tsseData.id) {
      if (tsseValue.tsseData.bulk !== tsseData.bulk || tsseValue.tsseData.tag !== tsseData.tag) {
        tsseValue.lastId = '0';
      }
    }
    tsseValue.user = user;
    tsseValue.tsseData = tsseData;
    tsseCollection.set(tsseKey, tsseValue);
    
    return true;
  } else {
    console.log("Invalid Thread SSE data.");
    return false;
  }
}

/**
 * Updates the data that was sent by the Thread-SSE client to all members of the user group
 * Thread-SSE uses this function sending updated data to members of the group 
 * 
 * @param {object} request - A request object
 * @param {object} response - A response object
 * @param {array} users - An array of user group that shares the single value
 * @return {boolean} false if data isn't right
 */
function updateGroupTsseData(request, response, users) {
  if ( !isRequest(request) ) {
    console.log("The first argument isn't a request object.");
    return false;
  }
  
  if ( !isResponse(response) ) {
    console.log("The second argument isn't a response object.");
    return false;
  }
  
  // read data from HTTP post
  if (request.method.toUpperCase() === 'POST') {
    var postBd = '';
    var sharedData = null;

    request.on('data', function (chunk) {
      postBd += chunk;
    });
    
    request.on('end', function () {
      try {
        sharedData = JSON.parse(postBd);
      }catch (e) {
        return false;
      }

      response.writeHead(200);
      response.end();

      updateSharedData(users, sharedData);
    });
  }
}

/**
 * Updates the value of tsseData to all Thread-SSE data in the same user group
 * 
 * @param {array} users - An array of user group that shares the single value
 * @param {object} tsseData - An object that is a property of Thread-SSE data
 * @return {boolean}
 */
function updateSharedData(users, tsseData) {

  if (users.length < 1) {
    console.log("No group members.");
    return false;
  } else if (typeof tsseData.id === "undefined" || tsseData.id < 6000 || tsseData.id > 7999 || typeof tsseData.bulk === "undefined") {
    console.log("Invalid shared data.");
    return false;
  }
  
  tsseCollection.forEach(function(val, key) {

    if (users.includes(val.user)) {

      if (val.tsseData.id === tsseData.id) {

        if (val.tsseData.bulk !== tsseData.bulk) {
          val.lastId = '0';
        }
      }
      val.tsseData = tsseData;
      tsseCollection.set(key, val);
    }
  });
  
  return true;
}

/**
 * Thread-SSE data is expired in 24 minutes
 * update isExpired sign to Thread-SSE data per 25 minutes
 */
setInterval(function() {
  var current = Math.round(new Date().getTime() / 1000);
  tsseCollection.forEach(function(val, key) {
    if ( current - val.cdt > 1500) {
      val.isExpired = true;
      tsseCollection.set(key, val);
    }
  });
}, 1500000);

/**
 * Module exports.
 * @public
 */
module.exports.getTsseServicePrefix = getTsseServicePrefix;
module.exports.getTsseServicePath = getTsseServicePath;
module.exports.getConnectionPath = getConnectionPath;
module.exports.getsharedDataPath = getsharedDataPath;

module.exports.libStyleGraph = libStyleGraph;
module.exports.responseClient = responseClient;
module.exports.setTsseConnection = setTsseConnection;
module.exports.tsseServer = tsseServer;

module.exports.updateTsseData = updateTsseData;
module.exports.updateGroupTsseData = updateGroupTsseData;
module.exports.validateTsseData = validateTsseData;
module.exports.AccessControl = AccessControl;
