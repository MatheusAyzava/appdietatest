import React, { useState, useEffect } from 'react'
import './SocialFeed.css'

function SocialFeed({ socialManager }) {
  const [feed, setFeed] = useState([])
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    if (socialManager.currentGroup) {
      setFeed(socialManager.getSocialFeed())
      setRanking(socialManager.getGroupRanking())
    }
  }, [socialManager])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Agora'
    if (hours === 1) return '1 hora atrás'
    return `${hours} horas atrás`
  }

  if (!socialManager.currentGroup) {
    return (
      <div className="social-feed-empty">
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum grupo ativo</h3>
          <p>Junte-se a um grupo ou crie um novo para começar a compartilhar seu progresso!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="social-feed">
      <div className="ranking-section">
        <h3>🏆 Ranking do Grupo</h3>
        <div className="ranking-list">
          {ranking.map((member, index) => (
            <div 
              key={member.id} 
              className={`ranking-item ${member.id === socialManager.userProfile.id ? 'current-user' : ''}`}
            >
              <div className="rank-position">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
              </div>
              <div className="member-info">
                <div className="member-avatar-container">
                  <div className="member-avatar">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder">{member.name.charAt(0)}</div>
                    )}
                  </div>
                  {member.isOnline && (
                    <span className="online-status-dot-small"></span>
                  )}
                </div>
                <div className="member-details">
                  <div className="member-name-row">
                    <span className="member-name">{member.name}</span>
                    {member.isOnline && (
                      <span className="online-badge">🟢</span>
                    )}
                  </div>
                  <div className="member-stats">
                    <span className="progress-badge">{member.progress}%</span>
                    <span className="streak-badge">🔥 {member.streak} dias</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-mini">
                <div 
                  className="progress-fill-mini"
                  style={{ width: `${member.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feed-section">
        <h3>📱 Atualizações do Grupo</h3>
        <div className="feed-list">
          {feed.map(update => (
            <div key={update.id} className="feed-item">
              <div className="feed-icon">
                {update.type === 'water_goal' && '🌊'}
                {update.type === 'calorie_goal' && '🔥'}
                {update.type === 'meal_logged' && '🥗'}
                {update.type === 'exercise' && '💪'}
              </div>
              <div className="feed-content">
                <p className="feed-message">{update.message}</p>
                <span className="feed-time">{formatTime(update.timestamp)}</span>
              </div>
            </div>
          ))}
          {feed.length === 0 && (
            <p className="no-updates">Nenhuma atualização ainda. Seja o primeiro a compartilhar!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialFeed

