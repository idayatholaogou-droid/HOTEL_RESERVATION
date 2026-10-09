import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Accueil from './pages/Accueil.jsx'
import Chambres from './pages/Chambres.jsx'
import Clients from './pages/Clients.jsx'
import DetailChambre from './pages/DetailChambre.jsx'
import Inscription from './pages/inscription.jsx'
import Login from './pages/Login.jsx'
import Reservation from './pages/Reservation.jsx'
import Admin from './pages/Admin.jsx'
import Planning from './pages/Planning.jsx'
import MesReservations from './pages/MesReservations.jsx'
import Paiement from './pages/Paiement.jsx'
import AdminChambres from './pages/AdminChambres.jsx'
import AdminTypes from './pages/AdminTypes.jsx'
import ReservationComptoir from './pages/ReservationComptoir.jsx'
import AdminUtilisateurs from './pages/AdminUtilisateurs.jsx'

function RoutePrivee({ children }) {
  const utilisateur = localStorage.getItem('utilisateur')
  return utilisateur ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route
        element={
          <RoutePrivee>
            <Layout />
          </RoutePrivee>
        }
      >
        <Route path="/" element={<Accueil />} />
        <Route path="/chambres" element={<Chambres />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation/:id" element={<DetailChambre />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/paiement/:id" element={<Paiement />} />
        <Route path="/admin/chambres" element={<AdminChambres />} />
        <Route path="/admin/types" element={<AdminTypes />} />
        <Route path="/reservation/comptoir" element={<ReservationComptoir />} />
        <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
      </Route>
    </Routes>
  )
}

export default App