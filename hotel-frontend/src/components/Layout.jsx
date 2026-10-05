import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ICONE_HOTEL, NOM_HOTEL } from '../hotel.js'


export default function Layout() {
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur'))

  function deconnexion() {
    localStorage.removeItem('utilisateur')
    navigate('/login')
  }

  return (
    <div className="app">
      <aside className="menu">
                <div className="menu-titre">
          {ICONE_HOTEL} {NOM_HOTEL}
        </div>
        <nav className="menu-liens">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/chambres">Chambres</NavLink>
          <NavLink to="/reservation">Réservation</NavLink>
        </nav>
        <div className="menu-bas">
          <span>
            {utilisateur?.prenom} ({utilisateur?.role})
          </span>
          <button onClick={deconnexion}>Déconnexion</button>
        </div>
      </aside>
      <main className="contenu">
        <Outlet />
      </main>
    </div>
  )
}