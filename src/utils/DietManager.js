// Gerenciador de Dieta - Controla calorias, refeições e lembretes
class DietManager {
  constructor(userEmail = null) {
    this.userEmail = userEmail
    this.storageKey = userEmail ? `whis_diet_data_${userEmail}` : 'whis_diet_data'
    this.waterReminderInterval = 2 // horas (padrão)
    this.loadData()
    this.reminders = []
    this.initReminders()
  }

  // Atualiza o e-mail do usuário e recarrega dados
  setUserEmail(email) {
    this.userEmail = email
    this.storageKey = email ? `whis_diet_data_${email}` : 'whis_diet_data'
    this.loadData()
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        this.dailyCalorieLimit = data.dailyCalorieLimit || 2000
        this.currentCalories = data.currentCalories || 0
        this.meals = data.meals || []
        this.waterGlasses = data.waterGlasses || 0
        this.waterGoal = data.waterGoal || 8
        this.waterGoalLiters = data.waterGoalLiters || 2
        this.waterReminderInterval = data.waterReminderInterval || 2
        this.wakeUpTime = data.wakeUpTime || '07:00'
        this.sleepTime = data.sleepTime || '23:00'
        this.glassSizeML = data.glassSizeML || 250
        this.startDate = data.startDate || new Date().toISOString()
        this.weight = data.weight || null
        this.goalWeight = data.goalWeight || null
      } else {
        this.initializeDefault()
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      this.initializeDefault()
    }
  }

  initializeDefault() {
    this.dailyCalorieLimit = 2000
    this.currentCalories = 0
    this.meals = []
    this.waterGlasses = 0
    this.waterGoal = 8
    this.waterGoalLiters = 2
    this.waterReminderInterval = 2
    this.wakeUpTime = '07:00'
    this.sleepTime = '23:00'
    this.glassSizeML = 250
    this.startDate = new Date().toISOString()
    this.weight = null
    this.goalWeight = null
    this.saveData()
  }

  saveData() {
    try {
      const data = {
        dailyCalorieLimit: this.dailyCalorieLimit,
        currentCalories: this.currentCalories,
        meals: this.meals,
        waterGlasses: this.waterGlasses,
        waterGoal: this.waterGoal,
        waterGoalLiters: this.waterGoalLiters,
        waterReminderInterval: this.waterReminderInterval,
        wakeUpTime: this.wakeUpTime,
        sleepTime: this.sleepTime,
        glassSizeML: this.glassSizeML,
        startDate: this.startDate,
        weight: this.weight,
        goalWeight: this.goalWeight
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
    }
  }

  // Define meta diária de calorias
  setDailyCalorieLimit(limit) {
    this.dailyCalorieLimit = parseInt(limit)
    this.saveData()
    return `Meta diária de calorias definida para ${this.dailyCalorieLimit} kcal.`
  }

  // Adiciona uma refeição
  addMeal(name, calories, image = null) {
    const meal = {
      id: Date.now(),
      name: name,
      calories: parseInt(calories),
      image: image,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR')
    }

    this.meals.push(meal)
    this.currentCalories += meal.calories
    this.saveData()

    // Verifica alertas
    this.checkCalorieWarning()

    const remaining = this.dailyCalorieLimit - this.currentCalories
    let response = `Refeição "${name}" adicionada: ${calories} kcal. `
    
    if (remaining > 0) {
      response += `Você ainda pode consumir ${remaining} kcal hoje.`
    } else if (remaining === 0) {
      response += `Você atingiu sua meta diária! Parabéns! 🎉`
      this.showNotification('🎉 Meta Atingida!', 'Você atingiu sua meta diária de calorias! Parabéns!')
    } else {
      response += `⚠️ Atenção: Você ultrapassou sua meta em ${Math.abs(remaining)} kcal.`
      this.showNotification('⚠️ Atenção!', `Você ultrapassou sua meta em ${Math.abs(remaining)} kcal.`)
    }

    return response
  }

  // Remove uma refeição
  removeMeal(mealId) {
    const meal = this.meals.find(m => m.id === mealId)
    if (meal) {
      this.currentCalories -= meal.calories
      this.meals = this.meals.filter(m => m.id !== mealId)
      this.saveData()
      return `Refeição "${meal.name}" removida. ${meal.calories} kcal descontadas.`
    }
    return 'Refeição não encontrada.'
  }

  // Adiciona copo de água
  addWaterGlass() {
    const glassML = this.glassSizeML || 250
    return this.addWaterML(glassML)
  }

  // Adiciona água em ML
  addWaterML(ml) {
    const glasses = ml / (this.glassSizeML || 250)
    this.waterGlasses += glasses
    this.saveData()
    
    const remaining = this.waterGoal - this.waterGlasses
    const remainingML = (remaining * (this.glassSizeML || 250))
    
    if (remaining > 0) {
      const message = `Água registrada! Você adicionou ${ml}ml (${glasses.toFixed(1)} copo${glasses > 1 ? 's' : ''}). Você já tomou ${this.waterGlasses.toFixed(1)} copos hoje. Faltam ${remaining.toFixed(1)} copos (${remainingML.toFixed(0)}ml) para atingir sua meta.`
      return message
    } else {
      this.showNotification('🎉 Meta de Água!', 'Parabéns! Você atingiu sua meta de água hoje!')
      return `Parabéns! Você atingiu sua meta de água hoje! 🎉`
    }
  }

  // Define meta de água
  setWaterGoal(glasses) {
    this.waterGoal = parseInt(glasses)
    this.saveData()
    return `Meta diária de água definida para ${this.waterGoal} copos.`
  }

  // Define meta de água em litros
  setWaterGoalLiters(liters) {
    this.waterGoalLiters = parseFloat(liters)
    // Atualiza também em copos (assumindo copo de 250ml)
    this.waterGoal = Math.round((this.waterGoalLiters * 1000) / this.glassSizeML)
    this.saveData()
    return `Meta diária de água definida para ${this.waterGoalLiters} litros (${this.waterGoal} copos).`
  }

  // Define horários de sono
  setSleepSchedule(wakeUpTime, sleepTime) {
    this.wakeUpTime = wakeUpTime
    this.sleepTime = sleepTime
    this.saveData()
    this.setupReminders() // Reconfigura lembretes com novos horários
    return `Horários atualizados: Acorda às ${wakeUpTime} e dorme às ${sleepTime}.`
  }

  // Define tamanho do copo em ML
  setGlassSize(ml) {
    this.glassSizeML = parseInt(ml)
    // Recalcula meta de copos baseado em litros
    if (this.waterGoalLiters) {
      this.waterGoal = Math.round((this.waterGoalLiters * 1000) / this.glassSizeML)
    }
    this.saveData()
    return `Tamanho do copo definido para ${ml}ml.`
  }

  // Calcula quantos ML beber em cada horário
  calculateWaterSchedule() {
    const [wakeHour, wakeMin] = this.wakeUpTime.split(':').map(Number)
    const [sleepHour, sleepMin] = this.sleepTime.split(':').map(Number)
    
    // Converte para minutos do dia
    const wakeMinutes = wakeHour * 60 + wakeMin
    const sleepMinutes = sleepHour * 60 + sleepMin
    
    // Calcula horas acordado (considera que pode passar da meia-noite)
    let awakeMinutes = sleepMinutes - wakeMinutes
    if (awakeMinutes < 0) {
      awakeMinutes = (24 * 60) - wakeMinutes
    }
    const awakeHours = awakeMinutes / 60
    
    // Total de ML a beber
    const totalML = this.waterGoalLiters * 1000
    
    // Divide em intervalos baseado no intervalo de lembretes
    const intervalHours = this.waterReminderInterval || 2
    const numIntervals = Math.floor(awakeHours / intervalHours)
    
    // ML por intervalo
    const mlPerInterval = Math.round(totalML / numIntervals)
    
    // Gera horários
    const schedule = []
    let currentMinutes = wakeMinutes
    
    for (let i = 0; i < numIntervals; i++) {
      const hours = Math.floor(currentMinutes / 60) % 24
      const mins = currentMinutes % 60
      const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
      
      schedule.push({
        time: timeString,
        ml: mlPerInterval,
        glasses: Math.round(mlPerInterval / this.glassSizeML)
      })
      
      currentMinutes += intervalHours * 60
      if (currentMinutes >= 24 * 60) {
        currentMinutes -= 24 * 60
      }
      
      // Para se passar do horário de dormir
      if (currentMinutes > sleepMinutes && sleepMinutes > wakeMinutes) {
        break
      }
    }
    
    return schedule
  }

  // Reseta dados do dia
  resetDailyData() {
    const today = new Date().toLocaleDateString('pt-BR')
    const resetKey = this.userEmail ? `last_reset_date_${this.userEmail}` : 'last_reset_date'
    const lastReset = localStorage.getItem(resetKey)
    
    if (lastReset !== today) {
      this.currentCalories = 0
      this.waterGlasses = 0
      this.meals = this.meals.filter(m => m.date === today)
      localStorage.setItem(resetKey, today)
      this.saveData()
      return 'Dados do dia resetados.'
    }
    return 'Os dados já foram resetados hoje.'
  }

  // Obtém estatísticas
  getStats() {
    const remaining = this.dailyCalorieLimit - this.currentCalories
    const percentage = (this.currentCalories / this.dailyCalorieLimit) * 100
    const waterPercentage = (this.waterGlasses / this.waterGoal) * 100
    const waterConsumedML = this.waterGlasses * this.glassSizeML
    const waterConsumedLiters = waterConsumedML / 1000

    return {
      currentCalories: this.currentCalories,
      dailyLimit: this.dailyCalorieLimit,
      remaining: remaining > 0 ? remaining : 0,
      percentage: Math.min(percentage, 100),
      waterGlasses: this.waterGlasses,
      waterGoal: this.waterGoal,
      waterGoalLiters: this.waterGoalLiters,
      waterConsumedML: waterConsumedML,
      waterConsumedLiters: waterConsumedLiters,
      waterPercentage: Math.min(waterPercentage, 100),
      mealsToday: this.meals.filter(m => m.date === new Date().toLocaleDateString('pt-BR')).length,
      wakeUpTime: this.wakeUpTime,
      sleepTime: this.sleepTime,
      glassSizeML: this.glassSizeML
    }
  }

  // Define horários de refeições automáticos
  setMealSchedule() {
    // Horários padrão baseados em dieta saudável
    return {
      breakfast: '07:00',
      morningSnack: '10:00',
      lunch: '12:30',
      afternoonSnack: '16:00',
      dinner: '19:30'
    }
  }

  // Inicializa lembretes
  initReminders() {
    // Verifica se há notificações disponíveis
    if ('Notification' in window && Notification.permission === 'granted') {
      this.setupReminders()
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Solicita permissão
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.setupReminders()
        }
      })
    }
  }

  setupReminders() {
    const schedule = this.setMealSchedule()
    
    // Limpa lembretes anteriores (exceto água que usa setTimeout)
    this.reminders.forEach(reminder => {
      if (reminder.type === 'meal') {
        clearInterval(reminder)
      }
    })
    this.reminders = this.reminders.filter(r => r.type !== 'meal')

    // Cria lembretes para cada refeição
    Object.entries(schedule).forEach(([meal, time]) => {
      this.createMealReminder(meal, time)
    })

    // Cria lembretes de água baseados nos horários de sono
    this.createWaterReminders()
  }

  createMealReminder(mealName, time) {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)

    // Se o horário já passou hoje, agenda para amanhã
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const mealNames = {
      breakfast: 'Café da manhã',
      morningSnack: 'Lanche da manhã',
      lunch: 'Almoço',
      afternoonSnack: 'Lanche da tarde',
      dinner: 'Jantar'
    }

    const timeout = reminderTime.getTime() - now.getTime()
    
    const timeoutId = setTimeout(() => {
      this.showNotification(mealNames[mealName] || mealName, `Hora do ${mealNames[mealName] || mealName}! Não esqueça de registrar suas calorias.`)
      // Agenda para o próximo dia
      this.createMealReminder(mealName, time)
    }, timeout)
    
    this.reminders.push({
      type: 'meal',
      timeout: timeoutId,
      meal: mealName
    })
  }

  createWaterReminders() {
    // Limpa lembretes anteriores
    this.reminders.forEach(reminder => {
      if (reminder.type === 'water') {
        clearTimeout(reminder.timeout)
      }
    })
    this.reminders = this.reminders.filter(r => r.type !== 'water')
    
    // Calcula horários baseado no tempo acordado
    const schedule = this.calculateWaterSchedule()
    
    schedule.forEach((item, index) => {
      const [hours, minutes] = item.time.split(':').map(Number)
      const now = new Date()
      const reminderTime = new Date()
      reminderTime.setHours(hours, minutes, 0, 0)

      // Se o horário já passou hoje, agenda para amanhã
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }

      const timeout = reminderTime.getTime() - now.getTime()
      
      if (timeout > 0) {
        const timeoutId = setTimeout(() => {
          const message = `💧 Hora de beber água! Tome ${item.ml}ml (${item.glasses} copo${item.glasses > 1 ? 's' : ''}) agora para manter-se hidratado.`
          this.showNotification('💧 Lembrete de Água', message)
          
          // Agenda para o próximo dia
          this.createWaterReminders()
        }, timeout)
        
        this.reminders.push({
          type: 'water',
          timeout: timeoutId,
          time: item.time
        })
      }
    })
  }

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'whis-diet-reminder',
        requireInteraction: false,
        silent: false
      })

      // Fecha automaticamente após 5 segundos
      setTimeout(() => {
        notification.close()
      }, 5000)
    }
  }

  // Adiciona alerta quando está perto de exceder calorias
  checkCalorieWarning() {
    const stats = this.getStats()
    const percentage = stats.percentage
    
    if (percentage >= 90 && percentage < 100) {
      this.showNotification(
        '⚠️ Atenção!',
        `Você já consumiu ${percentage.toFixed(0)}% da sua meta de calorias. Restam apenas ${stats.remaining} kcal!`
      )
    } else if (percentage >= 100) {
      this.showNotification(
        '🚨 Meta Atingida!',
        `Você atingiu sua meta diária de calorias! Parabéns! 🎉`
      )
    }
  }

  // Analisa foto de comida (simulação - pode ser integrado com API real)
  async analyzeFoodImage(imageFile) {
    // Simulação de análise de imagem
    // Em produção, você pode usar APIs como:
    // - Google Cloud Vision API
    // - Clarifai Food Model
    // - Nutritionix API
    
    return new Promise((resolve) => {
      // Por enquanto, retorna sugestões baseadas em padrões comuns
      const suggestions = [
        { name: 'Prato variado', calories: 500 },
        { name: 'Salada', calories: 200 },
        { name: 'Arroz com feijão', calories: 350 },
        { name: 'Frango grelhado', calories: 250 },
        { name: 'Massa', calories: 400 }
      ]
      
      // Simula delay de processamento
      setTimeout(() => {
        resolve(suggestions[Math.floor(Math.random() * suggestions.length)])
      }, 1000)
    })
  }
}

export default DietManager

