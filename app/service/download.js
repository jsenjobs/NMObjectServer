
let  Mongo = require('../db').mongoose;
exports.Download = function(fileName) {
    // 实现文件下载
    // Mongo.readingFile({filename:fileName}, res);
    return Mongo.GetGFS().existAsync({filename:fileName}).then(found => {
        if(found) {
            return Mongo.GetGFS().createReadStream({filename:fileName});
        } else {
            return {code:1, msg:'文件不存在'};
        }
    });
}
