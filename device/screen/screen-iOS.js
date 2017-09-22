const Image = require("sf-core/ui/image");

function Screen() {}

Screen.ios = {};
/*
    0 unknown
    1 portrait
    2 portraitUpsideDown
    3 landscapeLeft
    4 landscapeRight
    5 faceUp
    6 faceDown
*/
Object.defineProperty(Screen, 'orientation', {
  get: function() {
    if (__SF_UIDevice.currentDevice().orientation === 5) {
      return 1;
    }else if (__SF_UIDevice.currentDevice().orientation === 6){
      return 2;
    }else{
      return __SF_UIDevice.currentDevice().orientation;
    }
  },
  enumerable: true
});

Object.defineProperty(Screen, 'height', {
  get: function() {
    return __SF_UIScreen.mainScreen().bounds.height;
  },
  enumerable: true
});

Object.defineProperty(Screen, 'width', {
  get: function() {
    return __SF_UIScreen.mainScreen().bounds.width;
  },
  enumerable: true
});

Object.defineProperty(Screen, 'touchSupported', {
  value: 1,  
  writable: false,
  enumerable: true
});

Object.defineProperty(Screen.ios, 'forceTouchAvaliable', {
  value: __SF_UIDevice.forceTouchAvaliable(),  
  writable: false,
  enumerable: true
});

Object.defineProperty(Screen, 'capture', {
  value: function(){
    return Image.createFromImage(__SF_UIDevice.takeSnapShot());
  },  
  writable: false,
  enumerable: true
});


Object.defineProperty(Screen, 'dpi', {
  get: function() {
          if (__SF_UIScreen.mainScreen().scale === 2){
              return 326;
          }else if (__SF_UIScreen.mainScreen().scale === 3){
              return 401;
          }else{
              return 163;
          }
     },
     enumerable: true
});

module.exports = Screen;