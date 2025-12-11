import React, { useState } from 'react'
import './LoginScreen.css'

function LoginScreen({ authManager, onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isLogin) {
      // Login
      const result = authManager.login(email, password)
      if (result.success) {
        setSuccess(result.message)
        setTimeout(() => {
          onLogin(result.user)
        }, 500)
      } else {
        setError(result.message)
      }
    } else {
      // Registro
      const result = authManager.register(email, password, name)
      if (result.success) {
        setSuccess(result.message)
        // Faz login automático após registro
        setTimeout(() => {
          const loginResult = authManager.login(email, password)
          if (loginResult.success) {
            onLogin(loginResult.user)
          }
        }, 1000)
      } else {
        setError(result.message)
      }
    }

    setLoading(false)
  }

  const handleSwitchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setName('')
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🥗</div>
          <h1>Whis Diet</h1>
          <p className="login-subtitle">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                minLength={2}
                maxLength={30}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button"
            className="switch-mode-btn"
            onClick={handleSwitchMode}
          >
            {isLogin 
              ? 'Não tem conta? Cadastre-se' 
              : 'Já tem conta? Faça login'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen

