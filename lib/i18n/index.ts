import { az } from './az'
import { en } from './en'
import { ru } from './ru'

export type Lang = 'az' | 'en' | 'ru'
export type { Translations } from './az'

const translations = { az, en, ru }

export function getT(lang: Lang) {
  return translations[lang] ?? translations.az
}

export function getLangFromParam(param: string | null | undefined): Lang {
  if (param === 'en' || param === 'ru' || param === 'az') return param
  return 'az'
}

export { az, en, ru }

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'az', label: 'AZ', flag: '🇦🇿' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
]
