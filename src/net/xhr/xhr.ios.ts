import { HTTPRequestMethods, IXHR } from ".";

import NativeEventEmitterComponent from "../../core/native-event-emitter-component";
import { MobileOSProps } from "../../core/native-mobile-component";
import { HttpErrorResponse, HttpRequestOptions, HttpResponse, ResponseTypes, statuses, XMLHttpRequestResponseType } from "./common";
import { XHREventsEvents } from "./xhr-events";

export type XHREventsEvents = ExtractValues<typeof XHREventsEvents>;
class XHR<TEvent extends string = XHREventsEvents, TProps extends MobileOSProps = MobileOSProps> extends NativeEventEmitterComponent<TEvent | XHREventsEvents, any, TProps> implements IXHR {
    public static UNSENT = 0;
    public static OPENED = 1;
    public static HEADERS_RECEIVED = 2;
    public static LOADING = 3;
    public static DONE = 4;

    public onabort: (...args: any[]) => void;
    public onerror: (...args: any[]) => void;
    public onload: (...args: any[]) => void;
    public onloadend: (...args: any[]) => void;
    public onloadstart: (...args: any[]) => void;
    public onprogress: (...args: any[]) => void;
    public onreadystatechange: (...args: any[]) => void;
    public ontimeout: (...args: any[]) => void;

    private _requestID?: number
    private _options: HttpRequestOptions;
    private _readyState: number;
    private _response: any;
    private _headers: any;
    private _errorFlag: boolean;
    private _sendFlag: boolean;
    private _responseType: ResponseTypes = 'text';
    private _responseURL?: string
    private _status: number;

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

    public get responseText(): string {
        if (this._responseType !== XMLHttpRequestResponseType.empty && this._responseType !== XMLHttpRequestResponseType.text) {
            throw new Error("Failed to read the 'responseText' property from 'XMLHttpRequest': " + "The value is only accessible if the object's 'responseType' is '' or 'text' " + `(was '${this._responseType}').`);
        }

        return (this._response && !this._errorFlag) ? this._response : '';
    }

    public get responseType(): ResponseTypes {
        return this._responseType;
    }

    public get responseURL(): string | undefined {
        return this._responseURL;
    }

    public get status(): number {
        return this._status;
    }

    public get statusText(): string {
        if (this._readyState === XHR.UNSENT || this._readyState === XHR.OPENED || this._errorFlag) {
            return '';
        }

        return statuses[this._status];
    }

    public set timeout(value: number) {
        if (this._readyState !== XHR.OPENED || this._sendFlag) {
            throw new Error("Failed to set 'timeout' on 'XMLHttpRequest': " + "The object's state must be OPENED.");
        }

        this._options.timeout = value / 1000
    }

    public set responseType(value: ResponseTypes) {
        if (value === XMLHttpRequestResponseType.empty || value in XMLHttpRequestResponseType) {
            this._responseType = value;
        } else {
            throw new Error(`Response type of '${value}' not supported.`);
        }
    }

    public abort() {
        if (this._requestID) {
            const isRemovedTask = this.nativeObject.removeDataTask(this._requestID)
            if (isRemovedTask) {
                this._response = null;
                this._headers = "";
                this._status = 0;

                if ((this._readyState === XHR.OPENED && this._sendFlag) || this._readyState === XHR.HEADERS_RECEIVED || this._readyState === XHR.LOADING) {
                    this._errorFlag = true;
                    this._sendFlag = false;
                    this._setRequestError('abort');
                }

                if (this._readyState === XHR.DONE) {
                    this._readyState = XHR.UNSENT;
                }
            }
        }
        else {
            //TODO: What are we going to do when request can not be aborted.
        }
    }

    getResponseHeaders(): string {
        if (this._readyState < XHR.HEADERS_RECEIVED || this._errorFlag) {
			return '';
		}

		let result = '';

		for (const i in this._headers) {
			result += i + ': ' + this._headers[i] + '\r\n';
		}

		return result.substr(0, result.length - 2);
    }

    public getResponseHeader(header: string): string | null {
        if (typeof header === 'string' && this._readyState > XHR.OPENED && this._headers && !this._errorFlag) {
            header = header.toLowerCase();
            for (const i in this._headers) {
                if (i.toLowerCase() === header) {
                    return this._headers[i];
                }
            }
        }

        return null;
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

    public send(data?: any) {
        this.resetLocalStates();

        if (this._readyState !== XHR.OPENED || this._sendFlag) {
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': " + "The object's state must be OPENED.");
        }

        //TODO: add FormData, Blob, ArrayBuffer support
        if (typeof data === 'string') {
            this._options.content = data;
        }

        this._sendFlag = true;
        this.emitEvent('loadstart');

        const params = {
            url: this._options.url,
            method: this._options.method,
            headers: this._options.headers && Object.keys(this._options.headers).length > 0 ? this._options.headers : undefined,
            timeout: this._options.timeout ? this._options.timeout / 1000 : undefined,
            responseType: this.responseType
        };

        const taskID = this.nativeObject.createTask(JSON.stringify(params), (response: HttpResponse) => {
            this._handleResponse(response);
        }, (error: HttpErrorResponse) => {
            this._errorFlag = true;
            this._sendFlag = false;

            // -1004 apple specific code for timeout error
            if (error.errorCode == -1004) {
                this.emitEvent("timeout");
            }
            this._setRequestError("error", error);
        })
        this._requestID = taskID
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
        if (Object.values(XHREventsEvents).indexOf(eventName) === -1) {
            throw new Error("Argument `eventName` type does not match")
        }

        const handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    }

    public removeEventListener(eventName: XHREventsEvents, toDetach: Function) {
        if (Object.values(XHREventsEvents).indexOf(eventName) === -1) {
            throw new Error("Argument `eventName` type does not match")
        }

        let handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter((handler) => handler !== toDetach);
        this._listeners.set(eventName, handlers);
    }

    /* HELPER Functions */

    public _handleResponse(response: HttpResponse) {
        this._status = response.statusCode
        this._headers = response.headers
        this._responseURL = response.responseURL

        this._setReadyState(XHR.HEADERS_RECEIVED);
        this._setReadyState(XHR.LOADING);

        //TODO: add FormData, Blob, ArrayBuffer support
        if (this._responseType === XMLHttpRequestResponseType.text || this._responseType === XMLHttpRequestResponseType.empty) {
            this._response = response.content;
        }

        this.emitEvent('progress');
        this._sendFlag = false;
        this._setReadyState(XHR.DONE);
    }

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

    private _setRequestError(eventName: XHREventsEvents, error?: any) {
        this._readyState = XHR.DONE;
        this._response = error;

        this.emitEvent('readystatechange');
        this.emitEvent(eventName, error);
        this.emitEvent('loadend');
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

    private resetLocalStates() {
        this._requestID = undefined
        this._response = null;
        this._responseURL = undefined;
        this._status = 0;
        this._headers = null;
    }
};


export default XHR;
