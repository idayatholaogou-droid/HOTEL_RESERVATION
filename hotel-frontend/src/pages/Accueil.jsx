import { Link } from 'react-router-dom'
import { NOM_HOTEL, ICONE_HOTEL } from '../hotel.js'

export default function Accueil() {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const role = utilisateur?.role

  return (
    <div>
      {/* Hero de bienvenue */}
      <div className="accueil-hero">
        <h1>
          {ICONE_HOTEL} Bienvenue au {NOM_HOTEL}
        </h1>
        <p>
          Bonjour {utilisateur?.prenom} {utilisateur?.nom} 👋
        </p>
      </div>

      {/* Message selon le rôle */}
      {role === 'client' && (
        <div>
          <h2>Que souhaitez-vous faire ?</h2>
          <div className="cartes">
            <Link to="/chambres" className="carte carte-action">
              <h3>🏨 Voir les chambres</h3>
              <p>Découvrez nos chambres disponibles</p>
            </Link>

            <Link to="/reservation" className="carte carte-action">
              <h3>📅 Réserver</h3>
              <p>Réservez votre prochain séjour</p>
            </Link>

            <Link to="/mes-reservations" className="carte carte-action">
              <h3>📋 Mes réservations</h3>
              <p>Consultez et gérez vos réservations</p>
            </Link>
          </div>
        </div>
      )}

      {role === 'receptionniste' && (
        <div>
          <h2>Espace réceptionniste</h2>
          <div className="cartes">
            <Link to="/planning" className="carte carte-action">
              <h3>📊 Planning</h3>
              <p>Vue des chambres et réservations</p>
            </Link>

            <Link to="/clients" className="carte carte-action">
              <h3>👥 Clients</h3>
              <p>Gérer les clients</p>
            </Link>

            <Link to="/reservation" className="carte carte-action">
              <h3>📅 Réservations</h3>
              <p>Créer et gérer les réservations</p>
            </Link>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div>
          <h2>Espace administrateur</h2>
          <div className="cartes">
            <Link to="/admin" className="carte carte-action">
              <h3>👑 Administration</h3>
              <p>Gérer l'hôtel</p>
            </Link>

            <Link to="/chambres" className="carte carte-action">
              <h3>🏨 Chambres</h3>
              <p>Gérer les chambres</p>
            </Link>

            <Link to="/clients" className="carte carte-action">
              <h3>👥 Clients</h3>
              <p>Voir tous les clients</p>
            </Link>

            <Link to="/reservation" className="carte carte-action">
              <h3>📅 Réservations</h3>
              <p>Voir toutes les réservations</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}