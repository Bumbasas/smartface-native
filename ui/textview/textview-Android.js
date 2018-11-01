/*globals requireClass*/
const extend = require('js-base/core/extend');
const Label = require('../label');
const TextAlignment = require("../textalignment");
const TypeUtil = require("../../util/type");

const unitconverter = require('sf-core/util/Android/unitconverter');
const NativeBuild = requireClass("android.os.Build");
const NativeColor = requireClass("android.graphics.Color");
const NativeSpannableStringBuilder = requireClass("android.text.SpannableStringBuilder");
const NativeBackgroundColorSpan = requireClass("android.text.style.BackgroundColorSpan");
const NativeForegroundColorSpan = requireClass("android.text.style.ForegroundColorSpan");
const NativeLineHeightSpan = requireClass("android.text.style.LineHeightSpan");
const NativeTypeface = requireClass("android.graphics.Typeface");
const NativeLinkMovementMethod = requireClass("android.text.method.LinkMovementMethod");
var SPAN_EXCLUSIVE_EXCLUSIVE = 33;

const TextAlignmentDic = {};
TextAlignmentDic[TextAlignment.TOPLEFT] = 48 | 3; // Gravity.TOP | Gravity.LEFT
TextAlignmentDic[TextAlignment.TOPCENTER] = 48 | 1; //Gravity.TOP | Gravity.CENTER_HORIZONTAL
TextAlignmentDic[TextAlignment.TOPRIGHT] = 48 | 5; //Gravity.TOP | Gravity.RIGHT
TextAlignmentDic[TextAlignment.MIDLEFT] = 16 | 3; // Gravity.CENTER_VERTICAL | Gravity.LEFT
TextAlignmentDic[TextAlignment.MIDCENTER] = 17; // Gravity.CENTER
TextAlignmentDic[TextAlignment.MIDRIGHT] = 16 | 5; // Gravity.CENTER_VERTICAL | Gravity.RIGHT
TextAlignmentDic[TextAlignment.BOTTOMLEFT] = 80 | 3; // Gravity.BOTTOM | Gravity.LEFT
TextAlignmentDic[TextAlignment.BOTTOMCENTER] = 80 | 1; // Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
TextAlignmentDic[TextAlignment.BOTTOMRIGHT] = 80 | 5; // Gravity.BOTTOM | Gravity.RIGHT

const INT_16_3 = 16 | 3;
const INT_17 = 17;
const TextView = extend(Label)(
    function(_super, params) {
        _super(this);

        var self = this;

        var _attributedStringBuilder;
        var _spanArray = [];
        var _onClick = undefined; //Deprecated : Please use self.onLinkClick
        var _onLinkClick = undefined;
        var _letterSpacing = 0;
        var _lineSpacing = 0;
        var isMovementMethodAssigned = false;
        Object.defineProperties(self, {
            'htmlText': {
                get: function() {
                    var text = this.nativeObject.getText();
                    if (text) {
                        const NativeHtml = requireClass("android.text.Html");
                        var htmlText = NativeHtml.toHtml(text);
                        return htmlText.toString();
                    }
                    else {
                        return "";
                    }

                },
                set: function(htmlText) {
                    const NativeHtml = requireClass("android.text.Html");
                    var htmlTextNative = NativeHtml.fromHtml("" + htmlText);
                    if (!isMovementMethodAssigned) {
                        isMovementMethodAssigned = true;
                        this.nativeObject.setMovementMethod(NativeLinkMovementMethod.getInstance());
                    }
                    this.nativeObject.setText(htmlTextNative);
                },
                enumerable: true
            },
            'multiline': {
                get: function() {
                    return this.nativeObject.getMaxLines() !== 1;
                },
                set: function(multiline) {
                    this.nativeObject.setSingleLine(!multiline);
                    // Integer.MAX_VALUE
                    // const NativeInteger = requireClass("java.lang.Integer");
                    this.nativeObject.setMaxLines(multiline ? 1000 : 1);
                    if (multiline) {
                        const NativeScrollingMovementMethod = requireClass("android.text.method.ScrollingMovementMethod");
                        var movementMethod = new NativeScrollingMovementMethod();
                        this.nativeObject.setMovementMethod(movementMethod);
                    }
                    else {
                        this.nativeObject.setMovementMethod(null);
                    }
                },
                enumerable: true
            },
            'selectable': {
                get: function() {
                    return this.nativeObject.isTextSelectable();
                },
                set: function(value) {
                    if (TypeUtil.isBoolean(value)) {
                        this.nativeObject.setTextIsSelectable(value);
                    }
                },
                enumerable: true
            },
            'attributedText': {
                get: function() {
                    return _spanArray;
                },
                set: function(values) {
                    _spanArray = values;
                    if(_attributedStringBuilder)
                        _attributedStringBuilder.clear();
                    else
                        _attributedStringBuilder = new NativeSpannableStringBuilder();

                    for (var i = 0; i < _spanArray.length; i++) {
                        createSpannyText(_spanArray[i]);
                    }

                    lineSpacing();
                    this.nativeObject.setText(_attributedStringBuilder);
                    this.nativeObject.setSingleLine(false);
                    if (!isMovementMethodAssigned) {
                        isMovementMethodAssigned = true;
                        this.nativeObject.setMovementMethod(NativeLinkMovementMethod.getInstance());
                    }
                    this.nativeObject.setHighlightColor(NativeColor.TRANSPARENT);
                },
                enumerable: true,
                configurable: true
            },
            'onClick': {
                get: function() {
                    return _onClick;
                },
                set: function(value) {
                    _onClick = value;
                },
                enumerable: true,
                configurable: true
            },
            'onLinkClick': {
                get: function() {
                    return _onLinkClick;
                },
                set: function(value) {
                    _onLinkClick = value;
                },
                enumerable: true,
                configurable: true
            },
            'letterSpacing': {
                get: function() {
                    return _letterSpacing;
                },
                set: function(value) {
                    _letterSpacing = value;
                    if (NativeBuild.VERSION.SDK_INT >= 21) {
                        this.nativeObject.setLetterSpacing(value);

                    }
                },
                enumerable: true,
                configurable: true
            },
            'lineSpacing': {
                get: function() {
                    return _lineSpacing;
                },
                set: function(value) {
                    _lineSpacing = value;
                },
                enumerable: true,
                configurable: true
            },
            'textAlignment': {
                get: function() {
                    return this._textAlignment;
                },
                set: function(textAlignment) {
                    if (textAlignment in TextAlignmentDic) {
                        this._textAlignment = textAlignment;
                    }
                    else {
                        this._textAlignment = this.viewNativeDefaultTextAlignment;
                    }
                    this.nativeObject.setGravity(TextAlignmentDic[this._textAlignment]);
                },
                enumerable: true
            }
        });

        function lineSpacing() {
            var lineSpan = NativeLineHeightSpan.implement({
                chooseHeight: function(text, start, end, spanstartv, v, fm) {
                    fm.ascent -= unitconverter.dpToPixel(_lineSpacing);
                    fm.descent += unitconverter.dpToPixel(_lineSpacing);
                }
            });
            _attributedStringBuilder.setSpan(lineSpan, 0, _attributedStringBuilder.length(), SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        function createSpannyText(value) {
            _attributedStringBuilder.append(value.string);
            var start = _attributedStringBuilder.length() - value.string.length;
            var end = _attributedStringBuilder.length();
            // Link 
            // --------------------------------------------------------------------------------
            if (value.link !== undefined) {
                var clickableSpanOverrideMethods = {
                    onClick: function(view) {
                        self.onClick && self.onClick(value.link);
                        self.onLinkClick && self.onLinkClick(value.link);
                    },
                    updateDrawState: function(ds) {
                        ds.setUnderlineText(value.underline);
                    }
                };

                const SFClickableSpan = requireClass("io.smartface.android.sfcore.ui.textview.SFClickableSpan");
                var clickSpan = new SFClickableSpan(clickableSpanOverrideMethods);
                _attributedStringBuilder.setSpan(clickSpan, start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            if (value.strikethrough) {
                const NativeStrikethroughSpan = requireClass("android.text.style.StrikethroughSpan");
                var strikethroughSpan = new NativeStrikethroughSpan();
                _attributedStringBuilder.setSpan(strikethroughSpan, start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            // Foreground Color 
            // --------------------------------------------------------------------------------
            _attributedStringBuilder.setSpan(new NativeForegroundColorSpan(value.foregroundColor.nativeObject), start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            // Background Color 
            // --------------------------------------------------------------------------------
            _attributedStringBuilder.setSpan(new NativeBackgroundColorSpan(value.backgroundColor.nativeObject), start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            // Font
            // --------------------------------------------------------------------------------
            var newType = value.font.nativeObject;
            var typeSpanOverrideMethods = {
                updateDrawState: function(ds) {
                    applyCustomTypeFace(ds, newType);
                },
                updateMeasureState: function(paint) {
                    applyCustomTypeFace(paint, newType);
                }
            };

            const SFTypefaceSpan = requireClass("io.smartface.android.SFTypefaceSpan");
            var typeSpan = new SFTypefaceSpan("SF", typeSpanOverrideMethods);
            _attributedStringBuilder.setSpan(typeSpan, start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            // Size
            // --------------------------------------------------------------------------------

            const NativeAbsoluteSizeSpan = requireClass("android.text.style.AbsoluteSizeSpan");
            _attributedStringBuilder.setSpan(new NativeAbsoluteSizeSpan(value.font.size, true), start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            // Underline 
            // --------------------------------------------------------------------------------
            if (value.underline === true) {
                const NativeUnderlineSpan = requireClass("android.text.style.UnderlineSpan");
                _attributedStringBuilder.setSpan(new NativeUnderlineSpan(), start, end, SPAN_EXCLUSIVE_EXCLUSIVE);
            }
        }

        function applyCustomTypeFace(paint, tf) {
            var oldStyle;
            var old = paint.getTypeface();
            if (old == null) {
                oldStyle = 0;
            }
            else {
                oldStyle = old.getStyle();
            }
            var fake = oldStyle & ~tf.getStyle();
            if ((fake & NativeTypeface.BOLD) != 0) {
                paint.setFakeBoldText(true);
            }
            if ((fake & NativeTypeface.ITALIC) != 0) {
                paint.setTextSkewX(-0.25);
            }
            paint.setTypeface(tf);
        }

        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);

module.exports = TextView;
