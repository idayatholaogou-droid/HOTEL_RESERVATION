import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function ReservationComptoir() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [clients, setClients] = useState([])
  const [chambres, setChambres] = useState([])
  const [idClient, setIdClient] = useState('')
  const [idChambre, setIdChambre] = useState('')
  const [dateArrivee, setDateArrivee] = useState('')
  const [dateDepart, setDateDepart] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [chargement, setChargement] = useState(true)

  const aujourdhui = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    async function charger() {
      try {
        const [repC, repCh] = await Promise.all([
          fetch(`${API_URL}/client`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/chambre`),
        ])
        if (repC.ok) setClients(await repC.json())
        if (repCh.ok) setChambres(await repCh.json())
      } catch {
        setErreur('Impossible de charger les données')
      } finally {
        setChargement(false)
      }
    }
    charger()
  }, [token])

  async function enregistrer(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')

    try {
      const rep = await fetch(`${API_URL}/reservation/comptoir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date_arrivee: dateArrivee,
          date_depart: dateDepart,
          id_client: Number(idClient),
          id_chambre: Number(idChambre),
        }),
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Réservation impossible')
        return
      }
      setSucces(
        `✅ Réservation créée (ID : ${data.id_reservation}). Statut : en_attente.`,
      )
      setIdClient('')
      setIdChambre('')
      setDateArrivee('')
      setDateDepart('')
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <button onClick={() => navigate('/reservation')}>Retour</button>
      <h1>Nouvelle réservation au comptoir</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {succes && <p style={{ color: 'green' }}>{succes}</p>}

      <div className="paiement">
        <form onSubmit={enregistrer} className="formulaire-vertical">
          <label>Client</label>
          <select
            value={idClient}
            onChange={(e) => setIdClient(e.target.value)}
            required
          >
            <option value="">— Choisir un client —</option>
            {clients.map((c) => (
              <option key={c.id_client} value={c.id_client}>
                {c.prenom} {c.nom} ({c.telephone})
              </option>
            ))}
          </select>

          <label>Chambre</label>
          <select
            value={idChambre}
            onChange={(e) => setIdChambre(e.target.value)}
            required
          >
            <option value="">— Choisir une chambre —</option>
            {chambres.map((ch) => (
              <option key={ch.id_chambre} value={ch.id_chambre}>
                {ch.numero} ({ch.type?.libelle}) — {Number(ch.type?.prix_nuit).toFixed(0)} €
              </option>
            ))}
          </select>

          <label>Date d'arrivée</label>
          <input
            type="date"
            min={aujourdhui}
            value={dateArrivee}
            onChange={(e) => setDateArrivee(e.target.value)}
            required
          />

          <label>Date de départ</label>
          <input
            type="date"
            min={dateArrivee || aujourdhui}
            value={dateDepart}
            onChange={(e) => setDateDepart(e.target.value)}
            required
          />

          <button type="submit" style={{ marginTop: '16px' }}>
            Créer la réservation
          </button>
        </form>
      </div>
    </div>
  )
}