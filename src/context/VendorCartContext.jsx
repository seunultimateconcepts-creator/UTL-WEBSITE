/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const VendorCartContext = createContext(null)
const STORAGE_KEY = 'utl_vendor_carts'

/**
 * VendorCartContext
 *
 * Deliberately SEPARATE from CartContext.jsx (that one is the
 * Ultimate Concepts sourcing-request cart — different backend model
 * entirely, see SourcingRequest vs Order). This one is for real
 * vendor Products, checked out via POST /orders.
 *
 * Keyed by vendorId, NOT a single flat list — an Order has exactly
 * one vendorId, so items from different vendors can never be
 * combined into one checkout. A customer CAN have separate carts
 * going for two different vendors at once (normal multi-vendor
 * marketplace behavior — Amazon-style, checkout splits by seller);
 * they just check out one vendor at a time.
 *
 * Shape: { [vendorId]: { vendorName, items: { [productId]: {...} } } }
 * Each item: { productId, name, price, currency, image, quantity, stock, category }
 */
export function VendorCartProvider({ children }) {
  const [carts, setCarts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : {}
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carts))
  }, [carts])

  const addItem = (vendorId, vendorName, product, quantity = 1) => {
    setCarts((prev) => {
      const existingCart = prev[vendorId] || { vendorName, items: {} }
      const existingItem = existingCart.items[product.productId]
      const newQuantity = Math.min(
        (existingItem?.quantity || 0) + quantity,
        product.stock ?? Infinity
      )
      return {
        ...prev,
        [vendorId]: {
          vendorName,
          items: {
            ...existingCart.items,
            [product.productId]: { ...product, quantity: newQuantity },
          },
        },
      }
    })
  }

  const removeItem = (vendorId, productId) => {
    setCarts((prev) => {
      const cart = prev[vendorId]
      if (!cart) return prev
      const { [productId]: _removed, ...remainingItems } = cart.items
      if (Object.keys(remainingItems).length === 0) {
        const { [vendorId]: _gone, ...rest } = prev
        return rest
      }
      return { ...prev, [vendorId]: { ...cart, items: remainingItems } }
    })
  }

  const updateQuantity = (vendorId, productId, quantity) => {
    if (quantity < 1) {
      removeItem(vendorId, productId)
      return
    }
    setCarts((prev) => {
      const cart = prev[vendorId]
      if (!cart || !cart.items[productId]) return prev
      const cappedQuantity = Math.min(quantity, cart.items[productId].stock ?? Infinity)
      return {
        ...prev,
        [vendorId]: {
          ...cart,
          items: {
            ...cart.items,
            [productId]: { ...cart.items[productId], quantity: cappedQuantity },
          },
        },
      }
    })
  }

  const clearVendorCart = (vendorId) => {
    setCarts((prev) => {
      const { [vendorId]: _gone, ...rest } = prev
      return rest
    })
  }

  const getCart = (vendorId) => {
    const cart = carts[vendorId]
    if (!cart) return { vendorName: '', items: [], total: 0, count: 0 }
    const items = Object.values(cart.items)
    return {
      vendorName: cart.vendorName,
      items,
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    }
  }

  const getVendorCartCount = (vendorId) => {
    const cart = carts[vendorId]
    if (!cart) return 0
    return Object.values(cart.items).reduce((sum, i) => sum + i.quantity, 0)
  }

  return (
    <VendorCartContext.Provider
      value={{ carts, addItem, removeItem, updateQuantity, clearVendorCart, getCart, getVendorCartCount }}
    >
      {children}
    </VendorCartContext.Provider>
  )
}

export function useVendorCart() {
  const ctx = useContext(VendorCartContext)
  if (!ctx) throw new Error('useVendorCart must be used inside a VendorCartProvider')
  return ctx
}