// exports vendor
var express      = require('express'),
    path         = require('path'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    mongo        = require('mongodb'),
    monk         = require('monk');

// config
var config = require('./config');

// routes
var routes = require('./routes/index'),
    users  = require('./routes/users'),
    sites  = require('./routes/sites');

// monitor classes
var SiteModel      = require('./models/Site'),
    SiteController = require('./controllers/Site');

/**
 * Monitor Class
 * @constructor
 */
var Monitor = function () {
    this._setupExpress();
    this._setupDatabase();
    this._setHeaders();
    this._attachControllers();
    this._setMiddleware();
    this._handleErrorRequests();
};

Monitor.prototype = {
    constructor: Monitor,
    app: null,
    db: null,
    models: {},
    controllers: {},

    _setupExpress: function () {
        this.app = express();

        // view engine setup
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'jade');

        // setup default middleware
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    },

    _setupDatabase: function () {
        this.db = monk(config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database);
    },

    _setHeaders: function () {
        this.app.use(function (req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            //res.setHeader('Access-Control-Allow-Credentials', true);

            // Pass to next layer of middleware
            next();
        });
    },

    _attachControllers: function () {
        // site model and -controller
        this.models.site = new SiteModel(this.db, 'sitecollection');
        this.controllers.site = new SiteController(this.models.site);

        // attach controllers to resources for every http request
        this.app.use((function (req, res, next) {
            req.controllers = this.controllers;
            next();
        }).bind(this));
    },

    _setMiddleware: function () {
        this.app.use('/api', routes);
        this.app.use('/api/sites', sites);
        this.app.use('/api/users', users);
    },

    _handleErrorRequests: function () {
        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // handler: development error handler, will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // handler: production error handler, no stacktraces leaked to user
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
};


var monitor = new Monitor();
module.exports = monitor.app;