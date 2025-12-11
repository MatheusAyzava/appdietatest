import React, { useState } from 'react'
import './WelcomeModal.css'

function WelcomeModal({ onComplete }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Por favor, insira seu nome')
      return
    }

    if (name.trim().length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres')
      return
    }

    // Salva o nome no localStorage
    localStorage.setItem('whis_user_name', name.trim())
    localStorage.setItem('whis_welcome_completed', 'true')
    
    // Chama callback para atualizar o estado
    onComplete(name.trim())
  }

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <div className="welcome-header">
          <div className="welcome-icon">👋</div>
          <h2>Bem-vindo ao Whis Diet!</h2>
          <p className="welcome-subtitle">
            Vamos começar personalizando sua experiência
          </p>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="form-group">
            <label htmlFor="user-name">Qual é o seu nome?</label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Digite seu nome aqui"
              autoFocus
              maxLength={30}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="welcome-submit-btn">
            Começar 🚀
          </button>
        </form>

        <p className="welcome-note">
          Seu nome será usado para personalizar suas mensagens e estatísticas
        </p>
      </div>
    </div>
  )
}

export default WelcomeModal

