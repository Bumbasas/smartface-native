import { FileBase, IFile } from './file';
import FileStream from '../../io/filestream';
import { FileContentMode, FileStreamType } from '../filestream/filestream';

export default class FileIOS extends FileBase {
  constructor(params?: Partial<IFile>) {
    super();

    // Assign parameters given in constructor
    if (params) {
      for (var param in params) {
        this[param] = params[param];
      }
    }
  }

  static getDocumentsDirectory(): any {
    return __SF_File.getDocumentsDirectory();
  }

  static getMainBundleDirectory(): any {
    return __SF_File.getMainBundleDirectory();
  }

  get ios() {
    return {
      getNSURL: (): any => {
        if (this.nativeObject.getActualPath()) {
          return __SF_NSURL.fileURLWithPath(this.nativeObject.getActualPath());
        } else {
          return __SF_NSURL.URLWithString(this.nativeObject.getPath());
        }
      }
    };
  }

  get creationDate() {
    return this.nativeObject.getCreationDate();
  }

  get exists() {
    return this.nativeObject.exist();
  }

  get extension() {
    return this.nativeObject.getExtension();
  }

  get isDirectory() {
    return this.nativeObject.isDirectory();
  }

  get isFile() {
    return this.nativeObject.isFile();
  }

  get modifiedDate() {
    return this.nativeObject.getModifiedDate();
  }

  get name() {
    return this.nativeObject.getName();
  }

  get parent() {
    var parentNativeObject = this.nativeObject.getParent();
    var parent = new FileIOS();
    parent.nativeObject = parentNativeObject;
    return parent;
  }

  get size() {
    return this.nativeObject.getSize();
  }

  get writable() {
    return this.nativeObject.isWritable();
  }

  get path() {
    return this.nativeObject.getPath();
  }
  set path(value) {
    this.nativeObject = __SF_File.create(value);
  }

  copy(destination: string): boolean {
    return this.nativeObject.copy(destination);
  }

  createDirectory(createParents: boolean): boolean {
    const value = createParents === undefined ? true : createParents;
    return this.nativeObject.createDirectory(value);
  }

  createFile(createParents: boolean): boolean {
    const value = createParents === undefined ? true : createParents;
    return this.nativeObject.createFile(value);
  }

  remove(withChilds: boolean): boolean {
    const value = withChilds === undefined ? true : withChilds;
    return this.nativeObject.remove(value);
  }

  getFiles(): FileIOS[] {
    const filterValue = '';
    const typeValue = 0;

    const nativeObjectArray = this.nativeObject.getFiles(filterValue, typeValue);
    return nativeObjectArray.map((nativeObject: any) => {
      const file = new FileIOS();
      file.nativeObject = nativeObject;
      return file;
    });
  }

  move(destination: string): boolean {
    return this.nativeObject.move(destination);
  }

  rename(newName: string): boolean {
    return this.nativeObject.rename(newName);
  }

  openStream(streamType: FileStreamType, contentMode: FileContentMode): FileStream {
    return FileStream.create(this.nativeObject.getActualPath(), streamType, contentMode);
  }

  getAbsolutePath(): string {
    return this.nativeObject.getActualPath();
  }
}