/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'utl_cart'

/**
 * ✅ Repurposed for Ultimate Concepts' sourcing requests, not priced
 * products — this only ever served the old hardcoded Ultimate Shop
 * catalog, so nothing else in the app depends on the old shape.
 * Each item: { id, platform, description, referenceImageUrl, budget }
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => [...prev, { ...item, id: item.id || `req-${Date.now()}-${Math.random()}` }])
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setItems([])

  const cartCount = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}