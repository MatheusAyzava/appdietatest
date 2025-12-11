// Serviço de busca na web - busca informações sem armazenar
class WebSearch {
  constructor() {
    // Cache temporário em memória (não persiste)
    this.tempCache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  async search(query) {
    // Limpa cache antigo
    this.cleanCache()

    // Verifica cache temporário
    const cacheKey = query.toLowerCase().trim()
    if (this.tempCache.has(cacheKey)) {
      const cached = this.tempCache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
      this.tempCache.delete(cacheKey)
    }

    try {
      // Usa DuckDuckGo Instant Answer API (gratuita, sem necessidade de chave)
      const result = await this.searchDuckDuckGo(query)
      
      if (result) {
        // Armazena temporariamente em memória (será limpo automaticamente)
        this.tempCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        })
        return result
      }
    } catch (error) {
      console.log('Erro na busca:', error)
    }

    // Fallback: busca via múltiplas estratégias
    try {
      const generalResult = await this.searchGeneralWeb(query)
      if (generalResult) {
        this.tempCache.set(cacheKey, {
          data: generalResult,
          timestamp: Date.now()
        })
        return generalResult
      }
    } catch (error) {
      console.log('Erro na busca geral:', error)
    }

    return null
  }

  async searchDuckDuckGo(query) {
    try {
      // DuckDuckGo Instant Answer API
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      
      // Processa resposta do DuckDuckGo
      if (data.AbstractText) {
        return {
          text: data.AbstractText,
          source: data.AbstractURL || 'DuckDuckGo',
          type: 'abstract'
        }
      }

      if (data.Answer) {
        return {
          text: data.Answer,
          source: 'DuckDuckGo',
          type: 'answer'
        }
      }

      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        const firstTopic = data.RelatedTopics[0]
        if (firstTopic.Text) {
          return {
            text: firstTopic.Text,
            source: firstTopic.FirstURL || 'DuckDuckGo',
            type: 'related'
          }
          }
      }

      return null
    } catch (error) {
      return null
    }
  }

  async searchWikipedia(query) {
    try {
      // Primeiro tenta buscar o termo diretamente
      let searchResponse = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      // Se não encontrou, tenta buscar via API de busca da Wikipedia
      if (!searchResponse.ok) {
        // Extrai palavras-chave principais da query
        const keywords = query.split(' ').filter(w => w.length > 3).slice(0, 3).join(' ')
        if (keywords) {
          searchResponse = await fetch(
            `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keywords)}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            }
          )
        }
      }

      if (!searchResponse.ok) {
        return null
      }

      const data = await searchResponse.json()
      
      if (data.extract) {
        // Limita o texto para não ser muito longo, mas permite mais caracteres
        const text = data.extract.length > 800 
          ? data.extract.substring(0, 800) + '...' 
          : data.extract

        return {
          text: text,
          source: data.content_urls?.desktop?.page || 'Wikipedia',
          type: 'wikipedia'
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  // Nova função para buscar informações gerais usando múltiplas estratégias
  async searchGeneralWeb(query) {
    // Tenta DuckDuckGo primeiro
    const duckResult = await this.searchDuckDuckGo(query)
    if (duckResult && duckResult.text && duckResult.text.length > 20) {
      return duckResult
    }

    // Tenta Wikipedia
    const wikiResult = await this.searchWikipedia(query)
    if (wikiResult && wikiResult.text && wikiResult.text.length > 20) {
      return wikiResult
    }

    // Tenta buscar termos específicos extraídos da query
    const keywords = this.extractKeywords(query)
    if (keywords.length > 0) {
      for (const keyword of keywords.slice(0, 2)) {
        const wikiKeyword = await this.searchWikipedia(keyword)
        if (wikiKeyword && wikiKeyword.text && wikiKeyword.text.length > 20) {
          return wikiKeyword
        }
      }
    }

    return null
  }

  extractKeywords(query) {
    // Remove palavras comuns e extrai palavras-chave
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 
                      'em', 'na', 'no', 'nas', 'nos', 'para', 'com', 'por', 'que', 'qual',
                      'quando', 'onde', 'como', 'porque', 'por que', 'é', 'são', 'ser',
                      'vai', 'vou', 'vamos', 'quero', 'gostaria', 'saber', 'sobre']
    
    const words = query.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w))
    
    return words.slice(0, 5) // Retorna até 5 palavras-chave
  }

  // Busca informações gerais na web usando uma abordagem alternativa
  async searchGeneral(query) {
    try {
      // Tenta múltiplas fontes
      const duckResult = await this.searchDuckDuckGo(query)
      if (duckResult) return duckResult

      const wikiResult = await this.searchWikipedia(query)
      if (wikiResult) return wikiResult

      return null
    } catch (error) {
      return null
    }
  }

  cleanCache() {
    const now = Date.now()
    for (const [key, value] of this.tempCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.tempCache.delete(key)
      }
    }
  }

  // Limpa todo o cache (chamado quando necessário)
  clearCache() {
    this.tempCache.clear()
  }
}

export default WebSearch

