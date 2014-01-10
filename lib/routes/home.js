exports.index = function (req, res) {
    var model = {
        title: 'Vision App',
        description: 'A project-based dashboard for GitHub',
        author: 'Michael Allan',
        user: 'growlybear',
        sample: 'Some sample text'
    };

    res.render('index', model);
};
