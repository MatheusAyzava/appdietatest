import React, { useState, useEffect } from 'react'
import SettingsPanel from './SettingsPanel'
import FoodSearch from './FoodSearch'
import AchievementsPanel from './AchievementsPanel'
import VirtualCoach from './VirtualCoach'
import './DietDashboard.css'

function DietDashboard({ dietManager, socialManager, onAddMeal, onAddWater }) {
  const [stats, setStats] = useState(dietManager.getStats())
  const [showMealForm, setShowMealForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showFoodSearch, setShowFoodSearch] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [mealName, setMealName] = useState('')
  const [mealCalories, setMealCalories] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [mood, setMood] = useState(null)
  const [quickMealType, setQuickMealType] = useState(null)
  const [showWaterMLModal, setShowWaterMLModal] = useState(false)
  const [waterML, setWaterML] = useState('')
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('whis_user_name') || 'Usuário'
  })

  // Atualiza o nome quando mudar no localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'whis_user_name' || !e.key) {
        const newName = localStorage.getItem('whis_user_name')
        if (newName && newName !== userName) {
          setUserName(newName)
        }
      }
    }

    // Escuta mudanças no localStorage (entre abas)
    window.addEventListener('storage', handleStorageChange)
    
    // Escuta eventos customizados (mesma aba)
    window.addEventListener('userNameChanged', handleStorageChange)
    
    // Verifica mudanças periodicamente (fallback)
    const interval = setInterval(() => {
      const currentName = localStorage.getItem('whis_user_name')
      if (currentName && currentName !== userName) {
        setUserName(currentName)
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userNameChanged', handleStorageChange)
      clearInterval(interval)
    }
  }, [userName])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(dietManager.getStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [dietManager])

  // Gera mensagem do coach
  const getCoachMessage = () => {
    const hour = new Date().getHours()
    let message = ''

    if (stats.waterPercentage < 30) {
      message = '💧 Você bebeu pouca água até agora. Que tal um copo antes do almoço?'
    } else if (stats.waterPercentage >= 100) {
      message = '🎉 Parabéns! Você atingiu sua meta de água hoje! Continue assim!'
    } else if (stats.percentage >= 90 && stats.percentage < 100) {
      message = `⚠️ Você está quase atingindo sua meta! Faltam apenas ${stats.remaining} kcal!`
    } else if (stats.percentage >= 100) {
      message = '🎊 Incrível! Você atingiu sua meta de calorias! Você está no caminho certo!'
    } else if (stats.mealsToday === 0) {
      message = '🍽️ Que tal registrar sua primeira refeição do dia?'
    } else if (socialManager && socialManager.currentGroup) {
      message = '👥 Seu grupo está ativo hoje! Vá dar um oi!'
    } else {
      message = '💪 Você está fazendo um ótimo trabalho! Continue assim!'
    }

    return message
  }

  // Gera mensagem motivacional para calorias
  const getCalorieMotivation = () => {
    if (stats.remaining > 0) {
      return `Você está no controle — ainda restam ${stats.remaining} kcal.`
    } else if (stats.remaining === 0) {
      return 'Perfeito! Você atingiu sua meta exata! 🎯'
    } else {
      return `Você ultrapassou em ${Math.abs(stats.remaining)} kcal. Tudo bem, amanhã é um novo dia!`
    }
  }

  // Gera mensagem motivacional para água
  const getWaterMotivation = () => {
    const remainingGlasses = stats.waterGoal - stats.waterGlasses
    const remainingLiters = (stats.waterGoalLiters || 2) - (stats.waterConsumedLiters || (stats.waterGlasses * (stats.glassSizeML || 250) / 1000))
    
    if (remainingLiters > 0) {
      return `Faltam ${remainingLiters.toFixed(1)}L (${remainingGlasses} copo${remainingGlasses > 1 ? 's' : ''}) para bater sua meta 💧`
    } else {
      return 'Meta de água concluída! Hidratação em dia! 💙'
    }
  }

  // Gera mensagem de humor
  const getMoodMessage = () => {
    const moodMessages = {
      '😊': 'Você está animada! Ótimo momento para treinar 💪',
      '😐': 'Tudo bem. Foque nos seus objetivos!',
      '😔': 'Você se sente sonolenta hoje. Talvez um alongamento ajude.',
      '😴': 'Descanse bem! Sono é importante para a dieta.',
      '😋': 'Apetite em dia! Controle as porções.',
      '💪': 'Você está motivada! Perfeito para seguir a dieta!'
    }
    return mood ? moodMessages[mood] : 'Como você está se sentindo hoje?'
  }

  // Conquistas recentes
  const getRecentAchievements = () => {
    const achievements = []
    if (socialManager && socialManager.streak >= 5) {
      achievements.push({
        icon: '🏅',
        text: `${socialManager.streak} dias de consistência!`
      })
    }
    if (stats.waterPercentage >= 100) {
      achievements.push({
        icon: '💧',
        text: 'Meta de água concluída hoje!'
      })
    }
    if (stats.percentage >= 100) {
      achievements.push({
        icon: '🔥',
        text: 'Meta de calorias atingida!'
      })
    }
    return achievements.slice(0, 3)
  }

  // Agenda do dia
  const getDailyChecklist = () => {
    return [
      { id: 1, text: 'Beber 8 copos de água', completed: stats.waterGlasses >= stats.waterGoal },
      { id: 2, text: 'Registrar todas as refeições', completed: stats.mealsToday >= 3 },
      { id: 3, text: 'Manter dentro da meta de calorias', completed: stats.percentage <= 100 },
      { id: 4, text: 'Registrar humor do dia', completed: mood !== null }
    ]
  }

  // Atualizações do grupo
  const getGroupUpdates = () => {
    if (!socialManager || !socialManager.currentGroup) return []
    const feed = socialManager.getSocialFeed()
    return feed.slice(0, 2)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
      const result = await dietManager.analyzeFoodImage(file)
      if (result) {
        setMealName(result.name)
        setMealCalories(result.calories.toString())
      }
    }
  }

  const handleSubmitMeal = (e) => {
    e.preventDefault()
    if (mealName && mealCalories) {
      onAddMeal(mealName, mealCalories, selectedImage)
      setMealName('')
      setMealCalories('')
      setSelectedImage(null)
      setShowMealForm(false)
      setQuickMealType(null)
    }
  }

  const handleFoodSelect = (name, calories) => {
    setMealName(name)
    setMealCalories(calories)
    setShowFoodSearch(false)
    setShowMealForm(true)
  }

  const handleQuickMeal = (type) => {
    setQuickMealType(type)
    setShowMealForm(true)
  }

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood)
    localStorage.setItem('whis_mood_' + new Date().toLocaleDateString('pt-BR'), selectedMood)
  }

  const handleUpdateStats = () => {
    setStats(dietManager.getStats())
  }

  const getCalorieColor = () => {
    if (stats.percentage >= 100) return '#FF6B9D'
    if (stats.percentage >= 80) return '#FFC857'
    return '#4ECDC4'
  }

  const getWaterColor = () => {
    if (stats.waterPercentage >= 100) return '#4ECDC4'
    if (stats.waterPercentage >= 50) return '#95E1D3'
    return '#7F8C8D'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) return 'Bom dia'
    if (hour >= 12 && hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getDayProgress = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const dayMinutes = 24 * 60
    return Math.round((totalMinutes / dayMinutes) * 100)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Agora'
    if (hours === 1) return '1h atrás'
    return `${hours}h atrás`
  }

  return (
    <div className="diet-dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-greeting">
            {getGreeting()}, {userName}! {(() => {
              const hour = new Date().getHours()
              return hour >= 6 && hour < 12 ? '🌤' : hour >= 12 && hour < 18 ? '☀️' : '🌙'
            })()}
          </h1>
          <p className="hero-subtitle">Hoje você tem 3 metas principais</p>
          <div className="hero-summary">
            <div className="summary-item">
              <span className="summary-icon">💧</span>
              <span>Você bebeu {stats.waterConsumedLiters ? stats.waterConsumedLiters.toFixed(1) : (stats.waterGlasses * (stats.glassSizeML || 250) / 1000).toFixed(1)}/{stats.waterGoalLiters || 2}L ({stats.waterGlasses}/{stats.waterGoal} copos) hoje</span>
            </div>
            {socialManager && socialManager.currentGroup && (
              <div className="summary-item">
                <span className="summary-icon">👥</span>
                <span>Seu grupo está ativo hoje!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coach Card */}
      <div className="coach-card">
        <div className="coach-icon">🤖</div>
        <div className="coach-content">
          <h3>💬 Dica do dia</h3>
          <p>{getCoachMessage()}</p>
        </div>
      </div>

      {/* Metas do Dia - Cards Melhorados */}
      <div className="goals-grid">
        <div className="goal-card calories-goal">
          <div className="goal-icon">🔥</div>
          <div className="goal-content">
            <h3>Calorias</h3>
            <div className="goal-progress-circle">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-circle"
                  stroke="#E8E8E8"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring-fill"
                  stroke={getCalorieColor()}
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - stats.percentage / 100)}`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{Math.round(stats.percentage)}%</span>
              </div>
            </div>
            <div className="goal-stats">
              <span className="goal-value">{stats.currentCalories} / {stats.dailyLimit} kcal</span>
              <p className="goal-motivation">{getCalorieMotivation()}</p>
            </div>
          </div>
        </div>

        <div className="goal-card water-goal">
          <div className="goal-icon">💧</div>
          <div className="goal-content">
            <h3>Água</h3>
            <div className="goal-progress-circle">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-circle"
                  stroke="#E8E8E8"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring-fill"
                  stroke={getWaterColor()}
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - stats.waterPercentage / 100)}`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{Math.round(stats.waterPercentage)}%</span>
              </div>
            </div>
            <div className="goal-stats">
              <span className="goal-value">
                {stats.waterConsumedLiters ? stats.waterConsumedLiters.toFixed(1) : (stats.waterGlasses * (stats.glassSizeML || 250) / 1000).toFixed(1)} / {stats.waterGoalLiters || 2}L
              </span>
              <span className="goal-value-secondary">
                ({stats.waterGlasses} / {stats.waterGoal} copos)
              </span>
              <p className="goal-motivation">{getWaterMotivation()}</p>
              <div className="water-actions">
                <button className="goal-action-btn" onClick={onAddWater}>
                  + Copo ({stats.glassSizeML || 250}ml)
                </button>
                <button 
                  className="goal-action-btn-secondary" 
                  onClick={() => setShowWaterMLModal(true)}
                >
                  + Adicionar ML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos de Refeição */}
      <div className="quick-meals-section">
        <h3>🍽️ Refeição Rápida</h3>
        <div className="quick-meals-grid">
          <button className="quick-meal-btn" onClick={() => handleQuickMeal('breakfast')}>
            <span className="quick-meal-icon">🍳</span>
            <span>Café da manhã</span>
          </button>
          <button className="quick-meal-btn" onClick={() => handleQuickMeal('lunch')}>
            <span className="quick-meal-icon">🍝</span>
            <span>Almoço</span>
          </button>
          <button className="quick-meal-btn" onClick={() => handleQuickMeal('dinner')}>
            <span className="quick-meal-icon">🥗</span>
            <span>Jantar</span>
          </button>
          <button className="quick-meal-btn" onClick={() => handleQuickMeal('snack')}>
            <span className="quick-meal-icon">🍎</span>
            <span>Lanche</span>
          </button>
        </div>
      </div>

      {/* Gráfico do Dia */}
      <div className="chart-section">
        <h3>📊 Progresso do Dia</h3>
        <div className="day-chart">
          <div className="chart-item">
            <div className="chart-label">Dia</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar day-bar"
                style={{ width: `${getDayProgress()}%` }}
              ></div>
            </div>
            <div className="chart-value">{getDayProgress()}%</div>
          </div>
          <div className="chart-item">
            <div className="chart-label">Calorias</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar calories-bar"
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              ></div>
            </div>
            <div className="chart-value">{Math.round(stats.percentage)}%</div>
          </div>
          <div className="chart-item">
            <div className="chart-label">Água</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar water-bar"
                style={{ width: `${Math.min(stats.waterPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="chart-value">{Math.round(stats.waterPercentage)}%</div>
          </div>
        </div>
      </div>

      {/* Agenda do Dia */}
      <div className="checklist-section">
        <h3>📅 Agenda do Dia</h3>
        <div className="checklist">
          {getDailyChecklist().map(item => (
            <div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
              <span className="checklist-icon">
                {item.completed ? '✓' : '○'}
              </span>
              <span className="checklist-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Humor + Energia Melhorado */}
      <div className="mood-section-enhanced">
        <h3>🧠 Como você está se sentindo?</h3>
        <div className="mood-buttons">
          {['😊', '😐', '😔', '😴', '😋', '💪'].map(emoji => (
            <button
              key={emoji}
              className={`mood-btn ${mood === emoji ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
        <p className="mood-message">{getMoodMessage()}</p>
      </div>

      {/* Widget Social Mini */}
      {socialManager && socialManager.currentGroup && (
        <div className="social-widget">
          <h3>🔔 Atualizações do Grupo</h3>
          <div className="social-updates">
            {getGroupUpdates().map(update => (
              <div key={update.id} className="social-update-item">
                <span className="update-icon">
                  {update.type === 'water_goal' && '🌊'}
                  {update.type === 'calorie_goal' && '🔥'}
                  {update.type === 'meal_logged' && '🥗'}
                </span>
                <span className="update-text">{update.message}</span>
                <span className="update-time">{formatTime(update.timestamp)}</span>
              </div>
            ))}
            {getGroupUpdates().length === 0 && (
              <p className="no-updates">Nenhuma atualização ainda</p>
            )}
          </div>
        </div>
      )}

      {/* Conquistas Recentes */}
      {getRecentAchievements().length > 0 && (
        <div className="achievements-widget">
          <h3>⭐ Conquistas Recentes</h3>
          <div className="achievements-list">
            {getRecentAchievements().map((achievement, index) => (
              <div key={index} className="achievement-badge">
                <span className="achievement-icon">{achievement.icon}</span>
                <span className="achievement-text">{achievement.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Refeição */}
      {showMealForm && (
        <div className="meal-form">
          <h3>
            {quickMealType === 'breakfast' && '🍳 Café da manhã'}
            {quickMealType === 'lunch' && '🍝 Almoço'}
            {quickMealType === 'dinner' && '🥗 Jantar'}
            {quickMealType === 'snack' && '🍎 Lanche'}
            {!quickMealType && 'Adicionar Refeição'}
          </h3>
          <form onSubmit={handleSubmitMeal}>
            <div className="image-upload">
              <label htmlFor="food-image" className="upload-label">
                {selectedImage ? (
                  <img src={selectedImage} alt="Comida" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    📷 Clique para adicionar foto
                  </div>
                )}
              </label>
              <input
                id="food-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            <div className="input-with-search">
              <input
                type="text"
                placeholder="Nome da refeição (ex: Arroz com frango)"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                required
              />
              <button
                type="button"
                className="search-food-btn"
                onClick={() => setShowFoodSearch(true)}
                title="Pesquisar alimento"
              >
                🔍
              </button>
            </div>
            
            <input
              type="number"
              placeholder="Calorias"
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              required
              min="0"
            />
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Adicionar Refeição
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowMealForm(false)
                  setQuickMealType(null)
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Refeições */}
      <div className="meals-list">
        <h3>Refeições de Hoje ({stats.mealsToday})</h3>
        {dietManager.meals
          .filter(m => m.date === new Date().toLocaleDateString('pt-BR'))
          .map(meal => (
            <div key={meal.id} className="meal-item">
              {meal.image && (
                <img src={meal.image} alt={meal.name} className="meal-image" />
              )}
              <div className="meal-info">
                <span className="meal-name">{meal.name}</span>
                <span className="meal-time">
                  {new Date(meal.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <span className="meal-calories">{meal.calories} kcal</span>
            </div>
          ))}
        {stats.mealsToday === 0 && (
          <p className="no-meals">Nenhuma refeição registrada hoje. Adicione sua primeira refeição!</p>
        )}
      </div>

      {/* Dock de Navegação Inferior */}
      <div className="bottom-dock">
        <button className="dock-btn" onClick={() => setShowMealForm(!showMealForm)}>
          <span className="dock-icon">🍽️</span>
          <span className="dock-label">Refeição</span>
        </button>
        <button className="dock-btn" onClick={onAddWater}>
          <span className="dock-icon">💧</span>
          <span className="dock-label">Água</span>
        </button>
        <button className="dock-btn" onClick={() => setShowAchievements(true)}>
          <span className="dock-icon">🏆</span>
          <span className="dock-label">Conquistas</span>
        </button>
        <button className="dock-btn" onClick={() => setShowSettings(true)}>
          <span className="dock-icon">⚙️</span>
          <span className="dock-label">Config</span>
        </button>
      </div>

      {/* Modais */}
      {showSettings && (
        <SettingsPanel
          dietManager={dietManager}
          socialManager={socialManager}
          onClose={() => setShowSettings(false)}
          onUpdate={handleUpdateStats}
        />
      )}

      {showFoodSearch && (
        <FoodSearch
          onSelectFood={handleFoodSelect}
          onClose={() => setShowFoodSearch(false)}
        />
      )}

      {showAchievements && socialManager && (
        <AchievementsPanel
          socialManager={socialManager}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Modal para adicionar ML de água */}
      {showWaterMLModal && (
        <div className="modal-overlay" onClick={() => setShowWaterMLModal(false)}>
          <div className="modal-content water-ml-modal" onClick={(e) => e.stopPropagation()}>
            <h3>💧 Adicionar Água</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (waterML && parseInt(waterML) > 0) {
                const response = dietManager.addWaterML(parseInt(waterML))
                setWaterML('')
                setShowWaterMLModal(false)
                handleUpdateStats()
              }
            }}>
              <div className="form-group">
                <label>Quantos ML você bebeu?</label>
                <input
                  type="number"
                  value={waterML}
                  onChange={(e) => setWaterML(e.target.value)}
                  placeholder="Ex: 300"
                  min="1"
                  max="1000"
                  step="50"
                  autoFocus
                  required
                />
                <p className="setting-hint">
                  Tamanho do seu copo: {stats.glassSizeML || 250}ml
                </p>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-modal-btn">
                  Adicionar
                </button>
                <button 
                  type="button" 
                  className="cancel-modal-btn"
                  onClick={() => {
                    setShowWaterMLModal(false)
                    setWaterML('')
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DietDashboard
