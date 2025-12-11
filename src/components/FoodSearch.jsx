import React, { useState, useEffect } from 'react'
import FoodDatabase from '../utils/FoodDatabase'
import './FoodSearch.css'

function FoodSearch({ onSelectFood, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCalories, setCustomCalories] = useState('')
  const foodDB = new FoodDatabase()

  useEffect(() => {
    foodDB.loadCustomFoods()
    if (searchQuery) {
      setResults(foodDB.search(searchQuery))
    } else if (selectedCategory) {
      setResults(foodDB.getByCategory(selectedCategory))
    } else {
      setResults([])
    }
  }, [searchQuery, selectedCategory])

  const categories = foodDB.getAllCategories()

  const handleSelect = (food) => {
    onSelectFood(food.name, food.calories)
    onClose()
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (customName && customCalories) {
      foodDB.addCustomFood(customName, parseInt(customCalories))
      setCustomName('')
      setCustomCalories('')
      setShowAddForm(false)
      if (searchQuery) {
        setResults(foodDB.search(searchQuery))
      }
    }
  }

  return (
    <div className="food-search-overlay" onClick={onClose}>
      <div className="food-search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="food-search-header">
          <h2>🔍 Pesquisar Alimento</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="food-search-content">
          <input
            type="text"
            className="search-input"
            placeholder="Digite o nome do alimento..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedCategory(null)
            }}
            autoFocus
          />

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(selectedCategory === category ? null : category)
                  setSearchQuery('')
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="search-results">
            {results.length > 0 ? (
              results.map((food, index) => (
                <div
                  key={index}
                  className="food-item"
                  onClick={() => handleSelect(food)}
                >
                  <div className="food-info">
                    <span className="food-name">{food.name}</span>
                    <span className="food-category">{food.category}</span>
                  </div>
                  <span className="food-calories">{food.calories} kcal</span>
                </div>
              ))
            ) : searchQuery || selectedCategory ? (
              <p className="no-results">Nenhum alimento encontrado</p>
            ) : (
              <p className="search-hint">Digite para pesquisar ou escolha uma categoria</p>
            )}
          </div>

          <button
            className="add-custom-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Adicionar Alimento Personalizado
          </button>

          {showAddForm && (
            <form className="add-custom-form" onSubmit={handleAddCustom}>
              <input
                type="text"
                placeholder="Nome do alimento"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Calorias"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                required
                min="0"
              />
              <div className="form-actions">
                <button type="submit" className="save-custom-btn">Salvar</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false)
                    setCustomName('')
                    setCustomCalories('')
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodSearch

