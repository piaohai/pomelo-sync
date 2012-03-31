/**
 * Module dependencies.
 */

/**
 * Initialize a new AOF RedisRewriter with the given `db`.
 * 
 *  @param {options}
 */

var RedisRewriter = module.exports = function RedisRewriter() {
	this.filter = options.filter;
	this.write = options.write;
};

/**
 * Initiate sync.
 */

RedisRewriter.prototype.sync = function(server){
	if (server.client === undefined){
		throw error(' redis client must not null ');
	}
	this.client = server.client;
	var db = server.use();
	for(var key in db){
		if (!!this.filter){
			if (this.filter(key)===false) continue;
		}
		var val = db[key];
		if (server.changed(val)){
			if (!!this.write)
				this.write(key, val);
			else
				this._write(key,val)
		} 
	}
	server.queue.shiftEach(function(key){
		client.del(key);
	});
};
 

/**
 * Write key / val.
 */

RedisRewriter.prototype.write = function(key, val){
   return this.client.set(key, val);
};
 