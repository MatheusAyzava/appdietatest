// API de Chat Gratuita - usando serviço público
class ChatAPI {
  constructor() {
    // Usa uma API de chat gratuita via proxy público
    // Alternativa: usar API do Hugging Face Chat que é gratuita
    this.baseUrl = 'https://api-inference.huggingface.co/models'
  }

  async getResponse(message) {
    // Tenta múltiplas APIs gratuitas
    try {
      // Tenta usar modelo de chat em português
      const response = await this.tryHuggingFaceChat(message)
      if (response) return response
    } catch (error) {
      console.log('API Hugging Face não disponível, usando fallback local')
    }

    return null
  }

  async tryHuggingFaceChat(message) {
    try {
      // Modelo de chat que funciona sem autenticação (pode ter delay na primeira vez)
      const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-small`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: [],
            generated_responses: [],
            text: message
          }
        }),
      })

      if (response.status === 503) {
        // Modelo está carregando, retorna null para usar fallback
        return null
      }

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      
      if (data.error) {
        return null
      }

      if (data.generated_text) {
        return data.generated_text.trim()
      }

      return null
    } catch (error) {
      return null
    }
  }
}

export default ChatAPI

