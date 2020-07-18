/**
 * To add custom validation to custom Thread-SSE data
 *
 * The custom validation should be a static class method 
 *
 */
class CustomValidation {
  
  // An example of custom validation without validated code
  static is2000(bulk, tag) {
    return true;
  }
  
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
  
  // more custom validation methods here
  
}

/**
 * customVali must be a global
 *
 * Module exports
 * @public
 */
global.customVali = CustomValidation;
