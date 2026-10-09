import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

const UTILISATEUR_VIDE = {
  nom: '',
  prenom: '',
  login: '',
  mot_de_passe: '',
  role: 'receptionniste',
}

export default function AdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [form, setForm] = useState(UTILISATEUR_VIDE)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [chargement, setChargement] = useState(true)

  const token = localStorage.getItem('token')
  const moi = JSON.parse(localStorage.getItem('utilisateur') || '{}')

  async function charger() {
    setChargement(true)
    try {
      const rep = await fetch(`${API_URL}/utilisateur`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (rep.ok) setUtilisateurs(await rep.json())
    } catch {
      setErreur('Impossible de charger les utilisateurs')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  function modifier(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function creer(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')

    try {
      const rep = await fetch(`${API_URL}/utilisateur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Création impossible')
        return
      }
      setSucces(`✅ Utilisateur "${data.login}" créé (rôle : ${data.role})`)
      setForm(UTILISATEUR_VIDE)
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  async function supprimer(id, login) {
    if (id === moi.id_utilisateur) {
      alert('Tu ne peux pas supprimer ton propre compte')
      return
    }
    if (!window.confirm(`Supprimer l'utilisateur "${login}" ?`)) return
    try {
      const rep = await fetch(`${API_URL}/utilisateur/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!rep.ok) {
        const data = await rep.json()
        setErreur(data.message || 'Suppression impossible')
        return
      }
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {succes && <p style={{ color: 'green' }}>{succes}</p>}

      {/* Formulaire */}
      <div className="paiement" style={{ marginBottom: '32px' }}>
        <h2>Créer un utilisateur</h2>
        <form onSubmit={creer} className="formulaire-vertical">
          <label>Nom</label>
          <input
            name="nom"
            value={form.nom}
            onChange={modifier}
            required
          />

          <label>Prénom</label>
          <input
            name="prenom"
            value={form.prenom}
            onChange={modifier}
            required
          />

          <label>Login (email)</label>
          <input
            type="email"
            name="login"
            value={form.login}
            onChange={modifier}
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            value={form.mot_de_passe}
            onChange={modifier}
            minLength="6"
            required
          />

          <label>Rôle</label>
          <select name="role" value={form.role} onChange={modifier}>
            <option value="client">Client</option>
            <option value="receptionniste">Réceptionniste</option>
            <option value="admin">Administrateur</option>
          </select>

          <button type="submit" style={{ marginTop: '12px' }}>
            Créer l'utilisateur
          </button>
        </form>
      </div>

      {/* Liste */}
      <h2>Utilisateurs existants ({utilisateurs.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Login</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((u) => (
            <tr key={u.id_utilisateur}>
              <td>{u.nom}</td>
              <td>{u.prenom}</td>
              <td>{u.login}</td>
              <td>
                <span
                  className={`statut statut-${u.role === 'admin' ? 'annulee' : u.role === 'receptionniste' ? 'en_attente' : 'confirmee'}`}
                >
                  {u.role}
                </span>
              </td>
              <td>
                {u.id_utilisateur !== moi.id_utilisateur ? (
                  <button onClick={() => supprimer(u.id_utilisateur, u.login)}>
                    Supprimer
                  </button>
                ) : (
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    (c'est toi)
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}