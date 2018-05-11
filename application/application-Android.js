const TypeUtil = require("../util/type");
const AndroidConfig = require("../util/Android/androidconfig");
const RAU = require("./RAU");
const NativeActivityLifeCycleListener = requireClass("io.smartface.android.listeners.ActivityLifeCycleListener");

function ApplicationWrapper() {}

// Intent.ACTION_VIEW
const ACTION_VIEW = "android.intent.action.VIEW";
// Intent.FLAG_ACTIVITY_NEW_TASK
const FLAG_ACTIVITY_NEW_TASK = 268435456;
const REQUEST_CODE_CALL_APPLICATION = 114;
var _onMinimize;
var _onMaximize;
var _onExit;
var _onReceivedNotification;
var _onRequestPermissionsResult;
var spratAndroidActivityInstance = requireClass("io.smartface.android.SpratAndroidActivity").getInstance();

// Creating Activity Lifecycle listener
var activityLifeCycleListener = NativeActivityLifeCycleListener.implement({
    onCreate: function() {},
    onResume: function(){
        if(_onMaximize) {
            _onMaximize();
        }
    },
    onPause: function(){
        if(_onMinimize) {
            _onMinimize();
        }
    },
    onStop: function() {},
    onStart: function() {},
    onDestroy: function() {
        if(_onExit) {
            _onExit();
        }
    },
    onRequestPermissionsResult: function(requestCode, permission, grantResult){
        var permissionResults = {};
        permissionResults['requestCode'] = requestCode;
        permissionResults['result'] = (grantResult === 0);
        ApplicationWrapper.android.onRequestPermissionsResult && ApplicationWrapper.android.onRequestPermissionsResult(permissionResults);
    }
});

// Attaching Activity Lifecycle event
spratAndroidActivityInstance.addActivityLifeCycleCallbacks(activityLifeCycleListener);

Object.defineProperties(ApplicationWrapper, {
    // properties
    'byteReceived': {
        get: function(){
            const NativeTrafficStats = requireClass("android.net.TrafficStats");
            var UID = AndroidConfig.activity.getApplicationInfo().uid;
            return NativeTrafficStats.getUidRxBytes(UID) / (1024 * 1024);
        },
        enumerable: true
    },
    'byteSent': {
        get: function(){
            const NativeTrafficStats = requireClass("android.net.TrafficStats");
            var UID = AndroidConfig.activity.getApplicationInfo().uid;
            return NativeTrafficStats.getUidTxBytes(UID) / (1024 * 1024);
        },
        enumerable: true
    },
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    'currentReleaseChannel': {
        get: function(){
            return Application.currentReleaseChannel;
        },
        enumerable: true
    },
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    'smartfaceAppName': {
        get: function(){
            return Application.smartfaceAppName;
        },
        enumerable: true
    },
    // For publish case, project.json file will be encrypted we can not decrypt this file, we do not have a key so let SMFApplication handle this
    'version': {
        get: function(){
            return Application.version;
        },
        enumerable: true
    },
    'android':{
        value: {},
        enumerable: true
    },
        'Android':{
        value: {},
        enumerable: true
    },
    // methods
    'call': {
        value: function(uriScheme, data, onSuccess, onFailure, isShowChooser, chooserTitle){
            if(!TypeUtil.isString(uriScheme)){
                throw new TypeError('uriScheme must be string');
            }
            
            const NativeIntent = requireClass("android.content.Intent");
            const NativeUri = requireClass("android.net.Uri");
            
            var intent = new NativeIntent(ACTION_VIEW);

            if(TypeUtil.isObject(data)){
                // we should use intent.putExtra but it causes native crash.
                
                var params = Object.keys(data).map(function(k) {
                    return k + '=' + data[k];
                }).join('&');
                var uriObject;
                if(uriScheme.indexOf("|") !== -1){
                    var classActivityNameArray = uriScheme.split("|");
                    // JS string pass causes parameter mismatch
                    const NativeString = requireClass("java.lang.String");
                    var className = new NativeString(classActivityNameArray[0]);
                    var activityName = new NativeString(classActivityNameArray[1]);
                    intent.setClassName(className, activityName);
                    uriObject = NativeUri.parse(params);
                }
                else{
                    var uri = uriScheme + "?" + params;
                    uriObject = NativeUri.parse(uri);
                }
                intent.setData(uriObject);
            }
            else{
                if(uriScheme.indexOf("|") !== -1){
                    var classActivityNameArray = uriScheme.split("|");
                    // JS string pass causes parameter mismatch
                    const NativeString = requireClass("java.lang.String");
                    var className = new NativeString(classActivityNameArray[0]);
                    var activityName = new NativeString(classActivityNameArray[1]);
                    intent.setClassName(className, activityName);
                }
                else{
                    var uri = NativeUri.parse(uriScheme);
                    intent.setData(uri);
                }
            }
            
            var packageManager = AndroidConfig.activity.getPackageManager();
            var activitiesCanHandle = packageManager.queryIntentActivities(intent, 0);
            if(activitiesCanHandle.size() > 0){
                if(TypeUtil.isBoolean(isShowChooser) && isShowChooser){
                    var title = TypeUtil.isString(chooserTitle) ? chooserTitle : "Select and application";
                    var chooserIntent = NativeIntent.createChooser(intent, title); 
                    try{
                        AndroidConfig.activity.startActivityForResult(chooserIntent, REQUEST_CODE_CALL_APPLICATION);
                    }
                    catch(e){
                        onFailure && onFailure();
                        return;
                    }
                }
                else{
                    try{
                        AndroidConfig.activity.startActivityForResult(intent, REQUEST_CODE_CALL_APPLICATION);
                    }
                    catch(e){
                        onFailure && onFailure();
                        return;
                    }
                }
                onSuccess && onSuccess();
                return;
            }
            onFailure && onFailure();
        },
        enumerable: true
    },
    'exit': {
        value: function(){
            AndroidConfig.activity.finish();
        },
        enumerable: true
    },
    'restart': {
        value: function(){
            var spratIntent = AndroidConfig.activity.getIntent();
            AndroidConfig.activity.finish();
            AndroidConfig.activity.startActivity(spratIntent);
        },
        enumerable: true
    },
    'checkUpdate': {
        value: function(callback){
            if(TypeUtil.isFunction(callback)){
                RAU.checkUpdate(callback);
            }
        },
        enumerable: true
    },
    // events
    // We can not handle application calls for now, so let SMFApplication handle this
    'onApplicationCallReceived': {
        get: function(){
            return Application.onApplicationCallReceived;
        },
        set: function(onApplicationCallReceived){
            if(TypeUtil.isFunction(onApplicationCallReceived)){
                Application.onApplicationCallReceived = onApplicationCallReceived;
            }
        },
        enumerable: true
    },
    'onExit': {
        get: function(){
            return _onExit;
        },
        set: function(onExit){
            if(TypeUtil.isFunction(onExit) || onExit === null){
                _onExit = onExit;
            }
        },
        enumerable: true
    },
    'onMaximize': {
        get: function(){
            return _onMaximize;
        },
        set: function(onMaximize){
            if(TypeUtil.isFunction(onMaximize) || onMaximize === null){
                _onMaximize = onMaximize;
            }
        },
        enumerable: true
    },
    'onMinimize': {
        get: function(){
            return _onMinimize;
        },
        set: function(onMinimize){
            if(TypeUtil.isFunction(onMinimize) || onMinimize === null){
                _onMinimize = onMinimize;
            }
        },
        enumerable: true
    },
    'onReceivedNotification': {
        get: function(){
            return _onReceivedNotification;
        },
        set: function(callback){
            if(TypeUtil.isFunction(callback) || callback === null){
                _onReceivedNotification = callback;
            }
        },
        enumerable: true
    },
    // We can not detect js exceptions, so let SMFApplication handle this
    'onUnhandledError': {
        get: function(){
            return Application.onUnhandledError;
        },
        set: function(onUnhandledError){
            if(TypeUtil.isFunction(onUnhandledError) || onUnhandledError === null){
                Application.onUnhandledError = onUnhandledError;
            }
        },
        enumerable: true
    },
    
    'onApplicationCallReceived': {
        get: function(){
            return Application.onApplicationCallReceived;
        },
        set: function(_onApplicationCallReceived){
            if(TypeUtil.isFunction(_onApplicationCallReceived) || _onApplicationCallReceived === null){
                Application.onApplicationCallReceived = _onApplicationCallReceived;
            }
        },
        enumerable: true
    },
});

ApplicationWrapper.ios = {};
Object.defineProperties(ApplicationWrapper.android, {
    'packageName': {
        value: AndroidConfig.activity.getPackageName(),
        enumerable: true
    },
    'checkPermission':{
        value: function(permission){
            if(!TypeUtil.isString(permission)){
                throw new Error('Permission must be Application.Permission type');
            }
            
            if(AndroidConfig.sdkVersion < AndroidConfig.SDK.SDK_MARSHMALLOW){
                // PackageManager.PERMISSION_GRANTED
                const NativeContextCompat = requireClass('android.support.v4.content.ContextCompat');
                return NativeContextCompat.checkSelfPermission(AndroidConfig.activity, permission) === 0;
            }
            else{
                var packageManager = AndroidConfig.activity.getPackageManager();
                // PackageManager.PERMISSION_GRANTED
                return packageManager.checkPermission(permission, ApplicationWrapper.android.packageName) == 0;
            }
            
        },
        enumerable: true
    },
    // @todo requestPermissions should accept permission array too, but due to AND- it accepts just one permission.
    'requestPermissions':{
        value: function(requestCode, permissions){
            if(!TypeUtil.isNumeric(requestCode) || !(TypeUtil.isString(permissions))){
                throw new Error('requestCode must be numeric or permission must be Application.Permission type or array of Application.Permission.');
            }
            if(AndroidConfig.sdkVersion < AndroidConfig.SDK.SDK_MARSHMALLOW){
                ApplicationWrapper.android.onRequestPermissionsResult && ApplicationWrapper.android.onRequestPermissionsResult({
                    requestCode: requestCode,
                    result: this.checkPermission(permissions)
                });
            }
            else{
                AndroidConfig.activity.requestPermissions(array([permissions], "java.lang.String"), requestCode);
            }
            
        },
        enumerable: true
    },
    'shouldShowRequestPermissionRationale':{
        value: function(permission){
            if(!TypeUtil.isString(permission)){
                throw new Error('Permission must be Application.Permission type');
            } 
            return ((AndroidConfig.sdkVersion > AndroidConfig.SDK.SDK_MARSHMALLOW) && AndroidConfig.activity.shouldShowRequestPermissionRationale(permission));
        },
        enumerable: true
    },
    'onRequestPermissionsResult': {
        get: function(){
            return _onRequestPermissionsResult;
        },
        set: function(callback){
            if(TypeUtil.isFunction(callback) || callback === null){
                _onRequestPermissionsResult = callback;
            }
        }
        
    },
    'Permissions': {
        value: {},
        enumerable: true
    }
});

Object.defineProperties(ApplicationWrapper.Android, {
    'Permissions': {
        value: {},
        enumerable: true
    }
});

Object.defineProperties(ApplicationWrapper.Android.Permissions, {
    'READ_CALENDAR': {
        value: 'android.permission.READ_CALENDAR',
        enumerable: true
    },
    'WRITE_CALENDAR': {
        value: 'android.permission.WRITE_CALENDAR',
        enumerable: true
    },
    'CAMERA': {
        value: 'android.permission.CAMERA',
        enumerable: true
    },
    'READ_CONTACTS': {
        value: 'android.permission.READ_CONTACTS',
        enumerable: true
    },
    'WRITE_CONTACTS': {
        value: 'android.permission.WRITE_CONTACTS',
        enumerable: true
    },
    'GET_ACCOUNTS': {
        value: 'android.permission.GET_ACCOUNTS',
        enumerable: true
    },
    'ACCESS_FINE_LOCATION': {
        value: 'android.permission.ACCESS_FINE_LOCATION',
        enumerable: true
    },
    'ACCESS_COARSE_LOCATION': {
        value: 'android.permission.ACCESS_COARSE_LOCATION',
        enumerable: true
    },
    'RECORD_AUDIO': {
        value: 'android.permission.RECORD_AUDIO',
        enumerable: true
    },
    'READ_PHONE_STATE': {
        value: 'android.permission.READ_PHONE_STATE',
        enumerable: true
    },
    'CALL_PHONE': {
        value: 'android.permission.CALL_PHONE',
        enumerable: true
    },
    'READ_CALL_LOG': {
        value: 'android.permission.READ_CALL_LOG',
        enumerable: true
    },
    'WRITE_CALL_LOG': {
        value: 'android.permission.WRITE_CALL_LOG',
        enumerable: true
    },
    'ADD_VOICEMAIL': {
        value: 'com.android.voicemail.permission.ADD_VOICEMAIL',
        enumerable: true
    },
    'USE_SIP': {
        value: 'android.permission.USE_SIP',
        enumerable: true
    },
    'PROCESS_OUTGOING_CALLS': {
        value: 'android.permission.PROCESS_OUTGOING_CALLS',
        enumerable: true
    },
    'BODY_SENSORS': {
        value: 'android.permission.BODY_SENSORS',
        enumerable: true
    },
    'SEND_SMS': {
        value: 'android.permission.SEND_SMS',
        enumerable: true
    },
    'RECEIVE_SMS': {
        value: 'android.permission.RECEIVE_SMS',
        enumerable: true
    },
    'READ_SMS': {
        value: 'android.permission.READ_SMS',
        enumerable: true
    },
    'RECEIVE_WAP_PUSH': {
        value: 'android.permission.RECEIVE_WAP_PUSH',
        enumerable: true
    },
    'RECEIVE_MMS': {
        value: 'android.permission.RECEIVE_MMS',
        enumerable: true
    },
    'READ_EXTERNAL_STORAGE': {
        value: 'android.permission.READ_EXTERNAL_STORAGE',
        enumerable: true
    },
    'WRITE_EXTERNAL_STORAGE': {
        value: 'android.permission.WRITE_EXTERNAL_STORAGE',
        enumerable: true
    },
    'USE_FINGERPRINT': {
        value: 'android.permission.USE_FINGERPRINT',
        enumerable: true
    },
});

Object.assign(ApplicationWrapper.android.Permissions, ApplicationWrapper.Android.Permissions);

module.exports = ApplicationWrapper;