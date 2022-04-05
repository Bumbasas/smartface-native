import File from '../../io/file';
import FileStream from '../../io/filestream';
import Image from '../../ui/image';
import Blob from '../../global/blob';
import { AndroidProps, AbstractGifImage, IGifImage, iOSProps } from './gifimage';
import { Size } from '../../primitive/size';
import ImageiOS from '../image/image.ios';
import IBlob from '../../global/blob/blob';

export default class GifImageIOS extends AbstractGifImage {
  toBlob(): IBlob | null {
    throw new Error('Method not implemented.');
  }
  protected createNativeObject(params: Partial<IGifImage>) {
    return params.nativeObject;
  }
  constructor(params: Partial<IGifImage> = {}) {
    super(params);
  }

  static createFromFile(path: string): GifImageIOS {
    const file: File = typeof path === 'string' ? new File({ path }) : path;
    const fileStream = file.openStream(FileStream.StreamType.READ, FileStream.ContentMode.BINARY);
    const blob = fileStream?.readToEnd<Blob>();
    const nativeObject = __SF_FLAnimatedImage.animatedImageWithGIFData(blob?.nativeObject);

    return new GifImageIOS({ nativeObject });
  }

  static createFromBlob(blob: Blob): GifImageIOS {
    const nativeObject = __SF_FLAnimatedImage.animatedImageWithGIFData(blob.nativeObject);
    return new GifImageIOS({ nativeObject: nativeObject });
  }

  get loopCount(): number {
    return this.nativeObject.loopCount;
  }

  set loopCount(value: number) {}

  get frameCount(): number {
    return this.nativeObject.frameCount;
  }

  get posterImage(): Image {
    return ImageiOS.createFromImage(this.nativeObject.posterImage);
  }

  get instrinsicSize(): Size {
    return this.nativeObject.size;
  }

  get ios(): iOSProps {
    const self = this;
    return {
      get frameCacheSizeCurrent(): number {
        return self.nativeObject.frameCacheSizeCurrent;
      },
      getDelayTimesForIndexes() {
        return self.nativeObject.getDelayTimesForIndexes();
      }
    };
  }

  get android(): AndroidProps {
    return {};
  }
}
