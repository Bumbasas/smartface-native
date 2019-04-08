const FlexLayout = require('sf-core/ui/flexlayout');
const Color = require('sf-core/ui/color');

function Dialog(params) {

    var self = this;

    self.dialogView = new FlexLayout();
    self.dialogView.nativeObject.frame = __SF_UIScreen.mainScreen().bounds;
    self.dialogView.backgroundColor = Color.create(58, 0, 0, 0);
    self.dialogView.id = Dialog.iOS.ID;

    self.calculatePosition = function() {
        self.dialogView.nativeObject.frame = __SF_UIScreen.mainScreen().bounds;

        self.dialogView.applyLayout();
    }

    self.dialogView.nativeObject.addObserver(function() {
        __SF_UIView.animation(__SF_UIApplication.sharedApplication().statusBarOrientationAnimationDuration, 0, function() {
            self.calculatePosition();
        }, function() {

        });
    }, __SF_UIApplicationDidChangeStatusBarOrientationNotification);

    self.calculatePosition();
    //android specific property.
    self.android = {};
    Object.defineProperty(self, 'layout', {
        get: function() {
            return self.dialogView;
        },
        enumerable: true
    });

    self.layout.applyLayout = function() {
        self.dialogView.nativeObject.yoga.applyLayoutPreservingOrigin(true);
    }

    self.hide = function() {
        self.dialogView.nativeObject.removeFromSuperview();
    };

    self.show = function() {
        __SF_UIApplication.sharedApplication().keyWindow.addSubview(self.dialogView.nativeObject);
        self.dialogView.applyLayout();
    };

    if (params) {
        for (var param in params) {
            this[param] = params[param];
        }
    }
};

Dialog.iOS = {};
Dialog.iOS.ID = 1453;

//these are for android dialog style
Dialog.Android = {};
Dialog.Android.Style = {};

module.exports = Dialog;