import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import {
  LayoutDashboard, ShoppingCart, Package, DollarSign, Users, ShieldCheck,
  LogOut, Download, AlertCircle, Plus, CheckCircle2, QrCode, Globe, Palette,
  ArrowUpRight, RefreshCw, CreditCard, Sparkles, Bell, BarChart3, TrendingUp,
  FileCheck, AlertTriangle, Check
} from 'lucide-react'
import { OcrScannerModal } from './OcrScannerModal'

export function WorkspaceDashboard({ user, onLogout }) {
  const { t, lang, setLang } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  // States pour les données réelles du backend
  const [clients, setClients] = useState([])
  const [commandes, setCommandes] = useState([])
  const [produits, setProduits] = useState([])
  const [factures, setFactures] = useState([])
  const [notifications, setNotifications] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [forecast, setForecast] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [showOcrModal, setShowOcrModal] = useState(false)
  const [showNotifMenu, setShowNotifMenu] = useState(false)

  const tenantId = user.tenantId || 'societe_demo'

  useEffect(() => {
    fetchDashboardData()
  }, [tenantId])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [resClients, resCmds, resProds, resFacts, resNotifs, resSummary, resForecast] = await Promise.all([
        fetch(`/api/erp/commercial/clients?tenantId=${tenantId}`),
        fetch(`/api/erp/commercial/commandes?tenantId=${tenantId}`),
        fetch(`/api/erp/stock/produits?tenantId=${tenantId}`),
        fetch(`/api/erp/facturation/factures?tenantId=${tenantId}`),
        fetch(`/api/erp/notifications/list`, { headers: { 'X-Tenant-ID': tenantId } }),
        fetch(`/api/erp/analytics/summary`, { headers: { 'X-Tenant-ID': tenantId } }),
        fetch(`/api/erp/analytics/forecast`, { headers: { 'X-Tenant-ID': tenantId } })
      ])

      if (resClients.ok) setClients(await resClients.json())
      if (resCmds.ok) setCommandes(await resCmds.json())
      if (resProds.ok) setProduits(await resProds.json())
      if (resFacts.ok) setFactures(await resFacts.json())
      if (resNotifs.ok) setNotifications(await resNotifs.json())
      if (resSummary.ok) setAnalytics(await resSummary.json())
      if (resForecast.ok) setForecast(await resForecast.json())
    } catch (err) {
      console.error("Erreur de chargement des données ERP:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleValiderCommande = async (cmdId) => {
    try {
      const res = await fetch(`/api/erp/commercial/commandes/${cmdId}/valider?tenantId=${tenantId}`, {
        method: 'POST'
      })
      if (res.ok) {
        fetchDashboardData()
      }
    } catch (err) {
      alert("Erreur validation commande: " + err.message)
    }
  }

  const handleAjusterStock = async (prodId, variation) => {
    try {
      const res = await fetch(`/api/erp/stock/produits/${prodId}/ajuster?tenantId=${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variation })
      })
      if (res.ok) {
        fetchDashboardData()
      }
    } catch (err) {
      alert("Erreur ajustement stock: " + err.message)
    }
  }

  const handleExportData = async () => {
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

  const markNotifRead = async (id) => {
    try {
      await fetch(`/api/erp/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'X-Tenant-ID': tenantId }
      })
      setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  // Calculs KPI
  const caTotal = commandes.reduce((acc, c) => acc + (c.montantTotal || 0), 0)
  const stockAlertes = produits.filter(p => (p.quantiteStock || 0) < 10).length
  const unreadNotifsCount = notifications.filter(n => !n.lu).length

  return (
    <div className="workspace-layout">
      {/* Sidebar Latérale */}
      <aside className="workspace-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo sm">N</div>
          <span>Nexus ERP</span>
        </div>

        <div className="sidebar-tenant-badge">
          <ShieldCheck size={16} className="text-success" />
          <div className="tenant-meta">
            <span className="tenant-name">{user.nomEntreprise || 'Ma Société'}</span>
            <span className="tenant-id">{tenantId}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Vue d'ensemble</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Analytics & IA</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'commercial' ? 'active' : ''}`}
            onClick={() => setActiveTab('commercial')}
          >
            <ShoppingCart size={18} />
            <span>Commercial & Ventes</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            <Package size={18} />
            <span>Stock & Logistique</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'facturation' ? 'active' : ''}`}
            onClick={() => setActiveTab('facturation')}
          >
            <DollarSign size={18} />
            <span>Factures & QR Code</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-outline btn-block btn-sm" onClick={handleExportData}>
            <Download size={14} /> Exporter mes données
          </button>
          <button className="btn btn-secondary btn-block btn-sm mt-2 text-danger" onClick={onLogout}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="workspace-main">
        {/* Workspace Topbar */}
        <header className="workspace-topbar">
          <div className="topbar-title">
            <h2>Espace de Travail - {user.nomEntreprise}</h2>
            {user.typeSouscription === 'ESSAI' && (
              <span className="trial-top-notice">
                <AlertCircle size={14} /> Essai : {user.remainingVisits || 29} visites restantes
              </span>
            )}
          </div>

          <div className="topbar-controls">
            <button className="btn btn-primary btn-sm" onClick={() => setShowOcrModal(true)}>
              <Sparkles size={16} /> Scanner OCR IA
            </button>

            {/* Notification Bell */}
            <div className="notif-bell-wrapper" style={{ position: 'relative' }}>
              <button 
                className="icon-btn" 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="notif-count-badge">{unreadNotifsCount}</span>
                )}
              </button>

              {showNotifMenu && (
                <div className="notif-dropdown-menu">
                  <div className="notif-menu-header">
                    <h4>Notifications ({notifications.length})</h4>
                    <span className="text-muted text-xs">Multi-canal</span>
                  </div>
                  <div className="notif-menu-body">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-center text-muted">Aucune notification</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.lu ? 'unread' : ''}`}>
                          <div className="notif-item-header">
                            <span className={`badge-pill ${n.urgence === 'WARNING' ? 'badge-warning' : 'badge-info'}`}>
                              {n.canal}
                            </span>
                            <span className="notif-time">{n.type}</span>
                          </div>
                          <strong className="notif-item-title">{n.titre}</strong>
                          <p className="notif-item-msg">{n.message}</p>
                          {!n.lu && (
                            <button className="btn-link text-xs mt-1" onClick={() => markNotifRead(n.id)}>
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="selector-group">
              <Globe size={16} />
              <select value={lang} onChange={e => setLang(e.target.value)}>
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="ar">🇩🇿 العربية</option>
              </select>
            </div>

            <div className="selector-group">
              <Palette size={16} />
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="professional">💼 Professionnel</option>
                <option value="light">☀️ Clair</option>
                <option value="dark">🌙 Sombre</option>
              </select>
            </div>

            <button className="icon-btn" onClick={fetchDashboardData} title="Rafraîchir">
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="workspace-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="overview-view">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span>Chiffre d'Affaires</span>
                    <DollarSign size={20} className="kpi-icon text-success" />
                  </div>
                  <span className="kpi-value">{caTotal.toLocaleString()} DA</span>
                  <span className="kpi-sub positive">+12.4% ce mois</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span>Commandes Traitées</span>
                    <ShoppingCart size={20} className="kpi-icon text-primary" />
                  </div>
                  <span className="kpi-value">{commandes.length} Commandes</span>
                  <span className="kpi-sub">Validation en temps réel</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span>Référentiel Articles</span>
                    <Package size={20} className="kpi-icon text-warning" />
                  </div>
                  <span className="kpi-value">{produits.length} Produits</span>
                  <span className="kpi-sub danger">{stockAlertes} alerte(s) stock</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span>Factures Électroniques</span>
                    <QrCode size={20} className="kpi-icon text-purple" />
                  </div>
                  <span className="kpi-value">{factures.length} Générées</span>
                  <span className="kpi-sub positive">QR Code scannables</span>
                </div>
              </div>

              <div className="dashboard-sections-grid">
                <div className="dashboard-panel">
                  <h3>Commandes Récentes</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Statut</th>
                        <th>Montant</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandes.map(cmd => (
                        <tr key={cmd.id}>
                          <td>#CMD-{cmd.id}</td>
                          <td>{cmd.client ? cmd.client.nomClient : 'Client Standard'}</td>
                          <td>
                            <span className={`status-badge ${cmd.statut === 'VALIDEE' ? 'badge-success' : 'badge-warning'}`}>
                              {cmd.statut}
                            </span>
                          </td>
                          <td>{cmd.montantTotal ? cmd.montantTotal.toLocaleString() : 0} DA</td>
                          <td>
                            {cmd.statut !== 'VALIDEE' && (
                              <button className="btn btn-sm btn-primary" onClick={() => handleValiderCommande(cmd.id)}>
                                Valider
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS & IA */}
          {activeTab === 'analytics' && (
            <div className="module-view">
              <div className="view-header">
                <h3>Analytics Executive & Prédictions IA</h3>
                <span className="badge-pill">Intelligence d'Affaires</span>
              </div>

              <div className="kpi-grid mb-4">
                <div className="kpi-card">
                  <span className="kpi-header">Trésorerie Actuelle</span>
                  <span className="kpi-value text-primary">{analytics ? analytics.tresorerieActuelle.toLocaleString() : '485,000'} DA</span>
                  <span className="kpi-sub positive">Cash-Flow Sécurisé</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-header">Valeur du Stock Total</span>
                  <span className="kpi-value text-warning">{analytics ? analytics.valeurStockTotal.toLocaleString() : '312,000'} DA</span>
                  <span className="kpi-sub">Valorisation à la PMP</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-header">Taux Marge Brute</span>
                  <span className="kpi-value text-success">{analytics ? analytics.margeBrutePourcentage : '34.5'}%</span>
                  <span className="kpi-sub positive">Marge Optimisée</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-header">Prévision Q4</span>
                  <span className="kpi-value text-purple">{forecast ? forecast.trimestreProchainCA.toLocaleString() : '680,000'} DA</span>
                  <span className="kpi-sub positive">{forecast ? forecast.croissanceEstimee : '+12.4%'}</span>
                </div>
              </div>

              <div className="data-grid-two-col">
                <div className="dashboard-panel">
                  <h4>Ventes Mensuelles (2026)</h4>
                  <div className="chart-simulation">
                    {analytics && analytics.ventesParMois.map((m, idx) => (
                      <div key={idx} className="chart-bar-item">
                        <span className="bar-label">{m.mois}</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(m.montant / 250000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="bar-value">{(m.montant / 1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-panel">
                  <h4>Recommandation & Détection d'Anomalies IA</h4>
                  <div className="ai-recommendation-box mt-3">
                    <Sparkles className="text-primary mb-2" size={24} />
                    <h5>Optimisation Référentiel Stock</h5>
                    <p className="text-muted">
                      {forecast ? forecast.recommandationIA : "Analyse en cours..."}
                    </p>
                    <div className="risk-tag mt-3">
                      <span>Niveau de risque rupture : </span>
                      <strong className="text-success">{forecast ? forecast.risqueRuptureStock : 'FAIBLE'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMERCIAL */}
          {activeTab === 'commercial' && (
            <div className="module-view">
              <div className="view-header">
                <h3>Gestion Commerciale & Clients</h3>
                <span className="badge-pill">Module Ventes</span>
              </div>

              <div className="data-grid-two-col">
                <div className="dashboard-panel">
                  <h4>Portefeuille Clients ({clients.length})</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nom Client</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.nomClient}</strong></td>
                          <td>{c.email}</td>
                          <td>{c.telephone}</td>
                          <td>{c.adresse}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="dashboard-panel">
                  <h4>Commandes Clients ({commandes.length})</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Réf</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commandes.map(cmd => (
                        <tr key={cmd.id}>
                          <td>#CMD-{cmd.id}</td>
                          <td>{cmd.dateCommande}</td>
                          <td>
                            <span className={`status-badge ${cmd.statut === 'VALIDEE' ? 'badge-success' : 'badge-warning'}`}>
                              {cmd.statut}
                            </span>
                          </td>
                          <td>{cmd.montantTotal ? cmd.montantTotal.toLocaleString() : 0} DA</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STOCK */}
          {activeTab === 'stock' && (
            <div className="module-view">
              <div className="view-header">
                <h3>Stock & Logistique</h3>
                <span className="badge-pill">Inventaire Temps Réel</span>
              </div>

              <div className="dashboard-panel">
                <h4>Référentiel des Produits & Mouvements de Stock</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code SKU</th>
                      <th>Désignation Article</th>
                      <th>Prix Unitaire</th>
                      <th>Stock Dispo</th>
                      <th>Actions Ajustement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map(p => (
                      <tr key={p.id}>
                        <td><code>{p.codeSku}</code></td>
                        <td><strong>{p.nomProduit}</strong></td>
                        <td>{p.prixUnitaire ? p.prixUnitaire.toLocaleString() : 0} DA</td>
                        <td>
                          <span className={`stock-badge ${p.quantiteStock < 10 ? 'stock-low' : 'stock-ok'}`}>
                            {p.quantiteStock} unités
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline" onClick={() => handleAjusterStock(p.id, 1)}>
                              +1 Entrée
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={() => handleAjusterStock(p.id, -1)} disabled={p.quantiteStock <= 0}>
                              -1 Sortie
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FACTURES & QR CODE */}
          {activeTab === 'facturation' && (
            <div className="module-view">
              <div className="view-header">
                <h3>Facturation Électronique & QR Code</h3>
                <span className="badge-pill">Conformité Légale</span>
              </div>

              <div className="factures-grid">
                {factures.map(f => (
                  <div key={f.id} className="facture-card">
                    <div className="facture-card-header">
                      <div>
                        <h4>Facture #{f.numeroFacture}</h4>
                        <span className="facture-date">Date : {f.dateEmission}</span>
                      </div>
                      <QrCode size={40} className="qr-code-icon text-primary" />
                    </div>

                    <div className="facture-card-body">
                      <span className="facture-total-label">Montant TTC :</span>
                      <span className="facture-total-val">{f.montantTotal ? f.montantTotal.toLocaleString() : 0} DA</span>
                      <div className="qr-code-data">
                        <code>{f.codeQr}</code>
                      </div>
                    </div>

                    <div className="facture-card-footer">
                      <button className="btn btn-sm btn-primary btn-block" onClick={() => alert("Simulation paiement en ligne validée !")}>
                        <CreditCard size={14} /> Simuler Paiement en Ligne
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* OCR Scanner Modal */}
      {showOcrModal && (
        <OcrScannerModal 
          onClose={() => setShowOcrModal(false)}
          onImportSuccess={(parsed) => {
            alert(`Facture ${parsed.numeroFacture} de ${parsed.fournisseur} importée avec succès !`)
            fetchDashboardData()
          }}
        />
      )}
    </div>
  )
}
