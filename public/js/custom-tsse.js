/**
 * The part of custom validation 
 *
 * To add your server-side validation to the custom Thread-SSE data
 */

// customVali must be a global to the browser
window.customVali = {
  is2000: function(bulk, tag) {
    // validate bulk and tag, return true or false 

    return true;
  },
  
  // validate a name and a phone number
  is4050: function(bulk, tag) {
    var namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    var phonePattern = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;

    return namePattern.test(bulk) && phonePattern.test(tag);
  }
  
  // more validations here
};


/**
 * The part of client actions to send Thread-SSE data for other members of the user group 
 *
 * sendSharedTsseData is the client function that sends Thread-SSE data
 */
function sendData() {  
  sendSharedTsseData("6000", "Shared data sent by " + navigator.userAgent + ", " + Math.floor(Math.random() * 100)); 
}


/**
 * The part of client actions to run actions with Thread-SSE data from server-side
 * 
 * To add your action code in the body of tsseAction function.
 * Don't change the name of tsseAction
 * 
 * @param {string} id - The id between 1000 and 9999 to the value of tsseData
 * @param {string|number|boolean|null|array|json|others} bulk -
                        The item that contains the main content of Thread-SSE data
 * @param {string|number|boolean|null|array|json|others} tag - 
                        The aid item to Thread-SSE data
 */
function tsseAction(id, dt, bulk, tag) {
  document.getElementById("result").innerHTML += id + " at " + dt + " - " + bulk + ", " + tag + "<br>";
  
  if (id === '8340') {
    document.getElementById("result").innerHTML += '<button type="button" class="btn btn-primary">Primary</button> - <button type="button" class="btn btn-info">Info</button><br>';
  }
}


/**
 * The part of Thread-SSE client
 * 
 * Thread-SSE prints log message to the browser console
 * open the browser console to see it
 */    
tsseConnection( tsseAction );
