import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Accueil from './pages/Accueil.jsx'
import Chambres from './pages/Chambres.jsx'
import Login from './pages/Login.jsx'
import Reservation from './pages/Reservation.jsx'

function RoutePrivee({ children }) {
  const utilisateur = localStorage.getItem('utilisateur')
  return utilisateur ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route
        element={
          <RoutePrivee>
            <Layout />
          </RoutePrivee>
        }
      >
        <Route path="/" element={<Accueil />} />
        <Route path="/chambres" element={<Chambres />} />
      </Route>
    </Routes>
  )
}

export default App