/**
 * Module dependencies.
 */

/**
 * Initialize a new AOF MysqlRewriter with the given `db`.
 * 
 * @param {options}
 * 
 */

var MysqlRewriter = module.exports = function MysqlRewriter(options) {
	this.filter = options.filter;
	if (!!this.write)
		this.write = options.write;
	else
		throw Error('mysql sync method must set');
};

/**
 * Initiate sync.
 */

MysqlRewriter.prototype.sync = function(server){
	if (server.client === undefined){
		throw error(' mysql client must not null ');
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

MysqlRewriter.prototype._write = function(key, val){
  throw Error('direct orm mapping not support');
};

 