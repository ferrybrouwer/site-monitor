var Class = require('class.extend');

/**
 * BaseModel Class
 */
var BaseModel = Class.extend({
    db: null,
    _collectioName: null,
    _collection: null,

    /**
     * @constructor
     * @param {Collection} db
     * @param {string} collectionName
     */
    init: function (db, collectionName) {
        this.db = db;
        this._collectionName = collectionName;
    },

    /**
     * Get collection
     * @returns {*}
     */
    collection: function () {
        if (this._collection) {
            return this._collection;
        }
        this._collection = this.db.get(this._collectionName);
        return this._collection;
    }
});


module.exports = BaseModel;