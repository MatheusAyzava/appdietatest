// Gerenciador de Autenticação - Login e Registro
class AuthManager {
  constructor() {
    this.storageKey = 'whis_users'
    this.currentUserKey = 'whis_current_user'
    this.users = this.loadUsers()
  }

  loadUsers() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      return {}
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users))
    } catch (error) {
      console.error('Erro ao salvar usuários:', error)
    }
  }

  // Hash simples de senha (para desenvolvimento - em produção use bcrypt)
  hashPassword(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString()
  }

  // Registra novo usuário
  register(email, password, name) {
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: 'E-mail inválido' }
    }

    // Validação de senha
    if (!password || password.length < 6) {
      return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' }
    }

    // Verifica se o e-mail já existe
    if (this.users[email]) {
      return { success: false, message: 'Este e-mail já está cadastrado' }
    }

    // Validação de nome
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'O nome deve ter pelo menos 2 caracteres' }
    }

    // Cria novo usuário
    this.users[email] = {
      email: email.toLowerCase().trim(),
      passwordHash: this.hashPassword(password),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    this.saveUsers()
    return { success: true, message: 'Usuário cadastrado com sucesso!' }
  }

  // Faz login
  login(email, password) {
    const emailLower = email.toLowerCase().trim()
    const user = this.users[emailLower]

    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos' }
    }

    const passwordHash = this.hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, message: 'E-mail ou senha incorretos' }
    }

    // Atualiza último login
    user.lastLogin = new Date().toISOString()
    this.saveUsers()

    // Salva usuário atual
    localStorage.setItem(this.currentUserKey, emailLower)
    localStorage.setItem('whis_user_name', user.name)

    return { 
      success: true, 
      message: 'Login realizado com sucesso!',
      user: {
        email: user.email,
        name: user.name
      }
    }
  }

  // Faz logout
  logout() {
    localStorage.removeItem(this.currentUserKey)
    return { success: true, message: 'Logout realizado com sucesso!' }
  }

  // Verifica se há usuário logado
  getCurrentUser() {
    const email = localStorage.getItem(this.currentUserKey)
    if (!email) return null

    const user = this.users[email]
    if (!user) {
      localStorage.removeItem(this.currentUserKey)
      return null
    }

    return {
      email: user.email,
      name: user.name
    }
  }

  // Verifica se está logado
  isLoggedIn() {
    return this.getCurrentUser() !== null
  }

  // Atualiza nome do usuário
  updateUserName(email, newName) {
    const emailLower = email.toLowerCase().trim()
    const user = this.users[emailLower]
    
    if (!user) {
      return { success: false, message: 'Usuário não encontrado' }
    }

    if (!newName || newName.trim().length < 2) {
      return { success: false, message: 'O nome deve ter pelo menos 2 caracteres' }
    }

    user.name = newName.trim()
    this.saveUsers()
    localStorage.setItem('whis_user_name', user.name)

    return { success: true, message: 'Nome atualizado com sucesso!' }
  }

  // Recupera senha (simulação - em produção enviaria e-mail)
  resetPassword(email) {
    const emailLower = email.toLowerCase().trim()
    const user = this.users[emailLower]

    if (!user) {
      return { success: false, message: 'E-mail não cadastrado' }
    }

    // Em produção, aqui enviaria um e-mail com link de recuperação
    return { 
      success: true, 
      message: 'Instruções de recuperação enviadas para seu e-mail (simulação)' 
    }
  }
}

export default AuthManager

