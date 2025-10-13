// Утилиты для работы с корзиной

// Функция для отправки события об изменении корзины
const dispatchCartChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cartChanged'))
  }
}

export const getCart = () => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('cart') || '[]')
}

export const setCart = (cart) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart', JSON.stringify(cart))
  dispatchCartChange()
}

export const addToCart = (productId, quantity = 1) => {
  const cart = getCart()
  const existingItem = cart.find(item => item.id === productId)
  
  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + quantity
  } else {
    cart.push({ id: productId, qty: quantity })
  }
  
  setCart(cart)
  return cart
}

export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item.id !== productId)
  setCart(cart)
  return cart
}

export const updateCartItem = (productId, quantity) => {
  const cart = getCart()
  
  if (quantity <= 0) {
    return removeFromCart(productId)
  }
  
  const updatedCart = cart.map(item => 
    item.id === productId ? { ...item, qty: quantity } : item
  )
  
  setCart(updatedCart)
  return updatedCart
}

export const getCartCount = () => {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0)
}

export const clearCart = () => {
  setCart([])
  return []
}
