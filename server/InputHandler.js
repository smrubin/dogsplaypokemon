const exec = require('child_process').exec;

const validKeys = ['w', 's', 'a', 'd', 'z', 'x', 'n', 'm']; // See key.py to see mappings to emulator

class InputHandler {

    constructor() {
        this.lastDirection = this.up(); // Default to up on program start
    }

    getLastDirection() {
        return this.lastDirection;
    }

    setLastDirection(lastDirection) {
        this.lastDirection = lastDirection;
    }

    async handle(input) {
        const key = this.mapInput(input);
        await this.sendKey(key);
        return key;
    }

    async sendKey(key) {
        await exec('python server/sendKey.py' + ' ' + key);
    }

    /**
     *
     * @param input {acceleration: {x: 12.2, y: 99.3, z: -23.4}, orientation: {pitch: 12.3, yaw: -87.3, roll: -90.1}}
     * @returns {string} key One of the valid keys
     */
    mapInput(input) {
        if (!input.acceleration || !input.orientation) {
            throw new Error('Not a valid input. Input must have acceleration and orientation data.');
        }

        const {acceleration, orientation} = input;

        // If the dog rolled, perform that keypress.
        if (this.getRoll(orientation)) {
            return this.getRoll(orientation);
        }

        // If the dog spun or turned, perform that keypress (direction)
        const directionFromOrientation = this.getDirectionFromOrientation(orientation);
        if (directionFromOrientation) {
            this.setLastDirection(directionFromOrientation);
            return directionFromOrientation;
        }

        // If the dog accelerated, perform keypress in direction of acceleration (based on last known direction
        const directionFromAcceleration = this.getDirectionFromAcceleration(acceleration);
        if (directionFromAcceleration) {
            this.setLastDirection(directionFromAcceleration)
            return directionFromAcceleration;
        }

        // If the dog didn't spin or move, just execute an A press.
        return this.a();

        // TODO - Implement B button press.
    }

    /**
     * If the dog rolls in either direction, trigger start or select.
     * This dog action is less common, and we want to bias less to the start and select buttons, which is why we map here.
     * @param orientation
     * @param orientation.pitch The pitch
     * @param orientation.yaw The yaw
     * @param orientation.roll The roll
     * @returns {string | null} key One of the
     */
    getRoll(orientation) {
        const roll = orientation.roll;
        if (roll >= 60 && roll < 180) {
            return this.start();
        }

        if (roll >= 180 && roll < 300) {
            return this.select();
        }

        return null; // The dog didn't roll enough to trigger a button press.
    }

    /**
     * If the dog turns or spins to a new direction, get the new direction that the dog is facing.
     * @param orientation
     * @param orientation.pitch The pitch
     * @param orientation.yaw The yaw
     * @param orientation.roll The roll
     * @returns {string | null} key One of the
     */
    getDirectionFromOrientation(orientation) {
        // Get the direction the dog is current facing so we can get the new direction
        const lastDirection = this.getLastDirection(); // TODO - Need to make sure we only write to this global var when a keypress was directional.
        const lastDegrees = this.getDegreesFromDirection(lastDirection);
        const degreeChange = orientation.yaw;
        const currentDegrees = (lastDegrees + degreeChange) % 360;
        const currentDirection = this.getDirectionFromDegress(currentDegrees);

        // If the dog has a new current direction, emulate that keypress. Otherwise, look at acceleration data to see if it moved without spinning.
        if (currentDirection !== lastDirection) {
            return currentDirection;
        }

        // If the dog didn't spin or turn to a new direction, do nothing.
        return null;
    }

    /**
     * If the dog turns or spins to a new direction, get the new direction that the dog is facing.
     * @param acceleration
     * @param acceleration.x The x-axis acceleration
     * @param acceleration.y The y-axis acceleration
     * @param acceleration.z The z-axis acceleration
     * @returns {string} key One of the
     */
    getDirectionFromAcceleration(acceleration) {
        const lastDirection = this.getLastDirection();
        const lastDegrees = this.getDegreesFromDirection(lastDirection);

        if (acceleration.y > 3) {
            return lastDirection;
        }

        if (acceleration.y < -3) {
            const newDegrees = (lastDegrees + 180) % 360;
            const newDirection = this.getDirectionFromDegress(newDegrees);
            return newDirection;
        }

        // If no accleration, do nothing.
        return null;
    }

    /**
     * Gets the arrow key direction from a yaw degrees
     * @param yaw The yaw degress
     * @returns {string}
     */
    getDirectionFromDegress(yaw) {
        if (yaw >= 45 && yaw < 135) {
            return this.right();
        }

        if (yaw >= 135 && yaw < 225) {
            return this.down();
        }

        if (yaw >= 225 && yaw < 315) {
            return this.left();
        }

        return this.up();
    }

    /**
     * Gets a yaw degree from a directional keypress
     * @param direction The last keypress direction
     * @returns {number} The degrees, either 0, 90, 180, or 270
     */
    getDegreesFromDirection(direction) {
        if (direction === 'w') {
            return 0;
        }

        if (direction === 'd') {
            return 90;
        }

        if (direction === 's') {
            return 180;
        }

        if (direction === 'a') {
            return 270;
        }

        throw new Error('Not a valid direction!');
    }

    up() {
        return 'w';
    }

    down() {
        return 's';
    }

    left() {
        return 'a';
    }

    right() {
        return 'd';
    }

    a() {
        return 'z';
    }

    b() {
        return 'x';
    }

    start() {
        return 'm';
    }

    select() {
        return 'n';
    }
}

exports.InputHandler = (new InputHandler());
