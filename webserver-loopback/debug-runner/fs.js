"use strict";

var fs = require('fs'),
    path = require('path');

/**
 * Check if directory contains package.json
 * @param {string] path [optional]
 * @returns {Promise}
 */
fs.dirContainsPackagejson = function () {
    console.log('Check if `webserver-loopback` contains a `package.json` file...');
    return new Promise(function (fulfill, reject) {
        if (!fs.existsSync('../package.json')) {
            reject('could not find a `package.json`');
        } else {
            fulfill();
        }
    });
};

/**
 * Check if data directory exists
 * @returns {Promise}
 */
fs.dirDataExist = function() {
    return new Promise(function (fulfill, reject) {
        if (fs.existsSync(path.resolve(__dirname, '../../', 'data'))) {
            fulfill();
        } else {
            reject('Data directory does not exists.');
        }
    });
};


/**
 * Check if debug-runner is inside a LoopBack project
 * @returns {Promise}
 */
fs.isLoopBackDir = function(dir) {
    console.log('Check if debug-runner is inside LoopBack project...');
    return new Promise(function (fulfill, reject) {
        if (path.basename(dir) === 'webserver-loopback' && fs.existsSync(dir + '/server/server.js')) {
            fulfill();
        } else {
            reject('Directory ' + dir + ' is not a valid LoopBack project directory.');
        }
    });
}

module.exports = fs;
