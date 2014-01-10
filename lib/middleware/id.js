exports.validate = function (req, res, next, id) {
    // TODO this pattern should be tested
    var isValidMongoId = /^[0-9a-fA-F]{24}$/;

    if (!isValidMongoId.test(id)) {
        return res.json(400, 'Bad Request');
    }

    next();
};
