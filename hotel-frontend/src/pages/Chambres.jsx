import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

export default function Chambres() {
  const [chambres, setChambres] = useState([])
  const [erreur, setErreur] = useState('')

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
      <h1>Chambres</h1>
      {erreur && <p>{erreur}</p>}
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Étage</th>
            <th>Type</th>
            <th>Prix par nuit</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {chambres.map((chambre) => (
            <tr key={chambre.id_chambre}>
              <td>{chambre.numero}</td>
              <td>{chambre.etage}</td>
              <td>{chambre.type?.libelle}</td>
              <td>{chambre.type?.prix_nuit}</td>
              <td>{chambre.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}