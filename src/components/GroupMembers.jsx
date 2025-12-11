import React, { useState, useEffect } from 'react'
import './GroupMembers.css'

function GroupMembers({ socialManager, onUpdate }) {
  const [members, setMembers] = useState([])
  const [showAdminMenu, setShowAdminMenu] = useState(null)

  useEffect(() => {
    if (socialManager.currentGroup) {
      const groupMembers = socialManager.getGroupMembers()
      setMembers(groupMembers)
    }

    // Atualiza status online periodicamente
    const interval = setInterval(() => {
      if (socialManager.currentGroup) {
        socialManager.updateOnlineStatus(true)
        const updatedMembers = socialManager.getGroupMembers()
        setMembers(updatedMembers)
      }
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [socialManager])

  const isAdmin = socialManager.isAdmin()
  const currentUserId = socialManager.userProfile.id

  const handleSetAdmin = (memberId, makeAdmin) => {
    const result = socialManager.setAdmin(memberId, makeAdmin)
    if (result.success) {
      const updatedMembers = socialManager.getGroupMembers()
      setMembers(updatedMembers)
      setShowAdminMenu(null)
      onUpdate()
    } else {
      alert(result.message)
    }
  }

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Tem certeza que deseja remover este membro do grupo?')) {
      const result = socialManager.removeMember(memberId)
      if (result.success) {
        const updatedMembers = socialManager.getGroupMembers()
        setMembers(updatedMembers)
        onUpdate()
      } else {
        alert(result.message)
      }
    }
  }

  const getTimeAgo = (lastSeen) => {
    if (!lastSeen) return 'Nunca'
    const date = new Date(lastSeen)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffMinutes < 5) return 'Online agora'
    if (diffMinutes < 60) return `${diffMinutes} min atrás`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h atrás`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`
  }

  if (!socialManager.currentGroup) {
    return null
  }

  const onlineMembers = members.filter(m => m.isOnline)
  const offlineMembers = members.filter(m => !m.isOnline)

  return (
    <div className="group-members-section">
      <div className="members-header">
        <h3>👥 Membros do Grupo</h3>
        <div className="online-indicator">
          <span className="online-dot"></span>
          <span>{onlineMembers.length} online</span>
        </div>
      </div>

      <div className="members-list">
        {/* Membros Online */}
        {onlineMembers.length > 0 && (
          <div className="members-group">
            <h4 className="members-group-title">🟢 Online ({onlineMembers.length})</h4>
            {onlineMembers.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar-container">
                  <div className="member-avatar">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder">{member.name.charAt(0)}</div>
                    )}
                  </div>
                  <span className="online-status-dot"></span>
                </div>
                <div className="member-info">
                  <div className="member-name-row">
                    <span className="member-name">{member.name}</span>
                    {member.role === 'admin' && (
                      <span className="admin-badge">👑 Admin</span>
                    )}
                    {member.id === currentUserId && (
                      <span className="you-badge">Você</span>
                    )}
                  </div>
                  <span className="member-status">Online agora</span>
                </div>
                {isAdmin && member.id !== currentUserId && (
                  <div className="member-actions">
                    <button 
                      className="action-btn"
                      onClick={() => setShowAdminMenu(showAdminMenu === member.id ? null : member.id)}
                    >
                      ⋮
                    </button>
                    {showAdminMenu === member.id && (
                      <div className="admin-menu">
                        <button 
                          onClick={() => handleSetAdmin(member.id, !member.admins?.includes(member.id))}
                        >
                          {member.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="remove-btn"
                        >
                          Remover do Grupo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Membros Offline */}
        {offlineMembers.length > 0 && (
          <div className="members-group">
            <h4 className="members-group-title">⚫ Offline ({offlineMembers.length})</h4>
            {offlineMembers.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar-container">
                  <div className="member-avatar">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} />
                    ) : (
                      <div className="avatar-placeholder">{member.name.charAt(0)}</div>
                    )}
                  </div>
                </div>
                <div className="member-info">
                  <div className="member-name-row">
                    <span className="member-name">{member.name}</span>
                    {member.role === 'admin' && (
                      <span className="admin-badge">👑 Admin</span>
                    )}
                    {member.id === currentUserId && (
                      <span className="you-badge">Você</span>
                    )}
                  </div>
                  <span className="member-status">{getTimeAgo(member.lastSeen)}</span>
                </div>
                {isAdmin && member.id !== currentUserId && (
                  <div className="member-actions">
                    <button 
                      className="action-btn"
                      onClick={() => setShowAdminMenu(showAdminMenu === member.id ? null : member.id)}
                    >
                      ⋮
                    </button>
                    {showAdminMenu === member.id && (
                      <div className="admin-menu">
                        <button 
                          onClick={() => handleSetAdmin(member.id, !member.admins?.includes(member.id))}
                        >
                          {member.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="remove-btn"
                        >
                          Remover do Grupo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupMembers

