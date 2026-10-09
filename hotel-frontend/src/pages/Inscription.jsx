import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api.js'
import { NOM_HOTEL } from '../hotel.js'

export default function Inscription() {
  const [champs, setChamps] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    mot_de_passe: '',
    confirmation: '',
  })
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  function modifier(e) {
    setChamps({ ...champs, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    // Vérification des mots de passe
    if (champs.mot_de_passe !== champs.confirmation) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    try {
      const reponse = await fetch(`${API_URL}/client/inscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(champs),
      })
      if (!reponse.ok) {
        const data = await reponse.json()
        setErreur(data.message || 'Inscription impossible')
        return
      }

      const connexion = await fetch(`${API_URL}/utilisateur/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: champs.email.trim().toLowerCase(),
          mot_de_passe: champs.mot_de_passe,
        }),
      })
      if (!connexion.ok) {
        navigate('/login')
        return
      }

      const utilisateur = await connexion.json()
      localStorage.setItem('token', utilisateur.access_token)
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur))
      navigate('/')
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  return (
    <div className="login">
      <div className="login-image" />
      <div className="login-formulaire">
        <form onSubmit={handleSubmit} autoComplete="off">
          <h1>{NOM_HOTEL}</h1>
          <h2>Créer un compte</h2>
          <div>
            <label>Nom</label>
            <input name="nom" value={champs.nom} onChange={modifier} required />
          </div>
          <div>
            <label>Prénom</label>
            <input
              name="prenom"
              value={champs.prenom}
              onChange={modifier}
              required
            />
          </div>
          <div>
            <label>Téléphone</label>
            <input
              name="telephone"
              type="tel"
              value={champs.telephone}
              onChange={modifier}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={champs.email}
              onChange={modifier}
              required
            />
          </div>
          <div>
            <label>Adresse</label>
            <input
              name="adresse"
              value={champs.adresse}
              onChange={modifier}
              required
            />
          </div>
          <div>
            <label>Mot de passe</label>
            <input
              name="mot_de_passe"
              type="password"
              autoComplete="new-password"
              value={champs.mot_de_passe}
              onChange={modifier}
              required
            />
            <label>Confirmer votre Mot de passe</label>
            <input
              name="confirmation"
              type="password"
              autoComplete="new-password"
              value={champs.confirmation}
              onChange={modifier}
              required
            />
          </div>
          {erreur && <p>{erreur}</p>}
          <button type="submit">Créer mon compte</button>
          <p className="lien-inscription">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  )
}