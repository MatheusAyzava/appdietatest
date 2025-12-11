import React, { useState } from 'react'
import GroupMembers from './GroupMembers'
import './GroupManager.css'

function GroupManager({ socialManager, onGroupChange }) {
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupCode, setGroupCode] = useState('')

  const handleCreateGroup = (e) => {
    e.preventDefault()
    if (groupName.trim()) {
      const group = socialManager.createGroup(groupName)
      onGroupChange()
      setShowCreate(false)
      setGroupName('')
    }
  }

  const handleJoinGroup = (e) => {
    e.preventDefault()
    if (groupCode.trim()) {
      const group = socialManager.joinGroup(groupCode.toUpperCase())
      onGroupChange()
      setShowJoin(false)
      setGroupCode('')
    }
  }

  const handleLeaveGroup = () => {
    socialManager.currentGroup = null
    socialManager.saveData()
    onGroupChange()
  }

  return (
    <div className="group-manager">
      {!socialManager.currentGroup ? (
        <div className="group-actions">
          <button 
            className="create-group-btn"
            onClick={() => setShowCreate(true)}
          >
            ➕ Criar Grupo
          </button>
          <button 
            className="join-group-btn"
            onClick={() => setShowJoin(true)}
          >
            🔗 Entrar em Grupo
          </button>
        </div>
      ) : (
        <>
          <div className="current-group">
            <div className="group-info">
              <h3>👥 {socialManager.currentGroup.name}</h3>
              <p className="group-code">Código: {socialManager.currentGroup.code}</p>
              <p className="group-members">
                {Array.isArray(socialManager.currentGroup.members) 
                  ? socialManager.currentGroup.members.length 
                  : 0} membros
                {socialManager.isAdmin() && (
                  <span className="admin-indicator"> • Você é admin 👑</span>
                )}
              </p>
            </div>
            <button 
              className="leave-group-btn"
              onClick={handleLeaveGroup}
            >
              Sair do Grupo
            </button>
          </div>
          <GroupMembers 
            socialManager={socialManager}
            onUpdate={onGroupChange}
          />
        </>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Criar Novo Grupo</h3>
            <form onSubmit={handleCreateGroup}>
              <input
                type="text"
                placeholder="Nome do grupo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="submit-modal-btn">Criar</button>
                <button 
                  type="button" 
                  className="cancel-modal-btn"
                  onClick={() => setShowCreate(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Entrar em Grupo</h3>
            <form onSubmit={handleJoinGroup}>
              <input
                type="text"
                placeholder="Código do grupo"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                required
                autoFocus
                maxLength={6}
              />
              <p className="modal-hint">Digite o código de 6 letras do grupo</p>
              <div className="modal-actions">
                <button type="submit" className="submit-modal-btn">Entrar</button>
                <button 
                  type="button" 
                  className="cancel-modal-btn"
                  onClick={() => setShowJoin(false)}
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

export default GroupManager

