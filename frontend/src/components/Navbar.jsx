import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { Layers, Globe, Palette, Menu, X, Play, LogIn, UserPlus } from 'lucide-react'

export function Navbar({ onOpenDemo, onOpenLogin, onOpenRegister }) {
  const { lang, setLang, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <a href="#home" className="navbar-brand">
          <div className="brand-logo">
            <Layers size={24} className="logo-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">{t('nav.brand')}</span>
            <span className="brand-tagline">{t('nav.tagline')}</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="navbar-links desktop-only">
          <a href="#features" className="nav-link">{t('nav.features')}</a>
          <a href="#modules" className="nav-link">{t('nav.modules')}</a>
          <a href="#pricing" className="nav-link">{t('nav.pricing')}</a>
        </nav>

        {/* Controls & CTA buttons */}
        <div className="navbar-controls desktop-only">
          {/* Language Selector */}
          <div className="selector-group">
            <Globe size={16} className="selector-icon" />
            <select
              className="custom-select"
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ar">🇩🇿 العربية</option>
            </select>
          </div>

          {/* Theme Selector */}
          <div className="selector-group">
            <Palette size={16} className="selector-icon" />
            <select
              className="custom-select"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            >
              <option value="professional">💼 {t('nav.themes.professional')}</option>
              <option value="light">☀️ {t('nav.themes.light')}</option>
              <option value="dark">🌙 {t('nav.themes.dark')}</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button className="btn btn-demo" onClick={onOpenDemo}>
            <Play size={16} />
            <span>{t('nav.demoBtn')}</span>
          </button>

          <button className="btn btn-outline" onClick={onOpenLogin}>
            <LogIn size={16} />
            <span>{t('nav.login')}</span>
          </button>

          <button className="btn btn-primary" onClick={onOpenRegister}>
            <UserPlus size={16} />
            <span>{t('nav.register')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="icon-btn mobile-hamburger mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-links">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>{t('nav.features')}</a>
            <a href="#modules" onClick={() => setMobileMenuOpen(false)}>{t('nav.modules')}</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</a>
          </nav>

          <div className="mobile-selectors">
            <div className="selector-group">
              <Globe size={16} />
              <select value={lang} onChange={e => setLang(e.target.value)}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div className="selector-group">
              <Palette size={16} />
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="professional">Professionnel</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>
          </div>

          <div className="mobile-actions">
            <button className="btn btn-demo btn-block" onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}>
              <Play size={16} /> {t('nav.demoBtn')}
            </button>
            <button className="btn btn-outline btn-block" onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}>
              <LogIn size={16} /> {t('nav.login')}
            </button>
            <button className="btn btn-primary btn-block" onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}>
              <UserPlus size={16} /> {t('nav.register')}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
