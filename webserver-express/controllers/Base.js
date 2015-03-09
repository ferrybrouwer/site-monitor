var Class = require('class.extend');

/**
 * BaseController Class
 */
var BaseController = Class.extend({
    model: null,

    /**
     * @constructor
     * @param {BaseModel} model
     */
    init: function (model) {
        this.model = model;
    }
});

module.exports = BaseController;