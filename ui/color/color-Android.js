/*globals requireClass*/
const TypeUtil = require("../../util/type");
const NativeColor = requireClass("android.graphics.Color");
const NativeGradientDrawable = requireClass("android.graphics.drawable.GradientDrawable");
const NativeBuild = requireClass("android.os.Build");

function Color(params) {
    this.isGradient = params && params.isGradient;

    if (this.isGradient) {
        var colors = [params.startColor.nativeObject, params.endColor.nativeObject];
        var index = 0;
        if (params.direction)
            index = params.direction;
        this.colors = colors;
        this.direction = GradientDrawableDirection[index];
        this.nativeObject = new NativeGradientDrawable(GradientDrawableDirection[index], array(colors, "int"));
    } else {
        this.nativeObject = params.color;
    }
}

Object.defineProperties(Color, {
    // properties
    'GradientDirection': {
        value: {},
        enumerable: true
    },
    'BLACK': {
        value: new Color({
            color: NativeColor.BLACK
        }),
        enumerable: true
    },
    'BLUE': {
        value: new Color({
            color: NativeColor.BLUE
        }),
        enumerable: true
    },
    'CYAN': {
        value: new Color({
            color: NativeColor.CYAN
        }),
        enumerable: true
    },
    'DARKGRAY': {
        value: new Color({
            color: NativeColor.DKGRAY
        }),
        enumerable: true
    },
    'GRAY': {
        value: new Color({
            color: NativeColor.GRAY
        }),
        enumerable: true
    },
    'GREEN': {
        value: new Color({
            color: NativeColor.GREEN
        }),
        enumerable: true
    },
    'LIGHTGRAY': {
        value: new Color({
            color: NativeColor.LTGRAY
        }),
        enumerable: true
    },
    'MAGENTA': {
        value: new Color({
            color: NativeColor.MAGENTA
        }),
        enumerable: true
    },
    'RED': {
        value: new Color({
            color: NativeColor.RED
        }),
        enumerable: true
    },
    'TRANSPARENT': {
        value: new Color({
            color: NativeColor.TRANSPARENT
        }),
        enumerable: true
    },
    'YELLOW': {
        value: new Color({
            color: NativeColor.YELLOW
        }),
        enumerable: true
    },
    'WHITE': {
        value: new Color({
            color: NativeColor.WHITE
        }),
        enumerable: true
    },
    // methods
    'createGradient': {
        value: function(e) {
            e.isGradient = true;
            return (new Color(e));
        },
        enumerable: true
    },
    'create': {
        value: function(param1, param2, param3, param4) {
            if (arguments.length === 1) {
                if (!TypeUtil.isNumeric(param1)) {
                    return new Color({
                        color: NativeColor.parseColor(param1)
                    });
                } else {
                    return new Color({
                        color: param1
                    });
                }
            } else if (arguments.length === 3) {
                if (NativeBuild.VERSION.SDK_INT >= 26) {
                    return new Color({
                        color: NativeColor.rgb(float(param1 / 255), float(param2 / 255), float(param3 / 255))
                    });
                } else {
                    return new Color({
                        color: NativeColor.rgb(param1, param2, param3)
                    });
                }
            } else if (arguments.length === 4) {
                param1 = ((param1 / 100) * 255);
                if (NativeBuild.VERSION.SDK_INT >= 26) {
                    return new Color({
                        color: NativeColor.argb(float(param1 / 255), float(param2 / 255), float(param3 / 255), float(param4 / 255))
                    });
                } else {
                    return new Color({
                        color: NativeColor.argb(int(param1), int(param2), int(param3), int(param4))
                    });
                }
            }
        },
        enumerable: true
    },
    'red': {
        value: function(color) {
            return NativeColor.red(color.nativeObject);
        },
        enumerable: true
    },
    'green': {
        value: function(color) {
            return NativeColor.green(color.nativeObject);
        },
        enumerable: true
    },
    'blue': {
        value: function(color) {
            return NativeColor.blue(color.nativeObject);
        },
        enumerable: true
    },
    'alpha': {
        value: function(color) {
            return NativeColor.alpha(color.nativeObject);
        },
        enumerable: true
    }

});

Object.defineProperties(Color.GradientDirection, {
    'VERTICAL': {
        value: 0,
        enumerable: true
    },
    'HORIZONTAL': {
        value: 1,
        enumerable: true
    },
    'DIAGONAL_LEFT': {
        value: 2,
        enumerable: true
    },
    'DIAGONAL_RIGHT': {
        value: 3,
        enumerable: true
    }
});

const GradientDrawableDirection = [
    NativeGradientDrawable.Orientation.TOP_BOTTOM,
    NativeGradientDrawable.Orientation.LEFT_RIGHT,
    NativeGradientDrawable.Orientation.TL_BR,
    NativeGradientDrawable.Orientation.TR_BL
];

module.exports = Color;