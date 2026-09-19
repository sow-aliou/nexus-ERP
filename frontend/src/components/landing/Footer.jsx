import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Layers, ShieldCheck } from 'lucide-react'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <Layers size={22} className="logo-icon" />
            <span>Nexus ERP</span>
          </div>
          <p className="footer-desc">{t('footer.desc')}</p>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} BENJEDDOU Technologie Services. {t('footer.rights')}</p>
          <div className="security-badge">
            <ShieldCheck size={16} /> Multi-Tenant Cryptographic Isolation & AES-256-GCM Secured
          </div>
        </div>
      </div>
    </footer>
  )
}
