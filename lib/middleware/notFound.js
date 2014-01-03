var logger = require('../logger');

exports.index = function (req, res, next) {
    logger.error(req.url, 'Not Found');
    res.json(404, 'Not Found');
};
