import AIService from './AIService'

class AICore {
  constructor() {
    this.name = 'Whis'
    this.personality = {
      greeting: ['Olá!', 'Oi!', 'Olá, como posso ajudar?'],
      helpful: true,
      friendly: true,
      context: []
    }
    this.synth = window.speechSynthesis
    this.voices = []
    this.aiService = new AIService()
    this.conversationHistory = []
    this.loadVoices()
  }

  loadVoices() {
    this.voices = this.synth.getVoices()
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices()
      }
    }
  }

  speak(text) {
    if (!this.synth) return

    // Cancela qualquer fala anterior
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Tenta encontrar uma voz em português
    const ptVoice = this.voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('PT')
    )
    if (ptVoice) {
      utterance.voice = ptVoice
    }

    this.synth.speak(utterance)
  }

  async processMessage(userMessage) {
    const message = userMessage.toLowerCase().trim()
    
    // Adiciona ao histórico
    this.conversationHistory.push({ role: 'user', content: userMessage })
    
    // Respostas contextuais inteligentes (respostas rápidas para comandos específicos)
    if (this.isGreeting(message)) {
      const response = this.getGreetingResponse()
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    if (this.isTimeQuestion(message)) {
      const response = this.getTimeResponse()
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    if (this.isDateQuestion(message)) {
      const response = this.getDateResponse()
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    if (this.isCalculation(message)) {
      const response = this.getCalculationResponse(message)
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    if (this.isHelpRequest(message)) {
      const response = this.getHelpResponse()
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    if (this.isCompliment(message)) {
      const response = this.getComplimentResponse()
      this.conversationHistory.push({ role: 'assistant', content: response })
      return response
    }

    // Para outras perguntas, usa o serviço de IA inteligente
    try {
      const aiResponse = await this.aiService.getAIResponse(userMessage, this.conversationHistory)
      if (aiResponse && aiResponse.trim()) {
        this.conversationHistory.push({ role: 'assistant', content: aiResponse })
        return aiResponse
      }
    } catch (error) {
      console.error('Erro ao processar com IA:', error)
    }

    // Fallback para resposta padrão
    const defaultResponse = this.getDefaultResponse(message)
    this.conversationHistory.push({ role: 'assistant', content: defaultResponse })
    return defaultResponse
  }

  isGreeting(message) {
    const greetings = ['olá', 'oi', 'ola', 'eae', 'e aí', 'hey', 'hello', 'bom dia', 'boa tarde', 'boa noite']
    return greetings.some(g => message.includes(g))
  }

  isTimeQuestion(message) {
    return message.includes('horas') || message.includes('que hora') || message.includes('hora é')
  }

  isDateQuestion(message) {
    return message.includes('data') || message.includes('dia é hoje') || message.includes('que dia')
  }


  isCalculation(message) {
    const mathPattern = /[\d+\-*/().\s]+/
    const mathKeywords = ['calcule', 'quanto é', 'soma', 'subtrai', 'multiplica', 'divide', '+', '-', '*', '/']
    return mathPattern.test(message) && mathKeywords.some(k => message.includes(k))
  }

  isHelpRequest(message) {
    return message.includes('ajuda') || message.includes('help') || message.includes('o que você pode fazer')
  }

  isCompliment(message) {
    const compliments = ['obrigado', 'obrigada', 'valeu', 'thanks', 'obg', 'parabéns', 'muito bom']
    return compliments.some(c => message.includes(c))
  }

  getGreetingResponse() {
    const responses = [
      'Olá! Como posso ajudá-lo hoje?',
      'Oi! Estou aqui para ajudar!',
      'Olá! Em que posso ser útil?',
      'Oi! Pronto para ajudar!'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  getTimeResponse() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    return `São ${hours} horas e ${minutes} minutos.`
  }

  getDateResponse() {
    const now = new Date()
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    const dateStr = now.toLocaleDateString('pt-BR', options)
    return `Hoje é ${dateStr}.`
  }


  getCalculationResponse(message) {
    try {
      // Extrai números e operadores
      const cleanMessage = message
        .replace(/calcule|quanto é|soma|subtrai|multiplica|divide/gi, '')
        .replace(/[^\d+\-*/().\s]/g, '')
        .trim()
      
      if (cleanMessage) {
        // Avalia a expressão matemática (com cuidado de segurança)
        const result = Function(`"use strict"; return (${cleanMessage})`)()
        return `O resultado é ${result}.`
      }
    } catch (error) {
      return 'Desculpe, não consegui calcular isso. Pode reformular a pergunta?'
    }
    return 'Pode me dar uma expressão matemática para calcular?'
  }

  getHelpResponse() {
    return `Posso ajudá-lo com várias coisas:
- Responder perguntas
- Informar a hora e data
- Fazer cálculos matemáticos
- Conversar sobre diversos assuntos
- E muito mais! O que você gostaria de fazer?`
  }

  getComplimentResponse() {
    const responses = [
      'De nada! Fico feliz em ajudar!',
      'Por nada! Estou sempre aqui quando precisar!',
      'Disponha! Foi um prazer ajudar!',
      'De nada! Qualquer coisa, é só chamar!'
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  getDefaultResponse(message) {
    // Respostas contextuais baseadas em palavras-chave
    if (message.includes('nome')) {
      return `Meu nome é ${this.name}. Como posso ajudá-lo?`
    }

    if (message.includes('você') || message.includes('voce')) {
      return 'Sou um assistente de IA criado para ajudá-lo com diversas tarefas. Como posso ser útil?'
    }

    if (message.includes('tudo bem') || message.includes('como vai')) {
      return 'Estou muito bem, obrigado por perguntar! E você, como está?'
    }

    // Respostas mais genéricas e naturais
    const responses = [
      'Interessante! Pode me contar mais sobre isso?',
      'Entendo. Como posso ajudá-lo com isso?',
      'Compreendo. Há algo específico que você gostaria de saber?',
      'Que bom que você mencionou isso! Em que posso ajudar?',
      `Sobre "${message}", posso ajudá-lo de várias formas. O que você gostaria de saber?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export default AICore

