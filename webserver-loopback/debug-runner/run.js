"use strict";

var fs           = require('./fs'),
    childprocess = require('./childprocess'),
    path         = require('path');

/**
 * Start mongodb server
 * @returns {Promise}
 */
function startMongodbServer() {
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
/**
 * Clean up code
 * @return {function}
 */
function cleanUp() {
    var exit = function () {
        process.exit(0);
    };
    childprocess('killall mongod', 'Stop running mongodb servers', true).then(exit, exit);
}

/**
 * Error handler
 * @param {string} err
 */
function onError(err) {
    console.error(err);
    process.exit(0);
}

/**
 * When node process received the SIGTERM or SIGINT command clean up code
 * @return {function}
 */
process.on('SIGTERM', cleanUp);
process.on('SIGINT', cleanUp);



//   ____                                          _
//  |  _ \ _   _ _ __    _ __  _ __ ___  _ __ ___ (_)___  ___
//  | |_) | | | | '_ \  | '_ \| '__/ _ \| '_ ` _ \| / __|/ _ \
//  |  _ <| |_| | | | | | |_) | | | (_) | | | | | | \__ \  __/
//  |_| \_\\__,_|_| |_| | .__/|_|  \___/|_| |_| |_|_|___/\___|
//                      |_|
fs.isLoopBackDir(path.resolve(__dirname, '../'))

    .then(fs.dirContainsPackagejson, onError)

    .then(function () {
        return childprocess('npm install', 'Install webserver node packages');
    }, onError)

    .then(fs.dirDataExist, onError)

    .then(function () {
        return childprocess('killall mongod', 'Stop running mongodb servers', true);
    }, onError)

    .then(startMongodbServer, startMongodbServer)

    .then(function () {
        //childprocess('slc run .', 'Run webserver using `slc run`');
        // @todo: check why slc cant run!!
    }, onError)

    .then(function () {
        console.log('Up and running...');
    }, onError);

/*
 @todo:

 - Run mongodb in LoopBack
 - Create Site model
 - Write test to insert site
 - Write test to get site
 */
