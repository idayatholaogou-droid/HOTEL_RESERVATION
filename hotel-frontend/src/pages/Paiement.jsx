import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function Paiement() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState(null)
  const [mode, setMode] = useState('carte')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    async function charger() {
      try {
        const rep = await fetch(`${API_URL}/reservation/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!rep.ok) throw new Error()
        setReservation(await rep.json())
      } catch {
        setErreur('Impossible de charger la réservation')
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [id])

  async function payer(e) {
    e.preventDefault()
    setErreur('')
    try {
      const reponse = await fetch(`${API_URL}/paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id_reservation: Number(id),
          mode,
        }),
      })
      const data = await reponse.json()
      if (!reponse.ok) {
        setErreur(data.message || 'Paiement impossible')
        return
      }
      // Rediriger vers mes réservations
      navigate('/mes-reservations')
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>
  if (!reservation) return <p>{erreur || 'Réservation introuvable'}</p>

  const nuits = Math.round(
    (new Date(reservation.date_depart) - new Date(reservation.date_arrivee)) /
      86400000,
  )
  const prixNuit = Number(reservation.chambre?.type?.prix_nuit || 0)
  const montant = nuits * prixNuit

  return (
    <div>
      <h1>Paiement</h1>

      <div className="paiement">
        <h2>Récapitulatif</h2>
        <p>
          Chambre : <strong>{reservation.chambre?.numero}</strong> (
          {reservation.chambre?.type?.libelle})
        </p>
        <p>
          Du <strong>{reservation.date_arrivee}</strong> au{' '}
          <strong>{reservation.date_depart}</strong>
        </p>
        <p>Nombre de nuits : {nuits}</p>
        <p>Prix par nuit : {prixNuit.toFixed(2)}</p>
        <h3>Total à payer : {montant.toFixed(2)}</h3>

        <form onSubmit={payer} className="formulaire-vertical">
          <label>Mode de paiement</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="carte">Carte bancaire</option>
            <option value="especes">Espèces (au comptoir)</option>
            <option value="virement">Virement</option>
          </select>

          {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
          <button type="submit">Payer {montant.toFixed(2)} €</button>
        </form>
      </div>
    </div>
  )
}