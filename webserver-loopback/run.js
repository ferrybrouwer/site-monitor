"use strict";

var exec = require('child_process').exec,
    fs   = require('fs'),
    path = require('path');

/**
 * Execute child process
 *
 * @param {string} cmd
 * @param {boolean} silence
 * @param {boolean} preventKill
 */
function childprocess(cmd, silence, preventKill) {
    preventKill = preventKill || false;
    silence = silence || false;

    return new Promise(function (fulfill, reject) {
        var p = exec(cmd, function (err, stdout, stderr) {
            if (!preventKill) {
                p.kill();
            }

            if (err) {
                reject(stderr);
            } else {
                fulfill(stdout);
            }
        });

        if (!silence) {
            p.stdout.setEncoding('utf8');
            p.stdout.pipe(process.stdout);
            p.stderr.pipe(process.stderr);
        }
    });
};




// first install global packages
//console.log('Installing global packages...');
//childprocess('npm install -g strongloop && npm install -g npm')

// check if current directory is the project webserver-loopback directory and contains the server.js script
console.log('Check if server.js is available...');
(function () {
    return new Promise(function (fulfill, reject) {
        if (path.basename(__dirname) === 'webserver-loopback' && fs.existsSync('./server/server.js')) {
            fulfill();
        } else {
            reject('Could not run server, make sure you are in `webserver-loopback` which contains the script `server.js`');
        }
    });
})()

    // check for ./package.json
    .then(function () {
        console.log('Check if `webserver-loopback` contains a `package.json` file...');
        return new Promise(function (fulfill, reject) {
            if (!fs.existsSync('./package.json')) {
                reject('could not find a `package.json`');
            } else {
                fulfill();
            }
        });
    }, function (err) {
        console.error(err);
        process.exit(1);
    })

    // npm install for package.json
    .then(function () {
        console.log('Install webserver node packages...');
        return childprocess('npm install');
    }, function (err) {
        console.error(err);
        process.exit(1);
    })

    // run mongodb instance and run webserver
    .then(function () {
        var dataPath = path.resolve(__dirname, '../', 'data'),
            logPath = path.resolve(__dirname, '../', 'logs');

        if (fs.existsSync(dataPath)) {
            console.log('Stop running mongodb servers...');
            childprocess('killall mongod')
                .then(function() {
                    console.log('Start mongodb server...');
                    return childprocess('mongod --dbpath=' + dataPath + ' --port 12345 --fork --auth --logpath ' + logPath + '/mongodb.log', false, true);
                }, function() {
                    console.log('Start mongodb server...');
                    return childprocess('mongod --dbpath=' + dataPath + ' --port 12345 --fork --auth --logpath ' + logPath + '/mongodb.log', false, true);
                })
                .then(function () {
                    console.log('Mongodb server is running.');
                }, function () {
                    console.error('Cannot start mongodb server');
                    process.exit(1);
                });
        }

        console.log('Run webserver...');
        return childprocess('slc run .');
    });



/*
    @todo:

    - Run mongodb in LoopBack
    - Create Site model
    - Write test to insert site
    - Write test to get site
*/
