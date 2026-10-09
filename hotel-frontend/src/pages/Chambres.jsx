import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function Chambres() {
  const [chambres, setChambres] = useState([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/chambre`)
      .then((reponse) => {
        if (!reponse.ok) throw new Error()
        return reponse.json()
      })
      .then(setChambres)
      .catch(() => setErreur('Impossible de charger les chambres'))
      .finally(() => setChargement(false))
  }, [])

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Nos chambres</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      <div className="cartes">
        {chambres.map((chambre) => (
          <div key={chambre.id_chambre} className="carte">
            {chambre.image ? (
              <img
                src={`${API_URL}/uploads/${chambre.image}`}
                alt={`Chambre ${chambre.numero}`}
              />
            ) : (
              <div className="carte-sans-image">Pas d'image</div>
            )}

            <h3>Chambre {chambre.numero}</h3>
            <p>
              {chambre.type?.libelle} • Étage {chambre.etage}
            </p>
            <p>
              <strong>{Number(chambre.type?.prix_nuit).toFixed(0)} €</strong> / nuit
            </p>

            <div className="carte-bas">
              <span className={`statut statut-${chambre.statut}`}>
                {chambre.statut}
              </span>
              {chambre.statut === 'occupee' ||
              chambre.statut === 'maintenance' ? (
                <button
                  disabled
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Indisponible
                </button>
              ) : (
                <Link to={`/reservation/${chambre.id_chambre}`}>
                  <button>Réserver</button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}