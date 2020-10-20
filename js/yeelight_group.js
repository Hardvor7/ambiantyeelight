const { Yeelight } = require('yeelight-node');

class YeelightGroup {
    constructor(yeelights = []) {
        this.yeelights = yeelights;
    }

    _callOnGroup(callback, ...kwargs) {
        const returns = {}
        this.yeelights.forEach(
            yeelight => {
                console.log(yeelight.id,  kwargs)
                returns[yeelight.id] = callback.call(yeelight, ...kwargs);
            }
        );
        return returns;
    }


    /**
     * Establish the connection to the LED, and set the listeners
     * and event passthrough
     */
    _connect() {
        this._callOnGroup(Yeelight.prototype._connect);
    }

    /**
     * Wrap and send the TCP JSON command to the LED, and asynchronously
     * get the response
     * @param {Object} objectCommand The command structure to send to the LED
     */
    async _sendCommand(objectCommand) {
        return this._callOnGroup(Yeelight.prototype._sendCommand, objectCommand);
    }

    /**
     * Limit a number to stay between the range of min and max
     * @param {Number} input The base number to constrain
     * @param {Number} min The minimum allowed value
     * @param {Number} max The maximum allowed value
     */
    _constrain(input = 0, min = 0, max = 0) {
        return  this._callOnGroup(
            Yeelight.prototype._constrain, input, min, max
        );
    }

    /**
     * Return a boolean indicating whether or not the needle is present in the haystack
     * @param {*} needle What you are searching for
     * @param {Array} haystack Array to search against
     */
    _inArray(needle = '', haystack = []) {
        return  this._callOnGroup(
            Yeelight.prototype._inArray, needle, haystack
        );
    }

    /**
     * Check if a provided value is allowed, and if not, replace it with a valid fallback
     * @param {*} needle User supplied value
     * @param {Array} haystack Permitted values
     * @param {*} fallback The default, if the provided value is bad
     */
    _ifValid(needle = '', haystack = [], fallback = '') {
        return this._callOnGroup(
            Yeelight.prototype._ifValid, needle, haystack, fallback
        );
    }

    /**
     * Close TCP connection to lamp
     */
    closeConnection() {
        this._callOnGroup(Yeelight.prototype.closeConnection);
    }

    /**
     * Toggle the state of the main light
     */
    toggle() {
        return this._callOnGroup(Yeelight.prototype.toggle);
    }

    /**
     * Toggle the state of the background light if applicable
     */
    bg_toggle() {
        return this._callOnGroup(Yeelight.prototype.bg_toggle);
    }

    /**
     * Toggle the state of both the main and background light
     */
    dev_toggle() {
        return this._callOnGroup(Yeelight.prototype.dev_toggle);
    }

    /**
     * This method is used to retrieve the current properties of the smart LED.
     * @param {String} first The property of the light you want to get
     * @param {String} other The other properties (if more than 1)
     */
    get_prop(first, ...other) {
        return this._callOnGroup(
            Yeelight.prototype.get_prop, first, ...other
        );
    }

    /**
     * Set the color temperature
     * @param {number} ct_value The color temperature as an int between 1700 and 6500 (k)
     * @param {string} effect Either the string 'smooth' or 'sudden'
     * @param {number} duration the time in ms that the effect will take to execute (min 30)
     */
    set_ct_abx(ct_value = 6500, effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.set_ct_abx, ct_value, effect, duration
        );
    }

    /**
     * Set the RGB color of the light
     * @param {Array} rgb Array of R,G,B as values between 0 and 255
     * @param {String} effect Either 'smooth' or 'sudden'
     * @param {Number} duration
     */
    set_rgb(rgb = [255, 255, 255], effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.set_rgb, rgb, effect, duration
        );
    }

    /**
     * This method is used to change the color of the smart LED
     * @param {Number} hue Target hue value between 0 and 359
     * @param {Number} sat Target Saturation value between 0 and 100
     * @param {String} effect The desired transition effect
     * @param {Number} duration The Transition time in ms
     */
    set_hsv(hue = 255, sat = 45, effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.set_hsv, hue, sat, effect, duration
        );
    }

    /**
     * This method is used to change the color of the background smart LED
     * @param {Number} hue Target hue value between 0 and 359
     * @param {Number} sat Target Saturation value between 0 and 100
     * @param {String} effect The desired transition effect
     * @param {Number} duration The Transition time in ms
     */
    bg_set_hsv(hue = 255, sat = 45, effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.bg_set_hsv, hue, sat, effect, duration
        );
    }

    /**
     * This method is used to change the brightness of the Smart LED
     * @param {Number} brightness The desired brightness between 1 and 100
     * @param {String} effect Either the string 'sudden' or 'smooth'
     * @param {Number} duration the time in ms for the transition to take effect
     */
    set_bright(brightness = 50, effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.set_bright, brightness, effect, duration
        );
    }

    /**
     * This method is used to change the brightness of the background Smart LED
     * @param {Number} brightness The desired brightness between 1 and 100
     * @param {String} effect Either the string 'sudden' or 'smooth'
     * @param {Number} duration the time in ms for the transition to take effect
     */
    bg_set_bright(brightness = 50, effect = 'smooth', duration = 500) {
        return this._callOnGroup(
            Yeelight.prototype.bg_set_bright, brightness, effect, duration
        );
    }

    /**
     * This method is used to switch the Smart LED on or off at the software level
     * @param {String} power Either the string 'on' or 'off'
     * @param {String} effect Either the string 'sudden' or 'smooth'
     * @param {Number} duration The duration in ms for the transition to occur
     * @param {Number} mode 0 = normal, 1 = CT mode, 2 = RGB mode, 3 = HSV mode, 4 = CF mode, 5 = Night mode
     */
    set_power(power = 'on', effect = 'smooth', duration = 500, mode = 0) {
        return this._callOnGroup(
            Yeelight.prototype.set_power, power, effect, duration, mode
        );
    }

    /**
     * This method is used to switch the background Smart LED on or off at the software level
     * @param {String} power Either the string 'on' or 'off'
     * @param {String} effect Either the string 'sudden' or 'smooth'
     * @param {Number} duration The duration in ms for the transition to occur
     * @param {Number} mode 0 = normal, 1 = CT mode, 2 = RGB mode, 3 = HSV mode, 4 = CF mode, 5 = Night mode
     */
    bg_set_power(power = 'on', effect = 'smooth', duration = 500, mode = 0) {
        return this._callOnGroup(
            Yeelight.prototype.bg_set_power, power, effect, duration, mode
        );
    }

    /**
     * This method saves the current state of the smart LED to memory
     */
    set_default() {
        return this._callOnGroup(Yeelight.prototype.set_default);
    }

    /**
     * This method saves the current state of the background Smart LED to memory
     */
    bg_set_default() {
        return this._callOnGroup(Yeelight.prototype.bg_set_default);
    }

    /**
     *
     * @param {Number} count The number of state changes before color flow stops. 0 = infinite
     * @param {Number} action The action after stopping CF. 0 = revert to previous state, 1 stay at state when stopped, 2 = turn off smart LED
     * @param {Array} flow A series of tuples defining the [duration, mode, value, brightness]
     */
    start_cf(count = 0, action = 0, flow = []) {
        return this._callOnGroup(
            Yeelight.prototype.start_cf, count, action, flow
        );
    }

    /**
     * This method is used to stop a running color flow
     */
    stop_cf() {
        return this._callOnGroup(Yeelight.prototype.stop_cf);
    }

    /**
     * This method sets the LED directly to a specified state
     * @param {String} action The type of action being performed
     * @param {*} args Parameters to be passed depedning on the chosen action
     */
    set_scene(action, ...args) {
        return this._callOnGroup(Yeelight.prototype.set_scene, action, ...args);
    }

    /**
     * Set a timer job on the LED
     * @param {Number} type Currently only 0 (power off)
     * @param {Number} value Timer length in minutes
     */
    cron_add(type = 0, value = 1) {
        return this._callOnGroup(Yeelight.prototype.cron_add, type, value);
    }

    /**
     * Get running timer jobs of the specified type
     * @param {Number} type Currently only 0 (power off)
     */
    cron_get(type = 0) {
        return this._callOnGroup(Yeelight.prototype.cron_get, type);
    }

    /**
     * Stop the specified cron job
     * @param {Number} type Currently only 0 (power off)
     */
    cron_del(type = 0) {
        return this._callOnGroup(Yeelight.prototype.cron_del, type);
    }

    /**
     * This method is used to change the brightness, color, or CT of the smart LED without knowing the current value
     * @param {String} action The direction of the adjustment (increase, decrease, circle)
     * @param {String} prop The property to adjust
     */
    set_adjust(action = 'circle', prop = 'bright') {
        return this.set_adjust(Yeelight.prototype.set_name, action, prop);
    }

    /**
     * This method starts or stops a music server, able to send all supported commands to simulate a music effect
     * @param {Number} action The action of the set_music command, either 0 = off or 1 = on
     * @param {String} host The host address of the TCP server
     * @param {Number} port The TCP port of the TCP server
     */
    set_music(action = 0, host, port) {
        return this._callOnGroup(
            Yeelight.prototype.set_music, action, host, port
        );
    }

    /**
     * This method is used to name the device. The name will be stored in device memory
     * @param {String} name The name to set
     */
    set_name(name) {
        return this._callOnGroup(Yeelight.prototype.set_name, name);
    }
}

module.exports = YeelightGroup;
