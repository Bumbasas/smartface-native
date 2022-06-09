/*globals requireClass*/
import ColorAndroid from '../color/color.android';
import ImageAndroid from '../image/image.android';
import KeyboardType from '../shared/keyboardtype';
import ViewAndroid from '../view/view.android';
import { SearchViewEvents } from './searchview-events';
import Exception from '../../util/exception';
import TextAlignment from '../shared/textalignment';
import PageAndroid from '../page/page.android';
import SystemServices from '../../util/Android/systemservices';
import TypeValue from '../../util/Android/typevalue';
import AndroidConfig from '../../util/Android/androidconfig';
import { IColor } from '../color/color';
import { IFont } from '../font/font';
import { IView, SemanticContentAttribute } from '../view/view';
import { ISearchView, SearchViewStyle } from './searchview';
import { IImage } from '../image/image';
import FontAndroid from '../font/font.android';

const GradientDrawable = requireClass('android.graphics.drawable.GradientDrawable');
const PorterDuff = requireClass('android.graphics.PorterDuff');
const NativeSearchView = requireClass('androidx.appcompat.widget.SearchView');
const NativeSupportR = requireClass('androidx.appcompat.R');
const NativeTextView = requireClass('android.widget.TextView');
const NativeTextWatcher = requireClass('android.text.TextWatcher');
const NativePorterDuff = requireClass('android.graphics.PorterDuff');
const NativeView = requireClass('android.view.View');
const SFEditText = requireClass('io.smartface.android.sfcore.ui.textbox.SFEditText');

const { COMPLEX_UNIT_DIP } = TypeValue;

// Context.INPUT_METHOD_SERVICE
const { INPUT_METHOD_SERVICE, INPUT_METHOD_MANAGER } = SystemServices;

// InputMethodManager.SHOW_FORCED
const SHOW_FORCED = 2;
// InputMethodManager.HIDE_IMPLICIT_ONLY
const HIDE_IMPLICIT_ONLY = 1;
const INTEGER_MAX_VALUE = 2147483647;
const SEARCH_ACTION_KEY_TYPE = 3;
const NativeKeyboardType = [
  1, // InputType.TYPE_CLASS_TEXT
  2, //InputType.TYPE_CLASS_NUMBER
  2 | 8192, // InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL
  3, // InputType.TYPE_CLASS_PHONE
  1 | 16, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI
  1, // InputType.TYPE_CLASS_TEXT
  1, // InputType.TYPE_CLASS_TEXT
  4, // InputType.TYPE_CLASS_DATETIME
  2 | 4096, // InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_SIGNED
  2 | 8192 | 4096, // InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL | InputType.TYPE_NUMBER_FLAG_SIGNED
  1 | 65536, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE
  1 | 32768, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_CORRECT
  1 | 4096, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS
  1 | 16384, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
  1 | 8192, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_WORDS
  1 | 48, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_SUBJECT
  1 | 80, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_LONG_MESSAGE
  1 | 524288, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS
  1 | 96, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PERSON_NAME
  1 | 64, // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_SHORT_MESSAGE
  4 | 32, // InputType.TYPE_CLASS_DATETIME | InputType.TYPE_DATETIME_VARIATION_TIME
  1 | 32 // InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
];

// TextAlignment values to Android Gravity Values.
const NativeTextAlignment = [
  48 | 3, // Gravity.TOP | Gravity.LEFT == TextAlignment.TOPLEFT
  48 | 1, // Gravity.TOP | Gravity.CENTER_HORIZONTAL == TextAlignment.TOPCENTER
  48 | 5, // Gravity.TOP | Gravity.RIGHT == TextAlignment.TOPRIGHT
  16 | 3, // Gravity.CENTER_VERTICAL | Gravity.LEFT == TextAlignment.MIDLEFT
  17, // Gravity.CENTER == TextAlignment.CENTER
  16 | 5, // Gravity.CENTER_VERTICAL | Gravity.RIGHT == TextAlignment.MIDLEFT
  80 | 3, // Gravity.BOTTOM | Gravity.LEFT == TextAlignment.MIDLEFT
  80 | 1, // Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL == TextAlignment.MIDLEFT
  80 | 5 // Gravity.BOTTOM | Gravity.RIGHT == TextAlignment.MIDLEFT
];

export default class SearchViewAndroid<TEvent extends string = SearchViewEvents> extends ViewAndroid<TEvent | SearchViewEvents, any, ISearchView> implements ISearchView {
  private _hasEventsLocked: boolean;
  private _hint: string;
  private _textColor;
  private _defaultUnderlineColorNormal;
  private _defaultUnderlineColorFocus;
  private mSearchSrcTextView: any;
  private mCloseButton: any;
  private mSearchButton: any;
  private mUnderLine: any;
  private mSearchEditFrame: any;
  private mCompatImageView: any;
  private _hintTextColor;
  private _keyboardType;
  private _closeImage: ImageAndroid;
  private _backgroundImage: ImageAndroid;
  private _textFieldBackgroundColor;
  private _textFieldBorderRadius;
  private _searchButtonIcon: ImageAndroid;
  private _closeIcon: ImageAndroid;
  private _searchIcon: ImageAndroid;
  private _iconifiedByDefault: boolean;
  private _searchIconAssigned: boolean;
  private _textViewCursorColor;
  private _isNotSetTextWatcher: boolean;
  private _isClicklistenerAdded: boolean;
  private _leftItem: any;
  private _underlineColor: { normal: ColorAndroid; focus: ColorAndroid };
  private _font: IFont;
  private _textalignment;
  private textFieldBackgroundDrawable: typeof GradientDrawable;
  private _onSearchBeginCallback: () => void;
  private _onSearchEndCallback: () => void;
  private _onTextChangedCallback: (searchText: string) => void;
  private _onSearchButtonClickedCallback: () => void;
  private skipDefaults: boolean;
  preConstruct(params?: Partial<ISearchView>) {
    this._iconifiedByDefault = false;
    this._searchIconAssigned = true;
    this._isNotSetTextWatcher = false;
    this._isClicklistenerAdded = false;
    this._textFieldBorderRadius = 15;
    this._textFieldBackgroundColor = ColorAndroid.create(222, 222, 222);
    this._defaultUnderlineColorNormal = ColorAndroid.create('#ffcccccc');
    this._defaultUnderlineColorFocus = ColorAndroid.create('#ff444444');
    this._hintTextColor = ColorAndroid.LIGHTGRAY;
    this._keyboardType = KeyboardType.DEFAULT;
    this._textalignment = TextAlignment.MIDLEFT;
    this._textColor = ColorAndroid.BLACK;
    this._hint = '';
    this._hasEventsLocked = false;
    super.preConstruct(params);
  }
  createNativeObject() {
    const nativeObject = new NativeSearchView(AndroidConfig.activity);
    this.mSearchSrcTextView = nativeObject.findViewById(NativeSupportR.id.search_src_text);
    this.mCloseButton = nativeObject.findViewById(NativeSupportR.id.search_close_btn);
    this.mSearchButton = nativeObject.findViewById(NativeSupportR.id.search_button);
    this.mUnderLine = nativeObject.findViewById(NativeSupportR.id.search_plate);
    this.mSearchEditFrame = nativeObject.findViewById(NativeSupportR.id.search_edit_frame);
    nativeObject.clearFocus();
    return nativeObject;
  }
  constructor(params?: Partial<ISearchView>) {
    super(params);

    this.mUnderLine.setBackgroundColor(ColorAndroid.TRANSPARENT.nativeObject);

    this._underlineColor = {
      normal: this._defaultUnderlineColorNormal,
      focus: this._defaultUnderlineColorFocus
    };

    this.textFieldBackgroundDrawable = new GradientDrawable();

    if (!this.skipDefaults) {
      this.mCloseButton.getDrawable().setColorFilter(this._textFieldBackgroundColor.nativeObject, NativePorterDuff.Mode.SRC_IN);

      this.mSearchSrcTextView.setOnFocusChangeListener(
        NativeView.OnFocusChangeListener.implement({
          onFocusChange: (view: IView, hasFocus: boolean) => {
            if (hasFocus) {
              const inputManager = AndroidConfig.getSystemService(INPUT_METHOD_SERVICE, INPUT_METHOD_MANAGER);
              inputManager.showSoftInput(view, 0);
              this._onSearchBeginCallback?.();
              this.emit('searchBegin');
              this.mUnderLine.getBackground().setColorFilter(this._underlineColor.focus.nativeObject, PorterDuff.Mode.MULTIPLY);
            } else {
              this._onSearchEndCallback?.();
              this.emit('searchEnd');
              this.mUnderLine.getBackground().setColorFilter(this._underlineColor.normal.nativeObject, PorterDuff.Mode.MULTIPLY);
            }
          }
        })
      );
      this.setTextWatcher();
      this.setOnSearchButtonClickedListener();
    }

    // Makes SearchView's textbox apperance fully occupied.
    this.mCompatImageView = this.mSearchEditFrame.getChildAt(0);
    this.mSearchEditFrame.removeViewAt(0);
    const styledAttributes = AndroidConfig.activity.obtainStyledAttributes(null, NativeSupportR.styleable.SearchView, NativeSupportR.attr.searchViewStyle, 0);
    const mSearchHintIcon = styledAttributes.getDrawable(NativeSupportR.styleable.SearchView_searchHintIcon); //Drawable
    this._searchIcon = new ImageAndroid({ roundedBitmapDrawable: mSearchHintIcon });
    this.updateQueryHint(this.mSearchSrcTextView, this._searchIcon, this._hint);
    styledAttributes.recycle();

    this.addAndroidProps(this.getAndroidProps());
    this.android.iconifiedByDefault = false;
  }
  backgroundImage: IImage;
  private getAndroidProps() {
    const self = this;
    return {
      get closeImage(): ImageAndroid {
        return self._closeImage;
      },
      set closeImage(value: ImageAndroid) {
        // If setting null to icon, default search icon will be displayed.
        if (value === null || value instanceof ImageAndroid) {
          self._closeImage = value;
          self.mCloseButton.setImageDrawable(value.nativeObject);
        }
      },
      get textFieldBorderRadius(): number {
        return self._textFieldBorderRadius;
      },
      set textFieldBorderRadius(value: number) {
        self._textFieldBorderRadius = value;
        self.setTextFieldBackgroundDrawable();
      },
      get searchButtonIcon(): ImageAndroid {
        return self._searchButtonIcon;
      },
      set searchButtonIcon(value: ImageAndroid) {
        self._searchButtonIcon = value;
        self.mSearchButton.setImageDrawable(value.nativeObject);
      },
      get closeIcon(): ImageAndroid {
        return self._closeIcon;
      },
      set closeIcon(value: ImageAndroid) {
        self._closeIcon = value;
        self.mCloseButton.setImageDrawable(value.nativeObject);
      },
      get leftItem(): any {
        return self._leftItem;
      },
      set leftItem(value: any) {
        self._leftItem = value;
        if (value instanceof ImageAndroid) {
          self.mCompatImageView.setImageDrawable(value.nativeObject);
          self.mSearchEditFrame.addView(self.mCompatImageView, 0);
        } else self.mSearchEditFrame.addView(value.nativeObject, 0);
        //If searchIcon is assign then can be used leftView as well
        if (self._searchIconAssigned) self.updateQueryHint(self.mSearchSrcTextView, self.searchIcon, self.hint);
        else self.updateQueryHint(self.mSearchSrcTextView, null, self.hint);
      },
      get iconifiedByDefault() {
        return self._iconifiedByDefault;
      },
      set iconifiedByDefault(value) {
        self._iconifiedByDefault = value;
        self.nativeObject.setIconifiedByDefault(value);
      }
    };
  }
  get keyboardType(): KeyboardType {
    return this._keyboardType;
  }

  set keyboardType(value: KeyboardType) {
    this._keyboardType = value;
    this.nativeObject.setInputType(NativeKeyboardType[value]);
  }

  get textalignment(): TextAlignment {
    return this._textalignment;
  }

  set textalignment(value: TextAlignment) {
    this._textalignment = value;
    this.mSearchSrcTextView.setGravity(NativeTextAlignment[value]);
  }

  get text(): string {
    return this.nativeObject.getQuery().toString();
  }
  set text(value: string) {
    this._hasEventsLocked = true;
    this.nativeObject.setQuery(value, false);
    this._hasEventsLocked = false;
  }

  get hint(): string {
    return this._hint;
  }
  set hint(value: string) {
    this._hint = value;
    this.updateQueryHint(this.mSearchSrcTextView, this._searchIcon, value);
  }

  get textColor(): ColorAndroid {
    return this._textColor;
  }
  set textColor(value: ColorAndroid) {
    if (!(value instanceof ColorAndroid)) {
      throw new TypeError(Exception.TypeError.DEFAULT + 'Color');
    }
    this._textColor = value;
    this.mSearchSrcTextView.setTextColor(value.nativeObject);
  }

  get cursorColor(): IColor {
    return this._textViewCursorColor;
  }
  set cursorColor(value: IColor) {
    this._textViewCursorColor = value;
    SFEditText.setCursorColor(this.mSearchSrcTextView, this._textViewCursorColor.nativeObject);
  }

  get iconImage(): ImageAndroid {
    return this._searchIcon;
  }
  set iconImage(value: ImageAndroid) {
    this._searchIconAssigned = true;
    // If setting null to icon, default search icon will be displayed.
    if (value === null || value instanceof ImageAndroid) {
      this._searchIcon = value;
      this.updateQueryHint(this.mSearchSrcTextView, this.searchIcon, this.hint);
    }
  }

  get searchIcon(): ImageAndroid {
    return this._searchIcon;
  }
  set searchIcon(value: ImageAndroid) {
    this._searchIcon = value;
    this._searchIconAssigned = true;
    // If setting null to icon, default search icon will be displayed.
    if (value === null || value instanceof ImageAndroid) {
      this.updateQueryHint(this.mSearchSrcTextView, this.searchIcon, this.hint);
    }
  }

  get font(): IFont {
    return this._font;
  }
  set font(value: IFont) {
    if (value instanceof FontAndroid) {
      this._font = value;
      this.mSearchSrcTextView.setTypeface(value.nativeObject);
      this.mSearchSrcTextView.setTextSize(COMPLEX_UNIT_DIP, value.size);
    }
  }

  get textAlignment(): TextAlignment {
    return this._textalignment;
  }
  set textAlignment(value: TextAlignment) {
    this._textalignment = value;
    this.mSearchSrcTextView.setGravity(NativeTextAlignment[value]);
  }

  get hintTextColor(): ColorAndroid {
    return this._hintTextColor;
  }
  set hintTextColor(value: ColorAndroid) {
    if (!(value instanceof ColorAndroid)) {
      throw new TypeError(Exception.TypeError.DEFAULT + 'Color');
    }
    this._hintTextColor = value;
    this.mSearchSrcTextView.setHintTextColor(value.nativeObject);
  }

  get textFieldBackgroundColor(): ColorAndroid {
    return this._textFieldBackgroundColor;
  }
  set textFieldBackgroundColor(value: ColorAndroid) {
    if (!(value instanceof ColorAndroid)) {
      throw new TypeError(Exception.TypeError.DEFAULT + 'Color');
    }
    this._textFieldBackgroundColor = value;
    this.setTextFieldBackgroundDrawable();
  }

  get onSearchBegin(): () => void {
    return this._onSearchBeginCallback;
  }
  set onSearchBegin(value: () => void) {
    this._onSearchBeginCallback = value;
  }

  get onSearchEnd(): () => void {
    return this._onSearchEndCallback;
  }
  set onSearchEnd(value: () => void) {
    this._onSearchEndCallback = value;
  }

  get onTextChanged(): (searchText: string) => void {
    return this._onTextChangedCallback;
  }
  set onTextChanged(value: (searchText: string) => void) {
    this._onTextChangedCallback = value;
    this.setTextWatcher();
  }

  get onSearchButtonClicked(): () => void {
    return this._onSearchButtonClickedCallback;
  }
  set onSearchButtonClicked(value: () => void) {
    this._onSearchButtonClickedCallback = value;
    this.setOnSearchButtonClickedListener();
  }

  addToHeaderBar(page: PageAndroid): void {
    if (page) {
      // TODO Recheck after talk with Furkan
      page.headerBar?.addViewToHeaderBar(this);
    }
  }

  removeFromHeaderBar(page: PageAndroid): void {
    if (page) {
      // TODO Recheck after talk with Furkan
      page.headerBar?.removeViewFromHeaderBar(this);
    }
  }

  showKeyboard(): void {
    this.requestFocus();
  }

  hideKeyboard(): void {
    this.removeFocus();
  }

  requestFocus(): void {
    this.nativeObject.requestFocus();
  }

  removeFocus(): void {
    this.nativeObject.clearFocus();
    this.mSearchSrcTextView.clearFocus();
  }

  updateQueryHint(mSearchSrcTextView: any, icon: ImageAndroid | null, hint: string) {
    if (icon) {
      const NativeSpannableStringBuilder = requireClass('android.text.SpannableStringBuilder');
      const NativeImageSpan = requireClass('android.text.style.ImageSpan');

      const SPAN_EXCLUSIVE_EXCLUSIVE = 33;

      const nativeDrawable = icon.nativeObject;
      const textSize = parseInt(String(mSearchSrcTextView.getTextSize() * 1.25));
      nativeDrawable.setBounds(0, 0, textSize, textSize);
      const ssb = new NativeSpannableStringBuilder('   ');
      const imageSpan = new NativeImageSpan(nativeDrawable);
      ssb.setSpan(imageSpan, 1, 2, SPAN_EXCLUSIVE_EXCLUSIVE);
      ssb.append(hint);
      mSearchSrcTextView.setHint(ssb);
    } else {
      this.nativeObject.setQueryHint(hint);
    }
  }

  setTextFieldBackgroundDrawable() {
    this.textFieldBackgroundDrawable.setColor(this._textFieldBackgroundColor.nativeObject);
    this.textFieldBackgroundDrawable.setCornerRadius(this._textFieldBorderRadius);
    this.mSearchSrcTextView.setBackground(this.textFieldBackgroundDrawable);
  }

  setTextWatcher() {
    if (this._isNotSetTextWatcher) return;
    this.mSearchSrcTextView.addTextChangedListener(
      NativeTextWatcher.implement({
        onTextChanged: (charSequence: string, start, before, count) => {
          !this._hasEventsLocked && this._onTextChangedCallback?.(charSequence.toString());
          !this._hasEventsLocked && this.emit('textChanged', charSequence.toString());
        },
        beforeTextChanged: (charSequence, start, count, after) => {},
        afterTextChanged: (editable) => {}
      })
    );
    this._isNotSetTextWatcher = true;
  }

  setOnSearchButtonClickedListener() {
    if (this._isClicklistenerAdded) return;
    this.mSearchSrcTextView.setOnEditorActionListener(
      NativeTextView.OnEditorActionListener.implement({
        onEditorAction: (textView, actionId, event) => {
          this._onSearchButtonClickedCallback?.();
          this.emit('searchButtonClicked');
          return true;
        }
      })
    );
    this._isClicklistenerAdded = true;
  }

  toString(): string {
    return 'SearchView';
  }

  static iOS = {
    SemanticContentAttribute: SemanticContentAttribute,
    Style: SearchViewStyle
  };
}
