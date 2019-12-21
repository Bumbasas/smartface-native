/*globals requireClass*/
const NativeTransitionManager = requireClass('androidx.transition.TransitionManager');
const NativeTransition = requireClass('androidx.transition.Transition');
const NativeTransitionSet = requireClass('androidx.transition.TransitionSet');
const NativeAutoTransition = requireClass('androidx.transition.AutoTransition');
const NativeAlphaTransition = requireClass('io.smartface.android.anims.AlphaTransition');
const NativeRotateTransition = requireClass('io.smartface.android.anims.RotateTransition');
const NativeScaleTransition = requireClass('io.smartface.android.anims.ScaleTransition');

function Animator(params) {
    var _layout = params.layout;
    var _duration = params.duration;
    var _animFunction = params.animFunction;

    var _completeFunction = null;
    var _nextAnimator = null;
    var _onComplete = function() {
        if (_nextAnimator) {
            _nextAnimator.perform();
        } else if (_completeFunction) {
            _completeFunction();
            _layout.applyLayout();
        }
    };

    Object.defineProperties(this, {
        'perform': {
            value: function() {
                var scaleTransiton = new NativeScaleTransition();
                var autoTransition = new NativeAutoTransition();
                var alphaTransition = new NativeAlphaTransition();
                var rotateTransition = new NativeRotateTransition();
                var transitionSet = new NativeTransitionSet();
                transitionSet.addTransition(autoTransition);
                transitionSet.addTransition(alphaTransition);
                transitionSet.addTransition(rotateTransition);
                transitionSet.addTransition(scaleTransiton);
                transitionSet.setDuration(long(_duration));
                transitionSet.addListener(NativeTransition.TransitionListener.implement({
                    onTransitionStart: function(transition) {},
                    onTransitionCancel: function(transition) {},
                    onTransitionPause: function(transition) {},
                    onTransitionResume: function(transition) {},
                    onTransitionEnd: function(transition) {
                        _onComplete();
                    }
                }));
                NativeTransitionManager.beginDelayedTransition(_layout.nativeObject, transitionSet);
                _animFunction();
                _layout.applyLayout();
                applyLayoutInners(_layout);
            }
        },
        'then': {
            value: function(duration, animFunction) {
                var animator = new Animator({
                    layout: _layout,
                    duration: duration,
                    animFunction: animFunction
                });
                _nextAnimator = animator;
                return _nextAnimator;
            }
        },
        'complete': {
            value: function(completeFunction) {
                _completeFunction = completeFunction;
            }
        },
        'toString': {
            value: function() {
                return 'Animator';
            },
            enumerable: true,
            configurable: true
        }
    });
}

function applyLayoutInners(rootLayout) {
    var innerGroups = [];
    addInnerNativeViewGroups(rootLayout.nativeObject, innerGroups);
    innerGroups.forEach(function(viewGroup) {
        viewGroup.requestLayout();
        viewGroup.invalidate();
    });
}

function addInnerNativeViewGroups(viewGroup, viewGroups) {
    const NativeViewGroup = requireClass("android.view.ViewGroup");
    const NativeMapView = requireClass('com.google.android.gms.maps.MapView');
    for (var i = 0; i < viewGroup.getChildCount(); i++) {
        var innerView = viewGroup.getChildAt(i);
        var innerClass = innerView.getClass();

        // !NativeMapView.isAssignableFrom(innerClass) added for AND-3120
        if (NativeViewGroup.isAssignableFrom(innerClass) && !NativeMapView.isAssignableFrom(innerClass)) {
            addInnerNativeViewGroups(innerView, viewGroups);
        }
        viewGroups.push(innerView);
    }
}

Object.defineProperty(Animator, 'animate', {
    value: function(rootLayout, duration, animFunction) {
        var animator = new Animator({
            layout: rootLayout,
            duration: duration,
            animFunction: animFunction
        });
        animator.perform();
        return animator;
    }
});

module.exports = Animator;