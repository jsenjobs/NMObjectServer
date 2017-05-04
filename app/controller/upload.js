
var log4js = require('log4js');
var logger = log4js.getLogger('ControllerUpload');

exports.UploadBinary = function(req, res) {
    logger.info('Upload Binary file Api call');
    req.models.upload.Upload(req).then(json => {
        res.json(json);
    });
}

exports.UploadStr = function(req, res) {
    logger.info('Upload str file Api call');
    let strName=req.body.strName;
    let str=req.body.str;
    if(str && strName) {
        req.models.upload.UploadStr(strName, str).then(json => {
            res.json(json);
        });
    } else {
        res.json({code:1,msg:'非法参数'})
    }
}
