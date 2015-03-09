var Class          = require('class.extend'),
    Q              = require('q'),
    BaseController = require('./Base');

/**
 * SiteController Class
 * @extends {BaseController}
 */
var SiteController = BaseController.extend({

    /**
     * @constructor
     * @param {BaseModel} model
     */
    init: function (model) {
        this._super(model);
    },

    /**
     * Root path of users
     */
    index: function () {
        var deferred = Q.defer();
        this.model.collection().find({}, {}, function (err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
});

module.exports = SiteController;