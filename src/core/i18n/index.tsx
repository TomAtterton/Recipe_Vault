import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

export * from './utils';

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false, // escape passed in values to avoid XSS injections
  },
});

export default i18n;
