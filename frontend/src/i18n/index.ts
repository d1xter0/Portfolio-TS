import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

// Language configuration
export const languages = [
  { code: 'en', name: 'Anglais', dir: 'ltr' },
  { code: 'fr', name: 'Francais', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

export type LanguageCode = (typeof languages)[number]['code']
export type Language = (typeof languages)[number]

// Initialize i18next
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  i18n.use(LanguageDetector)
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: isBrowser
    ? {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      }
    : undefined,
})

// Helper function to get current language direction
export function getLanguageDir(lang?: string): 'ltr' | 'rtl' {
  const currentLang = lang || i18n.language
  const langConfig = languages.find((l) => l.code === currentLang)
  return langConfig?.dir || 'ltr'
}

export function syncDocumentLanguage(lang?: string) {
  if (typeof document === 'undefined') return

  const currentLang =
    (lang || i18n.resolvedLanguage || i18n.language || 'en')
      .toLowerCase()
      .split('-')[0]

  document.documentElement.setAttribute('lang', currentLang)
  document.documentElement.setAttribute('dir', getLanguageDir(currentLang))
}

// Helper function to change language and update document direction
export function changeLanguage(lang: LanguageCode) {
  i18n.changeLanguage(lang)
  syncDocumentLanguage(lang)
}

export default i18n

