import { useEffect, useState } from 'react'
import { API_URL } from '../api.js'

const TYPE_VIDE = {
  libelle: '',
  description: '',
  prix_nuit: 0,
  capacite: 1,
}

export default function AdminTypes() {
  const [types, setTypes] = useState([])
  const [form, setForm] = useState(TYPE_VIDE)
  const [modeEdition, setModeEdition] = useState(null)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)

  const token = localStorage.getItem('token')

  async function charger() {
    setChargement(true)
    try {
      const rep = await fetch(`${API_URL}/type-chambre`)
      setTypes(await rep.json())
    } catch {
      setErreur('Impossible de charger les types')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => { charger() }, [])

  function modifier(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enregistrer(e) {
    e.preventDefault()
    setErreur('')

    const url = modeEdition
      ? `${API_URL}/type-chambre/${modeEdition}`
      : `${API_URL}/type-chambre`
    const methode = modeEdition ? 'PATCH' : 'POST'

    try {
      const rep = await fetch(url, {
        method: methode,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          libelle: form.libelle,
          description: form.description,
          prix_nuit: Number(form.prix_nuit),
          capacite: Number(form.capacite),
        }),
      })
      const data = await rep.json()
      if (!rep.ok) {
        setErreur(data.message || 'Enregistrement impossible')
        return
      }
      setForm(TYPE_VIDE)
      setModeEdition(null)
      charger()
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  async function supprimer(id) {
    if (
      !window.confirm(
        'Supprimer ce type ? Attention : les chambres liées seront orphelines.',
      )
    )
      return
    try {
      const rep = await fetch(`${API_URL}/type-chambre/${id}`, {
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

  function editer(type) {
    setForm({
      libelle: type.libelle,
      description: type.description || '',
      prix_nuit: type.prix_nuit,
      capacite: type.capacite,
    })
    setModeEdition(type.id_type)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function annulerEdition() {
    setForm(TYPE_VIDE)
    setModeEdition(null)
  }

  if (chargement) return <p>Chargement...</p>

  return (
    <div>
      <h1>Types de chambres et tarifs</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {/* Formulaire */}
      <div className="paiement" style={{ marginBottom: '32px' }}>
        <h2>{modeEdition ? 'Modifier le type' : 'Ajouter un type'}</h2>
        <form onSubmit={enregistrer} className="formulaire-vertical">
          <label>Libellé</label>
          <input
            name="libelle"
            value={form.libelle}
            onChange={modifier}
            placeholder="Simple, Double, Suite..."
            required
          />

          <label>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={modifier}
            placeholder="Description courte"
          />

          <label>Prix par nuit (€)</label>
          <input
            type="number"
            name="prix_nuit"
            value={form.prix_nuit}
            onChange={modifier}
            min="0"
            step="0.01"
            required
          />

          <label>Capacité (personnes)</label>
          <input
            type="number"
            name="capacite"
            value={form.capacite}
            onChange={modifier}
            min="1"
            required
          />

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
      <h2>Types existants ({types.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Description</th>
            <th>Prix / nuit</th>
            <th>Capacité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t.id_type}>
              <td>
                <strong>{t.libelle}</strong>
              </td>
              <td>{t.description || '—'}</td>
              <td>
                <strong>{Number(t.prix_nuit).toFixed(2)} €</strong>
              </td>
              <td>{t.capacite} pers.</td>
              <td style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => editer(t)}>Modifier</button>
                <button onClick={() => supprimer(t.id_type)}>
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