import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ICONE_HOTEL, NOM_HOTEL } from '../hotel.js'

export default function Layout() {
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const role = utilisateur?.role

  function deconnexion() {
    localStorage.removeItem('utilisateur')
    localStorage.removeItem('token')
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

          {/* CLIENT */}
          {role === 'client' && (
            <>
              <NavLink to="/chambres">Chambres</NavLink>
              <NavLink to="/reservation">Réserver</NavLink>
              <NavLink to="/mes-reservations">Mes réservations</NavLink>
            </>
          )}

          {/* RÉCEPTIONNISTE + ADMIN */}
          {(role === 'receptionniste' || role === 'admin') && (
            <>
              <NavLink to="/planning">Planning</NavLink>
              <NavLink to="/clients">Clients</NavLink>
              <NavLink to="/reservation">Réservations</NavLink>
            </>
          )}

          {/* ADMIN uniquement */}
          {role === 'admin' && (
            <>
              <NavLink to="/admin">Administration</NavLink>
              <NavLink to="/admin/chambres">Gestion chambres</NavLink>
              <NavLink to="/admin/types">Types & tarifs</NavLink>
              <NavLink to="/admin/utilisateurs">Utilisateurs</NavLink>
            </>
          )}
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