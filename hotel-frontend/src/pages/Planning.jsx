import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

export default function Planning() {
  const [donnees, setDonnees] = useState({
    date: '',
    arrivees: [],
    departs: [],
  })
  const [toutesResa, setToutesResa] = useState([])
  const [etatChambres, setEtatChambres] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  const token = localStorage.getItem('token')

  async function charger() {
    setChargement(true)
    setErreur('')
    try {
      const [rep1, rep2, rep3] = await Promise.all([
        fetch(`${API_URL}/reservation/planning/jour`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/reservation`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/chambre/etat/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      if (rep1.ok) setDonnees(await rep1.json())
      if (rep2.ok) setToutesResa(await rep2.json())
      if (rep3.ok) setEtatChambres(await rep3.json())
    } catch {
      setErreur('Impossible de charger le planning')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  async function action(id, type) {
    if (!window.confirm(`Confirmer le ${type} ?`)) return
    setErreur('')
    try {
      const rep = await fetch(`${API_URL}/reservation/${id}/${type}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Action impossible')
        return
      }
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>

  const nbOccupees = etatChambres.filter(
    (c) => c.statutActuel === 'occupee',
  ).length
  const nbDisponibles = etatChambres.filter(
    (c) => c.statutActuel === 'disponible',
  ).length
  const nbMaintenance = etatChambres.filter(
    (c) => c.statutActuel === 'maintenance',
  ).length

  return (
    <div>
      <h1>Planning de l'hôtel</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {/* Stats rapides */}
      <div className="cartes" style={{ marginBottom: '32px' }}>
        <div className="carte-action">
          <h3>🛬 Arrivées aujourd'hui</h3>
          <p
            style={{
              fontSize: '32px',
              color: 'var(--marine)',
              fontWeight: 'bold',
            }}
          >
            {donnees.arrivees.length}
          </p>
        </div>
        <div className="carte-action">
          <h3>🛫 Départs aujourd'hui</h3>
          <p
            style={{
              fontSize: '32px',
              color: 'var(--marine)',
              fontWeight: 'bold',
            }}
          >
            {donnees.departs.length}
          </p>
        </div>
        <div className="carte-action">
          <h3>🏨 Chambres occupées</h3>
          <p
            style={{
              fontSize: '32px',
              color: '#991b1b',
              fontWeight: 'bold',
            }}
          >
            {nbOccupees} / {etatChambres.length}
          </p>
        </div>
      </div>

      {/* Arrivées du jour */}
      <h2>Arrivées prévues aujourd'hui</h2>
      {donnees.arrivees.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Aucune arrivée prévue.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donnees.arrivees.map((r) => (
              <tr key={r.id_reservation}>
                <td>
                  {r.client?.prenom} {r.client?.nom}
                </td>
                <td>
                  {r.chambre?.numero} ({r.chambre?.type?.libelle})
                </td>
                <td>{r.date_arrivee}</td>
                <td>{r.date_depart}</td>
                <td>
                  <span className={`statut statut-${r.statut}`}>
                    {r.statut}
                  </span>
                </td>
                <td>
                  {r.statut === 'confirmee' && (
                    <button
                      onClick={() =>
                        action(r.id_reservation, 'check-in')
                      }
                    >
                      ✅ Check-in
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Départs du jour */}
      <h2 style={{ marginTop: '40px' }}>Départs prévus aujourd'hui</h2>
      {donnees.departs.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Aucun départ prévu.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donnees.departs.map((r) => (
              <tr key={r.id_reservation}>
                <td>
                  {r.client?.prenom} {r.client?.nom}
                </td>
                <td>
                  {r.chambre?.numero} ({r.chambre?.type?.libelle})
                </td>
                <td>{r.date_arrivee}</td>
                <td>{r.date_depart}</td>
                <td>
                  <span className={`statut statut-${r.statut}`}>
                    {r.statut}
                  </span>
                </td>
                <td>
                  {r.statut === 'en_cours' && (
                    <button
                      onClick={() =>
                        action(r.id_reservation, 'check-out')
                      }
                    >
                      🚪 Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* État des chambres */}
      <h2 style={{ marginTop: '40px' }}>État des chambres</h2>
      <p
        style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        🟢 {nbDisponibles} disponible(s) · 🔴 {nbOccupees} occupée(s) · 🟠{' '}
        {nbMaintenance} en maintenance
      </p>

      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Numéro</th>
            <th>Type</th>
            <th>Étage</th>
            <th>Statut actuel</th>
            <th>Client actuel</th>
            <th>Prochain client</th>
          </tr>
        </thead>
        <tbody>
          {etatChambres.map((c) => (
            <tr key={c.id_chambre}>
              <td>
                {c.image ? (
                  <img
                    src={`${API_URL}/uploads/${c.image}`}
                    alt={`Chambre ${c.numero}`}
                    style={{
                      width: '70px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '70px',
                      height: '50px',
                      background: '#e5e7eb',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#9ca3af',
                    }}
                  >
                    —
                  </div>
                )}
              </td>
              <td>
                <strong>{c.numero}</strong>
              </td>
              <td>{c.type?.libelle}</td>
              <td>{c.etage}</td>
              <td>
                <span className={`statut statut-${c.statutActuel}`}>
                  {c.statutActuel}
                </span>
              </td>
              <td>{c.clientActuel || '—'}</td>
              <td>
                {c.prochainClient
                  ? `${c.prochainClient} (${c.prochaineArrivee})`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}