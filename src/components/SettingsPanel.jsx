import React, { useState } from 'react'
import PrivacySettings from './PrivacySettings'
import './SettingsPanel.css'

function SettingsPanel({ dietManager, socialManager, onClose, onUpdate }) {
  const [calories, setCalories] = useState(dietManager.dailyCalorieLimit)
  const [waterGoal, setWaterGoal] = useState(dietManager.waterGoal)
  const [waterGoalLiters, setWaterGoalLiters] = useState(dietManager.waterGoalLiters || 2)
  const [glassSizeML, setGlassSizeML] = useState(dietManager.glassSizeML || 250)
  const [wakeUpTime, setWakeUpTime] = useState(dietManager.wakeUpTime || '07:00')
  const [sleepTime, setSleepTime] = useState(dietManager.sleepTime || '23:00')
  const [enableNotifications, setEnableNotifications] = useState(Notification.permission === 'granted')
  const [waterReminderInterval, setWaterReminderInterval] = useState(dietManager.waterReminderInterval || 2) // horas
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('whis_user_name') || 'Usuário'
  })

  const handleSave = () => {
    dietManager.setDailyCalorieLimit(calories)
    dietManager.setWaterGoalLiters(waterGoalLiters)
    dietManager.setGlassSize(glassSizeML)
    dietManager.setSleepSchedule(wakeUpTime, sleepTime)
    dietManager.waterReminderInterval = waterReminderInterval
    dietManager.setupReminders()
    
    // Salva o nome do usuário
    if (userName.trim() && userName.trim().length >= 2) {
      localStorage.setItem('whis_user_name', userName.trim())
      // Dispara evento customizado para atualizar o dashboard na mesma aba
      window.dispatchEvent(new CustomEvent('userNameChanged', { 
        detail: { name: userName.trim() } 
      }))
    }
    
    onUpdate()
    onClose()
  }

  // Atualiza copos quando litros mudam
  const handleLitersChange = (liters) => {
    setWaterGoalLiters(liters)
    const newGlasses = Math.round((liters * 1000) / glassSizeML)
    setWaterGoal(newGlasses)
  }

  // Atualiza litros quando copos mudam
  const handleGlassesChange = (glasses) => {
    setWaterGoal(glasses)
    const newLiters = (glasses * glassSizeML) / 1000
    setWaterGoalLiters(parseFloat(newLiters.toFixed(2)))
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setEnableNotifications(permission === 'granted')
      if (permission === 'granted') {
        dietManager.setupReminders()
      }
    }
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Configurações</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <label>👤 Seu Nome</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={30}
            />
            <p className="setting-hint">Seu nome será usado nas mensagens personalizadas</p>
          </div>

          <div className="setting-group">
            <label>🔥 Meta Diária de Calorias</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min="800"
              max="5000"
              placeholder="Ex: 2000"
            />
            <p className="setting-hint">Defina quantas calorias você quer consumir por dia</p>
          </div>

          <div className="setting-group">
            <label>💧 Meta Diária de Água (litros)</label>
            <input
              type="number"
              step="0.1"
              value={waterGoalLiters}
              onChange={(e) => handleLitersChange(parseFloat(e.target.value) || 0)}
              min="0.5"
              max="5"
              placeholder="Ex: 2.0"
            />
            <p className="setting-hint">Quantos litros de água você quer beber por dia</p>
            <div className="water-conversion">
              <span>Isso equivale a aproximadamente <strong>{Math.round((waterGoalLiters * 1000) / glassSizeML)} copos</strong> de {glassSizeML}ml</span>
            </div>
          </div>

          <div className="setting-group">
            <label>🥤 Tamanho do Copo (ml)</label>
            <input
              type="number"
              value={glassSizeML}
              onChange={(e) => {
                const newSize = parseInt(e.target.value) || 250
                setGlassSizeML(newSize)
                const newGlasses = Math.round((waterGoalLiters * 1000) / newSize)
                setWaterGoal(newGlasses)
              }}
              min="100"
              max="500"
              step="50"
              placeholder="Ex: 250"
            />
            <p className="setting-hint">Tamanho do seu copo em mililitros (padrão: 250ml)</p>
          </div>

          <div className="setting-group">
            <label>🌅 Horário de Acordar</label>
            <input
              type="time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
            />
            <p className="setting-hint">Horário que você costuma acordar (para calcular lembretes)</p>
          </div>

          <div className="setting-group">
            <label>🌙 Horário de Dormir</label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
            <p className="setting-hint">Horário que você costuma dormir (não receberá notificações durante o sono)</p>
          </div>

          <div className="setting-group">
            <label>⏰ Intervalo de Lembrete de Água (horas)</label>
            <input
              type="number"
              value={waterReminderInterval}
              onChange={(e) => setWaterReminderInterval(e.target.value)}
              min="1"
              max="4"
              placeholder="Ex: 2"
            />
            <p className="setting-hint">De quanto em quanto tempo você quer ser lembrado de beber água (apenas durante o tempo acordado)</p>
          </div>

          <div className="setting-group">
            <label>🔔 Notificações</label>
            <div className="notification-setting">
              <span>Permitir notificações de lembretes</span>
              {!enableNotifications && (
                <button 
                  className="enable-notifications-btn"
                  onClick={requestNotificationPermission}
                >
                  Ativar
                </button>
              )}
              {enableNotifications && (
                <span className="enabled-badge">✓ Ativado</span>
              )}
            </div>
            <p className="setting-hint">Receba lembretes de refeições e água no seu celular</p>
          </div>

          <div className="setting-group">
            <label>🔐 Privacidade</label>
            <button 
              className="privacy-btn"
              onClick={() => setShowPrivacy(true)}
            >
              Configurar Modo de Privacidade
            </button>
            <p className="setting-hint">Escolha como compartilhar seu progresso</p>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Salvar Configurações
          </button>
        </div>
      </div>

      {showPrivacy && socialManager && (
        <PrivacySettings
          socialManager={socialManager}
          onClose={() => setShowPrivacy(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}

export default SettingsPanel

