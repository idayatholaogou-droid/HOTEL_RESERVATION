import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../api.js'

export default function DetailChambre() {
  const { id } = useParams()
  const navigate = useNavigate()
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const aujourdhui = new Date().toISOString().slice(0, 10)

  const [chambre, setChambre] = useState(null)
  const [avis, setAvis] = useState({ moyenne: 0, total: 0, avis: [] })
  const [dateArrivee, setDateArrivee] = useState('')
  const [dateDepart, setDateDepart] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  useEffect(() => {
    async function charger() {
      try {
        const [repChambre, repAvis] = await Promise.all([
          fetch(`${API_URL}/chambre/${id}`),
          fetch(`${API_URL}/reservation/avis/chambre/${id}`),
        ])
        if (!repChambre.ok) throw new Error()
        setChambre(await repChambre.json())
        if (repAvis.ok) setAvis(await repAvis.json())
      } catch {
        setErreur('Impossible de charger la chambre')
      }
    }
    charger()
  }, [id])

  async function reserver(e) {
    e.preventDefault()
    setErreur('')
    setSucces('')

    if (utilisateur.role !== 'client') {
      setErreur('Seul un client peut réserver en ligne')
      return
    }

    try {
      const reponse = await fetch(`${API_URL}/reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          date_arrivee: dateArrivee,
          date_depart: dateDepart,
          id_chambre: Number(id),
        }),
      })
      const data = await reponse.json()
      if (!reponse.ok) {
        setErreur(data.message || 'Réservation impossible')
        return
      }
      navigate(`/paiement/${data.id_reservation}`)
    } catch {
      setErreur('Le serveur ne répond pas')
    }
  }

  if (!chambre) {
    return (
      <div>
        <button onClick={() => navigate('/chambres')}>Retour</button>
        <p>{erreur || 'Chargement...'}</p>
      </div>
    )
  }

  const chambreIndisponible =
    chambre.statut === 'occupee' || chambre.statut === 'maintenance'

  return (
    <div>
      <button onClick={() => navigate('/chambres')}>Retour</button>
      <h1>Chambre {chambre.numero}</h1>

      <div className="detail">
        {chambre.image ? (
          <img
            src={`${API_URL}/uploads/${chambre.image}`}
            alt={`Chambre ${chambre.numero}`}
          />
        ) : (
          <div className="detail-sans-image">Pas d'image</div>
        )}

        <div>
          <h2>Informations</h2>
          <p>Type : {chambre.type?.libelle}</p>
          <p>Description : {chambre.type?.description}</p>
          <p>Étage : {chambre.etage}</p>
          <p>Capacité : {chambre.type?.capacite} personne(s)</p>
          <p>Prix par nuit : {Number(chambre.type?.prix_nuit).toFixed(0)} €</p>
          <p>
            Statut :{' '}
            <span className={`statut statut-${chambre.statut}`}>
              {chambre.statut}
            </span>
          </p>

          <h2>Réserver cette chambre</h2>

          {/* 🚫 Chambre occupée ou maintenance → message */}
          {chambreIndisponible ? (
            <div
              style={{
                padding: '20px',
                background:
                  chambre.statut === 'occupee' ? '#fee2e2' : '#fef3c7',
                border: `1px solid ${
                  chambre.statut === 'occupee' ? '#fca5a5' : '#fcd34d'
                }`,
                borderRadius: '8px',
                color:
                  chambre.statut === 'occupee' ? '#991b1b' : '#92400e',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              {chambre.statut === 'occupee'
                ? '🚫 Cette chambre est actuellement occupée.'
                : '🔧 Cette chambre est en maintenance.'}
              <br />
              <span style={{ fontWeight: 'normal', fontSize: '14px' }}>
                Elle sera à nouveau disponible prochainement.
              </span>
            </div>
          ) : (
            /* ✅ Chambre disponible → formulaire */
            <form onSubmit={reserver} className="formulaire-vertical">
              <label>Date d'arrivée</label>
              <input
                type="date"
                min={aujourdhui}
                value={dateArrivee}
                onChange={(e) => setDateArrivee(e.target.value)}
                required
              />

              <label>Date de départ</label>
              <input
                type="date"
                min={dateArrivee || aujourdhui}
                value={dateDepart}
                onChange={(e) => setDateDepart(e.target.value)}
                required
              />

              {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
              {succes && <p style={{ color: 'green' }}>{succes}</p>}
              <button type="submit">Réserver</button>
            </form>
          )}

          {/* ======================
              SECTION AVIS
              ====================== */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '2px solid var(--or)',
            }}
          >
            <h2>Avis des clients</h2>

            {avis.total === 0 ? (
              <p style={{ color: '#6b7280' }}>
                Aucun avis pour le moment.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                  <strong>⭐ {avis.moyenne}/5</strong> — basé sur {avis.total}{' '}
                  avis
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {avis.avis.map((a) => (
                    <div
                      key={a.id_reservation}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid var(--bordure)',
                        borderRadius: '8px',
                        background: 'white',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <strong>
                          {a.client?.prenom} {a.client?.nom}
                        </strong>
                        <span style={{ color: 'var(--or-fonce)' }}>
                          {'⭐'.repeat(a.note)}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: '#6b7280' }}>
                        {a.commentaire}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}