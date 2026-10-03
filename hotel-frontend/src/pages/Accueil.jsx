export default function Accueil() {
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur'))

  return (
    <div>
      <h1>Accueil</h1>
      <p>
        Bienvenue {utilisateur?.prenom} {utilisateur?.nom} ({utilisateur?.role})
      </p>
    </div>
  )
}