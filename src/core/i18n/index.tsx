import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

export * from './utils';

export const defaultNS = 'translation';

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: [defaultNS],
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}
