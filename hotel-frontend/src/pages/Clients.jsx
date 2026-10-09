import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

export default function Clients() {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const role = utilisateur?.role
  const token = localStorage.getItem('token')

  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')

  // Formulaire (réceptionniste uniquement)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [adresse, setAdresse] = useState('')

  async function charger() {
    try {
      const reponse = await fetch(`${API_URL}/client`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!reponse.ok) throw new Error()
      setClients(await reponse.json())
    } catch {
      setErreur('Impossible de charger les clients')
    }
  }

  async function chargerStats() {
    if (role !== 'admin') return
    try {
      const reponse = await fetch(`${API_URL}/client/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (reponse.ok) setStats(await reponse.json())
    } catch {
      // silencieux
    }
  }

  useEffect(() => {
    charger()
    chargerStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function ajouter(e) {
    e.preventDefault()
    setErreur('')
    try {
      const reponse = await fetch(`${API_URL}/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom,
          prenom,
          telephone,
          email: email || undefined,
          adresse: adresse || undefined,
        }),
      })
      if (!reponse.ok) {
        const data = await reponse.json()
        setErreur(data.message || "Impossible d'ajouter le client")
        return
      }
      setNom('')
      setPrenom('')
      setTelephone('')
      setEmail('')
      setAdresse('')
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer ce client ?')) return
    try {
      const reponse = await fetch(`${API_URL}/client/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!reponse.ok) {
        const data = await reponse.json()
        setErreur(data.message || 'Suppression impossible')
        return
      }
      charger()
      chargerStats()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  const clientsFiltres = clients.filter((client) =>
    `${client.nom} ${client.prenom} ${client.telephone}`
      .toLowerCase()
      .includes(recherche.toLowerCase()),
  )

  return (
    <div>
      <h1>{role === 'admin' ? 'Gestion des clients' : 'Clients'}</h1>
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {/* STATS pour ADMIN uniquement */}
      {role === 'admin' && stats && (
        <>
          <h2>Statistiques</h2>
          <div className="cartes" style={{ marginBottom: '32px' }}>
            <div className="carte-action">
              <h3>👥 Total clients</h3>
              <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
                {stats.total}
              </p>
            </div>
            <div className="carte-action">
              <h3>📅 Nouveaux ce mois</h3>
              <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
                {stats.nouveauxCeMois}
              </p>
            </div>
            <div className="carte-action">
              <h3>💻 Avec compte</h3>
              <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
                {stats.avecCompte}
              </p>
            </div>
            <div className="carte-action">
              <h3>🏨 Sans compte</h3>
              <p style={{ fontSize: '32px', color: 'var(--marine)', fontWeight: 'bold' }}>
                {stats.sansCompte}
              </p>
            </div>
          </div>
        </>
      )}

      {/* FORMULAIRE - RÉCEPTIONNISTE uniquement */}
      {role === 'receptionniste' && (
        <>
          <h2>Enregistrer un client</h2>
          <form onSubmit={ajouter} className="formulaire">
            <input
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            <input
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
            <input
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email (facultatif)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Adresse (facultatif)"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
            <button type="submit">Enregistrer</button>
          </form>
        </>
      )}

      {/* LISTE - visible pour tous */}
      <h2>Liste des clients ({clientsFiltres.length})</h2>
      <input
        className="recherche"
        placeholder="Rechercher par nom, prénom ou téléphone"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={{ marginBottom: '16px', width: '100%', maxWidth: '400px' }}
      />

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Adresse</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {clientsFiltres.map((client) => (
            <tr key={client.id_client}>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.telephone}</td>
              <td>{client.email || '—'}</td>
              <td>{client.adresse || '—'}</td>
              {role === 'admin' && (
                <td>
                  <button onClick={() => supprimer(client.id_client)}>
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}