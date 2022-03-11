import { INativeComponent } from '../../core/inative-component';
import { NativeMobileComponent, WithMobileOSProps } from '../../core/native-mobile-component';
import FileStream from '../filestream';
import { FileContentMode, FileStreamType } from '../filestream/filestream';

export interface FileiOSProps {
  getNSURL: () => __SF_NSURL;
}

export interface IFile extends INativeComponent {
  /**
   * Gets creation date of the File instance. If the file doesn't exist returns -1.
   * @android
   * @ios
   * @since 0.1
   */
  creationDate: number;
  /**
   * Check whether file or directory exists in given path.
   * @android
   * @ios
   * @since 0.1
   */
  exists: boolean;
  /**
   * Gets the extension of the file.
   * @android
   * @ios
   * @since 0.1
   */
  extension: string;
  /**
   * Check whether the File instance is a directory.
   * @android
   * @ios
   * @since 0.1
   */
  isDirectory: boolean;
  /**
   * Check whether the File instance is a file.
   * @android
   * @ios
   * @since 0.1
   */
  isFile: boolean;
  /**
   * Gets last modified time of the File. It measured in milliseconds. If file doesn't exists returns -1.
   * @android
   * @ios
   * @since 0.1
   */
  modifiedDate: number;
  /**
   * Gets the name of the file or directory.
   * @android
   * @ios
   * @since 0.1
   */
  name: string;
  /**
   * Gets the parent directory of the file or directory. If the file or parent of the file doesn't exist returns null.
   * @android
   * @ios
   * @since 0.1
   */
  parent: IFile | null;
  /**
   * Gets the path given on constructor. This property required for creating the File instance.
   * @android
   * @ios
   * @since 0.1
   */
  path: string;
  /**
   * Gets the size of the file or directory. If file or directory doesn't exists returns -1.
   * @android
   * @ios
   * @since 0.1
   */
  size: number;

  /**
   * @ios
   * @android
   */
  getAbsolutePath(): string;

  /**
   * Copy file or directory to given path.
   * @android
   * @ios
   * @since 0.1
   */
  copy(destination: string): boolean;

  /**
   * Creates the file named by this pathname.
   *
   * @param {Boolean} [createParents = false] If true, file will created with any necessary parent directories.
   * @return {Boolean}
   * @method createFile
   * @android
   * @ios
   * @since 0.1
   */
  createFile(createParents: boolean): boolean;
  /**
   * Creates the directory named by this pathname.
   *
   * @param {Boolean} [withParents = false] If true, directory will created with any necessary parent directories.
   * @return {Boolean}
   * @method createDirectory
   * @android
   * @ios
   * @since 0.1
   */
  createDirectory(createParents: any): boolean;
  /**
   * Deletes the file or directory.
   *
   * @param {Boolean} [withChilds = false] If true and the File object is a directory, all child files and directories will be removed.
   * @return {Boolean}
   * @method remove
   * @android
   * @ios
   * @since 0.1
   */
  remove(withChilds: boolean): boolean;
  /**
   * Returns the list of file and directories that exist in this director. If directory not exists or path is not refer a directory returns null.
   *
   * @return {IO.File[]}
   * @method getFiles
   * @android
   * @ios
   * @since 0.1
   */
  getFiles(): IFile[] | null;
  /**
   * Move the current file or directory to destination path.
   *
   * @param {String} destination
   * @return {Boolean}
   * @method move
   * @android
   * @ios
   * @since 0.1
   */
  move(destination: string): boolean;
  /**
   * Open a IO.FileStream object from this object. If path is refer a directory returns null.
   *
   * @param {IO.FileStream.StreamType} type
   * @param {IO.FileStream.ContentMode} contentMode. Optional, default value is IO.FileStream.ContentMode.TEXT
   * @return {IO.FileStream}
   * @method openStream
   * @android
   * @ios
   * @since 0.1
   */
  openStream(streamType: FileStreamType, contentMode: FileContentMode): FileStream | undefined;
  /**
   * Rename the current file or directory to given name.
   *
   * @param {String} newName
   * @return {Boolean}
   * @method rename
   * @android
   * @ios
   * @since 0.1
   */
  readonly writable: boolean;
  rename(newName: string): boolean;

  ios?: Partial<FileiOSProps>;
}

interface FileParams {
  path?: string;
}

export abstract class FileBase extends NativeMobileComponent<any, WithMobileOSProps<FileiOSProps, {}>> implements IFile {
  constructor(params: Partial<IFile> & FileParams) {
    super(params);
  }
  creationDate: number;
  exists: boolean;
  extension: string;
  isDirectory: boolean;
  isFile: boolean;
  modifiedDate: number;
  name: string;
  parent: IFile | null;
  path: string;
  size: number;
  getAbsolutePath(): string {
    throw new Error('Method not implemented.');
  }
  copy(destination: string): boolean {
    throw new Error('Method not implemented.');
  }
  createFile(createParents: boolean): boolean {
    throw new Error('Method not implemented.');
  }
  createDirectory(createParents: any): boolean {
    throw new Error('Method not implemented.');
  }
  remove(withChilds: boolean): boolean {
    throw new Error('Method not implemented.');
  }
  getFiles(): IFile[] | null {
    throw new Error('Method not implemented.');
  }
  move(destination: string): boolean {
    throw new Error('Method not implemented.');
  }
  openStream(streamType: FileStreamType, contentMode: FileContentMode): FileStream | undefined {
    throw new Error('Method not implemented.');
  }
  readonly writable: boolean;
  rename(newName: string): boolean {
    throw new Error('Method not implemented.');
  }

  static getDocumentsDirectory(): any {
    throw new Error('Method not implemented.');
  }

  static getMainBundleDirectory(): any {
    throw new Error('Method not implemented.');
  }
}
