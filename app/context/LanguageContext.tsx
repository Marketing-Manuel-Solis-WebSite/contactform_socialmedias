'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Obtener el idioma de la URL o usar 'es' por defecto
  const urlLang = params?.lang as Language
  const [language, setLanguageState] = useState<Language>(urlLang || 'es')

  useEffect(() => {
    if (urlLang && (urlLang === 'es' || urlLang === 'en')) {
      setLanguageState(urlLang)
    }
  }, [urlLang])

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang)
    
    // Cambiar la URL al nuevo idioma
    if (pathname) {
      const segments = pathname.split('/')
      if (segments[1] === 'es' || segments[1] === 'en') {
        segments[1] = newLang
        router.push(segments.join('/'))
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Fallback si no hay provider - útil para desarrollo
    return {
      language: 'es' as Language,
      setLanguage: (lang: Language) => {
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname
          const segments = pathname.split('/')
          if (segments[1] === 'es' || segments[1] === 'en') {
            segments[1] = lang
            window.location.href = segments.join('/')
          }
        }
      }
    }
  }
  return context
}

export default LanguageContext
