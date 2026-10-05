import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function Reservation() {
  const [chambres, setChambres] = useState([])
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/chambre`)
      .then((reponse) => {
        if (!reponse.ok) throw new Error()
        return reponse.json()
      })
      .then(setChambres)
      .catch(() => setErreur('Impossible de charger les chambres'))
  }, [])

  return (
    <div>
      <h1>Réservation</h1>
      {erreur && <p>{erreur}</p>}
      <div className="cartes">
        {chambres.map((chambre) => (
          <div className="carte" key={chambre.id_chambre}>
            {chambre.image ? (
              <img
                src={`/chambres/${chambre.image}`}
                alt={`Chambre ${chambre.numero}`}
              />
            ) : (
              <div className="carte-sans-image">Pas d'image</div>
            )}
            <h3>Chambre {chambre.numero}</h3>
            <p>{chambre.type?.libelle}</p>
            <button onClick={() => navigate(`/reservation/${chambre.id_chambre}`)}>
              Réservation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}