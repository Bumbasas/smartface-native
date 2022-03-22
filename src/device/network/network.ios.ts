import { ConnectionType, NetworkBase, INetworkNotifier } from '.';
import NativeComponent from '../../core/native-component';

class Notifier extends NativeComponent implements INetworkNotifier {
  private _connectionTypeChanged: ((type: ConnectionType) => void) | null;
  readonly android = {
    isInitialStickyNotification() {
      return false;
    },
    initialCacheEnabled: false
  };
  constructor(params?: { connectionTypeChanged: (type: ConnectionType) => void }) {
    super(params);

    if (this.nativeObject) {
      this.nativeObject.stopNotifier();
      this.nativeObject.removeObserver();
      this.nativeObject.reachabilityChangedCallback = () => {
        let sfStatus;
        const status = this.nativeObject.currentReachabilityStatus();
        switch (status) {
          case 0:
            sfStatus = Network.ConnectionType.NONE;
            break;
          case 1:
            sfStatus = Network.ConnectionType.WIFI;
            break;
          case 2:
            sfStatus = Network.ConnectionType.MOBILE;
            break;
          default:
            break;
        }

        if (this.connectionTypeChanged) {
          this.connectionTypeChanged(sfStatus);
        }
      };
    }
  }
  protected createNativeObject(): any {
    const nativeObject = __SF_SMFReachability.reachabilityForInternetConnection();
    nativeObject.observeFromNotificationCenter();
    return nativeObject;
  }
  subscribe(callback) {
    this.connectionTypeChanged = callback;
  }

  unsubscribe() {
    this.nativeObject.stopNotifier();
    this.nativeObject.removeObserver();
    this.connectionTypeChanged = null;
  }
  get connectionTypeChanged() {
    return this._connectionTypeChanged;
  }
  set connectionTypeChanged(value) {
    if (typeof value === 'function') {
      this._connectionTypeChanged = value;
      this.nativeObject.startNotifier();
    } else if (typeof value === 'object') {
      this._connectionTypeChanged = value;
      this.nativeObject.stopNotifier();
    }
  }
}

class NetworkIOS implements NetworkBase {
  ConnectionType = ConnectionType;
  public readonly notifier: INetworkNotifier = new Notifier();
  roamingEnabled: boolean = false;
  get SMSEnabled(): boolean {
    return false;
  }
  get IMSI(): string {
    return '';
  }
  get bluetoothMacAddress(): string {
    return '';
  }
  get wirelessMacAddress(): string {
    return '';
  }
  get carrier() {
    const info = new __SF_CTTelephonyNetworkInfo();
    return info.subscriberCellularProvider.carrierName;
  }
  get connectionType() {
    return __SF_UIDevice.currentReachabilityStatus();
  }
  get connectionIP() {
    return __SF_UIDevice.getIFAddresses()[0];
  }
  cancelAll() {
    if (this.notifier) {
      this.notifier.unsubscribe();
    }
  }
}

const Network = new NetworkIOS();

export default Network;
