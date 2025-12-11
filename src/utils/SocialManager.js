// Gerenciador Social - Grupos, Rankings e Progresso Social
class SocialManager {
  constructor(userEmail = null) {
    this.userEmail = userEmail
    this.storageKey = userEmail ? `whis_social_data_${userEmail}` : 'whis_social_data'
    this.loadData()
  }

  // Atualiza o e-mail do usuário e recarrega dados
  setUserEmail(email) {
    this.userEmail = email
    this.storageKey = email ? `whis_social_data_${email}` : 'whis_social_data'
    this.loadData()
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        this.userProfile = data.userProfile || this.createDefaultProfile()
        this.currentGroup = data.currentGroup || null
        this.privacyMode = data.privacyMode || 'solo' // solo, social, ghost
        this.friends = data.friends || []
        this.achievements = data.achievements || []
        this.streak = data.streak || 0
      } else {
        this.initializeDefault()
      }
    } catch (error) {
      console.error('Erro ao carregar dados sociais:', error)
      this.initializeDefault()
    }
  }

  initializeDefault() {
    this.userProfile = this.createDefaultProfile()
    this.currentGroup = null
    this.privacyMode = 'solo'
    this.friends = []
    this.achievements = []
    this.streak = 0
    this.saveData()
  }

  createDefaultProfile() {
    return {
      id: Date.now().toString(),
      name: 'Usuário',
      photo: null,
      motivationalQuote: 'Vamos alcançar nossos objetivos juntos! 💪',
      goals: {
        calories: 2000,
        water: 8,
        steps: 10000,
        exercises: 0
      },
      weeklyProgress: {
        calories: 0,
        water: 0,
        steps: 0,
        exercises: 0
      },
      badges: [],
      mood: null
    }
  }

  saveData() {
    try {
      const data = {
        userProfile: this.userProfile,
        currentGroup: this.currentGroup,
        privacyMode: this.privacyMode,
        friends: this.friends,
        achievements: this.achievements,
        streak: this.streak
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar dados sociais:', error)
    }
  }

  // Cria um grupo
  createGroup(groupName) {
    const group = {
      id: Date.now().toString(),
      name: groupName,
      code: this.generateGroupCode(),
      members: [{
        id: this.userProfile.id,
        email: this.userEmail,
        name: this.userProfile.name,
        role: 'admin',
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      }],
      admins: [this.userProfile.id],
      createdAt: new Date().toISOString(),
      challenges: []
    }
    this.currentGroup = group
    this.updateOnlineStatus(true)
    this.saveData()
    return group
  }

  // Entra em um grupo por código
  joinGroup(groupCode) {
    // Em produção, isso buscaria um servidor
    // Por enquanto, simula entrada em grupo
    const existingMembers = [
      {
        id: 'friend1',
        email: 'julia@email.com',
        name: 'Júlia',
        role: 'member',
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString() // Online há 5 min
      },
      {
        id: 'friend2',
        email: 'ana@email.com',
        name: 'Ana',
        role: 'member',
        joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // Offline há 2h
      }
    ]

    const group = {
      id: 'group_' + groupCode,
      code: groupCode,
      name: 'Grupo ' + groupCode,
      members: [
        ...existingMembers,
        {
          id: this.userProfile.id,
          email: this.userEmail,
          name: this.userProfile.name,
          role: 'member',
          joinedAt: new Date().toISOString(),
          lastSeen: new Date().toISOString()
        }
      ],
      admins: ['friend1'], // Júlia é admin
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    this.currentGroup = group
    this.updateOnlineStatus(true)
    this.saveData()
    return group
  }

  // Atualiza status online
  updateOnlineStatus(isOnline) {
    if (!this.currentGroup) return
    
    const memberIndex = this.currentGroup.members.findIndex(
      m => m.id === this.userProfile.id
    )
    
    if (memberIndex !== -1) {
      this.currentGroup.members[memberIndex].lastSeen = new Date().toISOString()
      this.currentGroup.members[memberIndex].isOnline = isOnline
      this.saveData()
    }
  }

  // Verifica se usuário está online (últimos 5 minutos)
  isMemberOnline(member) {
    if (!member.lastSeen) return false
    const lastSeen = new Date(member.lastSeen)
    const now = new Date()
    const diffMinutes = (now - lastSeen) / (1000 * 60)
    return diffMinutes < 5
  }

  // Verifica se usuário é admin
  isAdmin() {
    if (!this.currentGroup) return false
    if (!this.currentGroup.admins) {
      // Se não há admins definidos, o criador do grupo é admin
      return this.currentGroup.members?.[0]?.id === this.userProfile.id || false
    }
    return this.currentGroup.admins.includes(this.userProfile.id) || false
  }

  // Adiciona/remove admin
  setAdmin(memberId, isAdmin) {
    if (!this.isAdmin()) {
      return { success: false, message: 'Apenas administradores podem gerenciar admins' }
    }

    if (!this.currentGroup.admins) {
      this.currentGroup.admins = []
    }

    if (isAdmin) {
      if (!this.currentGroup.admins.includes(memberId)) {
        this.currentGroup.admins.push(memberId)
      }
    } else {
      this.currentGroup.admins = this.currentGroup.admins.filter(id => id !== memberId)
    }

    // Atualiza role do membro
    const member = this.currentGroup.members.find(m => m.id === memberId)
    if (member) {
      member.role = isAdmin ? 'admin' : 'member'
    }

    this.saveData()
    return { success: true, message: isAdmin ? 'Admin adicionado' : 'Admin removido' }
  }

  // Remove membro do grupo
  removeMember(memberId) {
    if (!this.isAdmin()) {
      return { success: false, message: 'Apenas administradores podem remover membros' }
    }

    if (memberId === this.userProfile.id) {
      return { success: false, message: 'Você não pode remover a si mesmo' }
    }

    this.currentGroup.members = this.currentGroup.members.filter(m => m.id !== memberId)
    this.currentGroup.admins = this.currentGroup.admins.filter(id => id !== memberId)
    this.saveData()
    return { success: true, message: 'Membro removido' }
  }

  // Obtém lista de membros com status
  getGroupMembers() {
    if (!this.currentGroup) return []
    
    return this.currentGroup.members.map(member => ({
      ...member,
      isOnline: this.isMemberOnline(member)
    }))
  }

  generateGroupCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Atualiza progresso do usuário
  updateProgress(stats) {
    if (this.privacyMode === 'solo') return

    this.userProfile.weeklyProgress = {
      calories: (this.userProfile.weeklyProgress.calories || 0) + (stats.currentCalories || 0),
      water: (this.userProfile.weeklyProgress.water || 0) + (stats.waterGlasses || 0),
      steps: (this.userProfile.weeklyProgress.steps || 0) + (stats.steps || 0),
      exercises: (this.userProfile.weeklyProgress.exercises || 0) + (stats.exercises || 0)
    }

    // Verifica conquistas
    this.checkAchievements(stats)
    this.saveData()
  }

  // Verifica e concede conquistas
  checkAchievements(stats) {
    const newAchievements = []

    // Conquista de água
    if (stats.waterPercentage >= 100 && !this.hasAchievement('water_master')) {
      newAchievements.push({
        id: 'water_master',
        name: 'Mestre da Água 💧',
        description: 'Bateu a meta de água!',
        date: new Date().toISOString()
      })
    }

    // Conquista de calorias
    if (stats.percentage >= 100 && !this.hasAchievement('calorie_king')) {
      newAchievements.push({
        id: 'calorie_king',
        name: 'Rei das Calorias 🔥',
        description: 'Atingiu a meta de calorias!',
        date: new Date().toISOString()
      })
    }

    // Conquista de streak
    if (this.streak >= 7 && !this.hasAchievement('week_warrior')) {
      newAchievements.push({
        id: 'week_warrior',
        name: 'Guerreiro da Semana ⭐',
        description: '7 dias seguidos de progresso!',
        date: new Date().toISOString()
      })
    }

    if (newAchievements.length > 0) {
      this.achievements.push(...newAchievements)
      this.saveData()
      return newAchievements
    }

    return []
  }

  hasAchievement(id) {
    return this.achievements.some(a => a.id === id)
  }

  // Calcula ranking do grupo
  getGroupRanking() {
    if (!this.currentGroup) return []

    // Simula membros do grupo (em produção viria do servidor)
    const members = [
      {
        id: this.userProfile.id,
        name: this.userProfile.name,
        progress: this.calculateProgressScore(),
        streak: this.streak,
        photo: this.userProfile.photo
      },
      {
        id: 'friend1',
        name: 'Júlia',
        progress: 85,
        streak: 5,
        photo: null
      },
      {
        id: 'friend2',
        name: 'Ana',
        progress: 72,
        streak: 3,
        photo: null
      }
    ]

    return members.sort((a, b) => b.progress - a.progress)
  }

  calculateProgressScore() {
    const progress = this.userProfile.weeklyProgress
    const goals = this.userProfile.goals
    
    const caloriesScore = Math.min((progress.calories / (goals.calories * 7)) * 100, 100)
    const waterScore = Math.min((progress.water / (goals.water * 7)) * 100, 100)
    
    return Math.round((caloriesScore + waterScore) / 2)
  }

  // Gera feed de atualizações
  getSocialFeed() {
    if (!this.currentGroup) return []

    const feed = []

    // Simula atualizações do grupo
    const updates = [
      {
        id: '1',
        type: 'water_goal',
        user: 'Júlia',
        message: '🌊 Júlia já bateu a meta de água hoje!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'calorie_goal',
        user: 'Ana',
        message: '🔥 Ana concluiu 60% da meta de calorias!',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'meal_logged',
        user: 'Mariana',
        message: '🥗 Mariana registrou todas as refeições do dia!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ]

    return updates
  }

  // Define modo de privacidade
  setPrivacyMode(mode) {
    this.privacyMode = mode
    this.saveData()
    return `Modo ${mode === 'solo' ? 'Individual' : mode === 'social' ? 'Social' : 'Fantasma'} ativado!`
  }

  // Incrementa streak
  incrementStreak() {
    const today = new Date().toLocaleDateString('pt-BR')
    const lastStreakDate = localStorage.getItem('last_streak_date')
    
    if (lastStreakDate !== today) {
      if (lastStreakDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')) {
        this.streak += 1
      } else {
        this.streak = 1
      }
      localStorage.setItem('last_streak_date', today)
      this.saveData()
    }
  }
}

export default SocialManager

