import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Check, Sparkles, ShieldCheck } from 'lucide-react'

export function PricingSection({ onOpenTrial }) {
  const { t } = useLanguage()

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t('pricing.title')}</h2>
          <p className="section-subtitle">{t('pricing.subtitle')}</p>
        </div>

        <div className="pricing-cards-grid">
          {/* Free Trial Card */}
          <div className="pricing-card free-trial-card">
            <div className="card-badge">
              <Sparkles size={14} /> Essai Sans Engagement
            </div>
            <h3 className="card-name">{t('pricing.trialPlan.name')}</h3>
            <div className="card-price-area">
              <span className="price">{t('pricing.trialPlan.price')}</span>
              <span className="period">{t('pricing.trialPlan.period')}</span>
            </div>

            <ul className="pricing-features">
              <li><Check size={18} className="check-icon" /> {t('pricing.trialPlan.feature1')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.trialPlan.feature2')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.trialPlan.feature3')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.trialPlan.feature4')}</li>
            </ul>

            <button className="btn btn-outline btn-block btn-lg" onClick={onOpenTrial}>
              {t('pricing.trialPlan.btn')}
            </button>
          </div>

          {/* Paid Pro Plan Card */}
          <div className="pricing-card pro-card featured">
            <div className="card-badge featured-badge">
              <ShieldCheck size={14} /> Recommandé Entreprises
            </div>
            <h3 className="card-name">{t('pricing.paidPlan.name')}</h3>
            <div className="card-price-area">
              <span className="price">{t('pricing.paidPlan.price')}</span>
              <span className="period">{t('pricing.paidPlan.period')}</span>
            </div>

            <ul className="pricing-features">
              <li><Check size={18} className="check-icon" /> {t('pricing.paidPlan.feature1')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.paidPlan.feature2')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.paidPlan.feature3')}</li>
              <li><Check size={18} className="check-icon" /> {t('pricing.paidPlan.feature4')}</li>
            </ul>

            <button className="btn btn-primary btn-block btn-lg" onClick={onOpenTrial}>
              {t('pricing.paidPlan.btn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
