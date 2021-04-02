import { attributes as enAttributes } from 'validation/locale/en';
import { messages as jpMessages } from 'validation/locale/ja';

export function getAttributes(locale = 'en') {
  switch (locale) {
    case 'en':
      return enAttributes;
    case 'ja':
      return null;
    default:
      return null;
  }
}

export function getMessages(locale = 'en') {
  switch (locale) {
    case 'en':
      return null;
    case 'ja':
      return jpMessages;
    default:
      return null;
  }
}
