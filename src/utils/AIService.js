import SmartAI from './SmartAI'

// Serviço de IA inteligente - usa múltiplas estratégias para respostas
class AIService {
  constructor() {
    this.smartAI = new SmartAI()
  }

  async getAIResponse(userMessage, conversationHistory = []) {
    // Usa o sistema de IA inteligente para processar a pergunta
    try {
      const response = await this.smartAI.processQuestion(userMessage)
      if (response && response.trim()) {
        return response
      }
    } catch (error) {
      console.error('Erro ao processar pergunta:', error)
    }

    // Fallback inteligente
    return this.getFallbackResponse(userMessage)
  }

  getFallbackResponse(message) {
    const msg = message.toLowerCase().trim()
    
    if (msg.includes('chuva') || msg.includes('chover') || msg.includes('tempo') || msg.includes('clima')) {
      return 'Para informações sobre o clima e previsão do tempo, recomendo verificar o Climatempo (climatempo.com.br) ou o INMET. Esses são os serviços mais confiáveis para previsões meteorológicas. Posso ajudá-lo com outras questões!'
    }

    if (msg.includes('vai') && (msg.includes('amanhã') || msg.includes('amanha'))) {
      return 'Sobre eventos futuros ou previsões, não tenho acesso a dados atualizados em tempo real. Para informações precisas, recomendo verificar fontes especializadas ou serviços online atualizados. Posso ajudá-lo com outras questões!'
    }

    return `Entendo sua pergunta sobre "${message}". Posso ajudá-lo com informações gerais sobre diversos assuntos. O que mais você gostaria de saber?`
  }
}

export default AIService
