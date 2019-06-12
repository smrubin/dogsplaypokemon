const exec = require('child_process').exec;

const validKeys = ['w', 's', 'a', 'd', 'z', 'x', 'n', 'm']; // See key.py to see mappings to emulator

async function handle(input) {
    const key = mapInput(input);
    await sendKey(key);
    return key;
}

const sendKey = async key => {
    await exec('python sendKey.py' + ' ' + key);
};

// TODO - Map the sensor input data to one of the valid keys
const mapInput = input => {
    if (!validKeys.includes(input)) {
        throw new Error('Not a valid input');
    }

    return input;
};

exports.handle = handle;
