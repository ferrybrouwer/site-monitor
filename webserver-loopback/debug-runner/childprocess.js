"use strict";

var exec = require('child_process').exec;

/**
 * Execute child process
 *
 * @param {string} cmd
 * @param {string} description
 * @param {boolean} silence
 * @param {boolean} preventKill
 * @returns {Promise}
 */
module.exports = function (cmd, description, silence, preventKill) {
    preventKill = preventKill || false;
    silence = silence || false;

    if (typeof description === 'string') {
        console.log(description + '...');
    }

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
}
