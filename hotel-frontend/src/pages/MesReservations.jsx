import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

export default function MesReservations() {
  const [reservations, setReservations] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  async function charger() {
    setChargement(true)
    try {
      const reponse = await fetch(`${API_URL}/reservation/mes-reservations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!reponse.ok) throw new Error()
      setReservations(await reponse.json())
    } catch {
      setErreur('Impossible de charger vos réservations')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  async function annuler(id) {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      return
    }
    try {
      const reponse = await fetch(
        `${API_URL}/reservation/${id}/annuler`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (!reponse.ok) {
        const data = await reponse.json()
        setErreur(data.message || 'Annulation impossible')
        return
      }
      charger()   // Recharge la liste
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Mes réservations</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {reservations.length === 0 ? (
        <p>Vous n'avez aucune réservation pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Chambre</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id_reservation}>
                <td>
                  {r.chambre?.numero} ({r.chambre?.type?.libelle})
                </td>
                <td>{r.date_arrivee}</td>
                <td>{r.date_depart}</td>
                <td>{r.statut}</td>
                <td>
                  {r.statut !== 'annulee' ? (
                    <button onClick={() => annuler(r.id_reservation)}>
                      Annuler
                    </button>
                  ) : (
                    <span>—</span>
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