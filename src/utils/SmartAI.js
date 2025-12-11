import WebSearch from './WebSearch'

// Sistema de IA Inteligente - Processa perguntas humanas de forma natural
class SmartAI {
  constructor() {
    this.knowledge = this.buildKnowledgeBase()
    this.webSearch = new WebSearch()
    this.shouldSearchWeb = true // Ativa busca na web
  }

  buildKnowledgeBase() {
    return {
      weather: {
        patterns: ['vai chover', 'vai chover amanhã', 'previsão do tempo', 'clima', 'temperatura', 'chuva'],
        response: async (msg, smartAI) => {
          // Busca informações sobre o clima na web
          if (smartAI.shouldSearchWeb) {
            const searchQuery = msg.includes('amanhã') || msg.includes('amanha') 
              ? `previsão do tempo amanhã ${msg}` 
              : `previsão do tempo ${msg}`
            const webResult = await smartAI.searchWebForAnswer(searchQuery)
            if (webResult) return webResult
          }
          // Fallback apenas se a busca falhar
          return 'Estou buscando informações atualizadas sobre o clima. Por favor, aguarde um momento ou tente novamente.'
        }
      },
      general: {
        'inteligência artificial': 'Inteligência Artificial (IA) é um campo da ciência da computação que busca criar sistemas capazes de realizar tarefas que normalmente requerem inteligência humana, como reconhecimento de padrões, aprendizado, raciocínio e tomada de decisões.',
        'ia': 'IA é a abreviação de Inteligência Artificial. Refere-se a sistemas computacionais que simulam inteligência humana através de algoritmos e aprendizado de máquina.',
        'programação': 'Programação é a arte e ciência de escrever código para criar software. Envolve lógica, algoritmos e conhecimento de linguagens como Python, JavaScript, Java, C++, entre outras.',
        'python': 'Python é uma linguagem de programação de alto nível, conhecida por sua sintaxe simples e legível. É amplamente usada em ciência de dados, IA, desenvolvimento web, automação e muito mais.',
        'javascript': 'JavaScript é uma linguagem de programação essencial para desenvolvimento web. Permite criar interatividade em páginas web e também é usada no backend com Node.js.',
        'react': 'React é uma biblioteca JavaScript criada pelo Facebook para construir interfaces de usuário. É muito popular para criar aplicações web modernas e reativas.',
        'computador': 'Um computador é uma máquina eletrônica programável que processa dados e executa instruções. Pode realizar cálculos complexos, armazenar informações e executar diversas tarefas.',
        'internet': 'A internet é uma rede global de computadores interconectados que permite comunicação e compartilhamento de informações em todo o mundo. Foi criada na década de 1960 e revolucionou a forma como vivemos.',
        'tecnologia': 'Tecnologia é o conjunto de conhecimentos, técnicas e ferramentas usadas para criar, modificar e utilizar sistemas para resolver problemas ou melhorar a vida humana.',
        'votorantim': 'Votorantim é uma cidade no estado de São Paulo, localizada na região metropolitana de Sorocaba. Tem aproximadamente 120 mil habitantes e é conhecida por sua indústria e desenvolvimento econômico.',
        'sorocaba': 'Sorocaba é uma importante cidade do interior de São Paulo, conhecida como a "Manchester Paulista" devido à sua tradição industrial. É um centro econômico e cultural importante da região.',
        'brasil': 'O Brasil é o maior país da América do Sul e o quinto maior do mundo em área. Tem mais de 200 milhões de habitantes e é conhecido por sua diversidade cultural, natural e econômica.',
        'são paulo': 'São Paulo é a maior cidade do Brasil e uma das maiores metrópoles do mundo. É o principal centro financeiro, corporativo e mercantil da América do Sul, com mais de 12 milhões de habitantes.',
        'html': 'HTML (HyperText Markup Language) é a linguagem de marcação usada para criar a estrutura de páginas web. Define o conteúdo e a organização dos elementos em uma página.',
        'css': 'CSS (Cascading Style Sheets) é usado para estilizar páginas web. Controla cores, fontes, layouts e a aparência visual geral dos elementos HTML.',
        'node.js': 'Node.js é um ambiente de execução JavaScript no servidor. Permite usar JavaScript para criar aplicações backend e servidores web.',
        'api': 'API (Application Programming Interface) é um conjunto de protocolos e ferramentas para construir software. Permite que diferentes aplicações se comuniquem entre si.',
        'banco de dados': 'Um banco de dados é um sistema organizado para armazenar, gerenciar e recuperar informações. Exemplos incluem MySQL, PostgreSQL, MongoDB, entre outros.',
        'software': 'Software é um conjunto de programas, dados e instruções que dizem a um computador o que fazer. Inclui sistemas operacionais, aplicativos e programas.',
        'hardware': 'Hardware são os componentes físicos de um computador, como processador, memória, disco rígido, placa-mãe, etc.',
        'algoritmo': 'Um algoritmo é uma sequência lógica de passos para resolver um problema ou realizar uma tarefa. É a base da programação.',
        'aplicativo': 'Um aplicativo (app) é um programa de software projetado para realizar tarefas específicas. Pode ser desktop, web ou mobile.',
        'navegador': 'Um navegador web é um software usado para acessar e visualizar páginas na internet. Exemplos: Chrome, Firefox, Edge, Safari.',
        'site': 'Um site (website) é uma coleção de páginas web relacionadas acessadas através de um endereço na internet (URL).',
        'servidor': 'Um servidor é um computador ou sistema que fornece serviços, recursos ou dados para outros computadores (clientes) em uma rede.',
        'rede': 'Uma rede é um conjunto de computadores e dispositivos conectados que podem compartilhar recursos e informações.',
        'segurança': 'Segurança da informação envolve proteger dados e sistemas contra acesso não autorizado, uso indevido ou danos.',
        'vírus': 'Um vírus de computador é um programa malicioso que se replica e se espalha, causando danos a sistemas e dados.',
        'backup': 'Backup é uma cópia de segurança de dados importantes, criada para restaurar informações em caso de perda ou dano.',
        'cloud': 'Cloud computing (computação em nuvem) é o fornecimento de serviços de computação pela internet, como armazenamento e processamento.',
        'smartphone': 'Um smartphone é um telefone celular avançado com capacidades de computador, incluindo internet, aplicativos e muito mais.',
        'tablet': 'Um tablet é um dispositivo móvel com tela sensível ao toque, maior que um smartphone mas menor que um laptop.',
        'laptop': 'Um laptop (notebook) é um computador portátil que combina monitor, teclado e processador em um único dispositivo.',
        'windows': 'Windows é um sistema operacional desenvolvido pela Microsoft, usado em milhões de computadores em todo o mundo.',
        'linux': 'Linux é um sistema operacional de código aberto, baseado em Unix, muito usado em servidores e desenvolvimento.',
        'macos': 'macOS é o sistema operacional da Apple para seus computadores Mac.',
        'android': 'Android é um sistema operacional móvel desenvolvido pelo Google, usado em smartphones e tablets.',
        'ios': 'iOS é o sistema operacional móvel da Apple, usado em iPhones e iPads.'
      },
      questions: {
        'o que é': async (topic, smartAI) => {
          const cleanTopic = topic.toLowerCase().trim()
          for (const [key, value] of Object.entries(smartAI.knowledge.general)) {
            if (cleanTopic.includes(key) || key.includes(cleanTopic)) {
              return value
            }
          }
          // Busca na web se não encontrou na base local
          if (smartAI.shouldSearchWeb) {
            const webResult = await smartAI.searchWebForAnswer(topic)
            if (webResult) return webResult
          }
          return `Sobre "${topic}", essa é uma pergunta interessante! Posso ajudá-lo com informações gerais. Se você puder ser mais específico, posso fornecer uma resposta mais detalhada.`
        },
        'quem é': async (person, smartAI) => {
          // Busca na web sobre pessoas
          if (smartAI.shouldSearchWeb) {
            const webResult = await smartAI.searchWebForAnswer(`quem é ${person}`)
            if (webResult) return webResult
          }
          return `Sobre "${person}", não tenho informações específicas sobre essa pessoa no momento. Pode me dar mais detalhes sobre quem você está perguntando?`
        },
        'como funciona': async (thing, smartAI) => {
          // Busca na web sobre como funciona
          if (smartAI.shouldSearchWeb) {
            const webResult = await smartAI.searchWebForAnswer(`como funciona ${thing}`)
            if (webResult) return webResult
          }
          return `Para explicar como "${thing}" funciona, preciso de mais contexto. Pode me dar mais detalhes sobre o que especificamente você gostaria de entender?`
        },
        'por que': async (question, smartAI) => {
          // Busca na web sobre por que
          if (smartAI.shouldSearchWeb) {
            const webResult = await smartAI.searchWebForAnswer(`por que ${question}`)
            if (webResult) return webResult
          }
          return `Essa é uma ótima pergunta! A resposta depende do contexto. Pode me dar mais detalhes sobre o que especificamente você gostaria de entender sobre "${question}"?`
        }
      }
    }
  }

  async processQuestion(userMessage) {
    const msg = userMessage.toLowerCase().trim()
    const originalMsg = userMessage.trim()

    // Remove pontuação excessiva para melhor matching
    const cleanMsg = msg.replace(/[?!.,;:]/g, '').trim()

    // Processa perguntas sobre clima/tempo (com várias variações)
    if (this.knowledge.weather.patterns.some(pattern => cleanMsg.includes(pattern)) || 
        cleanMsg.includes('vai chover') || cleanMsg.includes('vai fazer sol') ||
        cleanMsg.includes('previsão') || cleanMsg.includes('temperatura') ||
        cleanMsg.includes('clima')) {
      return await this.knowledge.weather.response(msg, this)
    }

    // Processa perguntas "o que é" (múltiplas variações)
    const whatIsPattern = /^(o que é|oq é|que é|oq significa|o que significa|definição de|defina)\s+(.+)$/i
    const whatIsMatch = originalMsg.match(whatIsPattern)
    if (whatIsMatch) {
      const topic = whatIsMatch[2].trim()
      if (topic) {
        return await this.knowledge.questions['o que é'](topic, this)
      }
    }

    // Processa perguntas "quem é"
    const whoIsPattern = /^(quem é|quem foi|quem são)\s+(.+)$/i
    const whoIsMatch = originalMsg.match(whoIsPattern)
    if (whoIsMatch) {
      const person = whoIsMatch[2].trim()
      if (person) {
        return await this.knowledge.questions['quem é'](person, this)
      }
    }

    // Processa perguntas "como funciona"
    const howPattern = /^(como funciona|como é que funciona|como trabalha|como opera)\s+(.+)$/i
    const howMatch = originalMsg.match(howPattern)
    if (howMatch) {
      const thing = howMatch[2].trim()
      if (thing) {
        return await this.knowledge.questions['como funciona'](thing, this)
      }
    }

    // Processa perguntas "por que"
    const whyPattern = /^(por que|porque|por quê|pq)\s+(.+)$/i
    const whyMatch = originalMsg.match(whyPattern)
    if (whyMatch) {
      const question = whyMatch[2].trim()
      if (question) {
        return await this.knowledge.questions['por que'](question, this)
      }
    }

    // Busca direta na base de conhecimento (busca mais inteligente)
    for (const [key, value] of Object.entries(this.knowledge.general)) {
      // Busca exata ou parcial
      if (cleanMsg === key || cleanMsg.includes(key) || 
          (key.length > 3 && cleanMsg.split(' ').some(word => word.includes(key) || key.includes(word)))) {
        return value
      }
    }

    // Busca por palavras-chave específicas
    if (cleanMsg.includes('quero saber') || cleanMsg.includes('gostaria de saber')) {
      const topic = originalMsg.replace(/quero saber|gostaria de saber|sobre/gi, '').trim()
      if (topic) {
        for (const [key, value] of Object.entries(this.knowledge.general)) {
          if (topic.toLowerCase().includes(key) || key.includes(topic.toLowerCase())) {
            return value
          }
        }
        // Se não encontrou na base local, busca na web
        if (this.shouldSearchWeb) {
          const webResult = await this.searchWebForAnswer(topic)
          if (webResult) return webResult
        }
        return `Sobre "${topic}", posso ajudá-lo com informações gerais. Pode ser mais específico sobre o que gostaria de saber?`
      }
    }

    // SEMPRE busca na web se não encontrou resposta na base local
    if (this.shouldSearchWeb && !this.isSimpleCommand(cleanMsg)) {
      // Busca para qualquer pergunta ou frase com mais de 5 caracteres
      if (cleanMsg.length > 5) {
        const webResult = await this.searchWebForAnswer(originalMsg)
        if (webResult) return webResult
      }
    }

    // Resposta inteligente baseada no contexto (agora é async)
    return await this.generateIntelligentResponse(originalMsg, cleanMsg)
  }

  isSimpleCommand(msg) {
    const simpleCommands = ['oi', 'olá', 'ola', 'tchau', 'obrigado', 'obrigada', 'valeu', 'ok', 'okay']
    return simpleCommands.includes(msg.toLowerCase().trim())
  }

  async searchWebForAnswer(query) {
    try {
      // Limita o tamanho da query para busca mais eficiente
      const searchQuery = query.length > 150 ? query.substring(0, 150) : query
      
      // Tenta busca direta
      let searchResult = await this.webSearch.search(searchQuery)
      
      // Se não encontrou, tenta busca geral com múltiplas estratégias
      if (!searchResult || !searchResult.text || searchResult.text.length < 20) {
        searchResult = await this.webSearch.searchGeneralWeb(searchQuery)
      }
      
      if (searchResult && searchResult.text && searchResult.text.trim().length > 10) {
        // Processa e formata a resposta
        let response = searchResult.text.trim()
        
        // Remove informações muito técnicas ou longas demais, mas permite mais texto
        if (response.length > 1000) {
          response = response.substring(0, 1000) + '...'
        }

        // Remove referências a "recomendo verificar" ou redirecionamentos
        response = response.replace(/recomendo verificar|recomendo consultar|verifique|consulte/gi, '')
        response = response.replace(/para mais informações|para saber mais|acesse|visite/gi, '')

        // Adiciona fonte apenas se for relevante e não for DuckDuckGo genérico
        if (searchResult.source && 
            searchResult.source !== 'DuckDuckGo' && 
            !searchResult.source.includes('duckduckgo')) {
          // Não adiciona fonte para não parecer redirecionamento
        }

        return response.trim()
      }
    } catch (error) {
      console.error('Erro ao buscar na web:', error)
    }

    return null
  }

  async generateIntelligentResponse(originalMsg, msg) {
    // SEMPRE tenta buscar na web antes de dar resposta genérica
    if (this.shouldSearchWeb && msg.length > 5) {
      const webResult = await this.searchWebForAnswer(originalMsg)
      if (webResult) return webResult
    }

    // Analisa a intenção da pergunta de forma mais inteligente
    const isQuestion = msg.includes('?') || msg.includes('quero saber') || msg.includes('gostaria de saber') || 
                       msg.includes('me diga') || msg.includes('me fale') || msg.includes('explique')
    
    if (isQuestion) {
      // Extrai o tópico principal da pergunta
      const questionWords = ['sobre', 'a respeito de', 'acerca de', 'quanto a']
      let topic = originalMsg
      
      for (const qw of questionWords) {
        if (msg.includes(qw)) {
          topic = originalMsg.split(qw)[1]?.trim() || originalMsg
          break
        }
      }
      
      // Remove palavras de pergunta comuns
      topic = topic.replace(/^(quero saber|gostaria de saber|me diga|me fale|explique|fale|diga)\s+/gi, '').trim()
      
      // Tenta buscar novamente com o tópico extraído
      if (topic && topic.length > 3 && topic !== originalMsg && this.shouldSearchWeb) {
        const webResult = await this.searchWebForAnswer(topic)
        if (webResult) return webResult
      }
      
      return `Estou buscando informações sobre "${originalMsg}". Por favor, aguarde um momento ou reformule sua pergunta de forma mais específica.`
    }

    // Perguntas sobre futuro/previsões - busca na web
    if (msg.includes('vai') && (msg.includes('amanhã') || msg.includes('amanha') || msg.includes('hoje') || msg.includes('depois'))) {
      if (this.shouldSearchWeb) {
        const webResult = await this.searchWebForAnswer(originalMsg)
        if (webResult) return webResult
      }
    }

    // Resposta conversacional inteligente e contextual
    const responses = [
      `Sobre "${originalMsg}", essa é uma questão interessante! Posso ajudá-lo com informações gerais sobre diversos assuntos. Se você puder ser mais específico, posso fornecer uma resposta mais detalhada.`,
      `Entendo sua pergunta sobre "${originalMsg}". Posso ajudá-lo com informações gerais. O que mais você gostaria de saber?`,
      `Essa é uma questão interessante sobre "${originalMsg}"! Para informações mais precisas e atualizadas, recomendo consultar fontes especializadas. Mas estou aqui para ajudar com outras questões ou simplesmente conversar!`,
      `Compreendo sua pergunta sobre "${originalMsg}". Posso ajudá-lo com informações gerais sobre diversos assuntos. O que mais você gostaria de saber?`
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export default SmartAI

