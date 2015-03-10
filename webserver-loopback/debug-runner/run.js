"use strict";

var path         = require('path'),
    fs           = require('./fs'),
    childprocess = require('./childprocess');

/**
 * DebugRunner Class
 * @constructor
 */
function DebugRunner() {
    // attach terminate signals to cleanup processes
    process.on('SIGTERM', this.cleanup);
    process.on('SIGINT', this.cleanup);

    // start promise
    this.startPromise();
}

DebugRunner.prototype = {
    constructor: DebugRunner,

    /**
     * Start promise running
     */
    startPromise: function() {
        // check if directory is a LoopBack project directory
        fs.isLoopBackDir(path.resolve(__dirname, '../'))

            // check if LoopBack directory contains a package.json
            .then(fs.dirContainsPackagejson, this.onError)

            // when package.json is found in LoopBack project directory, install dependency packages
            .then(function () {
                return childprocess('npm install', 'Install webserver node packages');
            }, this.onError)

            // check if data directory exist, to store database (mongodb) files
            .then(fs.dirDataExist, this.onError)

            // when data directory exists, first kill current running mongodb server process
            .then(function () {
                return childprocess('killall mongod', 'Stop running mongodb servers', true);
            }, this.onError)

            // restart mongodb server, even when previous running mongod process returns a signal
            .then(this.startServer, this.startServer)

            // start LoopBack webserver by the `slc run` command
            .then(function () {
                //childprocess('slc run .', 'Run webserver using `slc run`');
                // @todo: check why slc cant run!!
            }, this.onError)

            // show notification server is up and running
            .then(function () {
                console.log('Up and running...');
            }, this.onError);
    },

    /**
     * Clean up mongodb server process
     */
    cleanup: function () {
        childprocess('killall mongod', 'Stop running mongodb servers', true)
            .then(this.exit, this.exit);
    },

    /**
     * Error handler
     * @param {string} err
     */
    onError: function (err) {
        console.error(err);
        this.exit();
    },

    /**
     * Exit process
     */
    exit: function () {
        process.exit(0);
    },

    /**
     * Start Mongodb server in debian mode using --fork
     * @returns {Promise}
     */
    startServer: function () {
        var cmd = [
            'mongod',
            '--dbpath ' + path.resolve(__dirname, '../../', 'data'),
            '--port 12345',
            '--fork',
            '--noauth',
            '--logpath ' + path.resolve(__dirname, '../../', 'logs') + '/mongodb.log'
        ].join(' ');

        return childprocess(cmd, 'Start mongodb server', false, true);
    }
};

// instantiate debug runner
module.exports = new DebugRunner();

/*
 @todo:

 - Run mongodb in LoopBack
 - Create Site model
 - Write test to insert site
 - Write test to get site
 */
