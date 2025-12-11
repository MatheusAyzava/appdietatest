import React, { useState, useEffect, useRef } from 'react'
import './VoiceAssistant.css'

function VoiceAssistant({ onVoiceInput, isListening, setIsListening }) {
  const recognitionRef = useRef(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verifica suporte para Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.lang = 'pt-BR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onVoiceInput(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [onVoiceInput])

  const toggleListening = () => {
    if (!isSupported) {
      alert('Reconhecimento de voz não é suportado no seu navegador. Use Chrome ou Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  return (
    <div className="voice-assistant">
      <button
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        title={isListening ? 'Parar escuta' : 'Iniciar escuta de voz'}
      >
        <div className="voice-icon">
          {isListening ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </div>
        {isListening && <div className="pulse-ring"></div>}
      </button>
      {isListening && (
        <div className="listening-indicator">
          <span>Escutando...</span>
        </div>
      )}
    </div>
  )
}

export default VoiceAssistant

