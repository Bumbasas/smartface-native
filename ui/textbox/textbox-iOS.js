const FlexLayout = require("sf-core/ui/flexlayout");
const View = require('../view');
const KeyboardType = require('sf-core/ui/keyboardtype');
const ActionKeyType = require('sf-core/ui/actionkeytype');
const Color = require('sf-core/ui/color');
const KeyboardAnimationDelegate = require("sf-core/util").KeyboardAnimationDelegate;
const Invocation = require('sf-core/util/iOS/invocation.js');

const IOSKeyboardTypes = {
    default: 0, // Default type for the current input method.
    asciiCapable: 1, // Displays a keyboard which can enter ASCII characters
    numbersAndPunctuation: 2, // Numbers and assorted punctuation.
    URL: 3, // A type optimized for URL entry (shows . / .com prominently).
    numberPad: 4, // A number pad with locale-appropriate digits (0-9, ۰-۹, ०-९, etc.). Suitable for PIN entry.
    phonePad: 5, // A phone pad (1-9, *, 0, #, with letters under the numbers).
    namePhonePad: 6, // A type optimized for entering a person's name or phone number.
    emailAddress: 7, // A type optimized for multiple email address entry (shows space @ . prominently).
    decimalPad: 8, // @available(iOS 4.1, *) A number pad with a decimal point.
    twitter: 9, //@available(iOS 5.0, *) A type optimized for twitter text entry (easy access to @ #)
    webSearch: 10, // @available(iOS 7.0, *) A default keyboard type with URL-oriented addition (shows space . prominently).
    asciiCapableNumberPad: 11 // @available(iOS 10.0, *) A number pad (0-9) that will always be ASCII digits.
};

const IOSReturnKeyType = {
    default: 0,
    go: 1,
    google: 2,
    join: 3,
    next: 4,
    route: 5,
    search: 6,
    send: 7,
    yahoo: 8,
    done: 9,
    emergencyCall: 10,
    continue: 11 // @available(iOS 9.0, *)
};

const UITextAutocapitalizationType = {
    None: 0,
    Words: 1,
    Sentences: 2,
    AllCharactes: 3
};

TextBox.prototype = Object.create(View.prototype);
function TextBox(params) {
    var self = this;

    if (!self.nativeObject) {
        self.nativeObject = new __SF_UITextField();
    }

    View.apply(this);

    self.android = {};

    self.nativeObject.textBoxDelegate = function(method) {
        if (method.name === "textFieldShouldBeginEditing") {
            self.keyboardanimationdelegate.textFieldShouldBeginEditing();
            self.onEditBegins();
        } else if (method.name === "textFieldShouldEndEditing") {
            self.onEditEnds();
        } else if (method.name === "textFieldShouldReturn") {
            self.onActionButtonPress({
                "actionKeyType": self.actionKeyType
            });
        } else if (method.name === "textFieldShouldClear") {
            if (typeof self.ios.onClearButtonPress === 'function') {
                var returnValue = self.ios.onClearButtonPress();
                return returnValue === undefined ? true : returnValue;
            }
            return true;
        } else if (method.name === "shouldChangeCharactersIn:Range:ReplacementString") {
            if (typeof self.onTextChanged !== 'function') {
                return true;
            }

            // var __text = self.text;
            // var selectedTextRange = self.nativeObject.valueForKey("selectedTextRange");

            // var startPosition;
            // var invocationStartPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("start", selectedTextRange);
            // if (invocationStartPosition) {
            //     invocationStartPosition.target = selectedTextRange;
            //     invocationStartPosition.setSelectorWithString("start");
            //     invocationStartPosition.retainArguments();

            //     invocationStartPosition.invoke();
            //     startPosition = invocationStartPosition.getReturnValue();
            // }

            // var endPosition;
            // var invocationEndPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("end", selectedTextRange);
            // if (invocationEndPosition) {
            //     invocationEndPosition.target = selectedTextRange;
            //     invocationEndPosition.setSelectorWithString("end");
            //     invocationEndPosition.retainArguments();

            //     invocationEndPosition.invoke();
            //     endPosition = invocationEndPosition.getReturnValue();
            // }

            // var offset = 0;
            // var invocationOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("offsetFromPosition:toPosition:", self.nativeObject);
            // if (invocationOffsetFromPosition) {
            //     invocationOffsetFromPosition.target = self.nativeObject;
            //     invocationOffsetFromPosition.setSelectorWithString("offsetFromPosition:toPosition:");
            //     invocationOffsetFromPosition.retainArguments();
            //     invocationOffsetFromPosition.setNSObjectArgumentAtIndex(startPosition, 2);
            //     invocationOffsetFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
            //     invocationOffsetFromPosition.invoke();
            //     offset = invocationOffsetFromPosition.getNSIntegerReturnValue();
            // }

            // if (method.replacementString == "") {
            //     if (offset === 0) {
            //         self.text = __text.slice(0, method.range) + __text.slice(method.range + 1);
            //     } else {
            //         self.text = __text.slice(0, method.range) + __text.slice(method.range + offset);
            //     }
            // } else {
            //     self.text = __text.slice(0, method.range) + method.replacementString + __text.slice(method.range + offset);
            // }

            // var secondCharacterPosition;
            // var invocationPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("positionFromPosition:offset:", self.nativeObject);
            // if (invocationPositionFromPosition) {
            //     invocationPositionFromPosition.target = self.nativeObject;
            //     invocationPositionFromPosition.setSelectorWithString("positionFromPosition:offset:");
            //     invocationPositionFromPosition.retainArguments();
            //     invocationPositionFromPosition.setNSObjectArgumentAtIndex(startPosition, 2);
            //     if (method.replacementString == "") {
            //         if (offset === 0) {
            //             invocationPositionFromPosition.setNSIntegerArgumentAtIndex(-1, 3);
            //         } else {
            //             invocationPositionFromPosition.setNSIntegerArgumentAtIndex(0, 3);
            //         }
            //     } else {
            //         invocationPositionFromPosition.setNSIntegerArgumentAtIndex(method.replacementString.length, 3);
            //     }

            //     invocationPositionFromPosition.invoke();
            //     secondCharacterPosition = invocationPositionFromPosition.getReturnValue();
            // }

            // var firstCharacterRange;
            // var invocationTextRangeFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("textRangeFromPosition:toPosition:", self.nativeObject);
            // if (invocationTextRangeFromPosition) {
            //     invocationTextRangeFromPosition.target = self.nativeObject;
            //     invocationTextRangeFromPosition.setSelectorWithString("textRangeFromPosition:toPosition:");
            //     invocationTextRangeFromPosition.retainArguments();
            //     invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(secondCharacterPosition, 2);
            //     invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(secondCharacterPosition, 3);

            //     invocationTextRangeFromPosition.invoke();
            //     firstCharacterRange = invocationTextRangeFromPosition.getReturnValue();
            // }

            // self.nativeObject.setValueForKey(firstCharacterRange, "selectedTextRange");

            self.onTextChanged({
                location: method.range,
                insertedText: method.replacementString
            });

            // return false;
        }
    };

    self.onEditBegins = function() {};
    self.onEditEnds = function() {};
    self.onActionButtonPress = function(e) {};

    Object.defineProperty(self, 'font', {
        get: function() {
            return self.nativeObject.font;
        },
        set: function(value) {
            self.nativeObject.font = value;
        },
        enumerable: true
    });

    Object.defineProperty(self, 'cursorPosition', {
        get: function() {
            var selectedTextRange = self.nativeObject.valueForKey("selectedTextRange");

            var startPosition;
            var invocationStartPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("start", selectedTextRange);
            if (invocationStartPosition) {
                invocationStartPosition.target = selectedTextRange;
                invocationStartPosition.setSelectorWithString("start");
                invocationStartPosition.retainArguments();

                invocationStartPosition.invoke();
                startPosition = invocationStartPosition.getReturnValue();
            }

            var endPosition;
            var invocationEndPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("end", selectedTextRange);
            if (invocationEndPosition) {
                invocationEndPosition.target = selectedTextRange;
                invocationEndPosition.setSelectorWithString("end");
                invocationEndPosition.retainArguments();

                invocationEndPosition.invoke();
                endPosition = invocationEndPosition.getReturnValue();
            }

            var beginningOfDocument = self.nativeObject.valueForKey("beginningOfDocument");

            var offsetStart = 0;
            var invocationOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("offsetFromPosition:toPosition:", self.nativeObject);
            if (invocationOffsetFromPosition) {
                invocationOffsetFromPosition.target = self.nativeObject;
                invocationOffsetFromPosition.setSelectorWithString("offsetFromPosition:toPosition:");
                invocationOffsetFromPosition.retainArguments();
                invocationOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
                invocationOffsetFromPosition.setNSObjectArgumentAtIndex(startPosition, 3);
                invocationOffsetFromPosition.invoke();
                offsetStart = invocationOffsetFromPosition.getNSIntegerReturnValue();
            }

            var offsetEnd = 0;
            var invocationEndOffsetFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("offsetFromPosition:toPosition:", self.nativeObject);
            if (invocationEndOffsetFromPosition) {
                invocationEndOffsetFromPosition.target = self.nativeObject;
                invocationEndOffsetFromPosition.setSelectorWithString("offsetFromPosition:toPosition:");
                invocationEndOffsetFromPosition.retainArguments();
                invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
                invocationEndOffsetFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);
                invocationEndOffsetFromPosition.invoke();
                offsetEnd = invocationEndOffsetFromPosition.getNSIntegerReturnValue();
            }

            return {
                start: offsetStart,
                end: offsetEnd
            };
        },
        set: function(value) {
            if (value && value.start === parseInt(value.start, 10) && value.end === parseInt(value.end, 10)) {

                var beginningOfDocument = self.nativeObject.valueForKey("beginningOfDocument");
                var startPosition;
                var invocationPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("positionFromPosition:offset:", self.nativeObject);
                if (invocationPositionFromPosition) {
                    invocationPositionFromPosition.target = self.nativeObject;
                    invocationPositionFromPosition.setSelectorWithString("positionFromPosition:offset:");
                    invocationPositionFromPosition.retainArguments();
                    invocationPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
                    invocationPositionFromPosition.setNSIntegerArgumentAtIndex(value.start, 3);

                    invocationPositionFromPosition.invoke();
                    startPosition = invocationPositionFromPosition.getReturnValue();
                }

                var endPosition;
                var invocationEndPositionFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("positionFromPosition:offset:", self.nativeObject);
                if (invocationEndPositionFromPosition) {
                    invocationEndPositionFromPosition.target = self.nativeObject;
                    invocationEndPositionFromPosition.setSelectorWithString("positionFromPosition:offset:");
                    invocationEndPositionFromPosition.retainArguments();
                    invocationEndPositionFromPosition.setNSObjectArgumentAtIndex(beginningOfDocument, 2);
                    invocationEndPositionFromPosition.setNSIntegerArgumentAtIndex(value.end, 3);

                    invocationEndPositionFromPosition.invoke();
                    endPosition = invocationEndPositionFromPosition.getReturnValue();
                }

                var characterRange;
                var invocationTextRangeFromPosition = __SF_NSInvocation.createInvocationWithSelectorInstance("textRangeFromPosition:toPosition:", self.nativeObject);
                if (invocationTextRangeFromPosition) {
                    invocationTextRangeFromPosition.target = self.nativeObject;
                    invocationTextRangeFromPosition.setSelectorWithString("textRangeFromPosition:toPosition:");
                    invocationTextRangeFromPosition.retainArguments();
                    invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(startPosition, 2);
                    invocationTextRangeFromPosition.setNSObjectArgumentAtIndex(endPosition, 3);

                    invocationTextRangeFromPosition.invoke();
                    characterRange = invocationTextRangeFromPosition.getReturnValue();
                }

                self.nativeObject.setValueForKey(characterRange, "selectedTextRange");
            }
        },
        enumerable: true
    });

    Object.defineProperty(self, 'text', {
        get: function() {
            return self.nativeObject.text;
        },
        set: function(value) {
            self.nativeObject.text = value;
        },
        enumerable: true
    });

    Object.defineProperty(self, 'textColor', {
        get: function() {
            return new Color({
                color: self.nativeObject.textColor
            });
        },
        set: function(value) {
            self.nativeObject.textColor = value.nativeObject;
        },
        enumerable: true
    });

    var _textAligment = 3;
    Object.defineProperty(self, 'textAlignment', {
        get: function() {
            return _textAligment;
        },
        set: function(value) {
            _textAligment = value;

            var vertical;
            if (parseInt(value / 3) === 0) {
                vertical = 1;
            } else if (parseInt(value / 3) === 1) {
                vertical = 0;
            } else {
                vertical = 2;
            }

            var horizontal;
            if (value % 3 === 0) {
                horizontal = 0;
            } else if (value % 3 === 1) {
                horizontal = 1;
            } else {
                horizontal = 2;
            }

            self.nativeObject.contentVerticalAlignment = vertical;
            self.nativeObject.textAlignment = horizontal;
        },
        enumerable: true,
        configurable: true
    });

    var _hint;
    Object.defineProperty(self, 'hint', {
        get: function() {
            return _hint;
        },
        set: function(value) {
            _hint = value;
            var allocNSAttributedString = Invocation.invokeClassMethod("NSAttributedString", "alloc", [], "id");

            var argString = new Invocation.Argument({
                type: "NSString",
                value: value
            });

            var argAttributes = new Invocation.Argument({
                type: "id",
                value: {
                    "NSColor": _hintTextColor.nativeObject
                }
            });
            var nativeAttributeString = Invocation.invokeInstanceMethod(allocNSAttributedString, "initWithString:attributes:", [argString, argAttributes], "NSObject");
            self.nativeObject.setValueForKey(nativeAttributeString, "attributedPlaceholder");
        },
        enumerable: true,
        configurable: true
    });

    var _hintTextColor = Color.create(199, 199, 205);
    Object.defineProperty(self, 'hintTextColor', {
        get: function() {
            return _hintTextColor;
        },
        set: function(value) {
            _hintTextColor = value;
            self.hint = _hint;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(self, 'autoCapitalize', {
        get: function() {
            return Invocation.invokeInstanceMethod(self.nativeObject, "autocapitalizationType", [], "NSInteger");
        },
        set: function(value) {
            var argCapitalizationType = new Invocation.Argument({
                type: "NSInteger",
                value: value
            });
            Invocation.invokeInstanceMethod(self.nativeObject, "setAutocapitalizationType:", [argCapitalizationType]);
        },
        enumerable: true,
        configurable: true
    });

    this.ios = {};

    Object.defineProperty(self, 'cursorColor', {
        get: function() {
            return new Color({
                color: self.nativeObject.valueForKey("tintColor")
            });
        },
        set: function(color) {
            self.nativeObject.setValueForKey(color.nativeObject, "tintColor");
        },
        enumerable: true
    });

    Object.defineProperty(this.ios, 'adjustFontSizeToFit', {
        get: function() {
            return self.nativeObject.adjustsFontSizeToFitWidth;
        },
        set: function(value) {
            self.nativeObject.adjustsFontSizeToFitWidth = value;
        },
        enumerable: true,
        configurable: true
    });

    var _keyboardLayout;
    Object.defineProperty(this.ios, 'keyboardLayout', {
        get: function() {
            return _keyboardLayout;
        },
        set: function(value) {
            if (value === undefined){
                _keyboardLayout = value;
                self.nativeObject.setValueForKey(undefined, "inputAccessoryView");
                return;
            }
            
            if (typeof value === "object") {
                _keyboardLayout = value;
                _keyboardLayout.nativeObject.yoga.applyLayoutPreservingOrigin(true);
                
                // Bug : IOS-2601
                var oldOntouch = value.onTouch;
                value.onTouch = function() {
                    var returnValue = oldOntouch && oldOntouch();
                    return (typeof returnValue) === "undefined" ? true : returnValue;
                };
                //////////////////

                self.nativeObject.setValueForKey(value.nativeObject, "inputAccessoryView");
            }
        },
        enumerable: true
    });

    Object.defineProperty(this.ios, 'minimumFontSize', {
        get: function() {
            return self.nativeObject.minimumFontSize;
        },
        set: function(value) {
            self.nativeObject.minimumFontSize = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(this.ios, 'keyboardAppearance', {
        get: function() {
            return self.nativeObject.keyboardAppearance;
        },
        set: function(value) {
            self.nativeObject.keyboardAppearance = value;
        },
        enumerable: true
    });
    
    Object.defineProperty(this.ios, 'textContentType', {
        get: function() {
            return self.nativeObject.textContentType;
        },
        set: function(value) {
            self.nativeObject.textContentType = value;
        },
        enumerable: true
    });

    Object.defineProperty(this, 'actionKeyType', {
        get: function() {
            var returnValue;
            switch (self.nativeObject.returnKeyType) {
                case IOSReturnKeyType.default:
                    returnValue = ActionKeyType.DEFAULT;
                    break;
                case IOSReturnKeyType.next:
                    returnValue = ActionKeyType.NEXT;
                    break;
                case IOSReturnKeyType.go:
                    returnValue = ActionKeyType.GO;
                    break;
                case IOSReturnKeyType.search:
                    returnValue = ActionKeyType.SEARCH;
                    break;
                case IOSReturnKeyType.send:
                    returnValue = ActionKeyType.SEND;
                    break;
                default:
                    returnValue = null;
            }
            return returnValue;
        },
        set: function(value) {
            switch (value) {
                case ActionKeyType.NEXT:
                    self.nativeObject.returnKeyType = IOSReturnKeyType.next;
                    break;
                case ActionKeyType.GO:
                    self.nativeObject.returnKeyType = IOSReturnKeyType.go;
                    break;
                case ActionKeyType.SEARCH:
                    self.nativeObject.returnKeyType = IOSReturnKeyType.search;
                    break;
                case ActionKeyType.SEND:
                    self.nativeObject.returnKeyType = IOSReturnKeyType.send;
                    break;
                default:
                    self.nativeObject.returnKeyType = IOSReturnKeyType.default;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(self, 'keyboardType', {
        get: function() {
            var returnValue;

            switch (self.nativeObject.keyboardType) {
                case IOSKeyboardTypes.default:
                    returnValue = KeyboardType.DEFAULT;
                    break;
                case IOSKeyboardTypes.decimalPad:
                    returnValue = KeyboardType.DECIMAL;
                    break;
                case IOSKeyboardTypes.numberPad:
                    returnValue = KeyboardType.NUMBER;
                    break;
                case IOSKeyboardTypes.phonePad:
                    returnValue = KeyboardType.PHONE;
                    break;
                case IOSKeyboardTypes.URL:
                    returnValue = KeyboardType.URL;
                    break;
                case IOSKeyboardTypes.twitter:
                    returnValue = KeyboardType.ios.TWITTER;
                    break;
                case IOSKeyboardTypes.webSearch:
                    returnValue = KeyboardType.ios.WEBSEARCH;
                    break;
                case IOSKeyboardTypes.emailAddress:
                    returnValue = KeyboardType.EMAILADDRESS;
                    break;
                default:
                    returnValue = null;
            }
            return returnValue;
        },
        set: function(value) {
            switch (value) {
                case KeyboardType.DECIMAL:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.decimalPad;
                    break;
                case KeyboardType.NUMBER:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.numberPad;
                    break;
                case KeyboardType.PHONE:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.phonePad;
                    break;
                case KeyboardType.URL:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.URL;
                    break;
                case KeyboardType.ios.TWITTER:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.twitter;
                    break;
                case KeyboardType.ios.WEBSEARCH:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.webSearch;
                    break;
                case KeyboardType.EMAILADDRESS:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.emailAddress;
                    break;
                default:
                    self.nativeObject.keyboardType = IOSKeyboardTypes.default;
            }
        },
        enumerable: true,
        configurable: true
    });

    var _clearButtonMode = false;
    Object.defineProperty(this.ios, 'clearButtonEnabled', {
        get: function() {
            return _clearButtonMode;
        },
        set: function(value) {
            if (value) {
                self.nativeObject.clearButtonMode = 1;
            } else {
                self.nativeObject.clearButtonMode = 0;
            }

        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(self, 'isPassword', {
        get: function() {
            return self.nativeObject.isSecure;
        },
        set: function(value) {
            self.nativeObject.isSecure = value;

        },
        enumerable: true,
        configurable: true
    });

    this.showKeyboard = function() {
        self.nativeObject.becomeFirstResponder();
    };

    this.hideKeyboard = function() {
        self.nativeObject.resignFirstResponder();
    };

    this.requestFocus = function() {
        self.nativeObject.becomeFirstResponder();
    };

    this.removeFocus = function() {
        self.nativeObject.resignFirstResponder();
    };

    self.nativeObject.addKeyboardObserver();

    self.keyboardanimationdelegate = new KeyboardAnimationDelegate({
        nativeObject: self.nativeObject
    });

    self.nativeObject.onShowKeyboard = function(e) {
        if (_inputViewMain) {
            __SF_UIView.performWithoutAnimationWrapper(
                function(){
                    _inputViewMain.nativeObject.yoga.applyLayoutPreservingOrigin(true);
                });
        }
        
        if (_keyboardLayout) {
            __SF_UIView.performWithoutAnimationWrapper(
                function(){
                    _keyboardLayout.nativeObject.yoga.applyLayoutPreservingOrigin(true);
                });
        }

        self.keyboardanimationdelegate.keyboardShowAnimation(e.keyboardHeight, e);
    }
    
    self.nativeObject.addObserver(function() {
        _keyboardLayout && _keyboardLayout.nativeObject.yoga.applyLayoutPreservingOrigin(true);
        _inputViewMain && _inputViewMain.nativeObject.yoga.applyLayoutPreservingOrigin(true);
    }, __SF_UIDeviceOrientationDidChangeNotification);
    
    self.nativeObject.onHideKeyboard = function(e) {
        self.keyboardanimationdelegate.keyboardHideAnimation(e);
    }
    
    var _inputView = undefined;
    var _inputViewMain;
    Object.defineProperty(self.ios, 'inputView', {
        get: function() {
            return _inputView;
        },
        set: function(object) {
            _inputView = object;
            
            if (_inputView === undefined) {
                self.nativeObject.setValueForKey(undefined,"inputView");
                return;
            }
            
            if (!_inputViewMain) {
                var flexMain = new FlexLayout();
                flexMain.nativeObject.frame = {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: object.height ? object.height : 0
                };
                _inputViewMain = flexMain;
            } else {
                var childs = _inputViewMain.getChildList();
                for (var i in childs) {
                    _inputViewMain.removeChild(childs[i]);
                }
            }
            
            // Bug : IOS-2601
            var oldOntouch = object.view.onTouch;
            object.view.onTouch = function() {
                var returnValue = oldOntouch && oldOntouch();
                return (typeof returnValue) === "undefined" ? true : returnValue;
            };
            //////////////////
                
            _inputViewMain.addChild(object.view);

            self.nativeObject.setValueForKey(_inputViewMain.nativeObject,"inputView");
        },
        enumerable: true
    });
    
    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }

}

TextBox.AutoCapitalize = require("./autocapitalize");

module.exports = TextBox;