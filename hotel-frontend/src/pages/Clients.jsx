import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'


export default function Clients() {
  const [clients, setClients] = useState([])
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [adresse, setAdresse] = useState('')

  async function charger() {
    try {
      const reponse = await fetch(`${API_URL}/client`)
      if (!reponse.ok) throw new Error()
      setClients(await reponse.json())
    } catch {
      setErreur('Impossible de charger les clients')
    }
  }

  useEffect(() => {
    charger()
  }, [])

  async function ajouter(e) {
    e.preventDefault()
    setErreur('')
    try {
      const reponse = await fetch(`${API_URL}/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const clientsFiltres = clients.filter((client) =>
    `${client.nom} ${client.prenom} ${client.telephone}`
      .toLowerCase()
      .includes(recherche.toLowerCase()),
  )

  return (
    <div>
      <h1>Clients</h1>
      {erreur && <p>{erreur}</p>}

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

      <h2>Liste des clients</h2>
      <input
        className="recherche"
        placeholder="Rechercher par nom, prénom ou téléphone"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Adresse</th>
          </tr>
        </thead>
        <tbody>
          {clientsFiltres.map((client) => (
            <tr key={client.id_client}>
              <td>{client.nom}</td>
              <td>{client.prenom}</td>
              <td>{client.telephone}</td>
              <td>{client.email}</td>
              <td>{client.adresse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}