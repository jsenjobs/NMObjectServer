var log4js = require('log4js');
var logger = log4js.getLogger('ControllerDownload');

function _setHeaders(res, fileName) {
    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename='+fileName
    });
}

exports.Download = function(req, res) {
    // req.params.xxxxx 从path中的变量
    // req.query.xxxxx 从get中的?xxxx=中
    // req.body.xxxxx 从post中的变量
    logger.info('Download Api Call:'+req.params.fileName);
    let fileName = req.params.fileName;

    _setHeaders(res, fileName);

    req.models.download.Download(fileName).then(result => {
        if(result.code === undefined) {
            result.pipe(res);
        } else {
            res.json(result);
        }
    });
}

exports.Show = function(req, res) {
    logger.info('Show Api Call:'+req.params.fileName);
    // console.log("http://"+req.headers.host+req.originalUrl);
    let fileName = req.params.fileName;
    req.models.download.Download(fileName).then(result => {
        if(result.code === undefined) {
            result.pipe(res);
        } else {
            res.json(result);
        }
    });
}