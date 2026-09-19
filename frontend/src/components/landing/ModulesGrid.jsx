import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { ShoppingCart, Package, DollarSign, Users, Cpu, FileText } from 'lucide-react'

export function ModulesGrid({ onOpenDemo }) {
  const { t } = useLanguage()

  const modules = [
    { id: 'commercial', icon: ShoppingCart, title: t('modules.commercial.name'), desc: t('modules.commercial.desc') },
    { id: 'achats', icon: Package, title: t('modules.achats.name'), desc: t('modules.achats.desc') },
    { id: 'stock', icon: Package, title: t('modules.stock.name'), desc: t('modules.stock.desc') },
    { id: 'finance', icon: DollarSign, title: t('modules.finance.name'), desc: t('modules.finance.desc') },
    { id: 'rh', icon: Users, title: t('modules.rh.name'), desc: t('modules.rh.desc') },
    { id: 'aiOcr', icon: Cpu, title: t('modules.aiOcr.name'), desc: t('modules.aiOcr.desc') }
  ]

  return (
    <section className="modules-section" id="modules">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t('modules.title')}</h2>
          <p className="section-subtitle">{t('modules.subtitle')}</p>
        </div>

        <div className="modules-grid">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.id} className="module-card">
                <div className="module-card-header">
                  <div className="module-icon-box">
                    <Icon size={22} />
                  </div>
                  <span className="module-badge">Module Métier</span>
                </div>
                <h3 className="module-title">{m.title}</h3>
                <p className="module-desc">{m.desc}</p>

                <button className="btn btn-link" onClick={onOpenDemo}>
                  Démo interactive &rarr;
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
