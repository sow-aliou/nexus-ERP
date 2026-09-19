import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Shield, Database, Cpu, Globe2 } from 'lucide-react'

export function Features() {
  const { t } = useLanguage()

  const featureItems = [
    {
      icon: Database,
      title: t('features.multiTenant.title'),
      desc: t('features.multiTenant.desc')
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      desc: t('features.security.desc')
    },
    {
      icon: Cpu,
      title: t('features.analytics.title'),
      desc: t('features.analytics.desc')
    },
    {
      icon: Globe2,
      title: t('features.multilingual.title'),
      desc: t('features.multilingual.desc')
    }
  ]

  return (
    <section className="features-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle">{t('features.subtitle')}</p>
        </div>

        <div className="features-grid">
          {featureItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon size={24} />
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
