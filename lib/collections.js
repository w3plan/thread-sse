/**
 * The data collections for Thread-SSE
 * 
 * Don't change the name and definition of variables in the custom application
 * 
 */

// stores and manages the mapping of Thread-SSE client id to tsseCollection key
const tsseTokens = new Map();

// stores and manages Thread-SSE data
const tsseCollection = new Map();


/**
 * Module exports
 * @public
 */
module.exports.tsseTokens = tsseTokens;
module.exports.tsseCollection = tsseCollection;
