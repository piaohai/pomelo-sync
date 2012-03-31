/**
 * Module dependencies.
 */

var SyncServer = require('./syncserver');

var dbmgr = null;
/**
 * Library version.
 */

exports.version = '0.1.0';

/**
 * Initialize a new `Server` with the given `options`.
 *
 * @param {Object} options
 * @return {Server}
 */

exports.create = function(options) {
	dbmgr = new SyncServer(options);
  return dbmgr;
};



exports.shutdown = function(options) {
  if (!!dbmgr){
  	dbmgr.shutdown();
  }
};