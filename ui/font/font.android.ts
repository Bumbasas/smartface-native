import { AbstractFont, FontStyle } from './font';
import AndroidConfig from '../../util/Android/androidconfig';
import * as SizeCalculator from '../../util/Android/textviewsizecalculator';
import File from '../../io/file';
import Path from '../../io/path';

const NativeTypeface = requireClass('android.graphics.Typeface');

const fontCache = new Map();

export default class FontAndroid extends AbstractFont {
  private _size: number;
  constructor(params: any) {
    super();

    for (const param in params) {
      this[param] = params[param];
    }
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  sizeOfString(string: string, maxWidth: number): { width: number; height: number } {
    return SizeCalculator.calculateStringSize({
      text: string,
      maxWidth: maxWidth,
      textSize: this.size,
      typeface: this
    });
  }

  static create(fontFamily: string, size: number, style?: FontStyle): FontAndroid {
    const fromCache = getFromCache(fontFamily, style, size);
    if (fromCache) {
      return fromCache;
    }

    let fontStyle = NativeTypeface.NORMAL;
    let fontSuffix = '';
    let fontSuffix2 = '';

    if (style !== undefined) {
      switch (style) {
        case AbstractFont.NORMAL:
          fontStyle = NativeTypeface.NORMAL;
          fontSuffix = '_n';
          fontSuffix2 = '';
          break;
        case AbstractFont.BOLD:
          fontStyle = NativeTypeface.BOLD;
          fontSuffix = '_b';
          fontSuffix2 = '-Bold';
          break;
        case AbstractFont.ITALIC:
          fontStyle = NativeTypeface.ITALIC;
          fontSuffix = '_i';
          fontSuffix2 = '-Italic';
          break;
        case AbstractFont.BOLD_ITALIC:
          fontStyle = NativeTypeface.BOLD_ITALIC;
          fontSuffix = '_bi';
          fontSuffix2 = '-BoldItalic';
          break;
        default:
          break;
      }
    }
    let typeface: any;
    let font: FontAndroid;
    if (fontFamily && fontFamily.length > 0 && fontFamily !== AbstractFont.DEFAULT) {
      // Searching font on assets:
      const base = fontFamily.split(' ').join('.');
      const convertedFontName = base + fontSuffix + '.ttf';
      const convertedFontName2 = base + fontSuffix2 + '.ttf';
      const convertedFontName3 = base + fontSuffix + '.otf';
      const convertedFontName4 = base + fontSuffix2 + '.otf';

      let selectedFont = undefined;

      const fontFile = new File({
        path: 'assets://' + convertedFontName
      });

      const fontFile2 = new File({
        path: 'assets://' + convertedFontName2
      });

      const fontFile3 = new File({
        path: 'assets://' + convertedFontName3
      });

      const fontFile4 = new File({
        path: 'assets://' + convertedFontName4
      });

      if (fontFile.exists) {
        selectedFont = fontFile;
      } else if (fontFile2.exists) {
        selectedFont = fontFile2;
      } else if (fontFile3.exists) {
        selectedFont = fontFile3;
      } else if (fontFile4.exists) {
        selectedFont = fontFile4;
      }

      if (selectedFont !== undefined) {
        font = FontAndroid.createFromFile(selectedFont.fullPath, size);
        addToCache(fontFamily, style, font);
        return font;
      } else {
        typeface = NativeTypeface.create(fontFamily, fontStyle);
      }
    } else {
      typeface = NativeTypeface.defaultFromStyle(fontStyle);
    }

    font = new FontAndroid({
      nativeObject: typeface,
      size: size
    });
    addToCache(fontFamily, style, font);
    return font;
  }

  static createFromFile(path: string, size: number): FontAndroid {
    let typeface = NativeTypeface.DEFAULT;
    if (path) {
      const fontFile = new File({
        path: path
      });
      if (fontFile.exists && fontFile.nativeObject) {
        //@ts-ignore Fix after File is successfully converted to typescript
        if (fontFile.type === Path.FILE_TYPE.ASSET) {
          const assets = AndroidConfig.activity.getAssets();
          typeface = NativeTypeface.createFromAsset(assets, fontFile.name);
        } else {
          typeface = NativeTypeface.createFromFile(fontFile.nativeObject);
        }
      }
    }

    return new FontAndroid({
      nativeObject: typeface,
      size: size
    });
  }
}

function getFromCache(family: string, style: FontStyle, size: number): FontAndroid | undefined {
  if (!fontCache.has(family)) {
    return;
  }
  if (fontCache.get(family)[style]) {
    return new FontAndroid({
      nativeObject: fontCache.get(family)[style],
      size
    });
  }
}

function addToCache(family: string, style: FontStyle, font: FontAndroid): void {
  fontCache.set(family, { [style]: font });
}
