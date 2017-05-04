

var log4js = require('log4js');
var logger = log4js.getLogger('ServiceUpload');
var Promise = require("bluebird");

let UUID = require('uuid');
var fs = Promise.promisifyAll(require("fs"));

const multiparty = Promise.promisifyAll(require('multiparty'));

const  Mongo = require('../db').mongoose;

function _saveFile(fileData) {
    // console.log(fileData);

    let fName = fileData.originalFilename;
    return Mongo.GetGFS().existAsync({filename:fName}).then(found => {
        if(!found) {
            let id = UUID.v1();
            let path = fileData.path;
            return Mongo.saveFile({_id:id, filename:fName, content_type:fileData.headers['content-type']}, path);
        } else {
            return false;
        }
    }).then(result => {
        return result?{code:0,_link:fName}:{code:1,msg:'文件存在'};
    });
}

exports.Upload = function(req) {
    // parse a file upload
    var form = new multiparty.Form();
    return form.parseAsync(req)
        .spread((fields, files) =>  {return files.file})
        .each(fileData => _saveFile(fileData).then((stat) => fileData.stat = stat))
        .map(fileData => {
            fs.unlinkAsync(fileData.path);
            return {filename:fileData.originalFilename, stat:fileData.stat};
        }).then((fileData) => {
            let json = {code:0};
            json._links = fileData;
            return json;
        });
}

exports.UploadStr = function(strName, str) {
    return Mongo.GetGFS().existAsync({filename:strName}).then(found => {
        if(!found) {
            let id = UUID.v1();
            Mongo.saveStr({_id:id, filename:strName}, str);
            return {code:0,_link:strName};
        } else {
            return {code:1,msg:'文件存在'};
        }
    });
}


