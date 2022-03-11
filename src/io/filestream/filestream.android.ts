/* globals requireClass */
import File from '../file';
import Path from '../path';
import TypeUtil from '../../util/type';
import Blob from '../../global/blob';
import AndroidConfig from '../../util/Android/androidconfig';
import { IFileStream, FileStreamType, FileContentMode, FileStreamParams } from './filestream';
import NativeComponent from '../../core/native-component';

const StringUtil = requireClass('io.smartface.android.utils.StringUtil');
const NativeBufferedOutputStream = requireClass('java.io.BufferedOutputStream');
const NativeFileOutputStream = requireClass('java.io.FileOutputStream');
const NativeOutputStreamWriter = requireClass('java.io.OutputStreamWriter');
const NativeBufferedWriter = requireClass('java.io.BufferedWriter');
const NativeInputStreamReader = requireClass('java.io.InputStreamReader');
const NativeBufferedReader = requireClass('java.io.BufferedReader');
const NativeBufferedInputStream = requireClass('java.io.BufferedInputStream');
const NativeFileInputStream = requireClass('java.io.FileInputStream');
const NativeFileReader = requireClass('java.io.FileReader');
export class FileStreamAndroid extends NativeComponent implements IFileStream {
  private _fileObject: any;
  private _mode: FileStreamType;
  private _contentMode: FileContentMode;
  private _closed = false;
  constructor(params: FileStreamParams) {
    //The constructor isn't used externally. The parameters are required to call .
    super();

    this._mode = params.mode;
    this._contentMode = FileStreamAndroid.ContentMode.hasValue(params.contentMode) ? params.contentMode : FileStreamAndroid.ContentMode.TEXT;
    if (FileStreamAndroid.StreamType.hasValue(this._mode)) {
      if (TypeUtil.isString(params.path)) {
        this._fileObject = new File({
          path: params.path
        });
      }
      // TODO Recheck
      // must check instance of File but
      // instanceof check, but got #<Object>
      else if (params.source) {
        this._fileObject = params.source;
      } else {
        throw new Error('File path must be string or source must be given');
      }
    } else {
      throw new Error('Mode must be FileStream.StreamType');
    }

    if (this._mode === FileStreamAndroid.StreamType.APPEND) {
      if (this._fileObject.type !== Path.FILE_TYPE.FILE) {
        throw new Error('FileStream.StreamType.APPEND can be used for only files.');
      }

      if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
        const fileOutputStream = new NativeFileOutputStream(this._fileObject.nativeObject, true);
        const outputStreamWriter = new NativeOutputStreamWriter(fileOutputStream);
        this.nativeObject = new NativeBufferedWriter(outputStreamWriter);
      } else {
        const fileOutputStream = new NativeFileOutputStream(this._fileObject.nativeObject, true);
        this.nativeObject = new NativeBufferedOutputStream(fileOutputStream);
      }
    } else if (this._mode === FileStreamAndroid.StreamType.READ) {
      if (this._fileObject.type === Path.FILE_TYPE.ASSET) {
        if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
          const inputStreamReader = new NativeInputStreamReader(this._fileObject.nativeObject);
          this.nativeObject = new NativeBufferedReader(inputStreamReader);
        } else {
          const fileInputStream = new NativeFileInputStream(this._fileObject.nativeObject);
          this.nativeObject = new NativeBufferedInputStream(fileInputStream);
        }
      } else if (this._fileObject.type === Path.FILE_TYPE.DRAWABLE) {
        const inputStream = AndroidConfig.activityResources.openRawResource(this._fileObject.drawableResourceId);
        if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
          const inputStreamReader = new NativeInputStreamReader(inputStream);
          this.nativeObject = new NativeBufferedReader(inputStreamReader);
        } else {
          this.nativeObject = new NativeBufferedInputStream(inputStream);
        }
      } else {
        if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
          const fileReader = new NativeFileReader(this._fileObject.nativeObject);
          this.nativeObject = new NativeBufferedReader(fileReader);
        } else {
          const fileInputStream = new NativeFileInputStream(this._fileObject.nativeObject);
          this.nativeObject = new NativeBufferedInputStream(fileInputStream);
        }
      }
    } else if (this._mode === FileStreamAndroid.StreamType.WRITE) {
      if (this._fileObject.type !== Path.FILE_TYPE.FILE) {
        throw new Error('FileStream.StreamType.WRITE can be used for only files.');
      }

      if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
        const fileOutputStream = new NativeFileOutputStream(this._fileObject.nativeObject, false);
        const outputStreamWriter = new NativeOutputStreamWriter(fileOutputStream);
        this.nativeObject = new NativeBufferedWriter(outputStreamWriter);
      } else {
        const fileOutputStream = new NativeFileOutputStream(this._fileObject.nativeObject, false);
        this.nativeObject = new NativeBufferedOutputStream(fileOutputStream);
      }
    } else {
      throw new Error('Mode must be FileStream.StreamType');
    }
  }
  offset: number;

  static StreamType = {
    ...FileStreamType,
    hasValue: (valueToFind: number): boolean => {
      return Object.keys(FileStreamType).some((element) => {
        return FileStreamType[element] === valueToFind;
      });
    }
  };
  static ContentMode = {
    ...FileContentMode,
    hasValue: (valueToFind: number): boolean => {
      return Object.keys(FileContentMode).some((element) => {
        return FileContentMode[element] === valueToFind;
      });
    }
  };

  static create(path: any, streamMode: any, contentMode: number): FileStreamAndroid | undefined {
    return;
  }

  get mode(): FileStreamType {
    return this._mode;
  }

  get contentMode(): FileContentMode {
    return this._contentMode;
  }

  get isReadable(): boolean {
    return this.nativeObject && !this._closed && this._mode === FileStreamAndroid.StreamType.READ;
  }

  get isWritable(): boolean {
    return this.nativeObject && !this._closed && this._mode !== FileStreamAndroid.StreamType.READ;
  }

  get name(): string {
    return this._fileObject.name;
  }

  get path(): string {
    return this._fileObject.path;
  }

  close(): void {
    return !this._closed && this.nativeObject.close();
  }

  readBlob(): Blob {
    if (this._closed || this._mode !== FileStreamAndroid.StreamType.READ) {
      throw new Error('FileStream already closed or streamType is not READ');
    }
    const fileContent = this.readToEnd();
    if (this._contentMode === FileStreamAndroid.ContentMode.BINARY && fileContent instanceof Blob) {
      return new Blob(fileContent, { type: 'file' });
    } else {
      return new Blob(StringUtil.toByteArray(fileContent), {
        type: 'file'
      });
    }
  }

  readToEnd(): string | Blob {
    if (this._closed || this._mode !== FileStreamAndroid.StreamType.READ) {
      throw new Error('FileStream already closed or streamType is not READ');
    }
    if (this._contentMode === FileStreamAndroid.ContentMode.TEXT) {
      let readLine = this.nativeObject.readLine();
      let fileContent = '';
      while (readLine !== null) {
        fileContent += readLine + '\n';
        readLine = this.nativeObject.readLine();
      }
      return fileContent;
    } else {
      const NativeFileUtil = requireClass('io.smartface.android.utils.FileUtil');
      // toByteArray method handle large files by copying the bytes into blocks of 4KiB.
      const bytes = NativeFileUtil.toByteArray(this.nativeObject);
      return new Blob(bytes, { type: 'file' });
    }
  }

  write(data: string | Blob) {
    if (this._closed || this._mode === FileStreamAndroid.StreamType.READ) {
      throw new Error('FileStream already closed or streamType is READ');
    }
    if (this._contentMode === FileStreamAndroid.ContentMode.BINARY) {
      if (!(data instanceof Blob)) {
        throw new Error('Parameter must be Blob');
      }
      this.nativeObject.write(data.nativeObject.toByteArray());
    } else {
      if (!TypeUtil.isString(data)) {
        throw new Error('Parameter must be string');
      }
      this.nativeObject.write(data);
      return true;
    }
    return false;
  }

  seekToEnd() {}
}
