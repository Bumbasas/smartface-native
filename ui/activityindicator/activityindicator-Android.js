/*globals requireClass*/
const View = require('../view');
const extend = require('js-base/core/extend');

const NativeProgressBar = requireClass("android.widget.ProgressBar");
const NativePorterDuff = requireClass("android.graphics.PorterDuff");
const AndroidConfig = require("../../util/Android/androidconfig");

const ActivityIndicator = extend(View)(
    function(_super, params) {
        if (!this.nativeObject) {
            this.nativeObject = new NativeProgressBar(AndroidConfig.activity);
        }
        
        _super(this);
        
        this.nativeObject.setIndeterminate(true);
        
        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    },
    function(prop) {
        prop.__color = null;
        
        Object.defineProperties(prop, {
            'color': {
                get: function() {
                    return this.__color;
                },
                set: function(color) {
                    if (this.__color !== color) {
                        this.__color = color;
                        this.nativeObject.getIndeterminateDrawable().setColorFilter(this.__color.nativeObject, NativePorterDuff.Mode.SRC_IN);
                    }
                },
                enumerable: true
            }
        });
        
        prop.toString = function() {
            return 'ActivityIndicator';
        };
    }
);

ActivityIndicator.iOS = require("./ios");
ActivityIndicator.iOS.Type = {};

module.exports = ActivityIndicator;