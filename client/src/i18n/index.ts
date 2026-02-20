import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { Locale } from "shared";

import es from "../locales/es/translation.json";
import en from "../locales/en/translation.json";
import ca from "../locales/ca/translation.json";

const STORAGE_KEY = "el-llop-locale";

const resources = {
  es: { translation: es },
  en: { translation: en },
  ca: { translation: ca },
};

const savedLocale = (localStorage.getItem(STORAGE_KEY) as Locale) || "en";
const validLocale = ["es", "en", "ca"].includes(savedLocale) ? savedLocale : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: validLocale,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function setLocale(locale: Locale) {
  i18n.changeLanguage(locale);
  localStorage.setItem(STORAGE_KEY, locale);
}

export { STORAGE_KEY };
