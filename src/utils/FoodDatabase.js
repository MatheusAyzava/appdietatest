// Base de dados de alimentos comuns
class FoodDatabase {
  constructor() {
    this.foods = [
      // Frutas
      { name: 'Maçã', calories: 52, category: 'Frutas' },
      { name: 'Banana', calories: 89, category: 'Frutas' },
      { name: 'Laranja', calories: 47, category: 'Frutas' },
      { name: 'Morango', calories: 32, category: 'Frutas' },
      { name: 'Uva', calories: 69, category: 'Frutas' },
      { name: 'Abacaxi', calories: 50, category: 'Frutas' },
      { name: 'Mamão', calories: 43, category: 'Frutas' },
      { name: 'Melancia', calories: 30, category: 'Frutas' },
      
      // Vegetais
      { name: 'Alface', calories: 15, category: 'Vegetais' },
      { name: 'Tomate', calories: 18, category: 'Vegetais' },
      { name: 'Cenoura', calories: 41, category: 'Vegetais' },
      { name: 'Brócolis', calories: 34, category: 'Vegetais' },
      { name: 'Espinafre', calories: 23, category: 'Vegetais' },
      { name: 'Pepino', calories: 16, category: 'Vegetais' },
      
      // Proteínas
      { name: 'Frango grelhado (100g)', calories: 165, category: 'Proteínas' },
      { name: 'Peito de frango (100g)', calories: 165, category: 'Proteínas' },
      { name: 'Ovo cozido', calories: 155, category: 'Proteínas' },
      { name: 'Omelete (2 ovos)', calories: 310, category: 'Proteínas' },
      { name: 'Salmão (100g)', calories: 208, category: 'Proteínas' },
      { name: 'Atum (100g)', calories: 144, category: 'Proteínas' },
      { name: 'Carne bovina (100g)', calories: 250, category: 'Proteínas' },
      { name: 'Peito de peru (100g)', calories: 135, category: 'Proteínas' },
      
      // Carboidratos
      { name: 'Arroz branco (100g)', calories: 130, category: 'Carboidratos' },
      { name: 'Arroz integral (100g)', calories: 111, category: 'Carboidratos' },
      { name: 'Macarrão (100g)', calories: 131, category: 'Carboidratos' },
      { name: 'Pão integral (fatia)', calories: 80, category: 'Carboidratos' },
      { name: 'Pão francês (unidade)', calories: 150, category: 'Carboidratos' },
      { name: 'Batata doce (100g)', calories: 86, category: 'Carboidratos' },
      { name: 'Batata inglesa (100g)', calories: 77, category: 'Carboidratos' },
      { name: 'Aveia (100g)', calories: 389, category: 'Carboidratos' },
      
      // Laticínios
      { name: 'Leite integral (200ml)', calories: 122, category: 'Laticínios' },
      { name: 'Leite desnatado (200ml)', calories: 70, category: 'Laticínios' },
      { name: 'Iogurte natural (200g)', calories: 120, category: 'Laticínios' },
      { name: 'Queijo mussarela (100g)', calories: 300, category: 'Laticínios' },
      { name: 'Queijo cottage (100g)', calories: 98, category: 'Laticínios' },
      { name: 'Requeijão (50g)', calories: 120, category: 'Laticínios' },
      
      // Lanches
      { name: 'Biscoito água e sal (unidade)', calories: 25, category: 'Lanches' },
      { name: 'Bolacha recheada (unidade)', calories: 70, category: 'Lanches' },
      { name: 'Chocolate ao leite (30g)', calories: 155, category: 'Lanches' },
      { name: 'Amendoim (30g)', calories: 170, category: 'Lanches' },
      { name: 'Castanha do Pará (30g)', calories: 200, category: 'Lanches' },
      { name: 'Nozes (30g)', calories: 200, category: 'Lanches' },
      
      // Bebidas
      { name: 'Água', calories: 0, category: 'Bebidas' },
      { name: 'Suco de laranja (200ml)', calories: 90, category: 'Bebidas' },
      { name: 'Refrigerante (lata)', calories: 140, category: 'Bebidas' },
      { name: 'Café preto', calories: 2, category: 'Bebidas' },
      { name: 'Café com leite (200ml)', calories: 50, category: 'Bebidas' },
      { name: 'Chá verde', calories: 2, category: 'Bebidas' },
      
      // Pratos Comuns
      { name: 'Arroz com feijão (prato)', calories: 350, category: 'Pratos' },
      { name: 'Salada verde (prato)', calories: 50, category: 'Pratos' },
      { name: 'Frango com arroz (prato)', calories: 450, category: 'Pratos' },
      { name: 'Lasanha (fatia)', calories: 350, category: 'Pratos' },
      { name: 'Pizza (fatia média)', calories: 250, category: 'Pratos' },
      { name: 'Hambúrguer', calories: 500, category: 'Pratos' },
      { name: 'Sushi (8 unidades)', calories: 300, category: 'Pratos' },
    ]
  }

  search(query) {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return []

    return this.foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.category.toLowerCase().includes(searchTerm)
    ).slice(0, 10) // Limita a 10 resultados
  }

  getByCategory(category) {
    return this.foods.filter(food => food.category === category)
  }

  getAllCategories() {
    return [...new Set(this.foods.map(food => food.category))]
  }

  addCustomFood(name, calories, category = 'Personalizado') {
    this.foods.push({ name, calories, category })
    // Salva no localStorage
    this.saveCustomFoods()
  }

  saveCustomFoods() {
    const customFoods = this.foods.filter(f => f.category === 'Personalizado')
    localStorage.setItem('whis_custom_foods', JSON.stringify(customFoods))
  }

  loadCustomFoods() {
    try {
      const saved = localStorage.getItem('whis_custom_foods')
      if (saved) {
        const customFoods = JSON.parse(saved)
        // Remove antigos personalizados e adiciona os salvos
        this.foods = this.foods.filter(f => f.category !== 'Personalizado')
        this.foods.push(...customFoods)
      }
    } catch (error) {
      console.error('Erro ao carregar alimentos personalizados:', error)
    }
  }
}

export default FoodDatabase

