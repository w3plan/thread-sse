<p align="center">
  <img width="200" height="175" src="https://www.w3plan.net/images/tsse-logo-200x175.jpg">
</p>


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


### Installation of Thread-SSE package and environment
------------

Runs the following commands from the directory of your project.

1<span>.</span> Installs Thread-SSE

` npm install thread-sse `

2<span>.</span> Installs Thread-SSE environment

` node ./node_modules/thread-sse/postinstall `


### Using examples
------------

```javascript
// Responds Thread-SSE client library
libStyleGraph(request, response, "/public/js/tsse.js");

// Responds custom client library
libStyleGraph(request, response, "/public/js/custom-tsse.js");

// Responds the Thread-SSE client 
responseClient(request, response, content);

// Handles Thread-SSE connection request
setTsseConnection(request, response);

// Starts Thread-SSE server for the specific client
tsseServer(tsseServicePath, response);

// Assigns a Thread-SSE data to a server event
updateTsseData(tsseServicePath, tsseUser, "1000", "Sending Thread SSE Data");     

// Assigns a custom Thread-SSE data to a server event
updateTsseData(tsseServicePath, tsseUser, "4050", "Joanne Whalley", "(647) 823-7580");

// Sends Thread-SSE data to members of the group
updateGroupTsseData(request, response, members);
```


### Tests
------------
Runs the test server:

` node ./node_modules/thread-sse/test/server `

Then runs testing with http://<span></span>localhost:3000/test/index.html from web browsers.


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


### Developing Thread-SSE application
------------

1. Develops the access control to Thread-SSE data

Overrides methods of AccessControl class from ./custom/access-control.js, managing users and user group with the authentication used by your project.

2. Creates custom validation

Creates custom validation for server-side data sending from ./custom/validation.js and the data receiving of the web browsers from ./js/custom-tsse.js if you defined custom data to your project.

3. Writes client actions 

Writes your client actions in the function tsseAction(id, dt, bulk, tag) from ./js/custom-tsse.js, the arguments of tsseAction are data sent by Thread-SSE server.

4. Sends shared data

Sends shared data with sendSharedTsseData and assigns it as a browser event handler in ./js/custom-tsse.js

5. Updates SSL/TLS certificate and private key files

Updates SSL/TLS certificate and private key files in ./custom folder for the product of your project.


### Documentation
------------

To see [Thread-SSE documentation](https://github.com/w3plan/thread-sse/blob/master/doc/document.md)


### License
------------

MIT


### Keywords
------------

sse, thread, thread-sse, tsse, tsse data, client action, group shared, security
