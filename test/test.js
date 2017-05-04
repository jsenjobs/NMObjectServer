
require('../app/utils/env').env.ENVSET();
require('./log4jConfig').set();

var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent');
var expect = require('expect.js');

describe('server', function () {
	before(function() {
		boot();
	});

describe('homepage', function() {
	it('should respond to GET', function(done) {
		superagent.get('http://localhost:'+port).end(function(res){
			expect(res.status).to.equal(404);
			done();
		})
	});
	it('should respond to GET', function(done) {
		superagent.get('http://localhost:'+port+'/user/ol/logout').end(function(res){
			expect(res.status).to.equal(404);
			done();
		})
	});
})

after(function() {
	shutdown();
})
})