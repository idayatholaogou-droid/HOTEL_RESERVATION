import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur'))

  function deconnexion() {
    localStorage.removeItem('utilisateur')
    navigate('/login')
  }

  return (
    <div>
      <nav className="menu">
        <Link to="/">Accueil</Link>
        <Link to="/chambres">Chambres</Link>
        <span className="espace" />
        <span>
          {utilisateur?.prenom} ({utilisateur?.role})
        </span>
        <button onClick={deconnexion}>Déconnexion</button>
      </nav>
      <main className="contenu">
        <Outlet />
      </main>
    </div>
  )
}