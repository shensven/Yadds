import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LocaleName } from '../atoms/atomUI';

const LOCALE_EN = require('./locales/en.json');
const LOCALE_ZH_CN = require('./locales/zh_CN.json');
const LOCALE_ZH_TW = require('./locales/zh_TW.json');
const LOCALE_JA_JP = require('./locales/ja_JP.json');

const resources = {
  en: { translation: LOCALE_EN },
  zh_CN: { translation: LOCALE_ZH_CN },
  zh_TW: { translation: LOCALE_ZH_TW },
  ja_JP: { translation: LOCALE_JA_JP },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: (window.electron?.preferences.get('locale') as LocaleName | undefined) ?? 'en',
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
