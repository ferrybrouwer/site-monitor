var Class     = require('class.extend'),
    BaseModel = require('./Base');

/**
 * SiteModel
 * @extends {BaseModel}
 */
var SiteModel = BaseModel.extend({

    /**
     * @constructor
     * @param {Collection} db
     * @param {string} collectionName
     */
    init: function (db, collectionName) {
        this._super(db, collectionName);
    }
});

module.exports = SiteModel;