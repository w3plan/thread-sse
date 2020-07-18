/**
 * To write you access control for your specific Thread-SSE application
 * based on the user system used by the application.
 * 
 */

try {
  require.resolve("thread-sse");
  var { AccessControl } = require('thread-sse');
} catch(e) {
  var { AccessControl } = require('../index'); 
}

class CustomAccessControl extends AccessControl {
  
  // groupDataPath is a json file that stores userGroup data
  constructor(groupDataPath = '') {
  	// Reads userGroup data from the json file
    super(groupDataPath); 
  }
  
  // overriding methods of AccessControl as required
  
}

/**
 * Module exports
 * @public
 */
module.exports.CustomAccessControl = CustomAccessControl;
