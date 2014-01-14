var Vision = Vision || {};

Vision.Application = function () {
    this.start = function () {
        var router = new Vision.Router();

        Backbone.history.start();
        router.navigate('index', true);
    };
};

Vision.Router = Backbone.Router.extend({
    projectListView: '',

    routes: {
        '': 'index'
    },

    initialize: function () {
        this.project();
    },

    project: function () {
        this.projectListView = new Vision.ProjectListView();
    },

    index: function () {
        this.projectListView.render();
    }
});

Vision.Project = Backbone.Model.extend({
    defaults: {
        id: '',
        name: ''
    },

    idAttribute: '_id',
    urlRoot: '/project'
});

Vision.ProjectList = Backbone.Collection.extend({
    model: Vision.Project,

    url: function () {
        return '/project/';
    },

    initialize: function () {
        this.fetch();
    }
});

Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

Vision.ProjectListView = Backbone.View.extend({
    Projects: [],

    el: $('ul#projects-list'),

    initialize: function () {
        this.collection = new Vision.ProjectList(this.Projects);
        this.collection.on('add', this.add, this);
    },

    add: function (project) {
        var projectView = new Vision.ProjectView({
            model: project
        });

        this.$el.append(projectView.render().el);

        return projectView;
    }
});

Vision.ProjectView = Backbone.View.extend({
    tagName: 'li',

    viewTemplate: visiontemplates['lib/express/templates/projects.hbs'],

    render: function () {
        var project = this.viewTemplate(this.model.toJSON());
        this.$el.html(project);
        return this;
    }
});

$(document).ready(function () {
    var app = new Vision.Application();
    app.start();
});
