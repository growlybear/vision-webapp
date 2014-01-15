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
    repositoryListView:'',

    routes: {
        '': 'index',
        'add': 'add'
    },

    initialize: function () {
        this.project();
        this.listenTo(this.projectListView, 'join', this.join);
    },

    index: function () {
        this.projectListView.render();
    },

    add: function () {
        this.projectListView.showForm();
    },

    project: function () {
        this.projectListView = new Vision.ProjectListView();
    },

    join: function (args) {
        this.repository(args);
    },

    repository: function (args) {
        this.repositoryListView = new Vision.RepositoryListView({
            el: 'ul#repository-list',
            projectId: args.projectId
        });
    }
});


Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);


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
    },

    validate: function (attrs) {
        var errors = [];
        if (attrs.name === '') errors.push("Please enter a name");

        if (errors.length > 0) {
            return errors;
        }
    }
});

Vision.ProjectView = Backbone.View.extend({
    tagName: 'li',

    viewTemplate: visiontemplates['lib/express/templates/projects.hbs'],
    formTemplate: visiontemplates['lib/express/templates/project-form.hbs'],

    events: {
        'click a'            : 'repository',
        'click button.save'  : 'save',
        'click button.cancel': 'cancel'
    },

    render: function () {
        var project = this.viewTemplate(this.model.toJSON());
        this.$el.html(project);
        return this;
    },

    repository: function () {
        var data = {
            projectId: this.model.toJSON()._id
        };
        this.eventAggregator.trigger('repository:join', data);
    },

    add: function () {
        this.$el.html(this.formTemplate(this.model.toJSON()));
        this.repository({ editMode: false });
    },

    cancel: function () {
        var projectId = this.model.toJSON()._id;

        if (this.model.isNew()) {
            this.remove();
        }
        else {
            this.render();
            this.repository();
        }

        Backbone.history.navigate('index', true);
    },

    save: function (e) {
        e.preventDefault();

        var self = this,
            formData = {},
            projectId = this.model.toJSON()._id;

        // FIXME this application logic interferes with Bootstrap styling
        $(e.target).closest('form')
            .find(':input').not('button')
            .each(function () {
                formData[$(this).attr('class')] = $(this).val();
            });

        if (!this.model.isValid()) {
            self.formError(self.model, self.model.validationError, e);
        }
        else {
            formData.repositories = $('#repository-list')
                .find('input:checkbox:checked')
                .map(function () {
                    return $(this.val());
                }).get();
        }

        this.model.save(formData, {
            error: function (model, response) {
                self.formError(model, response, e);
            },
            success: function (model, response) {
                self.render();
                self.repository();

                Backbone.history.navigate('index', true);
            }
        });
    },

    formError: function (model, errors, e) {
        $(e.target).closest('form').find('.errors').html('');

        _.each(errors, function (err) {
            // FIXME better error handling
            $(e.target).closest('form').find('.errors').append(
                '<li>' + err + '</li>'
            );
        });
    }
});

Vision.ProjectListView = Backbone.View.extend({
    Projects: [],

    el: $('ul#projects-list'),

    initialize: function () {
        this.eventAggregator.on('repository:join', this.repository, this);

        this.collection = new Vision.ProjectList(this.Projects);
        this.collection.on('add',    this.add,    this);
        this.collection.on('reset',  this.render, this);
        this.collection.on('remove', this.remove, this);
    },

    repository: function (args) {
        this.trigger('join', args);
    },

    add: function (project) {
        var projectView = new Vision.ProjectView({
            model: project
        });

        this.$el.append(projectView.render().el);

        return projectView;
    },

    showForm: function () {
        this.add(new Vision.Project()).add();
    }
});


Vision.Repository = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        description: '',
        enabled: ''
    }
});

Vision.RepositoryList = Backbone.Collection.extend({
    projectId: '',
    model: Vision.Repository,

    url: function () {
        return '/project/' + this.projectId + '/repos';
    },

    initialize: function (items, item) {
        this.projectId = item.projectId;
    },

    parse: function (response) {
        response.id = response._id;
        return response;
    }
});

Vision.RepositoryView = Backbone.View.extend({
    tagName: 'li',
    viewTemplate: visiontemplates['lib/express/templates/repositories.hbs'],

    render: function () {
        this.$el.html(this.viewTemplate(this.model.toJSON()));
        return this;
    }
});

Vision.RepositoryListView = Backbone.View.extend({
    Repositories: [],

    initialize: function (args) {
        if (!args.projectId) return false;
        var self = this;

        this.$el.html('');
        this.collection = new Vision.RepositoryList(this.Repositories, {
            projectId: args.projectId
        });
        this.collection.fetch({success: function () {
            self.render();
        }});
    },

    render: function () {
        _.each(this.collection.models, function (item) {
            this.add(item);
        }, this);
    },

    add: function (item) {
        var repositoryView = new Vision.RepositoryView({
            model: item
        });

        this.$el.append(repositoryView.render(this.editMode).el);

        return repositoryView;
    }
});


$(document).ready(function () {
    var app = new Vision.Application();
    app.start();
});
