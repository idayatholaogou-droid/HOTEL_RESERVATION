import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api.js'
import { NOM_HOTEL } from '../hotel.js'

export default function Login() {
  const [login, setLogin] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    try {
      const reponse = await fetch(`${API_URL}/utilisateur/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, mot_de_passe: motDePasse }),
      })
      if (!reponse.ok) {
        const data = await reponse.json()
        setErreur(data.message || 'Connexion impossible')
        return
      }
      const utilisateur = await reponse.json()

      //  Stocke le token + l'utilisateur
      localStorage.setItem('token', utilisateur.access_token)
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur))

      //  Redirection selon le rôle
      const role = utilisateur.role
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'receptionniste') {
        navigate('/planning')
      } else {
        navigate('/')   // client → accueil
      }
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  return (
    <div className="login">
      <div className="login-image" />
      <div className="login-formulaire">
        <form onSubmit={handleSubmit}>
          <h1>{NOM_HOTEL}</h1>
          <h2>Connexion</h2>
          <div>
            <label>Login</label>
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          {erreur && <p>{erreur}</p>}
          <button type="submit">Se connecter</button>
          <p className="lien-inscription">
            Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  )
}