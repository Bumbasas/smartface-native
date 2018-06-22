const AndroidConfig = require('../../util/Android/androidconfig')
const NativeBluetoothAdapter = requireClass('android.bluetooth.BluetoothAdapter');
const NativeTelephonyManager = requireClass('android.telephony.TelephonyManager');
const NativeConnectivityManager = requireClass('android.net.ConnectivityManager');
// Context.WIFI_SERVICE
const WIFI_SERVICE = 'wifi';
const WIFI_MANAGER = 'android.net.wifi.WifiManager';
// Context.CONNECTIVITY_SERVICE
const CONNECTIVITY_SERVICE = 'connectivity';
const CONNECTIVITY_MANAGER = 'android.net.ConnectivityManager';
// Context.TELEPHONY_SERVICE
const TELEPHONY_SERVICE = 'phone';
const TELEPHONY_MANAGER = 'android.telephony.TelephonyManager';

const Network = {};
Network.ConnectionType = {};
Network.ConnectionType.None = 0;
Network.ConnectionType.Mobile = 1;
Network.ConnectionType.WIFI = 2;

Network.ConnectionType.NONE = 0;
Network.ConnectionType.MOBILE = 1;

const MARSHMALLOW = 23;

var _connectionTypeCallback;
var isReceiverInit = false;
Object.defineProperties(Network, {
    'IMSI': {
        get: function() {
            return getTelephonyManager().getSubscriberId() ? getTelephonyManager().getSubscriberId() : null;
        },
        configurable: false
    },
    'SMSEnabled': {
        get: function() {
            return getTelephonyManager().getDataState() === NativeTelephonyManager.DATA_CONNECTED;
        },
        configurable: false
    },
    'bluetoothMacAddress': {
        get: function() {
            var bluetoothAdapter = NativeBluetoothAdapter.getDefaultAdapter();
            if (bluetoothAdapter === null) {
                return "null";
            }
            else {
                return bluetoothAdapter.getAddress();
            }
        },
        configurable: false
    },
    'carrier': {
        get: function() {
            return getTelephonyManager().getNetworkOperatorName();
        },
        configurable: false
    },
    'connectionType': {
        get: function() {
            var activeInternet = getActiveInternet();
            if (activeInternet == null) { // undefined or null
                return Network.ConnectionType.NONE;
            }
            else {
                if (activeInternet.getType() === NativeConnectivityManager.TYPE_WIFI) {
                    return Network.ConnectionType.WIFI;
                }
                else if (activeInternet.getType() === NativeConnectivityManager.TYPE_MOBILE) {
                    return Network.ConnectionType.MOBILE;
                }
                else {
                    return Network.ConnectionType.NONE;
                }
            }
        },
        configurable: false
    },
    'connectionIP': {
        get: function() {
            if (Network.connectionType === Network.ConnectionType.WIFI) {
                var wifiManager = AndroidConfig.getSystemService(WIFI_SERVICE, WIFI_MANAGER);
                var wifiInfo = wifiManager.getConnectionInfo();
                var ipAddress = wifiInfo.getIpAddress();
                return (ipAddress & 0xff) +
                    "." + ((ipAddress >> 8) & 0xff) +
                    "." + ((ipAddress >> 16) & 0xff) +
                    "." + ((ipAddress >> 24) & 0xff);
            }
            else {
                return "0.0.0.0";
            }
        },
        configurable: false
    },
    'wirelessMacAddress': {
        get: function() {
            var wifiManager = AndroidConfig.getSystemService(WIFI_SERVICE, WIFI_MANAGER);
            var wifiInfo = wifiManager.getConnectionInfo();
            return wifiInfo.getMacAddress();
        },
        configurable: false
    },
    'connectionTypeChanged': {
        get: function() {
            return _connectionTypeCallback;
        },
        set: function(connectionTypeCallback) {
            if (typeof connectionTypeCallback !== 'function')
                return;
                
            if (!isReceiverInit) {
                isReceiverInit = true;
                initConnectionTypeReceiver();
            }
            _connectionTypeCallback = connectionTypeCallback;
        }
    }
});

function initConnectionTypeReceiver() {
    const NativeIntentFilter = requireClass("android.content.IntentFilter");
    const NativeConnectivityManager = requireClass("android.net.ConnectivityManager");
    const NativeBroadcastReceiver = requireClass("android.content.BroadcastReceiver");

    var connectionFilter = new NativeIntentFilter();
    connectionFilter.addAction(NativeConnectivityManager.CONNECTIVITY_ACTION);

    var broadcastReceiverObj = NativeBroadcastReceiver.extend('SFBroadcastReceiver', {
        onReceive: function(context, intent) {
            var noConnectivity = intent.getBooleanExtra(NativeConnectivityManager.EXTRA_NO_CONNECTIVITY, false);
            Network.connectionTypeChanged && Network.connectionTypeChanged(!noConnectivity);
        }
    }, null);

    AndroidConfig.activity.registerReceiver(broadcastReceiverObj, connectionFilter);
}

function getActiveInternet() {
    var connectivityManager;
    connectivityManager = AndroidConfig.getSystemService(CONNECTIVITY_SERVICE, CONNECTIVITY_MANAGER);
    return connectivityManager.getActiveNetworkInfo();
}

function getTelephonyManager() {
    return AndroidConfig.getSystemService(TELEPHONY_SERVICE, TELEPHONY_MANAGER);
}

module.exports = Network;
