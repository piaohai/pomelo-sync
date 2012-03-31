/**
 * Module dependencies.
 */

try {
  var DBsync = require('dbsync');
} catch (err) {
  var DBsync = require('../');
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


// new DBsync
var sync = new DBsync(this,options);

var User = function User(name){
	this.name = name;
};

var user1 = new User('hello');
var user2 = new User('world');

var key = 'hello';

sync.set(key,user1,function(err,resp){
	console.log('app.js register user1 result error=' + JSON.stringify(err) + ' resp ' + JSON.stringify(resp));
});

sync.set('world',user2,function(err,resp){
	console.log('app.js register user2  result error=' + err + ' resp ' + JSON.stringify(resp));
});

sync.get(key,function(err,resp){
	console.log(' app.js get  result error=' + err + ' resp ' + JSON.stringify(resp));
});

