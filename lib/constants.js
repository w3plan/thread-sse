/**
 * Thread-SSE system constants
 * 
 * Don't change them in the custom application
 *
 */
const tsseServicePrefix = '/tsse-service-';
const tsseConnectionPath = '/tsse-connection';
const tsseRequestPost = 'REQUEST-FOR-TSSE-CONNECTION';
const tsseRenewPost = "REQUEST-FOR-TSSE-RENEW";
const tsseSharedData = '/tsse-shared-data';

/**
 * JavaScript and css files sent by tsseClientFile for Thread-SSE client 
 *
 * You can increase more JavaScript and css files in the custom application
 *
 */
const clientLibs = [ 
                      'tsse.js', 'tsse.src.js', 'tsse.min.js', 
                      'custom-tsse.js', 'custom-tsse.src.js', 'custom-tsse.min.js'
                    ];

/**
 * Module exports
 * @public
 */
module.exports.TSSE_SERVICE_PREFIX = tsseServicePrefix;
module.exports.TSSE_CONNECTION = tsseConnectionPath;
module.exports.TSSE_REQUEST_POST = tsseRequestPost;
module.exports.TSSE_RENEW_POST = tsseRenewPost;
module.exports.TSSE_SHARED_DATA = tsseSharedData;
module.exports.TSSE_CLIENT_LIB = clientLibs;
