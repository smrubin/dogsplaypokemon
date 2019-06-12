const exec = require('child_process').exec;

function sendKey(key) {
    exec('python key.py' + ' ' + key);
}

exports.sendKey = sendKey;