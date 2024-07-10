import type TranslateOptions from 'i18next';
import i18n from 'i18next';
import memoize from 'lodash.memoize';

export const translate = memoize(
  (key: string, options = undefined) => i18n.t(key, options) as unknown as string,
  (key: string, options: typeof TranslateOptions) => (options ? key + JSON.stringify(options) : key)
);
