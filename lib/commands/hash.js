/**
 * Module dependencies.
 */

var utils = require('../utils/utils')
  , string = utils.string
  , invoke = utils.invoke
  , constant = require('../utils/constant');
/**
 * HLEN <key>
 */

exports.hlen = function(key,cb){
  var obj = this.lookup(string(key));

  if (!obj) {
  	invoke(cb,null,(0));
  } else if ('hash' == obj.type) {
    invoke(cb,null,(Object.keys(obj.val).length));
  } else {
  	invoke(cb,null,(-1));
  }
};

/**
 * HVALS <key>
 */

exports.hvals = function(key,cb){
  var obj = this.lookup(string(key));
  if (!obj) {
  	invoke(cb,null,(null));
  } else if ('hash' == obj.type) {
    return (Object.keys(obj.val).map(function(key){
      invoke(cb,null,(obj.val[key]));
    }));
  } else {
  	invoke(cb,null,(null));
  }
};

/**
 * HKEYS <key>
 */

exports.hkeys = function(key,cb){
  var obj = this.lookup(string(key));

  if (!obj) {
  	invoke(cb,null,(null));
  } else if ('hash' == obj.type) {
    invoke(cb,null,(Object.keys(obj.val)));
  } else {
  	invoke(cb,null,(null));
  }
};

/**
 * HSET <key> <field> <val>
 */

(exports.hset = function(key, field, val,cb){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key);

  if (obj && 'hash' != obj.type) invoke(cb,null,(false));
  obj = obj || (this.db.data[key] = { type: 'hash', val: {} });

  obj.val[field] = val;
  
  invoke(cb,null,(true));
  
}).mutates = true;

/**
 * HMSET <key> (<field> <val>)+
 */

(exports.hmset = function(data,cb){
  var len = data.length
    , key = string(data[0])
    , obj = this.lookup(key)
    , field
    , val;

  if (obj && 'hash' != obj.type)  invoke(cb,null,(false));;
  obj = obj || (this.db.data[key] = { type: 'hash', val: {} });

  for (var i = 1; i < len; ++i) {
    field = string(data[i++]);
    val = data[i];
    obj.val[field] = val;
  }

  invoke(cb,null,(true));
  
}).mutates = true;

exports.hmset.multiple = 2;
exports.hmset.skip = 1;

/**
 * HGET <key> <field>
 */

exports.hget = function(key, field,cb){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key)
    , val;
  if (!obj) {
  	invoke(cb,null,(null));
  } else if ('hash' == obj.type) {
    if (val = obj.val[field]) {
    	invoke(cb,null,(val));
    } else {
    	invoke(cb,null,(null));
    }
  } else {
  	invoke(cb,null,(null));
  }
};

/**
 * HGETALL <key>
 */

exports.hgetall = function(key,cb){
  var key = string(key)
    , obj = this.lookup(key)
    , list = [];

  if (!obj) {
  	invoke(cb,null,(null));
  } else if ('hash' == obj.type) {
    for (var field in obj.val) {
      list.push(field, obj.val[field]);
    }
    invoke(cb,null,(list));
  } else {
  	invoke(cb,null,(null));
  }
};

/**
 * HEXISTS <key> <field>
 */

exports.hexists = function(key, field,cb){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key);

  if (obj) {
    if ('hash' == obj.type) {
      var result = (field in obj.val);
      invoke(cb,null,(result));
    } else {
    	invoke(cb,null,(false));
    }
  } else {
  	invoke(cb,null,(false));
  }
};
