/**
 * A example of Thread-SSE server-side for Express
 * 
 * (c) Copyright 2020-present Richard Li <richard.li@w3plan.net>
 * License: MIT
 */
try {
  require.resolve('express');
  var express = require('express');
  var app = express();
} catch (e) {
  console.log("This app requires Express framework.");
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

// Loads custom validation for custom Thread-SSE data 
require('./custom/validation');

// Loads custom access control
const { CustomAccessControl } = require('./custom/access-control');

var tsseObj = null;
try {
  // Loads Thread-SSE from npm module
  require.resolve("thread-sse");
  tsseObj = require('thread-sse');
} catch(e) {
  // Loads Thread-SSE from local
  tsseObj = require('./index');  
}

// destructuring assignment
const { 
        getConnectionPath,
        getTsseServicePath,
        getsharedDataPath,
        libStyleGraph,
        responseClient,        
        setTsseConnection,
        tsseServer,
        updateTsseData,
        updateGroupTsseData,
        getTsseServicePrefix
      } = { ...tsseObj };

// the default Thread-SSE client library
app.get('/js/tsse.js', function(req, res) {
  libStyleGraph(req, res, "/public/js/tsse.js");
});

// the sample file of Thread-SSE client
app.get('/client.html', function(req, res) {
  var filePath = path.join(__dirname, "/public/client.html");
      
  try {
    var content = fs.readFileSync(filePath, 'utf8');
    
    responseClient(req, res, content, true);
  } catch (er) {
    console.log("Server can't read the client file.")
  }
});

// the custom Thread-SSE client JavaScript file 
app.get('/js/custom-tsse.js', function(req, res) {
  libStyleGraph(req, res, "/public/js/custom-tsse.js");
});

var tsseConnectionPath = getConnectionPath();

/**
* Handles Thread-SSE connection request
* 
* Using post method 
*/
app.post(tsseConnectionPath, function(req, res) {
  setTsseConnection(req, res);
});

// Handles the requests for Thread-SSE serves
app.get(getTsseServicePrefix() + '\*', function(req, res) {
  var tsseServicePath = getTsseServicePath(req);
  
  if (req.path === tsseServicePath && tsseServicePath !== '') {

    /**
     * Applies access control for visitors and logged in users
     * 
     * Controls visitors and logged in users to access tsseServer and updateTsseData
     */
    var cac = new CustomAccessControl();
    var tsseUser = cac.getTsseUser( req );

    // Thread-SSE server for the specific client
    tsseServer(tsseServicePath, res);
        
    /**
     * Using setTimeout as server event to update Thread-SSE data
     */
    
    // Updates the default Thread-SSE data
    setTimeout( function(){
      updateTsseData(tsseServicePath, tsseUser, "1000", "Sending Thread SSE Data");
     }, 4000 );
    
    // Updates the Thread-SSE data with the same id but different contents
    setTimeout( function(){
      updateTsseData(tsseServicePath, tsseUser, "1000", "Sending repeated data id");
     }, 8000 );
    
    // Updates the custom Thread-SSE data
    setTimeout( function(){
      updateTsseData(tsseServicePath, tsseUser, "4050", "Joanne Whalley", "(647) 823-7580");
     }, 12000 );
    
    // Updates the default Thread-SSE data with defined client action
    setTimeout( function(){
      updateTsseData( tsseServicePath, tsseUser, "8340", "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js;https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" );
    }, 16000 );
    
    // Closes Thread-SSE connection
    setTimeout( function(){
      updateTsseData(tsseServicePath, tsseUser, "8990");
    }, 20000 );    
  }
});

var sharedDataPath = getsharedDataPath();

/**
 * Receives shared Thread-SSE data and send it to the members of the group
 *
 * Using post method 
 */
app.post(sharedDataPath, function(req, res) {
  var cac = new CustomAccessControl();
  var tsseUser = cac.getTsseUser( req );
  var members = cac.getGroupMembersByUser(tsseUser);
  
  updateGroupTsseData(req, res, members);  
});

// Starts sample sever
app.listen(3000, () => console.log('The sample app listening at http://localhost:3000'));
