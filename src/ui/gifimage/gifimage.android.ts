// TODO: [AND-3663] Create a java wrapper class for GifDrawable.
const NativeGifDrawable = requireClass('pl.droidsonroids.gif.GifDrawable');

import FileStream from '../../io/filestream';
import ImageAndroid from '../../ui/image/image.android';
import { AndroidProps, AbstractGifImage, IGifImage, iOSProps } from './gifimage';
import { Size } from '../../primitive/size';
import IBlob from '../../global/blob/blob';
import { IFile } from '../../io/file/file';
import FileAndroid from '../../io/file/file.android';
import BlobAndroid from '../../global/blob/blob.android';

export default class GifImageAndroid extends AbstractGifImage {
  protected createNativeObject(params?: Partial<AbstractGifImage>) {
    const nativeObject = params?.android?.drawable || null;
    this._content = params?.android?.content || null;
    return nativeObject;
  }
  private _content: IFile | IBlob | null;
  private _seekPosition: number;
  private _speed: number;
  constructor(params: Partial<IGifImage> = {}) {
    super(params);
  }

  static createFromFile(path: string, width?: number, height?: number) {
    const file: IFile | undefined = typeof path === 'string' ? new FileAndroid({ path }) : undefined;
    if (file?.nativeObject) {
      return new GifImageAndroid({
        android: {
          drawable: new NativeGifDrawable(file.nativeObject),
          content: file
        }
      });
    } else return null;
  }

  static createFromBlob(blob: IBlob): IGifImage | null {
    const byteArray = blob.nativeObject.toByteArray();
    if (byteArray)
      return new GifImageAndroid({
        android: {
          drawable: new NativeGifDrawable(byteArray),
          content: blob
        }
      });
    return null;
  }

  get loopCount(): number {
    return this.nativeObject.getLoopCount();
  }
  set loopCount(value: number) {
    typeof value === 'number' && this.nativeObject.setLoopCount(value);
  }

  get frameCount(): number {
    return this.nativeObject.getNumberOfFrames();
  }

  get posterImage(): ImageAndroid {
    const bitmap = this.nativeObject.seekToFrameAndGet(0);
    return new ImageAndroid({ bitmap });
  }

  get instrinsicSize(): Size {
    const width = this.nativeObject.getIntrinsicWidth();
    const height = this.nativeObject.getIntrinsicHeight();
    return { width, height };
  }

  toBlob(): IBlob | null {
    if (this._content instanceof FileAndroid) {
      const myFileStream = this._content.openStream(FileStream.StreamType.READ, FileStream.ContentMode.BINARY);
      return (myFileStream?.readToEnd() as BlobAndroid) || null;
    } else if (this._content instanceof BlobAndroid) {
      return this._content;
    }
    return null;
  }

  get android(): AndroidProps {
    const self = this;
    return {
      get seekTo(): number {
        return self._seekPosition;
      },
      set seekTo(value: number) {
        if (typeof value !== 'number') return;
        self._seekPosition = value;
        self.nativeObject.seekTo(value);
      },
      get speed(): number {
        return self._speed;
      },
      set speed(value: number) {
        if (typeof value !== 'number') return;
        this._speed = value;
        self.nativeObject.setSpeed(value);
      },
      reset() {
        self.nativeObject.reset();
      }
    };
  }

  get ios(): iOSProps {
    return {};
  }
}
