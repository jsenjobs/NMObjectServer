var log4js = require('log4js');
var logger = log4js.getLogger('ControllerUpdate');

var log4js = require('log4js');
var logger = log4js.getLogger('ControllerUpdate');

exports.UpdateBinary = function(req, res) {
    logger.info("Update Binary file Api call");
    req.models.update.Update(req).then(json => {
        res.json(json);
    });
}

exports.UpdateStr = function(req, res) {
    logger.info("Update str file Api call");
    let strName=req.body.strName;
    let str=req.body.str;
    if(str && strName) {
        req.models.update.UpdateStr(strName, str).then(json => {
            res.json(json);
        });
    } else {
        res.json({code:1,msg:'非法参数'})
    }
}

exports.Delete = function(req, res) {
    logger.info("Delete file Api call");
    let fileName = req.params.fileName;
    req.models.update.Delete(fileName).then(json => {
        res.json(json);
    });
}