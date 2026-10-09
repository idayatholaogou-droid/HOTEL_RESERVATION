import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

const CHAMBRE_VIDE = {
  numero: '',
  etage: 1,
  statut: 'disponible',
  id_type: 1,
  image: '',
}

export default function AdminChambres() {
  const [chambres, setChambres] = useState([])
  const [types, setTypes] = useState([])
  const [form, setForm] = useState(CHAMBRE_VIDE)
  const [modeEdition, setModeEdition] = useState(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)
  const [uploadEnCours, setUploadEnCours] = useState(false)

  const token = localStorage.getItem('token')

  async function charger() {
    setChargement(true)
    try {
      const [repC, repT] = await Promise.all([
        fetch(`${API_URL}/chambre`),
        fetch(`${API_URL}/type-chambre`),
      ])
      setChambres(await repC.json())
      if (repT.ok) setTypes(await repT.json())
    } catch {
      setErreur('Impossible de charger les données')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => { charger() }, [])

  function modifier(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  //  Upload d'image
  async function uploaderImage(e) {
    const fichier = e.target.files[0]
    if (!fichier) return

    setUploadEnCours(true)
    setErreur('')

    const formData = new FormData()
    formData.append('image', fichier)

    try {
      const rep = await fetch(`${API_URL}/chambre/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Upload impossible')
        return
      }
      setForm({ ...form, image: data.filename })
    } catch {
      setErreur("Le serveur ne répond pas")
    } finally {
      setUploadEnCours(false)
    }
  }

  async function enregistrer(e) {
    e.preventDefault()
    setErreur('')

    const url = modeEdition
      ? `${API_URL}/chambre/${modeEdition}`
      : `${API_URL}/chambre`
    const methode = modeEdition ? 'PATCH' : 'POST'

    try {
      const rep = await fetch(url, {
        method: methode,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero: form.numero,
          etage: Number(form.etage),
          statut: form.statut,
          id_type: Number(form.id_type),
          image: form.image || undefined,
        }),
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Enregistrement impossible')
        return
      }
      setForm(CHAMBRE_VIDE)
      setModeEdition(null)
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer cette chambre ?')) return
    try {
      const rep = await fetch(`${API_URL}/chambre/${id}`, {
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

  function editer(chambre) {
    setForm({
      numero: chambre.numero,
      etage: chambre.etage,
      statut: chambre.statut,
      id_type: chambre.type?.id_type ?? chambre.id_type ?? 1,
      image: chambre.image || '',
    })
    setModeEdition(chambre.id_chambre)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function annulerEdition() {
    setForm(CHAMBRE_VIDE)
    setModeEdition(null)
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Gestion des chambres</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {/* Formulaire */}
      <div className="paiement" style={{ marginBottom: '32px' }}>
        <h2>{modeEdition ? 'Modifier la chambre' : 'Ajouter une chambre'}</h2>
        <form onSubmit={enregistrer} className="formulaire-vertical">
          <label>Numéro</label>
          <input
            name="numero"
            value={form.numero}
            onChange={modifier}
            placeholder="101"
            required
          />

          <label>Étage</label>
          <input
            type="number"
            name="etage"
            value={form.etage}
            onChange={modifier}
            min="0"
            required
          />

          <label>Type</label>
          <select name="id_type" value={form.id_type} onChange={modifier}>
            {types.map((t) => (
              <option key={t.id_type} value={t.id_type}>
                {t.libelle} ({Number(t.prix_nuit).toFixed(0)} €)
              </option>
            ))}
          </select>

          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={modifier}>
            <option value="disponible">Disponible</option>
            <option value="occupee">Occupée</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <label>Image de la chambre</label>
          <input
            type="file"
            accept="image/*"
            onChange={uploaderImage}
            disabled={uploadEnCours}
          />
          {uploadEnCours && <p>Upload en cours...</p>}
          {form.image && (
            <p style={{ color: 'green', fontSize: '13px' }}>
              ✅ Image uploadée : {form.image}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="submit">
              {modeEdition ? 'Enregistrer' : 'Ajouter'}
            </button>
            {modeEdition && (
              <button type="button" onClick={annulerEdition}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <h2>Liste des chambres ({chambres.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Numéro</th>
            <th>Étage</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chambres.map((c) => (
            <tr key={c.id_chambre}>
              <td>
                {c.image && (
                  <img
                      src={`${API_URL}/uploads/${c.image}`}
                      alt=""
                      style={{
                        width: '60px',
                        height: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                )}
              </td>
              <td>{c.numero}</td>
              <td>{c.etage}</td>
              <td>{c.type?.libelle}</td>
              <td>
                <span className={`statut statut-${c.statut}`}>
                  {c.statut}
                </span>
              </td>
              <td style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => editer(c)}>Modifier</button>
                <button onClick={() => supprimer(c.id_chambre)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}