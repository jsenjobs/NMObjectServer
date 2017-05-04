
var log4js = require('log4js');
var logger = log4js.getLogger('ServiceUpdate');
var Promise = require("bluebird");

let UUID = require('uuid');
var fs = Promise.promisifyAll(require("fs"));

const multiparty = Promise.promisifyAll(require('multiparty'));

const Mongo = require('../db').mongoose;

function _DoDelete(fileName) {
    return Mongo.GetGFS().removeAsync({filename: fileName});
}

function _saveFile(fileData) {
    let fName = fileData.originalFilename;
    let id = UUID.v1();
    let path = fileData.path;
    let option = {_id: id, filename: fName, content_type: fileData.headers['content-type']};
    return Mongo.GetGFS()
        .existAsync({filename: fName})
        .then(found => {
            return found ? _DoDelete(fName).then(()=>"覆盖") : "保存";
        })
        .catch(e => {
            return {code: 1, msg: '删除文件出错'};
        })
        .then((type) => {
            return Mongo.saveFile(option, path).then(result => {
                if (result) return {code: 0, msg: type + '成功'};
                return {code: 1, msg: type + '失败'};
            });
        });
}

exports.Update = function(req) {
    // parse a file upload
    var form = new multiparty.Form();
    return form.parseAsync(req)
        .spread((fields, files) => {
            return files.file
        })
        .each(fileData => _saveFile(fileData).then((stat) => fileData.stat = stat))
        .map(fileData => {
            fs.unlinkAsync(fileData.path);
            return {filename: fileData.originalFilename, stat: fileData.stat};
        }).then((fileData) => {
            let json = {code: 0};
            json._links = fileData;
            return json;
        });
}

exports.UpdateStr = function(strName, str) {
    return Mongo.GetGFS().existAsync({filename: strName}).then(found => {
        console.log(found);
        return found ? _DoDelete(strName).then(()=>"覆盖") : "保存";
    }).then(type => {
        let id = UUID.v1();
        return Mongo.saveStr({_id: id, filename: strName}, str).then(result => {
            if (result) return {code: 0, msg: type + '成功'};
            return {code: 1, msg: type + '失败'};
        });
    });
}

exports.Delete = function(fileName) {
    return Mongo.GetGFS().removeAsync({filename: fileName}).then(() => {
        return {code: 0}
    })
        .catch(() => {
            return {code: 1, msg: '删除文件失败', filename: fileName}
        });
}

