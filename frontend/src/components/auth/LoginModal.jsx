import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { X, Mail, Lock, LogIn, AlertCircle, Download, CheckCircle2 } from 'lucide-react'

export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trialExpiredInfo, setTrialExpiredInfo] = useState(null)

  if (!isOpen) return null

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setTrialExpiredInfo(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (response.status === 402 && data.trialExpired) {
        setTrialExpiredInfo(data)
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d’authentification')
      }

      onLoginSuccess(data)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async (tenantId) => {
    try {
      const res = await fetch(`/api/tenant/export-data?tenantId=${tenantId}`)
      const data = await res.json()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nexus_erp_export_${tenantId}.json`
      a.click()
    } catch (err) {
      alert("Erreur lors de l'exportation des données : " + err.message)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🔐 {t('auth.loginTitle')}</h2>
            <p className="modal-subtitle">Accédez à vos modules ERP et données d'entreprise</p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {trialExpiredInfo && (
          <div className="alert alert-warning trial-expired-box">
            <AlertCircle size={24} className="text-warning" />
            <div>
              <h4>Période d'essai expirée (30/30 visites)</h4>
              <p>{trialExpiredInfo.error}</p>
              <p className="small-text">Toutes vos données restent sauvegardées et conservées.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => handleExportData(trialExpiredInfo.tenantId)}
              >
                <Download size={16} /> Exporter/Télécharger toutes mes données
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('auth.emailLabel')}</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="Ex: demo@nexus-erp.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="demo-credentials-hint">
            💡 <strong>Compte de démo rapide :</strong> demo@nexus-erp.com / demo123
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Connexion en cours...' : t('nav.login')}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
