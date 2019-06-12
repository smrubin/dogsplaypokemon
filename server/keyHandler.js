const exec = require('child_process').exec;

const validInputs = ['w', 's', 'a', 'd', 'z', 'x', 'n', 'm']; // See key.py to see mappings to emulator

async function sendKey(key) {
    if (!validInputs.includes(key)) {
        throw new Error('Not a valid input');
    }

    await exec('python key.py' + ' ' + key);

    return key;
}

exports.sendKey = sendKey;
