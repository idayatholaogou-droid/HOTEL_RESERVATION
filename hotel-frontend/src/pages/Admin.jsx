import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [alertes, setAlertes] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  const token = localStorage.getItem('token')

  async function charger() {
    setChargement(true)
    try {
      const [repStats, repAlertes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/alerte`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      if (repStats.ok) setStats(await repStats.json())
      if (repAlertes.ok) setAlertes(await repAlertes.json())
    } catch {
      setErreur('Impossible de charger les données')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [token])

  async function marquerToutesLues() {
    try {
      await fetch(`${API_URL}/alerte/tout-vu`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      charger()
    } catch {
      setErreur('Action impossible')
    }
  }

  async function supprimerAlerte(id) {
    if (!window.confirm('Supprimer cette alerte ?')) return
    try {
      await fetch(`${API_URL}/alerte/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      charger()
    } catch {
      setErreur('Suppression impossible')
    }
  }

  if (chargement) return <p>Chargement...</p>
  if (!stats) return <p style={{ color: 'red' }}>{erreur}</p>

  const alertesNonLues = alertes.filter((a) => !a.vue).length

  return (
    <div>
      <h1>Tableau de bord</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {/* Stats principales */}
      <div className="cartes" style={{ marginBottom: '32px' }}>
        <div className="carte-action">
          <h3>🏨 Chambres</h3>
          <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.chambres.total}
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            {stats.chambres.disponibles} disponibles · {stats.chambres.occupees} occupées
          </p>
        </div>

        <div className="carte-action">
          <h3>👥 Clients</h3>
          <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.clients.total}
          </p>
        </div>

        <div className="carte-action">
          <h3>📅 Réservations</h3>
          <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.reservations.total}
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            {stats.reservations.enCours} en cours
          </p>
        </div>

        <div className="carte-action">
          <h3>💰 Revenus du mois</h3>
          <p style={{ fontSize: '28px', color: 'var(--or-fonce)', fontWeight: 'bold' }}>
            {stats.revenus.mois.toFixed(2)} €
          </p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Total : {stats.revenus.total.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* 🚨 Alertes de sécurité */}
      <h2>🚨 Alertes de sécurité</h2>

      {alertes.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Aucune alerte. Tout est normal. ✅</p>
      ) : (
        <>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <p style={{ margin: 0, color: alertesNonLues > 0 ? '#991b1b' : '#6b7280', fontWeight: '600' }}>
              {alertesNonLues > 0
                ? `⚠️ ${alertesNonLues} alerte(s) non lue(s)`
                : 'Toutes les alertes sont lues ✅'}
            </p>
            {alertesNonLues > 0 && (
              <button onClick={marquerToutesLues}>Marquer toutes comme lues</button>
            )}
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Message</th>
                <th>Login concerné</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map((a) => (
                <tr key={a.id_alerte} style={{ background: a.vue ? 'white' : '#fef3c7' }}>
                  <td>{new Date(a.date_creation).toLocaleString('fr-FR')}</td>
                  <td>
                    <span className="statut statut-annulee">{a.type}</span>
                  </td>
                  <td>{a.message}</td>
                  <td>{a.login_concerne || '—'}</td>
                  <td>{a.vue ? '✅ Lue' : '🆕 Nouvelle'}</td>
                  <td>
                    <button onClick={() => supprimerAlerte(a.id_alerte)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Réservations par statut */}
      <h2 style={{ marginTop: '40px' }}>Réservations par statut</h2>
      <div className="cartes" style={{ marginBottom: '32px' }}>
        <div className="carte-action" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>En attente</h3>
          <p style={{ fontSize: '24px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.reservations.enAttente}
          </p>
        </div>
        <div className="carte-action" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>Confirmées</h3>
          <p style={{ fontSize: '24px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.reservations.confirmees}
          </p>
        </div>
        <div className="carte-action" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>En cours</h3>
          <p style={{ fontSize: '24px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.reservations.enCours}
          </p>
        </div>
        <div className="carte-action" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>Terminées</h3>
          <p style={{ fontSize: '24px', color: 'var(--marine)', fontWeight: 'bold' }}>
            {stats.reservations.terminees}
          </p>
        </div>
        <div className="carte-action" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '16px' }}>Annulées</h3>
          <p style={{ fontSize: '24px', color: '#991b1b', fontWeight: 'bold' }}>
            {stats.reservations.annulees}
          </p>
        </div>
      </div>

      {/* 5 dernières réservations */}
      <h2>Dernières réservations</h2>
      {stats.dernieresReservations.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Aucune réservation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {stats.dernieresReservations.map((r) => (
              <tr key={r.id_reservation}>
                <td>{r.client}</td>
                <td>{r.chambre}</td>
                <td>{r.date_arrivee}</td>
                <td>{r.date_depart}</td>
                <td>
                  <span className={`statut statut-${r.statut}`}>{r.statut}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}