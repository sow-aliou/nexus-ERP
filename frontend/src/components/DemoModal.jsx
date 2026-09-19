import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { X, Play, ShieldCheck, CheckCircle2, Cpu, BarChart3, Users, ShoppingCart, Package, DollarSign } from 'lucide-react'

export function DemoModal({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('commercial')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  if (!isOpen) return null

  const demoCatalog = [
    {
      id: 'commercial',
      icon: ShoppingCart,
      title: t('modules.commercial.name'),
      desc: t('modules.commercial.desc'),
      steps: [
        "1. Création d'une fiche prospect / client",
        "2. Génération automatique du devis pro-forma avec calcul de TVA",
        "3. Conversion immédiate du devis en commande validée"
      ],
      previewStats: { clients: '1,248', devisActifs: '42', CA: '450,000 DA' }
    },
    {
      id: 'achats',
      icon: Package,
      title: t('modules.achats.name'),
      desc: t('modules.achats.desc'),
      steps: [
        "1. Saisie de la demande d'approvisionnement fournisseur",
        "2. Génération du bon de commande d'achat",
        "3. Réception du bon avec contrôle de conformité"
      ],
      previewStats: { fournisseurs: '84', bonsCommande: '18', receptionOk: '98%' }
    },
    {
      id: 'stock',
      icon: Package,
      title: t('modules.stock.name'),
      desc: t('modules.stock.desc'),
      steps: [
        "1. Scan du code SKU / code-barres de l'article",
        "2. Mise à jour instantanée du niveau de stock en temps réel",
        "3. Déclenchement automatique des alertes de réapprovisionnement"
      ],
      previewStats: { articlesEnStock: '4,520', alerteSecurite: '3 articles', valTotal: '2,800,000 DA' }
    },
    {
      id: 'finance',
      icon: DollarSign,
      title: t('modules.finance.name'),
      desc: t('modules.finance.desc'),
      steps: [
        "1. Génération de la facture électronique avec QR Code",
        "2. Suivi de l'encaissement via paiement sécurisé en ligne",
        "3. Consolidation automatique du journal de trésorerie"
      ],
      previewStats: { facturesMois: '156', encaissements: '1,950,000 DA', tvaDeclaree: '370,500 DA' }
    },
    {
      id: 'rh',
      icon: Users,
      title: t('modules.rh.name'),
      desc: t('modules.rh.desc'),
      steps: [
        "1. Gestion des rôles et attribution des permissions granulaires",
        "2. Suivi des demandes de congés et absences",
        "3. Journal d'audit interne des actions collaborateurs"
      ],
      previewStats: { effectifTotal: '38', demandesConges: '2 en attente', permissionsActives: '100%' }
    },
    {
      id: 'aiOcr',
      icon: Cpu,
      title: t('modules.aiOcr.name'),
      desc: t('modules.aiOcr.desc'),
      steps: [
        "1. Téléversement du document ou facture fournisseur (PDF/Image)",
        "2. Extraction IA/OCR des montants, numéros et lignes d'articles",
        "3. Validation utilisateur et enregistrement ERP automatique"
      ],
      previewStats: { precisionOCR: '99.4%', tempsExtraction: '1.2s', facturesTraitees: '310' }
    }
  ]

  const currentDemo = demoCatalog.find(d => d.id === activeTab) || demoCatalog[0]
  const IconComponent = currentDemo.icon

  const handleStartDemo = () => {
    setIsPlaying(true)
    setActiveStep(1)
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 3) {
          clearInterval(interval)
          setIsPlaying(false)
          return 3
        }
        return prev + 1
      })
    }, 1500)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content demo-modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🎬 {t('demoModal.title')}</h2>
            <p className="modal-subtitle">{t('demoModal.subtitle')}</p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="demo-tabs">
          {demoCatalog.map(demo => {
            const TabIcon = demo.icon
            return (
              <button
                key={demo.id}
                className={`demo-tab-btn ${activeTab === demo.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(demo.id)
                  setIsPlaying(false)
                  setActiveStep(1)
                }}
              >
                <TabIcon size={18} />
                <span>{demo.title}</span>
              </button>
            )
          })}
        </div>

        <div className="demo-body-grid">
          <div className="demo-info-pane">
            <div className="demo-header-badge">
              <IconComponent size={28} className="demo-badge-icon" />
              <h3>{currentDemo.title}</h3>
            </div>
            <p className="demo-description">{currentDemo.desc}</p>

            <div className="demo-steps-container">
              <h4>Étape du processus métier :</h4>
              <ul className="demo-steps-list">
                {currentDemo.steps.map((step, idx) => (
                  <li key={idx} className={`demo-step-item ${activeStep === idx + 1 ? 'active-step' : ''}`}>
                    <CheckCircle2 size={18} className={activeStep >= idx + 1 ? 'text-success' : 'text-muted'} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn btn-primary demo-play-btn" onClick={handleStartDemo} disabled={isPlaying}>
              <Play size={18} />
              <span>{isPlaying ? t('demoModal.simulating') : t('demoModal.watchBtn')}</span>
            </button>
          </div>

          <div className="demo-screen-preview">
            <div className="screen-window-bar">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="window-url">https://nexus-erp.cloud/app/{currentDemo.id}</span>
            </div>

            <div className="screen-content">
              <div className="screen-header">
                <div className="screen-title-area">
                  <IconComponent size={20} />
                  <span>Module {currentDemo.title} - Espace de travail SaaS</span>
                </div>
                <div className="screen-badge">
                  <ShieldCheck size={14} /> Isolation Tenant Activée
                </div>
              </div>

              <div className="stats-row">
                {Object.entries(currentDemo.previewStats).map(([key, val]) => (
                  <div key={key} className="stat-card">
                    <span className="stat-label">{key}</span>
                    <span className="stat-value">{val}</span>
                  </div>
                ))}
              </div>

              <div className="simulation-canvas">
                {isPlaying ? (
                  <div className="simulation-active">
                    <div className="spinner"></div>
                    <p>Simulacre d'exécution automatique - Étape {activeStep} / 3</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(activeStep / 3) * 100}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="simulation-placeholder">
                    <BarChart3 size={48} className="placeholder-icon" />
                    <p>Cliquez sur "Lancer la démonstration" pour voir l'interaction en direct.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
