import Page from '../../ui/page';
import Blob from '../../global/blob';
import NativeComponent from '../../core/native-component';

/**
 * @class Device.Contacts
 * @since 0.1
 * This class allows user to add a contact to contact list or to select a contact from list.
 *
 *     @example
 *	   const Contacts = require("@smartface/native/device/contacts");
 *     const Application = require("@smartface/native/application");
 *
 *     const READ_CONTACTS_CODE = 1002;
 *     Application.android.requestPermissions(READ_CONTACTS_CODE, Application.Android.Permissions.READ_CONTACTS);
 *
 *     Application.android.onRequestPermissionsResult = function(e){
 *         if(e.requestCode === READ_CONTACTS_CODE && e.result) {
 *              Contacts.pickContact({
 *                  onSuccess: function(e) {
 *                  console.log(JSON.stringify(e));
 *              }
 *         }
 *     }
 *
 *
 */
export class ContactsBase extends NativeComponent {
  static Contact: typeof ContactBase;
  /**
   * This function adds a contact to contact list with specified properties. You need check
   * {@link Application.Android.Permissions#WRITE_CONTACTS} before adding contact.
   *
   *
   *     @example
   *     const Contacts = require("@smartface/native/device/contacts");
   *
   *     let myContact = new Contacts.Contact({
   *         firstName: 'Smartface',
   *         namePrefix: 'Mr.',
   *         lastName: 'Team',
   *         urlAddresses: ["https://smartface.io"],
   *         phoneNumbers: ["+16506173265"],
   *         emailAddresses: ["info@smartface.io"],
   *         addresses: ["3790 El Camino Real # 1022 Palo Alto CA, 94306,United States"]
   *      });
   *      Contacts.add({
   *          contact: myContact,
   *          onSuccess : function(){
   *              console.log("Success");
   *          },
   *          onFailure : function(){
   *              console.log("Failure");
   *          }
   *      });
   *
   *
   * @param {Object} params Object describing properties
   * @param {Contact} params.contact Object describing contact properties
   * @param {Function} params.onSuccess This event is called after adding contact successfully.
   * @param {Function} [params.onFailure] This event is called after adding contact fails.
   * @param {Object} params.onFailure.params
   * @param {String} params.onFailure.params.message
   * @param {UI.Page} [params.page] The page parameter is optional. If this property is set,
   *                                the contacts will be editable before saving.
   * @method add
   * @android
   * @ios
   * @since 0.1
   */
  static add(params: { contact: ContactBase; onSuccess?: () => void; onFailure?: () => void }): void {
    throw new Error('Method not implemented.');
  }
  /**
   * This function shows contact list. It allows user to pick a data from the list.You need check
   * {@link Application.android.Permissions#READ_CONTACTS} before picking contact.
   *
   *
   *     @example
   *     const Contacts = require("@smartface/native/device/contacts");
   *     Contacts.pick({
   *         page : myPage,
   *         onSuccess : function(contact){
   *             console.log("Successfully picked");
   *         },
   *         onFailure : function(e){
   *             console.log("Something went wrong");
   *         }
   *     });
   *
   * @param {Object} params Object describing callbacks
   * @param {UI.Page} params.page
   * @param {Function} params.onSuccess This event is called after getting contact successfully.
   * @param {Object} params.onSuccess.params
   * @param {Contact} params.onSuccess.params.contact
   * @param {Function} [params.onFailure] This event is called after getting contact fails.
   * @method pick
   * @android
   * @ios
   * @since 0.1
   */
  static pickContact(
    page: Page,
    handlers: {
      onSuccess: (contact: any) => void;
      onFailure?: () => void;
    }
  ): void {
    throw new Error('Method not implemented.');
  }
  /**
   * This function returns a contact array.You need check
   * {@link Application.Android.Permissions#READ_CONTACTS} before using this function.
   *
   *
   *     @example
   *     const Contacts = require("@smartface/native/device/contacts");
   *     Contacts.fetchAll({
   *         onSuccess : function(contacts){
   *             var count = contacts.length;
   *         },
   *         onFailure : function(error){
   *             console.log("Message : " + error);
   *         }
   *     });
   *
   * @param {Object} params Object describing callbacks
   * @param {Function} params.onSuccess This event is called after getting contacts successfully.
   * @param {Array} params.onSuccess.params
   * @param {Contact} params.onSuccess.params.contact
   * @param {Function} [params.onFailure] This event is called after getting contacts fails.
   * @method getAll
   * @android
   * @ios
   * @since 0.1
   */
  static fetchAll(handlers: { onSuccess: (contacts: ContactBase[]) => void; onFailure?: (error: string) => void }): void {
    throw new Error('Method not implemented.');
  }

  /**
   * This function searches contacts by given phone number.You need check
   * {@link Application.android.Permissions#READ_CONTACTS} permission.
   *
   *
   *     @example
   *     const Contacts = require("@smartface/native/device/contacts");
   *     Contacts.getContactsByPhoneNumber("5555555555",{
   *         onSuccess : function(contacts){
   *             console.log("Successfully found ", contacts);
   *         },
   *         onFailure : function(error){
   *             console.log("Something went wrong");
   *         }
   *     });
   *
   * @param {String} phoneNumber Phone number to search in contacts
   * @param {Object} callbacks Object describing callbacks
   * @param {Function} callbacks.onSuccess This event is called after getting contact successfully.
   * @param {Device.Contacts.Contact[]} callbacks.onSuccess.contact passes {@link Device.Contacts.Contact Contact} array.
   * @param {Function} [callbacks.onFailure] This event is called after getting contact fails.
   * @method getContactsByPhoneNumber
   * @android
   * @ios
   * @since 4.3.0
   */
  static getContactsByPhoneNumber(
    phoneNumber: String,
    handlers: {
      onSuccess: (contacts: ContactBase[]) => void;
      onFailure?: (error: string) => void;
    }
  ): void {
    throw new Error('Method not implemented.');
  }
}

export class ContactBase extends NativeComponent {
  constructor(params?: Partial<ContactBase>) {
    super();
    throw new Error('Method not implemented.');
  }
  phoneNumbers?: string[];
  emailAddresses?: string[];
  addresses?: string[];
  urlAddresses?: string[];
  firstName?: string;
  lastName?: string;
  middleName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  title?: string;
  organization?: string;
  department?: string;
  nickname?: string;
  photo?: Blob;
}
