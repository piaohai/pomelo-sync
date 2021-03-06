/**
 * Convert `buf` to a string.
 *
 * @param {Buffer} buf
 * @return {String}
 */

exports.string = function(o) {
	return obj2str(o);
};

/**
 * Convert `object` to a string.
 * @param o
 * @returns
 */
obj2str = function(o) {
  var r = [];
  if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
  if(typeof o == "object"){
    if(!o.sort){
      for(var i in o)
        r.push(i+":"+obj2str(o[i]));
          if(!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
            r.push("toString:"+o.toString.toString());
          }
        r="{"+r.join()+"}";
    } else{
    for(var i =0;i<o.length;i++) { 
    	r.push(obj2str(o[i]));
    }
    	r="["+r.join()+"]";
    }
    return r;
  }
  return o.toString();
};

/**
 * Parse a redis `pattern` and return a RegExp.
 *
 * @param {String} pattern
 * @return {RegExp}
 */

exports.parsePattern = function(pattern){
  pattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp('^' + pattern + '$');
};

/**
 * invoke callback function
 * @param cb
 */
exports.invoke = function(cb) {
	if(!!cb && typeof cb == 'function') {
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};
