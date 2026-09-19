import React, { useState } from 'react'
import { FileText, Upload, CheckCircle2, AlertTriangle, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react'

export function OcrScannerModal({ onClose, onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError('')
    }
  }

  const handleScan = async () => {
    setScanning(true)
    setError('')
    try {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }
      const res = await fetch('/api/erp/ocr/parse-invoice', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      } else {
        setError("Échec de l'extraction OCR du document.")
      }
    } catch (err) {
      setError("Erreur de connexion au service IA/OCR: " + err.message)
    } finally {
      setScanning(false)
    }
  }

  const handleImport = () => {
    if (onImportSuccess && result) {
      onImportSuccess(result)
    }
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-lg">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Sparkles className="text-primary" size={24} />
            <div>
              <h3>Scanner OCR & Ingestion IA de Factures</h3>
              <p className="subtitle-sm">Reconnaissance automatique des factures fournisseurs (PDF / Images)</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {!result ? (
            <div className="ocr-upload-zone">
              <input 
                type="file" 
                id="ocr-file-input" 
                accept=".pdf,.png,.jpg,.jpeg" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="ocr-file-input" className="drag-drop-area">
                <Upload size={48} className="upload-icon text-primary" />
                <h4>Glissez-déposez la facture ici ou cliquez pour parcourir</h4>
                <span className="file-types-hint">Formats acceptés : PDF, PNG, JPG (Max 10 Mo)</span>
                {file && (
                  <div className="file-selected-badge mt-3">
                    <FileText size={18} /> {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </label>

              {error && (
                <div className="alert-banner danger mt-3">
                  <AlertTriangle size={18} /> {error}
                </div>
              )}

              <div className="modal-actions justify-end mt-4">
                <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleScan}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <Loader2 size={16} className="spin mr-2" /> Analyse par l'IA en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" /> Lancer l'Extraction OCR
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="ocr-result-preview">
              <div className="result-score-banner">
                <div className="score-badge">
                  <CheckCircle2 size={18} className="text-success" />
                  <span>Confiance IA : <strong>{(result.confidenceScore * 100).toFixed(1)}%</strong></span>
                </div>
                <span className="status-tag badge-success">{result.status}</span>
              </div>

              <div className="extracted-fields-grid mt-3">
                <div className="field-card">
                  <span className="field-label">Fournisseur Extrait</span>
                  <span className="field-val"><strong>{result.fournisseur}</strong></span>
                </div>

                <div className="field-card">
                  <span className="field-label">N° Facture</span>
                  <span className="field-val"><code>{result.numeroFacture}</code></span>
                </div>

                <div className="field-card">
                  <span className="field-label">Date Émission</span>
                  <span className="field-val">{result.dateFacture}</span>
                </div>

                <div className="field-card">
                  <span className="field-label">Montant Total TTC</span>
                  <span className="field-val text-success"><strong>{result.montantTTC.toLocaleString()} DA</strong></span>
                </div>
              </div>

              <div className="extracted-items-table mt-4">
                <h5>Lignes d'articles reconnues</h5>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Désignation</th>
                      <th>Quantité</th>
                      <th>P.U HT</th>
                      <th>Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.description}</td>
                        <td>{item.quantite}</td>
                        <td>{item.prixUnitaire.toLocaleString()} DA</td>
                        <td>{item.total.toLocaleString()} DA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions justify-between mt-4">
                <button className="btn btn-outline" onClick={() => setResult(null)}>Recommencer</button>
                <button className="btn btn-primary" onClick={handleImport}>
                  <ArrowRight size={16} /> Importer dans le Système ERP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
