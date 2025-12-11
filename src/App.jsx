import React, { useState, useEffect, useRef } from 'react'
import DietDashboard from './components/DietDashboard'
import VoiceAssistant from './components/VoiceAssistant'
import SocialFeed from './components/SocialFeed'
import GroupManager from './components/GroupManager'
import VirtualCoach from './components/VirtualCoach'
import WelcomeModal from './components/WelcomeModal'
import LoginScreen from './components/LoginScreen'
import DietManager from './utils/DietManager'
import SocialManager from './utils/SocialManager'
import AuthManager from './utils/AuthManager'
import './App.css'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard') // dashboard, social
  const [currentUser, setCurrentUser] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const authManager = useRef(new AuthManager())
  const dietManager = useRef(null)
  const socialManager = useRef(null)

  // Verifica se há usuário logado ao iniciar
  useEffect(() => {
    const user = authManager.current.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      initializeManagers(user.email)
    }
  }, [])

  // Inicializa managers com o e-mail do usuário
  const initializeManagers = (email) => {
    dietManager.current = new DietManager(email)
    socialManager.current = new SocialManager(email)
    
    // Atualiza status online
    if (socialManager.current.currentGroup) {
      socialManager.current.updateOnlineStatus(true)
    }
    
    // Verifica e reseta dados diários se necessário
    const today = new Date().toLocaleDateString('pt-BR')
    const lastReset = localStorage.getItem(`last_reset_date_${email}`)
    if (lastReset !== today) {
      dietManager.current.resetDailyData()
      localStorage.setItem(`last_reset_date_${email}`, today)
    }

    // Solicita permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Atualiza status online periodicamente
    const onlineInterval = setInterval(() => {
      if (socialManager.current && socialManager.current.currentGroup) {
        socialManager.current.updateOnlineStatus(true)
      }
    }, 30000) // A cada 30 segundos

    // Limpa intervalo ao desmontar
    return () => clearInterval(onlineInterval)
  }

  // Handler de login
  const handleLogin = (user) => {
    setCurrentUser(user)
    initializeManagers(user.email)
    
    // Verifica se precisa mostrar welcome (primeira vez)
    const welcomeCompleted = localStorage.getItem(`whis_welcome_completed_${user.email}`)
    if (!welcomeCompleted) {
      setShowWelcome(true)
    }
  }

  // Handler de logout
  const handleLogout = () => {
    authManager.current.logout()
    setCurrentUser(null)
    dietManager.current = null
    socialManager.current = null
  }

  const handleAddMeal = (name, calories, image) => {
    if (!dietManager.current) return
    const response = dietManager.current.addMeal(name, calories, image)
    const stats = dietManager.current.getStats()
    
    // Atualiza progresso social
    if (socialManager.current) {
      socialManager.current.updateProgress(stats)
      socialManager.current.incrementStreak()
    }
    
    console.log(response)
  }

  const handleAddWater = () => {
    if (!dietManager.current) return
    const response = dietManager.current.addWaterGlass()
    const stats = dietManager.current.getStats()
    
    // Atualiza progresso social
    if (socialManager.current) {
      socialManager.current.updateProgress(stats)
      socialManager.current.incrementStreak()
    }
    
    console.log(response)
  }

  const handleGroupChange = () => {
    // Força atualização quando grupo muda
    setCurrentView(currentView)
  }

  const handleWelcomeComplete = (userName) => {
    setShowWelcome(false)
    if (currentUser) {
      localStorage.setItem(`whis_welcome_completed_${currentUser.email}`, 'true')
    }
    // Força atualização do dashboard para mostrar o novo nome
    window.dispatchEvent(new CustomEvent('userNameChanged', { 
      detail: { name: userName } 
    }))
  }

  const handleVoiceCommand = (text) => {
    const msg = text.toLowerCase().trim()

    // Comandos de dieta por voz
    if (msg.includes('adicionar refeição') || msg.includes('adicionar comida') || msg.includes('comi')) {
      const match = text.match(/(?:comi|adicionar refeição|adicionar comida)\s+(.+?)\s+(?:com|de|tem)\s+(\d+)\s*(?:calorias|kcal|cal)/i)
      if (match) {
        const name = match[1].trim()
        const calories = match[2].trim()
        handleAddMeal(name, calories)
        return
      }
    }

    if (msg.includes('tomar água') || msg.includes('água') || msg.includes('bebi água')) {
      handleAddWater()
      return
    }
  }


  // Se não estiver logado, mostra tela de login
  if (!currentUser) {
    return (
      <LoginScreen 
        authManager={authManager.current}
        onLogin={handleLogin}
      />
    )
  }

  return (
    <div className="app">
      {showWelcome && (
        <WelcomeModal onComplete={handleWelcomeComplete} />
      )}

      <div className="app-header">
        <div className="app-logo">
          <div className="logo-icon">🥗</div>
        </div>
        <div className="header-content">
          <h1>Whis Diet</h1>
          <p className="subtitle">Seu Assistente Pessoal de Dieta</p>
        </div>
        <div className="user-info">
          <span className="user-name">{currentUser.name}</span>
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            🚪
          </button>
        </div>
      </div>

      <div className="view-selector">
        <button 
          className={`view-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`view-btn ${currentView === 'social' ? 'active' : ''}`}
          onClick={() => setCurrentView('social')}
        >
          👥 Social
        </button>
      </div>
      
      {dietManager.current && socialManager.current && (
        <>
          {currentView === 'dashboard' ? (
            <DietDashboard
              dietManager={dietManager.current}
              socialManager={socialManager.current}
              onAddMeal={handleAddMeal}
              onAddWater={handleAddWater}
            />
          ) : (
            <>
              <GroupManager
                socialManager={socialManager.current}
                onGroupChange={handleGroupChange}
              />
              <SocialFeed socialManager={socialManager.current} />
            </>
          )}
          
          <VirtualCoach
            dietManager={dietManager.current}
            socialManager={socialManager.current}
          />
          
          <VoiceAssistant
            onVoiceInput={handleVoiceCommand}
            isListening={isListening}
            setIsListening={setIsListening}
          />
        </>
      )}
    </div>
  )
}

export default App

