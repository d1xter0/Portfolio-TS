import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'
import { languages, changeLanguage, type LanguageCode } from '../src/i18n'
import { Globe, Check } from 'lucide-react'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang =
    languages.find((l) => l.code === i18n.resolvedLanguage) || languages[0]

  const handleLanguageChange = (langCode: LanguageCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      style={{ userSelect: 'none', position: 'relative' }}
    >
      <button
        className="lang-switcher-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Switch language"
      >
        <Globe size={15} />
        <span>{currentLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown" role="listbox" aria-label="Language options">
          {languages.map((lang) => {
            const isActive = i18n.resolvedLanguage === lang.code
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                className={`lang-dropdown-item${isActive ? ' active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="lang-name">{lang.name}</span>
                {isActive && <Check size={14} className="lang-check" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}