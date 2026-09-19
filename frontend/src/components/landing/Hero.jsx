import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Sparkles, Play, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react'

export function Hero({ onOpenTrial, onOpenDemo }) {
  const { t } = useLanguage()

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge-pill">
            <Sparkles size={14} className="badge-icon" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="hero-title">{t('hero.title')}</h1>

          <p className="hero-subtitle">{t('hero.subtitle')}</p>

          <div className="hero-cta-group">
            <button className="btn btn-primary btn-lg" onClick={onOpenTrial}>
              <span>{t('hero.ctaTrial')}</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn btn-secondary btn-lg" onClick={onOpenDemo}>
              <Play size={18} />
              <span>{t('hero.ctaDemo')}</span>
            </button>
          </div>

          <div className="hero-trust-bar">
            <ShieldCheck size={18} className="trust-icon" />
            <span>{t('hero.trust')}</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card hero-preview-card">
            <div className="preview-card-header">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="preview-tag">Nexus ERP Dashboard</span>
            </div>

            <div className="preview-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Ventes du mois</span>
                <span className="metric-value">1,450,000 DA</span>
                <span className="metric-trend positive">+18.5%</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Factures Générées</span>
                <span className="metric-value">248 (QR OK)</span>
                <span className="metric-trend">100% Conforme</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Niveau de Stock</span>
                <span className="metric-value">4,520 Articles</span>
                <span className="metric-trend positive">Optimisé</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Précision OCR IA</span>
                <span className="metric-value">99.4%</span>
                <span className="metric-trend positive">Temps réel</span>
              </div>
            </div>

            <div className="preview-chart-simulation">
              <div className="chart-bar" style={{ height: '40%' }}></div>
              <div className="chart-bar" style={{ height: '65%' }}></div>
              <div className="chart-bar" style={{ height: '55%' }}></div>
              <div className="chart-bar" style={{ height: '85%' }}></div>
              <div className="chart-bar active" style={{ height: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
