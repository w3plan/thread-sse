/**
 * Stores and manages the mapping of Thread-SSE user to data shared group
 *
 * 
 */
const { readTsseUserGroup, writeTsseUserGroup } = require('./dealStorage');

/**
 * The access control for Thread-SSE data 
 * 
 * To share simple data among the members of a user group, the system should 
 * include users and user group management, the developers of Thread-SSE application
 * need to create a custom class overloading methods of AccessControl class 
 * based on the user management system.
 */
 class AccessControl {
  // groupDataPath is a json file that stores userGroup data
  constructor(groupDataPath = '') { 
    // Reads userGroup data from the file
    this.tsseUserGroup = readTsseUserGroup(groupDataPath);
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

    if (this.tsseUserGroup.has(user)) {
      return this.tsseUserGroup.get(user);
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
   * Gets all members of an assigned user group
   * 
   * @param {string} groupName - A group name
   * @return {array}  An array of members
   */
  getGroupMembersByGroup(groupName) {
    var members = [];
    
    this.tsseUserGroup.forEach(function(val, key) {

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
    this.tsseUserGroup.set(user, group);
  }
  
  /**
   * Deletes a user from the group
   * 
   * 
   * @param {string} user - The name of a user
   * @param {string} group - A group name
   */
  removeTsseUserGroup(user) {
    return this.tsseUserGroup.delete(user);
  }
  
  /**
   * Avoids user group data lost, saving this.tsseUserGroup to server disk
   * before Thread-SSE server closed
   * 
   * @return {boolean}  true  Saving data succeeds, otherwise false 
   */
  saveUserGroup() {
    return writeTsseUserGroup(this.tsseUserGroup); 
  }
}

/**
 * Module exports
 * @public
 */
module.exports.AccessControl = AccessControl;
