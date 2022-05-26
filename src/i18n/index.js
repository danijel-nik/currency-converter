import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// translations
import translationsEn from "./translations/en";
import translationsSr from "./translations/sr";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: translationsEn,
            sr: translationsSr
        },
        fallbackLng: "en",
        debug: false,
        ns: ["translations"],
        defaultNS: "translations",
        keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ","
        }
    });

export default i18n;