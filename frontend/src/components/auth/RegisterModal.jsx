import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { X, Building2, Mail, Lock, User, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

export function RegisterModal({ isOpen, onClose, onOtpRequested }) {
  const { t } = useLanguage()
  const [typeSouscription, setTypeSouscription] = useState('ESSAI')
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    prenom: '',
    nom: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          typeSouscription
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription')
      }

      onOtpRequested(formData.email, data.debugOtp)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">✨ {t('auth.registerTitle')}</h2>
            <p className="modal-subtitle">Rejoignez l'écosystème SaaS Cloud Nexus ERP</p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="plan-selection-grid">
            <div
              className={`plan-card ${typeSouscription === 'ESSAI' ? 'selected' : ''}`}
              onClick={() => setTypeSouscription('ESSAI')}
            >
              <div className="plan-card-header">
                <Sparkles size={20} className="text-primary" />
                <span>{t('auth.trialChoice')}</span>
              </div>
              <p className="plan-card-desc">30 connexions/visites incluses. Accès immédiat sans CB.</p>
              <div className="plan-card-badge"><CheckCircle2 size={14} /> Conservation des données</div>
            </div>

            <div
              className={`plan-card ${typeSouscription === 'PAYANT' ? 'selected' : ''}`}
              onClick={() => setTypeSouscription('PAYANT')}
            >
              <div className="plan-card-header">
                <ShieldCheck size={20} className="text-success" />
                <span>{t('auth.paidChoice')}</span>
              </div>
              <p className="plan-card-desc">Accès illimité + Base dédiée isolée (Multi-Database).</p>
              <div className="plan-card-badge">Support 24/7 & IA</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.companyLabel')}</label>
            <div className="input-with-icon">
              <Building2 size={18} className="input-icon" />
              <input
                type="text"
                name="nomEntreprise"
                className="form-input"
                placeholder="Ex: Tech Corp SARL"
                value={formData.nomEntreprise}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('auth.prenomLabel')}</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="prenom"
                  className="form-input"
                  placeholder="Jean"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.nomLabel')}</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="nom"
                  className="form-input"
                  placeholder="Dupont"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.emailLabel')}</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="jean.dupont@entreprise.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('auth.passwordLabel')}</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Génération du code OTP...' : 'Créer mon environnement SaaS'}
          </button>
        </form>
      </div>
    </div>
  )
}
