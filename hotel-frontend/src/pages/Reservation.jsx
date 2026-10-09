import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function Reservation() {
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const role = utilisateur?.role
  const token = localStorage.getItem('token')

  const [chambres, setChambres] = useState([])
  const [reservations, setReservations] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  const estAdminOuRecep = role === 'admin' || role === 'receptionniste'

  useEffect(() => {
    async function charger() {
      setChargement(true)
      try {
        if (estAdminOuRecep) {
          const rep = await fetch(`${API_URL}/reservation`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!rep.ok) throw new Error()
          setReservations(await rep.json())
        } else {
          const rep = await fetch(`${API_URL}/chambre`)
          if (!rep.ok) throw new Error()
          setChambres(await rep.json())
        }
      } catch {
        setErreur('Impossible de charger les données')
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [estAdminOuRecep, token])

  async function action(id, type) {
    if (!window.confirm(`Confirmer le ${type} ?`)) return
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
      const rep2 = await fetch(`${API_URL}/reservation`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (rep2.ok) setReservations(await rep2.json())
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>

  // ==========================================
  // VUE CLIENT : liste des chambres pour réserver
  // ==========================================
  if (!estAdminOuRecep) {
    return (
      <div>
        <h1>Choisir une chambre</h1>
        {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
        <div className="cartes">
          {chambres.map((chambre) => (
            <div className="carte" key={chambre.id_chambre}>
              {chambre.image ? (
                <img
                  src={`${API_URL}/uploads/${chambre.image}`}
                  alt={`Chambre ${chambre.numero}`}
                />
              ) : (
                <div className="carte-sans-image">Pas d'image</div>
              )}
              <h3>Chambre {chambre.numero}</h3>
              <p>
                {chambre.type?.libelle} •{' '}
                {Number(chambre.type?.prix_nuit).toFixed(0)} € / nuit
              </p>
              <div className="carte-bas">
                <span className={`statut statut-${chambre.statut}`}>
                  {chambre.statut}
                </span>
                {chambre.statut === 'occupee' ||
                chambre.statut === 'maintenance' ? (
                  <button
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    Indisponible
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/reservation/${chambre.id_chambre}`)
                    }
                  >
                    Réserver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ==========================================
  // VUE RÉCEP + ADMIN : liste des réservations
  // ==========================================
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0 }}>Réservations ({reservations.length})</h1>
        {role === 'receptionniste' && (
          <button onClick={() => navigate('/reservation/comptoir')}>
            ➕ Nouvelle réservation (comptoir)
          </button>
        )}
      </div>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {reservations.length === 0 ? (
        <p style={{ color: '#6b7280' }}>Aucune réservation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id_reservation}>
                <td>{r.id_reservation}</td>
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
                <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {r.statut === 'confirmee' && (
                    <button onClick={() => action(r.id_reservation, 'check-in')}>
                      ✅ Check-in
                    </button>
                  )}
                  {r.statut === 'en_cours' && (
                    <button
                      onClick={() => action(r.id_reservation, 'check-out')}
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
    </div>
  )
}