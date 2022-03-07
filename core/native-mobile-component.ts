import { copyObjectPropertiesWithDescriptors } from '../util';
import NativeComponent from './native-component';

export type MobileOSProps<TIOS extends { [key: string]: any } = {[key: string]: any}, TAND extends { [key: string]: any } = {[key: string]: any}> = {
  ios?: Partial<TIOS>;
  android?: Partial<TAND>;
};
export type WithMobileOSProps<TProps extends Record<string, any> = {}, TIOS extends { [key: string]: any } = { [key: string]: any }, TAND extends { [key: string]: any } = { [key: string]: any }> = MobileOSProps<TIOS, TAND> & Partial<TProps>;
export abstract class NativeMobileComponent<TNative extends Record<string, any> = Record<string, any>, TProps extends WithMobileOSProps<{ [key: string]: any }> = {}> extends NativeComponent<TNative> {
  private _ios: TProps['ios'] = {};
  private _android: TProps['android'] = {};
  constructor({ android = {}, ios = {}, ...rest }: TProps) {
    super(rest);

    copyObjectPropertiesWithDescriptors(this._ios, ios);
    copyObjectPropertiesWithDescriptors(this._android, android);
  }
  protected addAndroidProps(props: TProps['android']) {
    copyObjectPropertiesWithDescriptors(this._android, props);
  }
  protected addIOSProps(props: TProps['ios']) {
    copyObjectPropertiesWithDescriptors(this._ios, props);
  }
  get ios(): Partial<TProps['ios']> {
    return this._ios;
  }
  get android(): Partial<TProps['android']> {
    return this._android;
  }
}
