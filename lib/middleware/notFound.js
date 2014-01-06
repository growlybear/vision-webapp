var logger = require('../logger');

/*jshint -W098:true */
exports.index = function (req, res, next) {
/*jshint -W098:false */
    logger.error(req.url, 'Not Found');
    res.json(404, 'Not Found');
};
