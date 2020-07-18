### Table of document contents
------------

1. [Thread-SSE](#Thread-SSE)
2. [Features](#Features)
3. [Thread-SSE security](#Thread-SSE-security)
4. [Thread-SSE data](#Thread-SSE-data)
5. [Thread-SSE data and client actions](#Thread-SSE-data-and-client-actions)
6. [Sharing Thread-SSE data](#Sharing-Thread-SSE-data)
7. [Client APIs](#Client-APIs)
8. [Server APIs](#Server-APIs)
9. [Developing Thread-SSE application](#Developing-Thread-SSE-application)
10. [Demo applications](#Demo-applications)
11. [Thread-SSE tips](#Thread-SSE-tips)

### Thread-SSE
------------

Thread-SSE is a library for Node.js and web browsers to develop security and high-performance SSE (Server-Send-Events) applications.


### Features
------------

- Based on Node.js built-in modules, supports HTTP, HTTPS, and HTTP/2 protocols, being compatible with most web browsers, faster real-time communication.

- One SSE server-side only connects one Thread-SSE client, and one web browser has one Thread-SSE connection.

- Validates SSE data at the time of data sending and data receiving.

- Thread-SSE data includes a data id and data with defined types, the developer can create client actions to an SSE data or directly using system default client actions. 

- The members of the user group can send and receive data via SSE.

- Thread-SSE is extendable and customizable.


### Thread-SSE security
------------

**Thread-SSE client and server**

Thread-SSE client is a web page that includes Thread-SSE client libraries: /js/tsse.js and /js/custom-tsse.js, for example, 
```html
<script src="/js/tsse.js"></script>
<script src="/js/custom-tsse.js"></script>
```
Thread-SSE server is a node.js web server using Thread-SSE module for SSE requests and other related web requests. to access "Demo applications" to see examples of Thread-SSE server.

**Security**

One SSE server-side only connects one Thread-SSE client, one web browser has one Thread-SSE connection. Opens the same Thread-SSE client from another browser tab would close the current connection then create a new one. Thread-SSE servers can identify the browser using Thread-SSE client.

Thread-SSE allows developers to restrict Thread-SSE connections by login status and user group, Thread-SSE developers can create new restrictions for a Thread-SSE application, for example, restricting Thread-SSE connections by geolocation and ‎access devices to visitors, restricting Thread-SSE connections by user role to logged-in users.


### Thread-SSE data
------------
Thread-SSE sends 7 data types from server to client, they are string, number, boolean, null, array, JSON object, others, the first 6 types are SON data types, they are complete same to both Node.js server and web browser, others type includes undefined, BigInt, Date, Map, Set, Symbol, Window, Document and more, it would be a serialized string received by Thread-SSE client, there no way to parse it back to the original object.

Thread-SSE uses the following object to send all data via SSE, Thread-SSE data is converted to a string at the time of sending and parses it back to the object at the time of receiving, Thread-SSE data are bound to Thread-SSE connections, a Thread-SSE connection has its Thread-SSE data.

> **{  id,  dt, bulk, tag }**

Here id is an integer string between '1000' and '9999', dt is the ISO Datetime that the data was created, bulk is the main part of the data, tag is an aid part to the data. 

**Definitions of Thread-SSE data id**

| <span style="width:20%">id</span> | <span style="width:30%">bulk</span> |<span style="width:30%">bag</span> | Used by |
| ------- | -------- |----------|----------|
| 1000 - 1999 | simple data |  "" | system default |
| 2000 - 2999 | simple data |  "" | custom application |
| 3000 - 3999 | complicate data|  non-empty string | system default |
| 4000 - 4999 | complicate data |  non-empty string | custom application |
| 5000 - 5499 | undefined |  undefined | system default |
| 5500 - 5999 | undefined |  undefined | custom application |
| 6000 - 6999 | simple data to share |  "" | system default |
| 7000 - 7999 | simple data to share |  "" | custom application |
| 8000 - 8999 | data to client action | data to client action | system default  |
| 9000 - 9999 | data to client action | data to client action | custom application |

**Simple data**

Data id between between "1000" and "2999", bulk data type is one of string, number, true, false, null, tag is an empty string, Thread-SSE module uses data id between "1000" and "1999", data id between "2000" and "2999" is for custom Thread-SSE application, the developers can define new simple data to bulk property.

To access [the default simple data and examples](./simple-data.md "Thread-SSE simple data") for the details.

**Complicate data**

Data id between between "3000" and "4999", bulk data type is one of string, array, JSON object, others, tag is a non-empty string for the description of bulk value, the system automatically generates the value for tag property to data id between "3000" and "3460". Thread-SSE module uses data id between "3000" and "3999", data id between "4000" and "4999" are for custom Thread-SSE application, the developers can define new complicate data to bulk property.

Thread-SSE automatically converts others object (the data id is 3200) into a serialized string at server-side, and keeping it as a serialized string at Thread-SSE client, Thread-SSE client doesn't parse it back to the original object.

To access [the default complicate data and examples](./complicate-data.md "Thread-SSE complicate data") for the details.

**Simple data to share**

Data id between "6000" and "7999" are used to share simple data in members of a user group, the definitions of shared data ids are the same with the definitions of simple data that the data id increase "5000", for example, the definition of shared data id "6000" is the complete same with the definition of data id "1000", the definition of shared data id "7000" is the complete same with the definition of data id "2000". 

Thread-SSE module uses data id between "6000" and "6999", data id between "7000" and "7999" are for custom Thread-SSE application, the developers can define new simple data to share.

The value of tag property in a shared Thread-SSE data is an empty string always.


### Thread-SSE data and client actions
------------

Thread-SSE allows to assign a client action to each Thread-SSE data, a client action is a JavaScript code snippet in the body of function tsseAction(id, dt, bulk, tag) of ./js/custom-tsse.js file, the client action uses data id, dt, bulk, tag from web server and runs in the web browser.

For example, {"id": "8280", "bulk": "id=mybtn", "tag": "click"} will trigger the click event to the element with id=mybtn in the Thread-SSE client, and {"id": "8990", "bulk": "", "tag": ""} will close a specific Thread-SSE connection.

Data id between "8000" and "8999" is the system default client actions, To access [the default client actions and examples](./action-data.md "Client actions and examples") for the details.


### Sharing Thread-SSE data
------------

**Set up user group**

Thread-SSE supports sending data from a client browser to web server, the web server forwards the data to members of a group to that the original data sender belongs via SSE connections, the members of a group can share real-time data communications through web server, the security of shared Thread-SSE data is based on user and user group system that your Thread-SSE application, you need to override existing access control in CustomAccessControl class for your Thread-SSE application, CustomAccessControl class is located in ./custom/access-control.js of the Thread-SSE project.

Thread-SSE uses tsseUserGroup to store user and group data, the tsseUserGroup is a Map object, Thread-SSE uses a file saving the tsseUserGroup, you may replace it with a database.

A user group is not a traditional user role, the purpose of a user group is the management of shared Thread-SSE data.

The code of Thread-SSE's access control

```javascript
/**
 * Stores and manages the mapping of Thread-SSE user to data shared group
 *
 */
const { readTsseUserGroup, writeTsseUserGroup } = require('./dealStorage');

// Reads tsseUserGroup from server disk
var tsseUserGroup = readTsseUserGroup();

/**
 * The access control for Thread-SSE data 
 * 
 * To share simple data among the members of a user group, the system should 
 * include users and user group management, the developers of Thread-SSE application
 * need to create a custom class overloading methods of AccessControl class 
 * based on the user management system.
 */
 class AccessControl {  
  constructor() { 
    // now it is an empty constructor
  }
  
  /**
   * Gets user information from the request object, returns an empty string to a visitor 
   * who isn't logged in the application
   * 
   * @param {object} request - The request object
   * @return  A user name, an empty string or false if the argument isn't a request object
   */
  getTsseUser(request) {

    if (typeof request === 'object' && request.url && request.headers) {      
      // write you code to get user name
      return '';
    } else {
      console.log("The argument must be a request object.");
      return false;
    }
  }
  
  /**
   * Gets the group name that user belongs to, returns an empty string to a visitor 
   * who isn't logged in the application
   * 
   * @param {string} user - The name of current user
   * @return {string}  A group name or an empty string if the user is a visitor
   */
  getTsseUserGroup(user) {

    if (tsseUserGroup.has(user)) {
      return tsseUserGroup.get(user);
    } else {
      return '';
    }
  }
  
  /**
   * Gets all members of the group to that user belongs, returns [] to a visitor
   *
   * @param {string} user - The name of current user
   * @return {string}  An array of members, [] to a visitor
   */
  getGroupMembersByUser(user) {
    var group =  this.getTsseUserGroup(user);

    if (group === '') {
      return [];
    }
    
    var members = this.getGroupMembersByGroup(group);
    var index = members.indexOf(user);
    
    members.splice(index, 1);
    return members;
  }
  
  /**
   * Gets all members of a assigned user group
   * 
   * @param {string} groupName - A group name
   * @return {array}  An array of members
   */
  getGroupMembersByGroup(groupName) {
    var members = [];
    
    tsseUserGroup.forEach(function(val, key) {

      if (val === groupName) {
        members.push(key);
      }
    });

    return members;    
  }
  
  /**
   * Adds a new user to the user group
   * 
   * The member of the group can send and receive data in Thread-SSE default, 
   * as user name is a key to tsseUserGroup object, a user doesn't belong more than 
   * one user group.
   * 
   * @param {string} user - The name of a user
   * @param {string} group - The name of user group
   */
  addTsseUserGroup(user, group) {
    tsseUserGroup.set(user, group);
  }
  
  /**
   * Deletes a user from the group
   * 
   * 
   * @param {string} user - The name of a user
   * @param {string} group - A group name
   */
  removeTsseUserGroup(user) {
    return tsseUserGroup.delete(user);
  }
  
  /**
   * Avoids user group data lost, saving tsseUserGroup to server disk
   * before Thread-SSE server closed
   * 
   * @return {boolean}  true  Saving data succeeds, otherwise false 
   */
  saveUserGroup() {
    return writeTsseUserGroup(tsseUserGroup); 
  }
}
```

**Sends shared data**

Sends shared data with updateGroupTsseData in Thread-SSE server.

```javascript
/**
 * Receives shared Thread-SSE data and send it to the members of the group
 */
var cac = new CustomAccessControl();
var tsseUser = cac.getTsseUser( req );
var members = cac.getGroupMembersByUser(tsseUser)

updateGroupTsseData(req, res, members);
```
Assigns sendSharedTsseData as a browser event handler in ./js/custom-tsse.js

```javascript
/**
 * The part of client actions to send Thread-SSE data for other members of the user group
 * sendSharedTsseData is a client function that sends Thread-SSE data
 */
function sendData() {  
  sendSharedTsseData("6000", "Shared data sent by " + navigator.userAgent + ", " + Math.floor(Math.random() * 100)); 
}
```
The event to trigger the event handler in the page of Thread-SSE client

```html
<p>
  <button id="mybtn" onclick="sendData()">
    Sending data to group members
  </button>
</p>
```


### Client APIs
------------

**tsseAction(id, dt, bulk, tag)**

The part of client actions to run actions with Thread-SSE data from server-side.<br>
To add your action code in the body of tsseAction function. Don't change the name of tsseAction.

Parameters
> {string} id - The id between 1000 and 9999 to the value of tsseData<br>
> {string|number|boolean|null|array|json|others} bulk - The item that contains the main content of Thread-SSE data<br>
> {string|number|boolean|null|array|json|others} tag - The aid item to Thread-SSE data

**sendSharedTsseData(id, bulk, tag)**

Sends shared Thread-SSE data to the members of user group.

Parameters
> {string} id - The id between 1000 and 9999 to the value of tsseData<br>
> {string|number|boolean|null} bulk - The item that contains the main content of Thread-SSE data<br>
> {string|number|boolean|null} tag -  The aid item to Thread-SSE data

Return
> false if sending failed, otherwise true

**tsseConnection( tsseAction )**

Requests a Thread-SSE server-side connection.

Parameter
> {string} tsseAction  - The function name that runs with Thread-SSE data as arguments

Return
> false if the request failed

**validateTsseData(id, bulk, tag)**

Validates the value of tsseData.

Parameters
> {string} id - The id between 1000 and 9999 to the value of tsseData<br>
> {string|number|boolean|null} bulk - The item that contains the main content of Thread-SSE data<br>
> {string|number|boolean|null} tag -  The aid item to Thread-SSE data

Return
> true validation succeeds, otherwise false


### Server APIs
------------
**getConnectionPath()**

Gets the path of Thread-SSE connection.

Return
> {string} A path

**getsharedDataPath()**

Gets the working path of shared data

Return
> {string} A path

**getTsseServicePath(request)**

Gets the service path from the request object.

Parameters
> {object} request - A request object

Return
> {string} A path if the client id is existing, otherwise an empty string

**getTsseServicePrefix()**

Gets the path prefix of Thread-SSE service.

Return
> {string} A path prefix of Thread-SSE service

**libStyleGraph(request, response, filePath)**

Parameters
> {object} request - A request object<br>
> {object} response - A response object<br>
> {string} filePath - The path of Thread-SSE client library, style and graph files

Return
> {boolean} true if succeed, otherwise false

**responseClient(request, response, content, isHttps = false)**

Responds Thread-SSE client to the request.

Parameters
> {object} request - A request object<br>
> {object} response - A response object<br>
> {string} content - The content of Thread-SSE client file<br>
> {boolean=} isHttps - Set secure flag to cookie if the protocol is HTTPS or HTTP/2

Return
> {boolean}   true to send succeeded, otherwise false

**setTsseConnection(request, response)**

Prepares the Thread-SSE connection or extends another 25 minutes to the connection.

Parameters
> {object} request - A request object

Return
> {object} response - A response object

**tsseServer(servicePath, response, isHttp2 = false)**

Provides Thread-SSE service to the coming connections.

Parameters
> {string} servicePath - The service path of Thread-SSE connection<br>
> {object} response - A response object<br>
> {boolean} isHttp2 - false if the protocol is HTTP/2, otherwise true

Return
> {boolean} false if failed

**updateGroupTsseData(request, response, users)**

Updates the data that was sent by the Thread-SSE client to all members of the user group.<br>
Thread-SSE uses this function sending updated data to members of the group.

Parameters
> {object} request - A request object<br>
> {object} response - A response object<br>
> {array} users - An array of user group that shares the single value

Return
> {boolean} false if data isn't right

**updateTsseData(servicePath, user, id, bulk = '', tag = '')**

Updates Thread-SSE data to the specific Thread-SSE connection user.<br>
Thread-SSE uses this function sending updated data to the client 

Parameters
> {string} servicePath - The service path of Thread-SSE connection<br>
> {string} user - The login name that is using the Thread-SSE connection, an empty string to all the visitors<br>
> {string} id - The id between 1000 and 9999 to the value of tsseData<br>
> {string|number|boolean|null|array|json|others} bulk - The item that contains the main content of Thread-SSE data<br>
> {string|number|boolean|null|array|json|others} tag - The aid item to Thread-SSE data

Return
> {boolean} false if failed, otherwise true

**validateTsseData(id, bulk = '', tag = '')**

The same with client API validateTsseData(id, bulk, tag), but bulk and tag include more data types than bulk and tag to client API.

You can use and override methods of AccessControl class in ./custom/access-control.js, here no further description to the methods of AccessControl class, please read [Sharing Thread-SSE data](#Sharing-Thread-SSE-data) for the details


### Developing Thread-SSE application
------------

**Custom access control**

Overrides methods of AccessControl class from ./custom/access-control.js or create new methods to CustomAccessControl class, you would use this class to manage visitors and users to access Thread-SSE server and to assign Thread-SSE data to server events like Node.js timer, directory and file watch, HTTP requests, and database accesses, then using CustomAccessControl class in your code, for example,

```javascript
var cac = new CustomAccessControl();
var tsseUser = cac.getTsseUser( request );

// the Thread-SSE server for a logged in user
if (tsseUser !== '') {
  tsseServer(tsseServicePath, response);

  // Updates the default Thread-SSE data
  setTimeout( function(){
    updateTsseData(tsseServicePath, tsseUser, "1000", "Sending Thread SSE Data");
   }, 3000 );

  // Updates the custom Thread-SSE data
  setTimeout( function() {
    updateTsseData(tsseServicePath, tsseUser, "4050", "Joanne Whalley", "(647) 823-7580");
   }, 6000 );
}
```

**Add data validations**

Thread-SSE requires to validate data at the time of data sending and data receiving, Thread-SSE includes validations for all default Thread-SSE data, if data ids are not the default values that were defined by Thread-SSE, for example, "2100", "4050", you need to create validations for custom data.

Creates static validation methods for data sending in CustomValidation class of ./custom/validation.js, for example,

```javascript
/**
 * An example of custom validation which validates a name and a phone number
 *
 * @param {string} bulk - A name
 * @param {string} tag - A phone number
 * @return {boolean} true if all matched, otherwise false
 */
static is4050(bulk, tag) {
  var namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  var phonePattern = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;

  // validate bulk and tag
  return namePattern.test(bulk) && phonePattern.test(tag);
}
```

Creates key-value pairs to customVali object for data receiving in ./js/custom-tsse.js, and the name of key would be "is" followed by a data id, the value is a function with bulk and tag arguments, for example,

```javascript
// validate a name and a phone number
is4050: function(bulk, tag) {
          var namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
          var phonePattern = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;

          return namePattern.test(bulk) && phonePattern.test(tag);
        }
```

**Creates client actions**

The client action is a JavaScript code snippet in the body of function tsseAction(id, dt, bulk, tag) of ./js/custom-tsse.js file, the client action uses data id, dt, bulk, tag from web server and runs in the web browser.

Data id of client actions between "8000" and "9999", system default data ids are between "8000" and "8999", user custom data ids are between "9000" and "9999".

```javascript
if (id === '8340') {
  // applies styles that was loaded by default client action to buttons
  document.getElementById("result").innerHTML += '<button type="button" class="btn btn-primary">Primary</button> - <button type="button" class="btn btn-info">Info</button><br>';
} else {
  // shows up data id, dt, bulk, tag from web server except 8340
  document.getElementById("result").innerHTML += id + " at " + dt + " - " + bulk + ", " + tag + "<br>";
}
```

User can create client actions for the data id with one of "8300", "8320" and "8340", the custom client actions would be run after the default client actions completed.


### Demo applications
------------

postinstall.js installed Thread-SSE demo applications in the folder of Thread-SSE project, the demo applications include:

**server-http.js**

The example application of Thread-SSE server over HTTP protocol.

**cluster-server-http.js**

The example application that clusters Thread-SSE server over HTTP protocol to take advantage of multi-core systems.

**server-https.js**

The example application of Thread-SSE server over HTTPS protocol.

**server-http2.js**

The example application of Thread-SSE server over HTTP/2 protocol.

**server-express.js**

The example application of Thread-SSE server with Express over HTTP protocol.

**server-express-https.js**

The example application of Thread-SSE server with Express over HTTPS protocol.

Starts demo Thread-SSE server then access the application from http://<span></span>localhost:3000/client.html


### Thread-SSE tips
------------

- Try to user Thread-SSE with Node.js HTTP, HTTPS, HTTP/2 module for data communication, current web application framework like Express may not the best environment to Thread-SSE applications.

- Thread-SSE client files have to be located on the same site of Thread-SSE server-side, Thread-SSE client doesn't support CORS (Cross-origin resource sharing).

- Thread-SSE doesn't work with IE web browser as IE doesn't support EventSource. 

- A web browser only has a Thread-SSE connection at the same time, open the same Thread-SSE client page from another browser tab will close the existing Thread-SSE connection then create a new Thread-SSE connection.

- Sends URL paths of the binary data like videos, images instead of directly sending binary data, don't send large-size binary data from Thread-SSE.

- Thread-SSE client page include a _tsse_cid cookie for the client identification, _tsse_cid is a secure cookie to HTTPS, when switching a Thread-SSE client from HTTPS to HTTP, new _tsse_cid should be a cookie without secure flag, as a web browser can not remove the existing secure cookie over an insecure connection, you may need to delete it manually from the web browser.

- Each Thread-SSE server-sides use setInterval to send data, as Node.js is single threaded, setIntervals are run from the event stack in turns, there is a delay than actual interval value when Thread-SSE connections increasing.

- Clusters Thread-SSE application on each CPU cores to take advantage of multi-core systems with the help of sample: /cluster-server-http.js

- XMLHttpRequest posts requests and Thread-SSE responses are better bidirectional communications than WebSockets. 

- If your web server isn't node.js, you may create your Thread-SSE server-side with the reference of [Thread-SSE project]( https://github.com/w3plan/thread-sse/). The license of Thread-SSE is MIT.


[**Back to top**](#Table-of-document-contents)
