/* globals toJSArray, requireClass */
const AndroidConfig             = require('../../util/Android/androidconfig');
const NativeSensor              = requireClass('android.hardware.Sensor');
const NativeSensorEventListener = requireClass('android.hardware.SensorEventListener');
// Context.SENSOR_SERVICE
const SENSOR_SERVICE = 'sensor';
const SENSOR_MANAGER = 'android.hardware.SensorManager';

const Accelerometer = {};

var sensorManager = AndroidConfig.getSystemService(SENSOR_SERVICE, SENSOR_MANAGER);
var accelerometerSensor = sensorManager.getDefaultSensor(NativeSensor.TYPE_ACCELEROMETER);

var _callback;
var _sensorListener;

Object.defineProperties(Accelerometer, {
    'start': {
        value: function(delayType = 0) {
            _sensorListener = NativeSensorEventListener.implement({
                onAccuracyChanged: function(sensor, accuracy) {},
                onSensorChanged: function(event) {
                    var eventData = toJSArray(event.values);
                    _callback && _callback({
                        x: eventData[0],
                        y: eventData[1],
                        z: eventData[2]
                    });
                }
            });
            // SensorManager.SENSOR_DELAY_UI
            sensorManager.registerListener(_sensorListener, accelerometerSensor, delayType);
        }
    },
    'stop': {
        value: function() {
            if (_sensorListener) {
                sensorManager.unregisterListener(_sensorListener, accelerometerSensor);
                _sensorListener = null;
            }
        }
    },
    'onAccelerate': {
        get: function() {
            return _callback;
        },
        set: function(callback) {
            _callback = callback;
        }
    }
});

module.exports = Accelerometer;