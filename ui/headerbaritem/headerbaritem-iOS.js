const Color = require("sf-core/ui/color");
const Image = require('sf-core/ui/image');
const Invocation = require('sf-core/util').Invocation;

function HeaderBarItem(params) {
    var _onPress = null;
    
    var self = this;
    
    self.nativeObject = new __SF_UIBarButtonItem();
    self.nativeObject.target = self.nativeObject;
    var _badge ={};
    _badge.ios = {};
    
    Object.defineProperties(this, {
        'title': {
            get: function() {
                return self.nativeObject.title;
            },
            set: function(value) {
                if (typeof(value) !== "string") {
                    return;
                }
                self.nativeObject.title = value;
            },
            enumerable: true
        },
        'image': {
            get: function() {
                var retval = undefined;
                if (self.nativeObject.image) {
                    retval = Image.createFromImage(self.nativeObject.image);
                }
                return retval;
            },
            set: function(value) {
                if (typeof value === "string") {
                    var image = Image.createFromFile(value);
                    self.nativeObject.image = image.nativeObject;
                } else {
                    if (value) {
                        self.nativeObject.image = value.nativeObject;
                    }   
                }
            },
            enumerable: true
        },
        'color': {
            get: function() {
                return new Color({color : self.nativeObject.tintColor});
            },
            set: function(value) {
                if (value) {
                    self.nativeObject.tintColor = value.nativeObject;
                }
            },
            enumerable: true
        },
        'enabled': {
            get: function() {
                return self.nativeObject.enabled;
            },
            set: function(value) {
                self.nativeObject.enabled = value;
            },
            enumerable: true
        },
        'onPress': {
            get: function() {
                return _onPress;
            },
            set: function(value) {
                if (value instanceof Function) {
                    _onPress = value.bind(this);
                    self.nativeObject.addJSAction(_onPress);
                }
            },
            enumerable: true
        },
        'badge': {
            get: function(){
                return _badge;
            },
            enumerable: true
        }
    });
    
    var _visible = false;
    var _backgroundColor;
    var _font;
    var _textColor;
    var _borderColor;
    var _borderWidth;
    var _badgeHeight;
    var _isBadgeFirstLoad = false;
    Object.defineProperties(_badge, {
        'setText': {
            value: function(text){
                __SF_Dispatch.mainAsyncAfter(function(){
                    self.nativeObject.pp_addBadgeWithText(text);
                    if (!_isBadgeFirstLoad) {
                        _visible ? self.nativeObject.pp_showBadge() : self.nativeObject.pp_hiddenBadge();
                        _backgroundColor ? self.badge.setBackgroundColor(_backgroundColor) : 0;
                        _textColor ? self.badge.setTextColor(_textColor) : 0;
                        _font ? self.badge.setFont(_font) : 0;
                        _borderColor ? self.badge.setBorderColor(_borderColor) : 0;
                        _borderWidth ? self.badge.setBorderWidth(_borderWidth) : 0;
                        _badgeHeight !== undefined ? self.badge.setHeight(_badgeHeight) : 0;
                    }
                    _isBadgeFirstLoad = true;
                },1);
            },
            enumerable: true
        },
        'setVisible': {
            value: function(value){
                _visible = value;
                if (value) {
                    self.nativeObject.pp_showBadge();
                }else{
                    self.nativeObject.pp_hiddenBadge();
                }
            },
            enumerable: true
        },
        'setHeight': {
            value: function(value){
                _badgeHeight = value;
                self.nativeObject.pp_setBadgeHeight(value);
            },
            enumerable: true
        },
        'setBorderWidth': {
            value: function(value){
                _borderWidth = value;
                self.nativeObject.pp_setBorderWidth(value);
            },
            enumerable: true
        },
        'setBorderColor': {
            value: function(value){
                _borderColor = value;
                self.nativeObject.pp_setBorderColor(value.nativeObject);
            },
            enumerable: true
        },
        'setBackgroundColor' : {
            value: function(value){
                _backgroundColor = value;
                var argIDBlock= new Invocation.Argument({
                    type:"IDBlock",
                    value: function(label){
                        var argColor= new Invocation.Argument({
                            type:"NSObject",
                            value: value.nativeObject
                        });
                        Invocation.invokeInstanceMethod(label,"setBackgroundColor:",[argColor]);
                    }
                });
                Invocation.invokeInstanceMethod(self.nativeObject,"pp_setBadgeLabelAttributes:",[argIDBlock]);
            },
            enumerable: true
        },
        'setTextColor' : {
            value: function(value){
                _textColor = value;
                var argIDBlock= new Invocation.Argument({
                    type:"IDBlock",
                    value: function(label){
                        var argColor= new Invocation.Argument({
                            type:"NSObject",
                            value: value.nativeObject
                        });
                        Invocation.invokeInstanceMethod(label,"setTextColor:",[argColor]);
                    }
                });
                Invocation.invokeInstanceMethod(self.nativeObject,"pp_setBadgeLabelAttributes:",[argIDBlock]);
            },
            enumerable: true
        },
        'setFont' : {
            value: function(value){
                _font = value;
                var argIDBlock= new Invocation.Argument({
                    type:"IDBlock",
                    value: function(label){
                        var argFont= new Invocation.Argument({
                            type:"NSObject",
                            value: value
                        });
                        Invocation.invokeInstanceMethod(label,"setFont:",[argFont]);
                    }
                });
                Invocation.invokeInstanceMethod(self.nativeObject,"pp_setBadgeLabelAttributes:",[argIDBlock]);
            },
            enumerable: true
        }
    });
    
    Object.defineProperties(_badge, {
        'move' : {
            value: function(x,y){
                __SF_Dispatch.mainAsyncAfter(function(){
                    self.nativeObject.pp_moveBadgeWithXY(x,y);
                },1);
            },
            enumerable: true
        }
    });
    
    // Assign parameters given in constructor
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
}

module.exports = HeaderBarItem;