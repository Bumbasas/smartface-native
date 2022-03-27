import { HTTPRequestMethods, IXHR } from ".";

import NativeEventEmitterComponent from "../../core/native-event-emitter-component";
import { MobileOSProps } from "../../core/native-mobile-component";
import { HttpRequestOptions } from "./common";
import { XHREventsEvents } from "./xhr-events";

export type XHREventsEvents = ExtractValues<typeof XHREventsEvents>;
class XHR<TEvent extends string = XHREventsEvents, TProps extends MobileOSProps = MobileOSProps> extends NativeEventEmitterComponent<TEvent | XHREventsEvents, any, TProps> implements IXHR {
    public static UNSENT = 0;
    public static OPENED = 1;
    public static DONE = 4;

    public onabort: (...args: any[]) => void;
    public onerror: (...args: any[]) => void;
    public onload: (...args: any[]) => void;
	public onloadend: (...args: any[]) => void;
    public onloadstart: (...args: any[]) => void;
    public onprogress: (...args: any[]) => void;
	public onreadystatechange: (...args: any[]) => void;
    public ontimeout: (...args: any[]) => void;

    private _options: HttpRequestOptions;
    private _readyState: number;
    private _response: any;
    private _sendFlag: boolean;

    private _listeners: Map<string, Array<Function>> = new Map<string, Array<Function>>();


    protected createNativeObject() {
        this._readyState = XHR.UNSENT;
        return new __SF_XMLHttpRequest();
    }

    public get readyState(): number {
		return this._readyState;
	}

    public get response(): any {
        if (this._responseType === XMLHttpRequestResponseType.empty || this._responseType === XMLHttpRequestResponseType.text) {
            if (this._readyState !== XHR.LOADING && this._readyState !== XHR.DONE) {
                return '';
            } else {
                return this._response;
            }
        } else {
            if (this._readyState !== XHR.DONE) {
                return null;
            } else {
                return this._response;
            }
        }
    }

    public get responseType(): ResponseTypes {
        return this._responseType;
    }

    public set responseType(value: ResponseTypes) {
        if (value === XMLHttpRequestResponseType.empty || value in XMLHttpRequestResponseType) {
            this._responseType = value;
        } else {
            throw new Error(`Response type of '${value}' not supported.`);
        }
    }

    public open(method: HTTPRequestMethods, url: string, async?: boolean, user?: string, password?: string) {
        if (typeof async === 'boolean' && !async) {
            throw new Error('Every request must be asynchronous')
        }
        else if (typeof method !== 'string' && typeof url !== 'string') {
            throw new Error("Method and URL must be string");
        }

        this._options = { method: method, url: url }
        this._options.headers = {};

        if (typeof user === 'string') {
            this._options.headers['user'] = user;
        }
        if (typeof password === 'string') {
            this._options.headers['password'] = password;
        }

        this._setReadyState(XHR.OPENED);
    }

    public setRequestHeader(header: string, value: string) {
        if (this._readyState !== XHR.OPENED || this._sendFlag) {
            throw new Error("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': " + "The object's state must be OPENED.");
        }

        if (typeof header === 'string' && typeof value === 'string' && this._options.headers) {
            this._options.headers[header] = value;
        }
    }

    public addEventListener(eventName: XHREventsEvents, handler: Function) {
        if(Object.values(XHREventsEvents).indexOf(eventName) === -1) {
            throw new Error("Argument `eventName` type does not match")
        }

		const handlers = this._listeners.get(eventName) || [];
		handlers.push(handler);
		this._listeners.set(eventName, handlers);
	}

	public removeEventListener(eventName: XHREventsEvents, toDetach: Function) {
        if(Object.values(XHREventsEvents).indexOf(eventName) === -1) {
            throw new Error("Argument `eventName` type does not match")
        }

		let handlers = this._listeners.get(eventName) || [];
		handlers = handlers.filter((handler) => handler !== toDetach);
		this._listeners.set(eventName, handlers);
	}

    /* HELPER Functions */

    private _setReadyState(value: number) {
        if (this._readyState !== value) {
            this._readyState = value;
            this.emitEvent('readystatechange');

        }

        if (this._readyState === XHR.DONE) {
            this.emitEvent('load');
            this.emitEvent('loadend');
        }
    }

    private emitEvent(eventName: XHREventsEvents, ...args: Array<any>) {
        this.emit(eventName)

        if (typeof this['on' + eventName] === 'function') {
            this['on' + eventName](...args);
        }

        const handlers = this._listeners.get(eventName) || [];
        handlers.forEach((handler) => {
            handler(...args);
        });
    }
};


export default XHR;
