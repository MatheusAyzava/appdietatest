import React, { useState, useEffect } from 'react'
import './AchievementsPanel.css'

function AchievementsPanel({ socialManager, onClose }) {
  const [achievements, setAchievements] = useState(socialManager.achievements || [])

  useEffect(() => {
    setAchievements(socialManager.achievements || [])
  }, [socialManager])

  const allAchievements = [
    { id: 'water_master', name: 'Mestre da Água 💧', description: 'Bateu a meta de água!', icon: '💧' },
    { id: 'calorie_king', name: 'Rei das Calorias 🔥', description: 'Atingiu a meta de calorias!', icon: '🔥' },
    { id: 'week_warrior', name: 'Guerreiro da Semana ⭐', description: '7 dias seguidos de progresso!', icon: '⭐' },
    { id: 'month_champion', name: 'Campeão do Mês 🏆', description: '30 dias seguidos!', icon: '🏆' },
    { id: 'perfect_day', name: 'Dia Perfeito ✨', description: 'Bateu todas as metas em um dia!', icon: '✨' },
    { id: 'hydration_hero', name: 'Herói da Hidratação 🌊', description: 'Bebeu 3L de água em um dia!', icon: '🌊' }
  ]

  const hasAchievement = (id) => {
    return achievements.some(a => a.id === id)
  }

  return (
    <div className="achievements-overlay" onClick={onClose}>
      <div className="achievements-panel" onClick={(e) => e.stopPropagation()}>
        <div className="achievements-header">
          <h2>🏆 Conquistas</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="streak-display">
          <div className="streak-card">
            <span className="streak-icon">🔥</span>
            <div className="streak-info">
              <span className="streak-label">Sequência</span>
              <span className="streak-value">{socialManager.streak} dias</span>
            </div>
          </div>
        </div>

        <div className="achievements-list">
          {allAchievements.map(achievement => {
            const unlocked = hasAchievement(achievement.id)
            return (
              <div 
                key={achievement.id} 
                className={`achievement-item ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="achievement-info">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-desc">{achievement.description}</span>
                </div>
                {unlocked && (
                  <span className="unlocked-badge">✓</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AchievementsPanel

