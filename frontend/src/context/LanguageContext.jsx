import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr')

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = (path, params = {}) => {
    const keys = path.split('.')
    let current = translations[lang] || translations.fr

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key]
      } else {
        return path
      }
    }

    if (typeof current === 'string' && params) {
      Object.keys(params).forEach(pKey => {
        current = current.replace(`{{${pKey}}}`, params[pKey])
      })
    }
    return current
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
