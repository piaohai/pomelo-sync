/**
 * Module dependencies.
 */

try {
  var dbsync = require('dbsync');
} catch (err) {
  var dbsync = require('../');
}

/**
 * Options.
 */

var options = {};

/**
 * Usage information.
 */
//var FileRewriter = require('../lib/rewriter/filerewriter');
//options.rewrite = new FileRewriter();

// Start server
var server = dbsync.create(options);

var User = function User(name){
	this.name = name;
};

var user1 = new User('hello');
var user2 = new User('world');

server.register(user1,user1,function(err,resp){
	console.log('app.js register user1 result error=' + JSON.stringify(err) + ' resp ' + JSON.stringify(resp));
});

server.register(user2,user2,function(err,resp){
	console.log('app.js register user2  result error=' + err + ' resp ' + JSON.stringify(resp));
});

server.get(user1,function(err,resp){
	console.log('app.js get  result error=' + err + ' resp ' + JSON.stringify(resp));
});


setInterval(function(){user1.name = 'hello change ';console.log('change user name');},1000* 60 *1);

