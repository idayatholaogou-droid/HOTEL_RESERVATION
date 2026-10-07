import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class AfficheErreur extends Component {
  state = { erreur: null }

  static getDerivedStateFromError(erreur) {
    return { erreur }
  }

  render() {
    if (this.state.erreur) {
      return (
        <pre style={{ padding: 16, color: 'red', whiteSpace: 'pre-wrap' }}>
          {String(this.state.erreur.stack || this.state.erreur)}
        </pre>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AfficheErreur>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AfficheErreur>
  </StrictMode>,
)