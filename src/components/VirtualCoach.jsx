import React, { useState, useEffect } from 'react'
import './VirtualCoach.css'

function VirtualCoach({ dietManager, socialManager }) {
  const [messages, setMessages] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    generateCoachMessage()
  }, [dietManager, socialManager])

  const generateCoachMessage = () => {
    const stats = dietManager.getStats()
    const hour = new Date().getHours()
    let message = ''

    // Mensagens baseadas no horário
    if (hour >= 6 && hour < 12) {
      message = 'Bom dia! 🌅 Que tal começar o dia bebendo um copo de água?'
    } else if (hour >= 12 && hour < 18) {
      message = 'Boa tarde! ☀️ Não esqueça de manter-se hidratado!'
    } else {
      message = 'Boa noite! 🌙 Como foi seu dia? Registre suas refeições!'
    }

    // Mensagens baseadas no progresso
    if (stats.waterPercentage < 30) {
      message = '💧 Você bebeu pouca água hoje. Que tal tomar um copo agora?'
    } else if (stats.waterPercentage >= 100) {
      message = '🎉 Parabéns! Você atingiu sua meta de água hoje! Continue assim!'
    } else if (stats.percentage >= 90 && stats.percentage < 100) {
      message = '⚠️ Você está quase atingindo sua meta de calorias! Faltam apenas ' + stats.remaining + ' kcal!'
    } else if (stats.percentage >= 100) {
      message = '🎊 Incrível! Você atingiu sua meta de calorias! Você está no caminho certo!'
    } else if (stats.mealsToday === 0) {
      message = '🍽️ Que tal registrar sua primeira refeição do dia?'
    } else if (socialManager && socialManager.streak >= 7) {
      message = '🔥 ' + socialManager.streak + ' dias seguidos! Você é incrível! Continue essa sequência!'
    }

    // Mensagens motivacionais aleatórias
    const motivationalMessages = [
      '💪 Você está fazendo um ótimo trabalho! Continue assim!',
      '✨ Cada pequeno passo conta! Você está no caminho certo!',
      '🌟 Lembre-se: consistência é a chave do sucesso!',
      '💙 Seu corpo agradece cada escolha saudável que você faz!',
      '🎯 Foque no progresso, não na perfeição!'
    ]

    // 20% de chance de mensagem motivacional
    if (Math.random() < 0.2) {
      message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    }

    setMessages([{ id: Date.now(), text: message, timestamp: new Date() }])
  }

  if (!isVisible) return null

  return (
    <div className="virtual-coach">
      <div className="coach-avatar">
        <div className="coach-face">🤖</div>
        <div className="coach-pulse"></div>
      </div>
      <div className="coach-messages">
        {messages.map(msg => (
          <div key={msg.id} className="coach-message">
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <button 
        className="coach-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Ocultar coach' : 'Mostrar coach'}
      >
        {isVisible ? '✕' : '💬'}
      </button>
    </div>
  )
}

export default VirtualCoach

