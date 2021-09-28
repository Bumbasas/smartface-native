const { EventEmitter, EventEmitterMixin } = require('../../core/eventemitter');
const Events = require('./events');
function Accelerometer() {}
Object.assign(Accelerometer, EventEmitterMixin);

Accelerometer.emitter = new EventEmitter();

const EventFunctions = {
    [Events.Accelerate]: function() {
        Accelerometer.monitonManager.callback = (e) => {
            Accelerometer.emitter.emit(Events.Accelerate, e);
        };
    }
}

Object.defineProperty(Accelerometer, 'on', {
    value: (event, callback) => {
        EventFunctions[event].call(Accelerometer);
        Accelerometer.emitter.on(event, callback);
    }
});

Accelerometer.ios = {};
Accelerometer.android = {};

Accelerometer.monitonManager = new __SF_CMMotionManager();
Accelerometer.monitonManager.accelerometerUpdateInterval = 0.1; //Default Value

Accelerometer.start = function() {
    Accelerometer.monitonManager.startAccelerometerUpdates();
}

Accelerometer.stop = function() {
    Accelerometer.monitonManager.stopAccelerometerUpdates();
}

Object.defineProperty(Accelerometer, 'onAccelerate', {
    set: function(value) {
        Accelerometer.monitonManager.callback = value;
    },
    enumerable: true
});

Object.defineProperty(Accelerometer.ios, 'accelerometerUpdateInterval', {
    get: function() {
        return Accelerometer.monitonManager.accelerometerUpdateInterval * 1000; // Convert to millisecond
    },
    set: function(value) {
        Accelerometer.monitonManager.accelerometerUpdateInterval = value / 1000; // Convert to second
    },
    enumerable: true
});

module.exports = Accelerometer;