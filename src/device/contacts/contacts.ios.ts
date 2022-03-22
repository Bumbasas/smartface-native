import Page from '../../ui/page';
import { ContactsBase, Contact, ManagedContact } from '.';

function manageNativeContact(contact: ContactIOS) {
  const returnValue: { displayName?: string; phoneNumbers?: string[]; emailAddresses?: string[]; urlAddresses?: string[]; addresses?: string[] } = {};
  if (contact.givenName) {
    returnValue.displayName = contact.givenName + ' ' + contact.familyName;
  }

  const phoneNumbers: string[] = [];
  for (const number in contact.phoneNumbers) {
    // Added this check to resolve the sonar issue.
    // hasOwnProperty() is used to filter out properties from the object's prototype chain.
    if (Object.prototype.hasOwnProperty.call(contact.phoneNumbers, number)) {
      phoneNumbers.push(contact.phoneNumbers[number].value.stringValue);
    }
  }
  returnValue.phoneNumbers = phoneNumbers;

  const emailAddresses: any[] = [];
  for (const email in contact.emailAddresses) {
    // Added this check to resolve the sonar issue.
    // hasOwnProperty() is used to filter out properties from the object's prototype chain.
    if (Object.prototype.hasOwnProperty.call(contact.emailAddresses, email)) {
      emailAddresses.push(contact.emailAddresses[email].value);
    }
  }
  returnValue.emailAddresses = emailAddresses;

  const urlAddresses: string[] = [];
  for (const urlAddress in contact.urlAddresses) {
    // Added this check to resolve the sonar issue.
    if (Object.prototype.hasOwnProperty.call(contact.urlAddresses, urlAddress)) {
      urlAddresses.push(contact.urlAddresses[urlAddress].value);
    }
  }
  returnValue.urlAddresses = urlAddresses;

  const addresses: string[] = [];
  for (const address in contact.postalAddresses) {
    // Added this check to resolve the sonar issue.
    if (Object.prototype.hasOwnProperty.call(contact.postalAddresses, address)) {
      const addressStr =
        contact.postalAddresses[address].value.street +
        ' ' +
        contact.postalAddresses[address].value.city +
        ' ' +
        contact.postalAddresses[address].value.state +
        ' ' +
        contact.postalAddresses[address].value.postalCode +
        ' ' +
        contact.postalAddresses[address].value.country;
      addresses.push(addressStr);
    }
  }
  returnValue.addresses = addresses;

  return returnValue;
}

export class ContactIOS extends Contact {
  constructor(params?: Partial<ContactIOS>) {
    super();
    params = params || {};
    if (params.nativeObject) {
      this.nativeObject = params.nativeObject;
    } else {
      this.nativeObject = __SF_CNMutableContact.new();
    }

    for (const param in params) {
      if (param === 'ios' || param === 'android') {
        for (const osSpecificParameter in params[param]) {
          this[param][osSpecificParameter] = params[param][osSpecificParameter];
        }
      } else {
        this[param] = params[param];
      }
    }
  }
}

class ContactsIOS extends ContactsBase {
  protected createNativeObject() {
    return __SF_CNMutableContact.new();
  }
  static ios = {
    __pickerDelegate: new __SF_CNContactPickerDelegate()
  };
  static android: {};
  public static readonly Contact = ContactIOS;
  constructor(params?: Partial<ContactsBase>) {
    super(params);
  }
  pickContact(
    page: Page,
    handlers: {
      onSuccess: (contact: ContactIOS) => void;
      onFailure?: () => void;
    }
  ) {
    if (typeof page === 'object') {
      const store = __SF_CNContactStore.new();
      store.requestAccess(
        function () {
          const pickerViewController = __SF_CNContactPickerViewController.new();
          ContactsIOS.ios.__pickerDelegate.contactPickerDidSelectContact = function (contact) {
            if (typeof handlers.onSuccess === 'function') {
              __SF_Dispatch.mainAsync(function () {
                const jsContact = new ContactsIOS.Contact({
                  nativeObject: contact.mutableCopy()
                });
                handlers.onSuccess(jsContact);
              });
            }
          };
          pickerViewController.delegate = ContactsIOS.ios.__pickerDelegate;

          page.nativeObject.presentViewController(pickerViewController);
        },
        function () {
          if (typeof handlers.onFailure === 'function') {
            __SF_Dispatch.mainAsync(function () {
              handlers.onFailure?.();
            });
          }
        }
      );
    } else {
      throw Error('page parameter cannot be null');
    }
  }
  getContactsByPhoneNumber(
    phoneNumber: string,
    handlers: {
      onSuccess: (contacts: ContactIOS[]) => void;
      onFailure?: (error: string) => void;
    }
  ) {
    const store = __SF_CNContactStore.new();
    store.requestAccess(
      function () {
        store.fetchAllContacts(
          function (allContactsNativeArray) {
            const allContactsManagedArray: ContactIOS[] = [];
            for (const index in allContactsNativeArray) {
              if (Object.prototype.hasOwnProperty.call(allContactsNativeArray, index)) {
                const jsContact = new ContactsIOS.Contact({
                  nativeObject: allContactsNativeArray[index].mutableCopy()
                });
                const isMatch = jsContact.phoneNumbers?.find((a) => a.includes(phoneNumber));
                if (isMatch !== undefined && jsContact) {
                  allContactsManagedArray.push(jsContact);
                }
              }
            }
            handlers.onSuccess(allContactsManagedArray);
          },
          function (error) {
            handlers.onFailure?.(error);
          }
        );
      },
      function (error) {
        if (typeof handlers.onFailure === 'function') {
          handlers.onFailure(error);
        }
      }
    );
  }
  fetchAll(params: { onSuccess: (...args: any[]) => void; onFailure: (...args: any[]) => void }) {
    const store = __SF_CNContactStore.new();
    store.requestAccess(
      function () {
        store.fetchAllContacts(
          function (allContactsNativeArray) {
            const allContactsManagedArray: ContactIOS[] = [];
            for (const index in allContactsNativeArray) {
              // Added this check to resolve the sonar issue.
              // hasOwnProperty() is used to filter out properties from the object's prototype chain.
              if (Object.prototype.hasOwnProperty.call(allContactsNativeArray, index)) {
                const jsContact = new ContactsIOS.Contact({
                  nativeObject: allContactsNativeArray[index].mutableCopy()
                });
                allContactsManagedArray.push(jsContact);
              }
            }
            params.onSuccess(allContactsManagedArray);
          },
          function (error) {
            params.onFailure(error);
          }
        );
      },
      function (error) {
        if (typeof params.onFailure === 'function') {
          params.onFailure(error);
        }
      }
    );
  }
  add(params: { contact: ContactIOS; onSuccess?: () => void; onFailure?: (...args: any[]) => void; page?: Page }) {
    const store = __SF_CNContactStore.new();
    store.requestAccess(
      function () {
        let contact;
        if (params.contact.constructor.name === 'Contacts') {
          contact = params.contact.nativeObject;
        } else {
          contact = __SF_CNMutableContact.new();
          const parameterContact = params.contact;

          for (const propertyName in parameterContact) {
            if (Object.prototype.hasOwnProperty.call(parameterContact, propertyName)) {
              switch (propertyName) {
                case 'displayName':
                  contact.givenName = parameterContact[propertyName];
                  break;
                case 'phoneNumber':
                  contact.phoneNumbers = [new __SF_CNLabeledValue(__SF_CNLabelPhoneNumberMain, __SF_CNPhoneNumber.phoneNumberWithStringValue(parameterContact[propertyName]))];
                  break;
                case 'email':
                  contact.emailAddresses = [new __SF_CNLabeledValue(__SF_CNLabelHome, parameterContact[propertyName])];
                  break;
                case 'urlAddress':
                  contact.urlAddresses = [new __SF_CNLabeledValue(__SF_CNLabelURLAddressHomePage, parameterContact[propertyName])];
                  break;
                case 'address': {
                  const addressValue = __SF_CNMutablePostalAddress.new();
                  addressValue.street = parameterContact[propertyName];
                  contact.postalAddresses = [new __SF_CNLabeledValue(__SF_CNLabelHome, addressValue)];
                  break;
                }
                default:
              }
            }
          }
        }

        if (typeof params.page === 'object') {
          this.contactViewController = __SF_CNContactViewController.viewControllerForNewContact(contact);
          this.contactViewController.contactStore = store;
          this.contactViewController.allowsActions = false;
          this.contactViewControllerDelegate = new __SF_CNContactViewControllerDelegate();
          this.contactViewControllerDelegate.didCompleteWithContact = function (contact) {
            if (contact) {
              if (typeof params.onSuccess === 'function') {
                params.onSuccess();
              }
            } else {
              if (typeof params.onFailure === 'function') {
                params.onFailure();
              }
            }
          };
          this.contactViewController.delegate = this.contactViewControllerDelegate;
          const navigationalcontactViewController = new __SF_UINavigationController();
          navigationalcontactViewController.viewControllers = [this.contactViewController];
          params.page.nativeObject.presentViewController(navigationalcontactViewController);
        } else {
          const saveRequest = __SF_CNSaveRequest.new();
          saveRequest.addContact(contact);
          const retval = store.executeSave(saveRequest);

          if (retval) {
            if (typeof params.onSuccess === 'function') {
              params.onSuccess();
            }
          } else {
            if (typeof params.onFailure === 'function') {
              params.onFailure();
            }
          }
        }
      },
      function () {
        params.onFailure?.({
          message: 'Contact access is declined by user.'
        });
      }
    );
  }
  getAll(params: { onFailure: (error: any) => void; onSuccess: (contacts: ManagedContact[]) => void }) {
    //Depracated on 4.1.5
    const store = __SF_CNContactStore.new();
    store.requestAccess(
      function () {
        store.fetchAllContacts<ContactIOS>(
          function (allContactsNativeArray) {
            const allContactsManagedArray: ManagedContact[] = [];
            for (const index in allContactsNativeArray) {
              // Added this check to resolve the sonar issue.
              // hasOwnProperty() is used to filter out properties from the object's prototype chain.
              if (Object.prototype.hasOwnProperty.call(allContactsNativeArray, index)) {
                const managedContact = manageNativeContact(allContactsNativeArray[index]);
                allContactsManagedArray.push(managedContact);
              }
            }
            params.onSuccess(allContactsManagedArray);
          },
          function (error) {
            params.onFailure(error);
          }
        );
      },
      function (error) {
        if (typeof params.onFailure === 'function') {
          params.onFailure(error);
        }
      }
    );
  }
}

export default ContactsIOS;
