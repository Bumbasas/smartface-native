import { ConstructorOf } from '../../core/constructorof';
import IFlexLayout from './flexlayout';

const FlexLayout: ConstructorOf<IFlexLayout, Partial<IFlexLayout>> = require(`./image.${Device.deviceOS.toLowerCase()}`)
.default;
type FlexLayout = IFlexLayout;

export default FlexLayout;