/**
 * A example of Thread-SSE server-side for HTTP/2 over TLS
 * 
 * (c) Copyright 2020-present Richard Li <richard.li@w3plan.net>
 * License: MIT
 */
const fs = require('fs');
const path = require('path');
const http2 = require('http2');

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
        updateGroupTsseData
      } = { ...tsseObj };

// Using HTTPS certificate and private key
const HttpsOptions = {
  key: fs.readFileSync('./custom/localhost.key'),
  cert: fs.readFileSync('./custom/localhost.cert')
};

const server = http2.createSecureServer( HttpsOptions );

// Sets up sample server
server.on('request', function (req, res) {  
    var requestUrl = req.url;
    var tsseServicePath = getTsseServicePath(req);
    
    if (requestUrl === "/js/tsse.js") 
    {
      // the default Thread-SSE client library
      libStyleGraph(req, res, "/public/js/tsse.js");

    } else if (requestUrl === "/client.html") 
    { 
      // the sample file of Thread-SSE client
      var filePath = path.join(__dirname, "/public/client.html");
      
      try {
        var content = fs.readFileSync(filePath, 'utf8');
        
        responseClient(req, res, content, true);
      } catch (er) {
        console.log("Server can't read the client file.")
      }      
    } else if (requestUrl === "/js/custom-tsse.js") 
    {
      // the custom Thread-SSE client JavaScript file 
      libStyleGraph(req, res, "/public/js/custom-tsse.js");
      
    } else if (requestUrl === getConnectionPath()) 
    { 
      // Handles Thread-SSE connection request
      setTsseConnection(req, res);
      
    } else if (requestUrl === tsseServicePath && tsseServicePath !== '')
    { 
      /**
       * Applies access control for visitors and logged in users
       * 
       * Controls visitors and logged in users to access tsseServer and updateTsseData
       */
      var cac = new CustomAccessControl();
      var tsseUser = cac.getTsseUser( req );

      // Thread-SSE server for the specific client over HTTP2
      tsseServer(tsseServicePath, res, true);
            
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
      
    } else if (requestUrl === getsharedDataPath())
    { 
      /**
       * Receives shared Thread-SSE data and send it to the members of the group
       *
       */
      var cac = new CustomAccessControl();
      var tsseUser = cac.getTsseUser( req );
      var members = cac.getGroupMembersByUser(tsseUser);
      
      updateGroupTsseData(req, res, members);
    } else 
    {
      // response Thread-SSE logo
      libStyleGraph(req, res, "/public/img/tsse-logo-200x175.jpg");
    } 
  }
);

// Starts sample sever
server.listen(3000, "localhost", () => console.log('The sample app listening at https://localhost:3000'));
