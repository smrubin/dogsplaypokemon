const exec = require('child_process').exec;

const validKeys = ['w', 's', 'a', 'd', 'z', 'x', 'n', 'm']; // See key.py to see mappings to emulator

class InputHandler {

    async handle(input) {
        const key = this.mapInput(input);
        await this.sendKey(key);
        return key;
    }

    async sendKey(key) {
        await exec('python server/sendKey.py' + ' ' + key);
    }

    // TODO - Map the sensor input data to one of the valid keys
    mapInput(input) {
        if (!validKeys.includes(input)) {
            throw new Error('Not a valid input');
        }

        return input;
    }
}

exports.InputHandler = (new InputHandler());
