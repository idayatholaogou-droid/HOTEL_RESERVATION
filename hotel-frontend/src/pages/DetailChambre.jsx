import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function DetailChambre() {
  const { id } = useParams()
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur'))
  const aujourdhui = new Date().toISOString().slice(0, 10)

  const [chambre, setChambre] = useState(null)
  const [clients, setClients] = useState([])
  const [idClient, setIdClient] = useState('')
  const [dateArrivee, setDateArrivee] = useState('')
  const [dateDepart, setDateDepart] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  useEffect(() => {
    async function charger() {
      try {
        const [repChambre, repClients] = await Promise.all([
          fetch(`${API_URL}/chambre/${id}`),
          fetch(`${API_URL}/client`),
        ])
        if (!repChambre.ok || !repClients.ok) throw new Error()
        setChambre(await repChambre.json())
        setClients(await repClients.json())
      } catch {
        setErreur('Impossible de charger la chambre')
      }
    }
    charger()
  }, [id])

  async function reserver(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')
    try {
      const reponse = await fetch(`${API_URL}/reservation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_arrivee: dateArrivee,
          date_depart: dateDepart,
          id_client: Number(idClient),
          id_chambre: Number(id),
          id_utilisateur: utilisateur.id_utilisateur,
        }),
      })
      const data = await reponse.json()
      if (!reponse.ok) {
        setErreur(data.message || 'Réservation impossible')
        return
      }
      setSucces('Réservation enregistrée')
      setIdClient('')
      setDateArrivee('')
      setDateDepart('')
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (!chambre) {
    return (
      <div>
        <button onClick={() => navigate('/reservation')}>Retour</button>
        <p>{erreur || 'Chargement...'}</p>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/reservation')}>Retour</button>
      <h1>Chambre {chambre.numero}</h1>

      <div className="detail">
        {chambre.image ? (
          <img
            src={`/chambres/${chambre.image}`}
            alt={`Chambre ${chambre.numero}`}
          />
        ) : (
          <div className="detail-sans-image">Pas d'image</div>
        )}

        <div>
          <h2>Informations</h2>
          <p>Type : {chambre.type?.libelle}</p>
          <p>Description : {chambre.type?.description}</p>
          <p>Étage : {chambre.etage}</p>
          <p>Capacité : {chambre.type?.capacite} personne(s)</p>
          <p>Prix par nuit : {chambre.type?.prix_nuit}</p>
          <p>Statut : {chambre.statut}</p>

          <h2>Réserver cette chambre</h2>
          <form onSubmit={reserver} className="formulaire-vertical">
            <label>Client</label>
            <select
              value={idClient}
              onChange={(e) => setIdClient(e.target.value)}
              required
            >
              <option value="">Choisir un client</option>
              {clients.map((client) => (
                <option key={client.id_client} value={client.id_client}>
                  {client.nom} {client.prenom}
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

            {erreur && <p>{erreur}</p>}
            {succes && <p>{succes}</p>}
            <button type="submit">Réserver</button>
          </form>
        </div>
      </div>
    </div>
  )
}