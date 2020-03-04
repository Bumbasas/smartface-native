const View = require('../view');
const extend = require('js-base/core/extend');
const UIControlEvents = require("sf-core/util").UIControlEvents;
const Color = require("sf-core/ui/color");

const RangeSlider = extend(View)(
	function(_super, params) {
		var self = this;

		if (!self.nativeObject) {
			self.nativeObject = new __SF_MultiSlider();
		}

		_super(this);

		self.nativeObject.layer.masksToBounds = false;
		self.nativeObject.isVertical = false;
		self.nativeObject.thumbCount = 2;
		self.nativeObject.snapStepSize = 1;
		self.nativeObject.minimumValue = 0;
		self.nativeObject.maximumValue = 5;

		var _rangeEnabled = true;
		Object.defineProperty(self, 'rangeEnabled', {
			get: function() {
				return _rangeEnabled;
			},
			set: function(value) {
				value ? (self.nativeObject.thumbCount = 2) : (self.nativeObject.thumbCount = 1);
				_rangeEnabled = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'trackColor', {
			get: function() {
				return new Color({
					color: self.nativeObject.tintColor
				});
			},
			set: function(value) {
				self.nativeObject.tintColor = value.nativeObject;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'outerTrackColor', {
			get: function() {
				return new Color({
					color: self.nativeObject.outerTrackColor
				});
			},
			set: function(value) {
				self.nativeObject.outerTrackColor = value.nativeObject;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'trackWeight', {
			get: function() {
				return self.nativeObject.trackWidth;
			},
			set: function(value) {
				self.nativeObject.trackWidth = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'value', {
			get: function() {
				return self.nativeObject.value;
			},
			set: function(value) {
				if (value.length !== self.nativeObject.thumbCount) {
					throw new TypeError("Value array length must be " + self.nativeObject.thumbCount);
				}
				self.nativeObject.value = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'snapStepSize', {
			get: function() {
				return self.nativeObject.snapStepSize;
			},
			set: function(value) {
				self.nativeObject.snapStepSize = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'minValue', {
			get: function() {
				return self.nativeObject.minimumValue;
			},
			set: function(value) {
				self.nativeObject.minimumValue = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'maxValue', {
			get: function() {
				return self.nativeObject.maximumValue;
			},
			set: function(value) {
				self.nativeObject.maximumValue = value;
			},
			enumerable: true
		});

		var _thumbImage = undefined;
		Object.defineProperty(self.ios, 'thumbImage', {
			get: function() {
				return _thumbImage;
			},
			set: function(value) {
				_thumbImage = value;
				self.nativeObject.thumbImage = _thumbImage ? _thumbImage.nativeObject : undefined;
			},
			enumerable: true
		});

		Object.defineProperty(self.ios, 'isHapticSnap', {
			get: function() {
				return self.nativeObject.isHapticSnap;
			},
			set: function(value) {
				self.nativeObject.isHapticSnap = value;
			},
			enumerable: true
		});

		var _valueChangeHandler = function() {
			if (typeof self.onValueChange === "function") {
				self.onValueChange(self.value);
			}
		};

		self.nativeObject.addJSTarget(_valueChangeHandler, UIControlEvents.valueChanged);

		var _onValueChange;
		Object.defineProperty(self, 'onValueChange', {
			get: function() {
				return _onValueChange;
			},
			set: function(value) {
				_onValueChange = value;
			},
			enumerable: true
		});

		Object.defineProperty(self, 'isTrackRounded', {
			get: function() {
				return self.nativeObject.hasRoundTrackEnds;
			},
			set: function(value) {
				self.nativeObject.hasRoundTrackEnds = value;
			},
			enumerable: true
		});

		Object.defineProperty(self.ios, 'showsThumbImageShadow', {
			get: function() {
				return self.nativeObject.showsThumbImageShadow;
			},
			set: function(value) {
				self.nativeObject.showsThumbImageShadow = value;
			},
			enumerable: true
		});

		// Assign parameters given in constructor
		params && (function(params) {
			for (var param in params) {
				if (param === "ios" || param === "android") {
					setOSSpecificParams.call(this, params[param], param);
				}
				else {
					this[param] = params[param];
				}
			}

			function setOSSpecificParams(params, key) {
				for (var param in params) {
					this[key][param] = params[param];
				}
			}
		}.bind(this)(params));
	});

module.exports = RangeSlider;