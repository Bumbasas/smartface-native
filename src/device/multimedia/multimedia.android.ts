import { ConvertToMp4Params, LaunchCropperParams, MultimediaBase, MultimediaParams, PickMultipleFromGalleryParams, RecordVideoParams } from './multimedia';
import FileAndroid from '../../io/file/file.android';
import ImageAndroid from '../../ui/image/image.android';

import AndroidConfig from '../../util/Android/androidconfig';
import * as RequestCodes from '../../util/Android/requestcodes';
import AndroidUnitConverter from '../../util/Android/unitconverter';
import TypeUtil from '../../util/type';
import { IPage } from '../../ui/page/page';
import PageAndroid from '../../ui/page/page.android';

/* global requireClass */
const NativeMediaStore = requireClass('android.provider.MediaStore');
const NativeIntent = requireClass('android.content.Intent');
const NativeUCrop = requireClass('com.yalantis.ucrop.UCrop');
const NativeSFUCropOptions = requireClass('io.smartface.android.sfcore.device.multimedia.crop.SFUCropOptions');
const NativeSFMultimedia = requireClass('io.smartface.android.sfcore.device.multimedia.SFMultimedia');
const NativeActivityResultContracts = requireClass('androidx.activity.result.contract.ActivityResultContracts');

const Type = {
  IMAGE: NativeSFMultimedia.TYPE_IMAGE,
  VIDEO: NativeSFMultimedia.TYPE_VIDEO
};

const ActionType = {
  IMAGE_CAPTURE: 0,
  VIDEO_CAPTURE: 1
};

const CropShape = {
  RECTANGLE: 1,
  OVAL: 2
};

const VideoQuality = {
  HIGH: 1,
  LOW: 0
};

const activity = AndroidConfig.activity;
const MULTIMEDIA_ACTIVITY_RESULT_OK = -1;
const _types = ['image/*', 'video/*', 'image/* video/*'];

//TODO: user method in the java (SFMultimedia.java)
function getRealPathFromURI(uri) {
  const projection = [
    '_data' //NativeMediaStore.MediaColumns.DATA
  ];
  const contentResolver = activity.getContentResolver();
  const cursor = contentResolver.query(uri, array(projection, 'java.lang.String'), null, null, null);

  if (cursor === null) {
    return uri.getPath();
  } else {
    cursor.moveToFirst();
    const idx = cursor.getColumnIndex(projection[0]);
    const realPath = cursor.getString(idx);
    cursor.close();
    return realPath;
  }
}

class MultimediaAndroid implements MultimediaBase {
  ios = {
    requestGalleryAuthorization() {},
    requestCameraAuthorization() {},
    getGalleryAuthorizationStatus() {},
    getCameraAuthorizationStatus() {},
    cameraAuthorizationStatus: {},
    galleryAuthorizationStatus: {}
  };
  iOS = {
    CameraFlashMode: {},
    CameraDevice: {}
  };
  ActionType = ActionType;
  Type = Type;
  CropShape = CropShape;
  CameraDevice = {};
  VideoQuality = VideoQuality;
  CAMERA_REQUEST = RequestCodes.Multimedia.CAMERA_REQUEST;
  PICK_FROM_GALLERY = RequestCodes.Multimedia.PICK_FROM_GALLERY;
  CropImage = RequestCodes.Multimedia.CropImage;
  private _captureParams: { page?: IPage } = {};
  private _pickParams = {};
  private _action = 0;
  private _fileURI = null;
  // We should store image file, because data.getData() and data.getExtras() return null on activity result
  // when we use intent with MediaStore.EXTRA_OUTPUT.
  // https://github.com/ArthurHub/Android-Image-Cropper/wiki/FAQ#why-image-captured-from-camera-is-blurred-or-low-quality
  private _imageFileUri = null;
  constructor() {}
  get hasCameraFeature() {
    const NativeContext = requireClass('android.content.Context');
    const context = AndroidConfig.activity;
    const cameraManager = context.getSystemService(NativeContext.CAMERA_SERVICE);
    const cameraIdList = toJSArray(cameraManager.getCameraIdList());
    return cameraIdList.length > 0;
  }
  //Deprecated since 4.3.0
  startCamera(params: MultimediaParams) {
    if (!(params.page instanceof PageAndroid)) throw new TypeError('Page parameter required');

    if (params.action !== undefined) {
      this._action = params.action;
    }

    this._pickParams = {};
    this._captureParams = params;
    const page = this._captureParams.page;

    if (this._action === ActionType.IMAGE_CAPTURE) {
      this._imageFileUri = NativeSFMultimedia.createImageFile(activity);
      const takePictureIntent = NativeSFMultimedia.getCameraIntent(activity, this._imageFileUri);
      page?.nativeObject.startActivityForResult(takePictureIntent, this.CAMERA_REQUEST);
    } else this.startRecordVideoWithExtraField({ _captureParams: this._captureParams });
  }
  recordVideo(params: RecordVideoParams) {
    if (!(params.page instanceof PageAndroid)) throw new TypeError('Page parameter required');

    this._pickParams = {};
    this._captureParams = params;
    this._action = ActionType.VIDEO_CAPTURE;
    this.startRecordVideoWithExtraField({ _captureParams: this._captureParams });
  }
  capturePhoto(params: MultimediaParams) {
    if (!(params.page instanceof PageAndroid)) throw new TypeError('Page parameter required');

    this._pickParams = {};
    this._captureParams = params;
    this._action = ActionType.IMAGE_CAPTURE;
    const page = params.page;
    this._imageFileUri = NativeSFMultimedia.createImageFile(activity);
    const takePictureIntent = NativeSFMultimedia.getCameraIntent(activity, this._imageFileUri);

    page.nativeObject.startActivityForResult(takePictureIntent, this.CAMERA_REQUEST);
  }
  pickFromGallery(params: MultimediaParams) {
    if (!(params.page instanceof PageAndroid)) {
      throw new TypeError('Page parameter required');
    }
    this._captureParams = {};
    this._pickParams = params;
    if (NativeActivityResultContracts.PickVisualMedia.Companion.isPhotoPickerAvailable()) {
      const visualMediaType = params.type === Type.IMAGE ?
        NativeActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE :
        NativeActivityResultContracts.PickVisualMedia.VideoOnly.INSTANCE;
      params.page.nativeObject.launchPhotoPickerForSingleSelection(visualMediaType);
      (params.page as PageAndroid).onPickVisualMedia = (uri) => {
        this.pickFromGalleryHelper(params, uri);
      };
    } else {
      const intent = new NativeIntent();
      let type = Type.IMAGE;
      if (params.type !== undefined) type = params.type;
      intent.setType(_types[type]);
      intent.setAction(NativeIntent.ACTION_PICK);
      /** @todo
       * An error occured
       */
      params.page.nativeObject.startActivityForResult(intent, this.PICK_FROM_GALLERY);
    }
  }
  convertToMp4(params: ConvertToMp4Params) {
    const { videoFile, outputFileName, onCompleted, onFailure } = params;

    if (!videoFile || !outputFileName) throw new Error('Video File or Output File Name cannot be undefined');

    NativeSFMultimedia.convertToMp4(videoFile.nativeObject, outputFileName, {
      onCompleted: (outputVideoFilePath) => {
        const video = new FileAndroid({ path: outputVideoFilePath });
        onCompleted && onCompleted({ video });
      },
      onFailure
    });
  }
  launchCropper(params: LaunchCropperParams) {
    const {
      page,
      aspectRatio = {},
      asset,
      cropShape = CropShape.RECTANGLE,
      headerBarTitle,
      enableFreeStyleCrop = false,
      onFailure,
      android: { rotateText: rotateText, scaleText: scaleText, cropText: cropText, maxResultSize: maxResultSize = {}, hideBottomControls: hideBottomControls = false } = {}
    } = params;

    if (!asset || (!(asset instanceof FileAndroid) && !(asset instanceof ImageAndroid))) throw new TypeError('Asset parameter must be typeof File or Image');

    this._captureParams = {};
    this._pickParams = params;
    const startCropActivityParams = Object.assign(
      {
        requestCode: this.CropImage.CROP_GALLERY_DATA_REQUEST_CODE,
        asset: asset.nativeObject,
        page,
        cropShape,
        aspectRatio,
        rotateText,
        scaleText,
        cropText,
        headerBarTitle,
        maxResultSize,
        hideBottomControls,
        enableFreeStyleCrop
      },
      asset instanceof ImageAndroid ? { onFailure } : {}
    );

    this.startCropActivityHelper(startCropActivityParams);
  }
  pickMultipleFromGallery(params: PickMultipleFromGalleryParams) {
    if (!(params.page instanceof PageAndroid)) {
      throw new TypeError('Page parameter required');
    }
    this._captureParams = {};
    this._pickParams = params;
    const visualMediaType = params.type === Type.IMAGE ?
      NativeActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE :
      NativeActivityResultContracts.PickVisualMedia.VideoOnly.INSTANCE;
    params.page.nativeObject.launchPhotoPickerForMultipleSelection(visualMediaType);
    (params.page as PageAndroid).onPickMultipleVisualMedia = (uris) => {
      this.pickMultipleFromGalleryHelper(params, toJSArray(uris));
    };
  }
  onActivityResult(requestCode: number, resultCode: number, data: any) {
    if (requestCode === this.CAMERA_REQUEST) {
      this.getCameraDataHelper(this._captureParams, resultCode, data);
    } else if (requestCode === this.PICK_FROM_GALLERY) {
      this.pickFromGalleryActivityResultHelper(this._pickParams, resultCode, data);
    } else if (requestCode === this.CropImage.CROP_CAMERA_DATA_REQUEST_CODE) {
      this.cropCameraDataHelper(this._captureParams, resultCode, data);
    } else if (requestCode === this.CropImage.CROP_GALLERY_DATA_REQUEST_CODE) {
      this.cropGalleryDataHelper(this._pickParams, resultCode, data);
    }
  }
  startRecordVideoWithExtraField(params: { _captureParams }) {
    const { _captureParams } = params;
    const { videoQuality, maximumDuration, page } = _captureParams;
    const cameraIntent = new NativeIntent(NativeMediaStore.ACTION_VIDEO_CAPTURE);

    if (maximumDuration !== undefined) cameraIntent.putExtra(NativeMediaStore.EXTRA_DURATION_LIMIT, maximumDuration);
    if (videoQuality !== undefined) cameraIntent.putExtra(NativeMediaStore.EXTRA_VIDEO_QUALITY, videoQuality);

    page.nativeObject.startActivityForResult(cameraIntent, this.CAMERA_REQUEST);
  }
  cropCameraDataHelper(_captureParams, resultCode, data) {
    const { onSuccess, onCancel, onFailure, android: { fixOrientation: fixOrientation = false, maxImageSize: maxImageSize = -1 } = {} } = _captureParams;
    if (resultCode === MULTIMEDIA_ACTIVITY_RESULT_OK) {
      const resultUri = NativeUCrop.getOutput(data);
      //follow the uCrop lib issue. https://github.com/Yalantis/uCrop/issues/743. If they fixes, no need to fix orientation issue.
      NativeSFMultimedia.getBitmapFromUriAsync(activity, resultUri, maxImageSize, fixOrientation, {
        onCompleted: (bitmap) => {
          const croppedImage = new ImageAndroid({
            bitmap
          });
          onSuccess &&
            onSuccess({
              image: croppedImage
            });
        },
        onFailure: (err) => {
          onFailure &&
            onFailure({
              message: err
            });
        }
      });
    } else {
      onCancel && onCancel();
    }
  }
  cropGalleryDataHelper(_pickParams, resultCode, data) {
    const { onSuccess, onFailure, onCancel, android: { fixOrientation: fixOrientation = false, maxImageSize: maxImageSize = -1 } = {} } = _pickParams;

    if (resultCode === MULTIMEDIA_ACTIVITY_RESULT_OK) {
      const resultUri = NativeUCrop.getOutput(data);
      //follow the uCrop lib issue. https://github.com/Yalantis/uCrop/issues/743. If they fixes, no need to fix orientation issue.
      NativeSFMultimedia.getBitmapFromUriAsync(activity, resultUri, maxImageSize, fixOrientation, {
        onCompleted: (bitmap) => {
          const croppedImage = new ImageAndroid({
            bitmap
          });

          onSuccess?.({
            image: croppedImage
          });
        },
        onFailure: (err) => {
          onFailure?.({
            message: err
          });
        }
      });
    } else {
      onCancel && onCancel();
    }
  }
  startCropActivityHelper(params) {
    const { requestCode, asset, page, cropShape, aspectRatio, rotateText, scaleText, cropText, headerBarTitle, maxResultSize, hideBottomControls, enableFreeStyleCrop, onFailure } = params;

    if (!asset) return;
    const { x, y } = aspectRatio;
    const { width, height } = maxResultSize;
    const uCropOptions = new NativeSFUCropOptions();

    if (TypeUtil.isNumeric(x) && TypeUtil.isNumeric(y)) uCropOptions.withAspectRatio(x, y);

    if (cropShape === this.CropShape.OVAL) uCropOptions.setCircleDimmedLayer(true);

    if (TypeUtil.isNumeric(width) && TypeUtil.isNumeric(height)) uCropOptions.withMaxResultSize(AndroidUnitConverter.dpToPixel(width), AndroidUnitConverter.dpToPixel(height));

    if (rotateText) uCropOptions.setRotateText(rotateText);

    if (scaleText) uCropOptions.setScaleText(scaleText);

    if (cropText) uCropOptions.setCropText(cropText);

    if (headerBarTitle) uCropOptions.setToolbarTitle(headerBarTitle);

    uCropOptions.setHideBottomControls(hideBottomControls);
    uCropOptions.setFreeStyleCropEnabled(enableFreeStyleCrop);

    if (onFailure)
      NativeSFMultimedia.startCropActivity(asset, activity, page.nativeObject, uCropOptions, requestCode, {
        onFailure: (err) => {
          onFailure({
            message: err
          });
        }
      });
    else NativeSFMultimedia.startCropActivity(asset, activity, page.nativeObject, uCropOptions, requestCode);
  }
  pickFromGalleryActivityResultHelper(_pickParams, resultCode, data) {
    const {
      onFailure,
      onSuccess,
      onCancel
    } = _pickParams;
    if (resultCode === MULTIMEDIA_ACTIVITY_RESULT_OK) {
      try {
        const uri = data.getData();
        this.pickFromGalleryHelper(_pickParams, uri);
      } catch (err) {
        onFailure &&
          onFailure({
            message: err
          });
        return;
      }
    } else {
      onCancel && onCancel();
    }
  }

  pickFromGalleryHelper(_pickParams: MultimediaParams, uri: any) {
    const {
      onFailure,
      onSuccess,
      onCancel,
      type = this.Type.IMAGE,
      allowsEditing,
      page,
      aspectRatio = {},
      android: {
        cropShape: cropShape = CropShape.RECTANGLE,
        rotateText: rotateText = 'Rotate',
        scaleText: scaleText = 'Scale',
        cropText: cropText = 'Crop',
        headerBarTitle: headerBarTitle = '',
        maxResultSize: maxResultSize = {},
        hideBottomControls: hideBottomControls = false,
        enableFreeStyleCrop: enableFreeStyleCrop = false,
        fixOrientation: fixOrientation = false,
        maxImageSize: maxImageSize = -1
      } = {}
    } = _pickParams;
    try {
      if (uri === undefined) {
        onCancel?.();
        return;
      }

      const realPath = NativeSFMultimedia.getUriAsset(activity, uri).realPath;

      if (onSuccess) {
        if (type === this.Type.IMAGE) {
          if (!allowsEditing) {
            NativeSFMultimedia.getBitmapFromUriAsync(activity, uri, maxImageSize, fixOrientation, {
              onCompleted: (bitmap) => {
                const image = new ImageAndroid({
                  bitmap
                });
                onSuccess({
                  image
                });
              },
              onFailure: (err) => {
                onFailure &&
                  onFailure({
                    message: err
                  });
              }
            });
          } else {
            this.startCropActivityHelper({
              requestCode: this.CropImage.CROP_GALLERY_DATA_REQUEST_CODE,
              asset: uri,
              page,
              cropShape,
              aspectRatio,
              rotateText,
              scaleText,
              cropText,
              headerBarTitle,
              maxResultSize,
              hideBottomControls,
              enableFreeStyleCrop
            });
          }
        } else {
          onSuccess({
            video: new FileAndroid({
              path: realPath
            })
          });
        }
      }
    } catch (err) {
      onFailure &&
        onFailure({
          message: err
        });
      return;
    }
  }

  pickMultipleFromGalleryHelper(_pickParams, uris) {
    const { onFailure, onSuccess, onCancel, type = this.Type.IMAGE, android: { fixOrientation: fixOrientation = false, maxImageSize: maxImageSize = -1 } = {}, page } = _pickParams;
    try {
      if (uris.length === 0) {
        onCancel?.();
        return;
      }
      if (onSuccess) {
        NativeSFMultimedia.getMultimediaAssetsFromUrisAsync(activity, array(uris, 'android.net.Uri'), type, maxImageSize, fixOrientation, {
          onCompleted: (mAssets) => {
            const assets = toJSArray(mAssets).map((asset) => {
              if (type === this.Type.IMAGE) {
                return {
                  image: new ImageAndroid({
                    bitmap: asset.bitmap
                  }),
                  file: new FileAndroid({
                    path: asset.realPath
                  })
                };
              } else {
                return {
                  file: new FileAndroid({
                    path: asset.realPath
                  })
                };
              }
            });
            onSuccess({
              assets
            });
          },
          onFailure: (errors) => {
            const errorObject = toJSArray(errors).map((error) => {
              return {
                message: error.message,
                fileName: error.fileName,
                uri: error.uri
              };
            });
            onFailure?.(errorObject);
          }
        });
      }
    } catch (err) {
      onFailure?.({
        message: err
      });
      return;
    }
  }
  getCameraDataHelper(_captureParams, resultCode, data) {
    const {
      onSuccess,
      onFailure,
      page,
      aspectRatio = {},
      onCancel,
      allowsEditing,
      android: {
        cropShape: cropShape = CropShape.RECTANGLE,
        rotateText: rotateText = 'Rotate',
        scaleText: scaleText = 'Scale',
        cropText: cropText = 'Crop',
        headerBarTitle: headerBarTitle = '',
        maxResultSize: maxResultSize = {},
        hideBottomControls: hideBottomControls = false,
        enableFreeStyleCrop: enableFreeStyleCrop = false,
        fixOrientation: fixOrientation = false,
        maxImageSize: maxImageSize = -1
      } = {}
    } = _captureParams;
    let uri = null;
    let failure = false;
    if (resultCode !== MULTIMEDIA_ACTIVITY_RESULT_OK) {
      onCancel?.();
      return;
    }
    try {
      if (this._action !== ActionType.IMAGE_CAPTURE) {
        uri = data.getData();
      }
    } catch (err) {
      failure = true;
      onFailure?.({
        message: err
      });
    }
    if (!failure && onSuccess) {
      if (this._action === ActionType.IMAGE_CAPTURE) {
        if (allowsEditing) {
          this.startCropActivityHelper({
            requestCode: this.CropImage.CROP_CAMERA_DATA_REQUEST_CODE,
            asset: this._imageFileUri,
            page,
            cropShape,
            aspectRatio,
            rotateText,
            scaleText,
            cropText,
            headerBarTitle,
            maxResultSize,
            hideBottomControls,
            enableFreeStyleCrop
          });
        } else {
          NativeSFMultimedia.getBitmapFromUriAsync(activity, this._imageFileUri, maxImageSize, fixOrientation, {
            onCompleted: (bitmap) => {
              const image = new ImageAndroid({
                bitmap
              });
              onSuccess({
                image
              });
            },
            onFailure: (err) => {
              onFailure &&
                onFailure({
                  message: err
                });
            }
          });
        }
      } else {
        const realPath = getRealPathFromURI(uri);
        onSuccess({
          video: new FileAndroid({
            path: realPath
          })
        });
      }
    }
  }
  Android = {
    CropShape: CropShape
  };
}

const Multimedia = new MultimediaAndroid();

export default Multimedia;
