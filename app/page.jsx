'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '../components/ProductCard'
import { getCartCount } from '@/utils/cart'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, description, image_url')
        .order('title', { ascending: true })
      if (!mounted) return
      if (error) {
        console.error(error)
        setProducts([])
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  // Загружаем количество товаров в корзине при загрузке страницы
  useEffect(() => {
    setCartCount(getCartCount())
  }, [])

  // Слушаем события изменения корзины
  useEffect(() => {
    const handleCartChange = () => {
      setCartCount(getCartCount())
    }
    
    window.addEventListener('cartChanged', handleCartChange)
    
    return () => window.removeEventListener('cartChanged', handleCartChange)
  }, [])

  const handleAddToCart = () => {
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  return (
    <div className="py-4 sm:py-8">
      {/* Уведомление о добавлении в корзину */}
      {showNotification && (
        <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="hidden sm:inline">Товар добавлен в корзину!</span>
          <span className="sm:hidden">Добавлено!</span>
        </div>
      )}

      {/* HERO — чистый без кнопок */}
      <section className="mb-6 sm:mb-8">
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand to-blue-500 text-white p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
            lvlmart — просто покупать, приятно получать
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
            Небольшой, но отборный ассортимент. Покупайте блоки товаров, копите уровни и открывайте бонусы.
          </p>
        </div>
      </section>

      {/* Каталог */}
      <section id="catalog" className="mt-4 sm:mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">Каталог</h2>
          <span className="text-xs sm:text-sm text-gray-500">{products.length} позиций</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-48 sm:h-64 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            Пока пусто. Загляните позже — скоро добавим больше товаров.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
          </div>
        )}
      </section>
    </div>
  )
}
