/**
 * Created by jsen on 2017/4/17.
 */

var log4js = require('log4js');
var logger = log4js.getLogger('MongoseIniter');

var Promise = require("bluebird");
var join = Promise.join;

let Readable = require('stream').Readable;


let mongoose = require('mongoose');
const Grid = require('gridfs-stream');
mongoose.Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));

Grid.mongo = mongoose.mongo;

let gfs;

exports.saveFile = function(option, path) {
    return join(gfs.createWriteStream(option), fs.createReadStream(path), function(wS, rS) {
        rS.pipe(wS);
        return true;
    }).error(() => {
        return false;
    });
}
exports.saveStr = function(option, str) {
    let rS = new Readable;
    rS.push(str);
    rS.push(null);
    return join(gfs.createWriteStream(option), rS, (wS, rS) => {
        rS.pipe(wS);
        return true;
    }).error(() => {
        return false;
    });
}

exports.GetGFS = function() {
    return gfs;
}

exports.boot = function() {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.connect(process.env.MongoUrl + '/' + process.env.MongoTable, options);
    let conn = mongoose.connection;
    gfs = Grid(conn.db);
    Promise.promisifyAll(gfs);
    conn.on('error', (err) => {
        logger.error(err);
    })
    // .on('disconnected', this.Init(app))
    .once('open', () => {
        logger.info('MongoDB open');
    });
}