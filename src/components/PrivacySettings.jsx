import React, { useState } from 'react'
import './PrivacySettings.css'

function PrivacySettings({ socialManager, onClose, onUpdate }) {
  const [privacyMode, setPrivacyMode] = useState(socialManager.privacyMode || 'solo')

  const handleSave = () => {
    socialManager.setPrivacyMode(privacyMode)
    onUpdate()
    onClose()
  }

  const modes = [
    {
      id: 'solo',
      name: 'Modo Individual',
      icon: '🔒',
      description: 'Treine sozinho. Seu progresso é privado e apenas você vê.',
      features: ['Progresso privado', 'Diário pessoal', 'Badges e conquistas', 'Insights do coach']
    },
    {
      id: 'social',
      name: 'Modo Social',
      icon: '👥',
      description: 'Compartilhe seu progresso com amigos e participe de grupos.',
      features: ['Feed social', 'Ranking do grupo', 'Desafios coletivos', 'Motivação em grupo']
    },
    {
      id: 'ghost',
      name: 'Modo Fantasma',
      icon: '👻',
      description: 'Treine sozinho, mas veja o ranking sem aparecer nele.',
      features: ['Progresso privado', 'Visualiza ranking', 'Não aparece no ranking', 'Motivação discreta']
    }
  ]

  return (
    <div className="privacy-overlay" onClick={onClose}>
      <div className="privacy-panel" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-header">
          <h2>🔐 Modo de Privacidade</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="privacy-content">
          <p className="privacy-intro">
            Escolha como você quer usar o app. Você pode mudar isso a qualquer momento.
          </p>

          <div className="privacy-modes">
            {modes.map(mode => (
              <div
                key={mode.id}
                className={`privacy-mode-card ${privacyMode === mode.id ? 'selected' : ''}`}
                onClick={() => setPrivacyMode(mode.id)}
              >
                <div className="mode-icon">{mode.icon}</div>
                <div className="mode-content">
                  <h3>{mode.name}</h3>
                  <p className="mode-description">{mode.description}</p>
                  <ul className="mode-features">
                    {mode.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mode-radio">
                  <div className={`radio-button ${privacyMode === mode.id ? 'checked' : ''}`}>
                    {privacyMode === mode.id && <div className="radio-dot"></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="save-privacy-btn" onClick={handleSave}>
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings

