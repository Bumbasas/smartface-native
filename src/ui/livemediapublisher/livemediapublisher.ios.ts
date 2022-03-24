import LiveMediaPublisher, { AudioProfile, Camera, ILiveMediaPublisher, VideoPreset, VideoProfile } from '.';
import ViewIOS from '../view/view.ios';
import { LiveMediaPublisherEvents } from './livemediapublisher-events';

//Defaults
const cameraDefault = {
  cameraId: 0,
  cameraFrontMirror: true
};

const videoDefault = {
  preset: 12,
  bitrate: 400000,
  profile: 1,
  fps: 15,
  videoFrontMirror: false
};

const audioDefault = {
  bitrate: 32000,
  profile: 1,
  samplerate: 44100
};

export default class LiveMediaPublisherIOS<TEvent extends string = LiveMediaPublisherEvents> extends ViewIOS<TEvent | LiveMediaPublisherEvents, {}> implements ILiveMediaPublisher {
  static Events = LiveMediaPublisherEvents;
  static Camera = Camera;
  static VideoPreset = VideoPreset;
  static VideoProfile = VideoProfile;
  static AudioProfile = AudioProfile;
  private nodePublisher: __SF_NodePublisher;
  private publisherDelegate: __SF_NodePlayerDelegateClass;
  private _outputUrl = '';
  private _flashEnabled = false;
  private _audioEnabled = true;
  private _videoEnabled = true;
  private _videoOptions = videoDefault;
  private _cameraOptions = cameraDefault;
  private _audioOptions = audioDefault;
  private _onChange: (params: { event: number; message: string }) => void;
  createNativeObject() {
    this.nodePublisher = new __SF_NodePublisher();
    const previewView = new ViewIOS();
    return previewView.nativeObject;
  }
  constructor(params?: Partial<LiveMediaPublisher>) {
    super(params);
    const self = this;

    this.nodePublisher.setCameraPreviewCameraIdFrontMirror(this._nativeObject, this._cameraOptions.cameraId, this._cameraOptions.cameraFrontMirror);

    this.nodePublisher.setVideoParamPresetFpsBitrateProfileFrontMirror(
      this._videoOptions.preset,
      this._videoOptions.fps,
      this._videoOptions.bitrate,
      this._videoOptions.profile,
      this._videoOptions.videoFrontMirror
    );

    this.nodePublisher.setAudioParamBitrateProfileSampleRate(this._audioOptions.bitrate, this._audioOptions.profile, this._audioOptions.samplerate);

    this.publisherDelegate = new __SF_NodePlayerDelegateClass();
    this.publisherDelegate.onEventCallbackEventMsg = function (e) {
      self._onChange?.({ event: e.event, message: e.msg });
      self.emit(LiveMediaPublisherEvents.Change, { event: e.event, message: e.msg });
    };
    this.nodePublisher.nodePublisherDelegate = this.publisherDelegate;
  }
  get onChange() {
    return this._onChange;
  }
  set onChange(callback: (params: { event: number; message: string }) => void) {
    this._onChange = callback;
  }
  get audioEnabled() {
    return this._audioEnabled;
  }
  set audioEnabled(value: boolean) {
    this._audioEnabled = value;
    this.nodePublisher.audioEnable = this._audioEnabled;
  }
  get videoEnabled() {
    return this._videoEnabled;
  }
  set videoEnabled(value: boolean) {
    this._videoEnabled = value;
    this.nodePublisher.videoEnable = this._videoEnabled;
  }
  get video() {
    return this._videoOptions;
  }
  set video(options: Partial<{ preset: number; bitrate: number; profile: number; fps: number; videoFrontMirror: boolean }>) {
    const videoOptionsDefault = Object.assign({}, videoDefault);
    this._videoOptions = Object.assign(videoOptionsDefault, options);

    this.nodePublisher.setVideoParamPresetFpsBitrateProfileFrontMirror(
      this._videoOptions.preset,
      this._videoOptions.fps,
      this._videoOptions.bitrate,
      this._videoOptions.profile,
      this._videoOptions.videoFrontMirror
    );
  }
  get camera() {
    return this._cameraOptions;
  }
  set camera(options: Partial<{ cameraId: number; cameraFrontMirror: boolean }>) {
    const cameraOptionsDefault = Object.assign({}, cameraDefault);
    this._cameraOptions = Object.assign(cameraOptionsDefault, options);

    this.nodePublisher.setCameraPreviewCameraIdFrontMirror(this._nativeObject, this._cameraOptions.cameraId, this._cameraOptions.cameraFrontMirror);
  }
  get audio() {
    return this._audioOptions;
  }
  set audio(options: Partial<{ bitrate: number; profile: number; samplerate: number }>) {
    const audioOptionsDefault = Object.assign({}, audioDefault);
    this._audioOptions = Object.assign(audioOptionsDefault, options);
    this.nodePublisher.setAudioParamBitrateProfileSampleRate(this._audioOptions.bitrate, this._audioOptions.profile, this._audioOptions.samplerate);
  }
  get outputUrl() {
    return this._outputUrl;
  }
  set outputUrl(url: string) {
    this._outputUrl = url;
    this.nodePublisher.outputUrl = this._outputUrl;
  }
  get flashEnabled() {
    return this._flashEnabled;
  }
  set flashEnabled(value: boolean) {
    this._flashEnabled = value;
    this.nodePublisher.flashEnable = this._flashEnabled;
  }
  play() {
    this.nodePublisher.start();
  }
  stop() {
    this.nodePublisher.stop();
  }
  startPreview() {
    this.nodePublisher.startPreview();
  }
  stopPreview() {
    this.nodePublisher.stopPreview();
  }
  switchCamera() {
    this.nodePublisher.switchCamera();
  }
  release() {}
}
