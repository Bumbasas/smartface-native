/*globals requireClass*/
const AndroidConfig = require("../../util/Android/androidconfig");
const AndroidUnitConverter = require("../../util/Android/unitconverter.js");
const Type = require("../../util/type");
const NativeAlertDialog = requireClass("android.app.AlertDialog");
const NativeDialogInterface = requireClass("android.content.DialogInterface");
const {
    MATCH_PARENT,
    WRAP_CONTENT
} = require("../../util/Android/layoutparams");

AlertView.Android = {};
AlertView.Android.ButtonType = {
    POSITIVE: 0,
    NEUTRAL: 1,
    NEGATIVE: 2,
};

// DEPRECATED
var ButtonType = {
    POSITIVE: 0,
    NEUTRAL: 1,
    NEGATIVE: 2,
};

const activity = AndroidConfig.activity;

function AlertView(params) {
    if (!this.nativeObject) {
        this.nativeObject = new NativeAlertDialog.Builder(activity).create();
    }

    this.__androidProperties = new AndroidSpesificProperties(this);
    this.__buttonCallbacks = [];

    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

AlertView.prototype = {
    __title: "",
    __message: "",
    __textBoxes: [],
    get title() {
        return this.__title;
    },
    set title(title) {
        if (Type.isString(title)) {
            this.__title = title;
            this.nativeObject.setTitle(title);
        }
    },
    get message() {
        return this.__message;
    },
    set message(message) {
        if (Type.isString(message)) {
            this.__message = message;
            this.nativeObject.setMessage(message);
        }
    },
    get onDismiss() {
        return this.__onDismiss;
    },
    set onDismiss(onDismiss) {
        this.__onDismiss = onDismiss.bind(this);
        if (!this.__didSetOnDismissListener) setOnDismissListener(this);
    },
    get android() {
        return this.__androidProperties;
    },
    set android(properties) {
        for (var param in properties) {
            this.__androidProperties[param] = properties[param];
        }
    },
    get inputsText() {
        return this.__textBoxes.map(textBox => textBox.text);
    }
};

AlertView.prototype.isShowing = function() {
    return this.nativeObject.isShowing();
};

AlertView.prototype.show = function() {
    this.nativeObject.show();
};

AlertView.prototype.dismiss = function() {
    this.nativeObject.dismiss();
};

AlertView.prototype.addButton = function(params) {
    !params.text && (params.text = "");
    var buttonType = params.index;
    Number.isInteger(params.type) && (buttonType = params.type);
    this.__buttonCallbacks[buttonType] = params.onClick;
    var nativeButtonIndex;
    switch (buttonType) {
        case AlertView.Android.ButtonType.POSITIVE:
            nativeButtonIndex = -1;
            break;
        case AlertView.Android.ButtonType.NEGATIVE:
            nativeButtonIndex = -2;
            break;
        case AlertView.Android.ButtonType.NEUTRAL:
            nativeButtonIndex = -3;
            break;
        default:
            nativeButtonIndex = -3;
            break;
    }

    this.nativeObject.setButton(nativeButtonIndex, params.text,
        NativeDialogInterface.OnClickListener.implement({
            onClick: function(dialog, which) {
                switch (which) {
                    case -1:
                        this.__buttonCallbacks[AlertView.Android.ButtonType.POSITIVE] && this.__buttonCallbacks[AlertView.Android.ButtonType.POSITIVE]();
                        break;
                    case -2:
                        this.__buttonCallbacks[AlertView.Android.ButtonType.NEGATIVE] && this.__buttonCallbacks[AlertView.Android.ButtonType.NEGATIVE]();
                        break;
                    case -3:
                        this.__buttonCallbacks[AlertView.Android.ButtonType.NEUTRAL] && this.__buttonCallbacks[AlertView.Android.ButtonType.NEUTRAL]();
                        break;
                    default:
                        break;
                }
            }.bind(this)
        })
    );
};

AlertView.prototype.addTextBox = function(params = {}) {
    const TextBox = require("../textbox");
    const TextAlignment = require('../textalignment');
    const NativeLinearLayout = requireClass("android.widget.LinearLayout");

    const {
        hint = "", text = "", isPassword = false, android: {
            viewSpacings: viewSpacings = {},
            height,
            width
        } = {}
    } = params;
    let mTextBox = new TextBox({
        hint,
        text,
        isPassword,
        textAlignment: TextAlignment.MIDLEFT
    });
    if (Object.keys(viewSpacings).length > 0 || (height !== undefined || width !== undefined)) {
        let viewSpacingsInPx = {};
        Object.keys(viewSpacings).map((key) => {
            viewSpacingsInPx[key] = AndroidUnitConverter.dpToPixel(viewSpacings[key]);
        });
        let {
            left = 0, top = 0, right = 0, bottom = 0
        } = viewSpacingsInPx;
        let dpHeight = dpToPixel(height);
        let dpWidth = dpToPixel(width);
        let nativeLinearParams = new NativeLinearLayout.LayoutParams(dpWidth, dpHeight);
        nativeLinearParams.setMargins(left, top, right, bottom);
        mTextBox.nativeObject.setLayoutParams(nativeLinearParams);
    }
    if (!this._alertLayout) {
        this._alertLayout = new NativeLinearLayout(activity);
        this._alertLayout.setOrientation(1);
        this.nativeObject.setView(this._alertLayout);
    }
    this._alertLayout.addView(mTextBox.nativeObject);
    this.__textBoxes.push(mTextBox);
};

function dpToPixel(size) {
    return size !== undefined ? AndroidUnitConverter.dpToPixel(size) : MATCH_PARENT;
}

AlertView.prototype.toString = function() {
    return 'AlertView';
};

function setOnDismissListener(object) {
    object.nativeObject.setOnDismissListener(NativeDialogInterface.OnDismissListener.implement({
        onDismiss: function(dialog) {
            typeof this.__onDismiss === "function" && this.__onDismiss(this);
        }.bind(object)
    }));
    object.__didSetOnDismissListener = true;
}

function AndroidSpesificProperties(alertview) {
    var _cancellable;
    Object.defineProperty(this, 'cancellable', {
        get: function() {
            return _cancellable;
        },
        set: function(cancellable) {
            _cancellable = cancellable;
            alertview.nativeObject.setCancelable(cancellable);
            alertview.nativeObject.setCanceledOnTouchOutside(cancellable);
        },
        enumerable: true
    });
}

Object.defineProperty(AlertView, 'ButtonType', {
    value: ButtonType,
    writable: false,
    enumerable: true
});

module.exports = AlertView;