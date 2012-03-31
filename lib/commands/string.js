/**
 * Module dependencies.
 */

var utils = require('../utils/utils')
  , string = utils.string
  , invoke = utils.invoke
  , constant = require('../utils/constant');

/**
 * GET <key>
 */

exports.get = function(key,cb){
  var obj = this.lookup(string(key));
  if (!!obj)
    invoke(cb,null,obj.val);
  else 
	invoke(cb,null,null);
};

/**
 * add data to list for key
 */
exports.sadd = function(key,val,cb){
  this.writeToAOF('sadd', [key,val]);
  var obj = this.lookup(string(key));
  if (!!obj) {
	  obj.val.push(val);
	  invoke(cb,null,obj.val);
  }	else {
	  var list = [];
	  list.push(val);
	  this.set(key,list,cb);
  }
};


/**
 * GETSET <key> <val>
 */

exports.getset = function(key, val, cb){
  var key = string(key)
    , obj = this.lookup(key);

  this.db.data[key] = { val: val };
  
  invoke(cb,null,(get(key)));
};

/**
 * SET <key> <str>
 */

(exports.set = function(key, val,cb){
  //this.writeToAOF('set', [key,val]);
  key = string(key);
  this.db.data[key] = { val: val};
  invoke(cb,null,true);
}).mutates = true;

/**
 * SETNX <key> <val>
 */

(exports.setnx = function(key, val,cb){
  key = string(key);
  if (this.lookup(key)) return false;
  this.db.data[key] = {val: val };
  invoke(cb,null,(true));
}).mutates = true;

/**
 * SETEX <key> <seconds> <val>
 */

(exports.setex = function(key, seconds, val,cb){
	
  var key = string(key);
  this.db.data[key] = {
  		val: val
    , expires: Date.now() + (string(seconds) * 1000)
  };
  
  invoke(cb,null,(true));
}).mutates = true;

/**
 * INCR <key>
 */

(exports.incr = function(key,cb){
  var key = string(key)||'',obj = this.lookup(key);

  if (!obj) {
    this.db.data[key] = {val: 1 };
    invoke(cb,null,(1));
  }  else {
    invoke(cb,null,(++obj.val));
  } 
}).mutates = true;

/**
 * INCRBY <key> <num>
 */

(exports.incrby = function(key, num,cb){
  var key = string(key)
    , obj = this.lookup(key)
    , num = +string(num);

  if (isNaN(num))  invoke(cb,constant.TypeError,null);

  if (!obj) {
    obj = this.db.data[key] = {val: num };
    return (obj.val);
  } else {
    invoke(cb,null,(obj.val += num));
  } 
}).mutates = true;

/**
 * DECRBY <key> <num>
 */

(exports.decrby = function(key, num,cb){
  var key = string(key)
    , obj = this.lookup(key)
    , num = +string(num);

  if (isNaN(num)) invoke(cb,constant.OutOfRange,null);;;

  if (!obj) {
    obj = this.db.data[key] = {val: -num };
    return (obj.val);
  } else {
  	return (obj.val -= num);
  } 
}).mutates = true;

/**
 * DECR <key>
 */

(exports.decr = function(key,cb){
  var key = string(key)
    , obj = this.lookup(key);

  if (!obj) {
    this.db.data[key] = { val: -1 };
    invoke(cb,null,(-1));
  } else {
    invoke(cb,null,(--obj.val));
  } 
}).mutates = true;

/**
 * STRLEN <key>
 */

exports.strlen = function(key){
  var key = string(key)
    , val = this.lookup(key);
  if (val) {
    invoke(cb,null,val.length);
  } else {
  	invoke(cb,null,0);
  } 
};

/**
 * MGET <key>+
 */

(exports.mget = function(keys,cb){
  var len = keys.length;
  var list = [];
  for (var i = 0; i < len; ++i) {
    var obj = this.lookup(keys[i]);
    list.push(obj);
  }
  invoke(cb,null,(list));
}).multiple = 1;

/**
 * MSET (<key> <val>)+
 */

exports.mset = function(strs,cb){
  var len = strs.length
    , key
    , val;

  for (var i = 0; i < len; ++i) {
    key = string(strs[i++]);
    this.db.data[key] = { val: strs[i] };
  }
  invoke(cb,null,(true));
};

exports.mset.multiple = 2;
exports.mset.mutates = true;

/**
 * MSETNX (<key> <val>)+
 */

exports.msetnx = function(strs,cb){
  var len = strs.length
    , keys = []
    , key
    , val;

  // Ensure none exist
  for (var i = 0; i < len; ++i) {
    keys[i] = key = string(strs[i++]);
    if (this.lookup(key)) invoke(cb,null,(false));;
  }

  // Perform sets
  for (var i = 0; i < len; i += 2) {
    key = keys[i];
    this.db.data[key] = {val: strs[i] }
  }
  
  invoke(cb,null,(true));
};

exports.msetnx.multiple = 2;
exports.msetnx.mutates = true;
