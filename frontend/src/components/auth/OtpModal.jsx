import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { X, KeyRound, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react'

export function OtpModal({ isOpen, email, debugOtp, onClose, onVerified }) {
  const { t } = useLanguage()
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(300) // 5 minutes (300 seconds)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    const countdown = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [isOpen])

  if (!isOpen) return null

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codeOtp: otp })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Code OTP invalide')
      }

      setSuccessMsg(data.message)
      setTimeout(() => {
        onVerified(email)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du renvoi')
      }

      setTimer(300)
      setSuccessMsg("Un nouveau code OTP a été envoyé à votre adresse e-mail.")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal-container">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">🔐 {t('auth.otpTitle')}</h2>
            <p className="modal-subtitle">
              {t('auth.otpInstruction')} <strong>{email}</strong>
            </p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {debugOtp && (
          <div className="alert alert-info">
            💡 <strong>Code OTP de démonstration :</strong> <span className="otp-code-highlight">{debugOtp}</span>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <div className="otp-timer-badge">
              <span>Code valide pendant encore : <strong>{formatTime(timer)}</strong></span>
            </div>

            <div className="input-with-icon">
              <KeyRound size={20} className="input-icon" />
              <input
                type="text"
                className="form-input otp-input"
                placeholder="Ex: 123456"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading || otp.length < 6}
          >
            {loading ? 'Vérification en cours...' : t('auth.verifyBtn')}
          </button>

          <div className="resend-container">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResend}
              disabled={timer > 270} // 30s rate limit
            >
              <RotateCcw size={14} />
              <span>{t('auth.resendBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
