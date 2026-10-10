import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import vi from './locales/vi.json'

export const LANG_STORAGE_KEY = 'edumap-lang'
export const SUPPORTED_LANGS = ['vi', 'en'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, vi: { translation: vi } },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    nonExplicitSupportedLngs: true, // 'vi-VN' -> 'vi'
    interpolation: { escapeValue: false }, // React đã tự escape
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

// Đồng bộ thẻ <html lang="...">
const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.startsWith('vi') ? 'vi' : 'en'
}
syncHtmlLang(i18n.language)
i18n.on('languageChanged', syncHtmlLang)

export default i18n
