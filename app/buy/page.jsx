'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCart, updateCartItem, removeFromCart } from '@/utils/cart'

// отключаем статическую генерацию, чтобы не было prerender-ошибок
export const dynamic = 'force-dynamic'

function BuyInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const qty = parseInt(searchParams.get('qty') || '1', 10)

  // Корзина с полной информацией о товарах
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)

  // Загружаем данные о товарах из базы данных
  useEffect(() => {
    const loadProducts = async () => {
      const cartItems = getCart()
      if (cartItems.length === 0) {
        setLoading(false)
        return
      }

      const productIds = cartItems.map(item => item.id)
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, image_url')
        .in('id', productIds)

      if (!error && data) {
        const productsMap = {}
        data.forEach(product => {
          productsMap[product.id] = product
        })
        setProducts(productsMap)
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const stored = getCart()
    setCart(stored)
  }, [])

  const total = useMemo(
    () => cart.reduce((acc, item) => {
      const product = products[item.id]
      const price = product ? Number(product.price || 0) : 0
      return acc + price * (item.qty || 1)
    }, 0),
    [cart, products]
  )

  const handleUpdateCartItem = (itemId, newQty) => {
    const updated = updateCartItem(itemId, newQty)
    setCart(updated)
  }

  const handleRemoveFromCart = (itemId) => {
    const updated = removeFromCart(itemId)
    setCart(updated)
  }

  if (loading) {
    return (
      <main className="pt-16 container-page py-8">
        <h1 className="text-2xl font-semibold mb-4">Корзина</h1>
        <div className="card p-6">
          <div className="animate-pulse">Загрузка корзины...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-16 container-page py-4 sm:py-8 px-4">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Корзина</h1>

      {cart.length === 0 ? (
        <div className="card p-6 sm:p-8 text-center">
          <div className="text-base sm:text-lg font-medium">Корзина пуста</div>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Добавьте товары из каталога.</p>
          <div className="mt-4">
            <Link href="/" className="btn btn-primary text-sm sm:text-base py-2">В каталог</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => {
            const product = products[item.id]
            const price = product ? Number(product.price || 0) : 0
            const itemTotal = price * (item.qty || 1)
            
            return (
              <div key={item.id} className="card p-3 sm:p-4">
                {/* Мобильная версия - вертикальная компоновка */}
                <div className="block sm:hidden">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Изображение товара */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product?.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Нет фото
                        </div>
                      )}
                    </div>
                    
                    {/* Информация о товаре */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {product?.title || `Товар ${item.id}`}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {price.toLocaleString('ru-RU')} ₸ за шт.
                      </p>
                    </div>
                    
                    {/* Кнопка удаления */}
                    <button
                      className="text-red-600 hover:text-red-700 p-1"
                      onClick={() => handleRemoveFromCart(item.id)}
                      title="Удалить"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Управление количеством и сумма */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        className="px-3 py-2 text-lg font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center min-w-[44px]" 
                        onClick={() => handleUpdateCartItem(item.id, (item.qty || 1) - 1)}
                        disabled={(item.qty || 1) <= 1}
                        title="Уменьшить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-3 py-2 min-w-[3rem] text-center font-semibold bg-white border-x border-gray-200">
                        {item.qty || 1}
                      </span>
                      <button 
                        className="px-3 py-2 text-lg font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center min-w-[44px]" 
                        onClick={() => handleUpdateCartItem(item.id, (item.qty || 1) + 1)}
                        title="Увеличить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Сумма за товар */}
                    <div className="text-right">
                      <div className="font-semibold text-base">
                        {itemTotal.toLocaleString('ru-RU')} ₸
                      </div>
                    </div>
                  </div>
                </div>

                {/* Десктопная версия - горизонтальная компоновка */}
                <div className="hidden sm:flex items-center gap-4">
                  {/* Изображение товара */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {product?.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Нет фото
                      </div>
                    )}
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">
                      {product?.title || `Товар ${item.id}`}
                    </h3>
                    <p className="text-base text-gray-600">
                      {price.toLocaleString('ru-RU')} ₸ за шт.
                    </p>
                  </div>
                  
                  {/* Управление количеством */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button 
                        className="px-3 py-2 text-lg font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center min-w-[40px]" 
                        onClick={() => handleUpdateCartItem(item.id, (item.qty || 1) - 1)}
                        disabled={(item.qty || 1) <= 1}
                        title="Уменьшить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-3 py-2 min-w-[3rem] text-center font-semibold bg-white border-x border-gray-200">
                        {item.qty || 1}
                      </span>
                      <button 
                        className="px-3 py-2 text-lg font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center min-w-[40px]" 
                        onClick={() => handleUpdateCartItem(item.id, (item.qty || 1) + 1)}
                        title="Увеличить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Сумма за товар */}
                    <div className="text-right min-w-[6rem]">
                      <div className="font-semibold text-base">
                        {itemTotal.toLocaleString('ru-RU')} ₸
                      </div>
                    </div>
                    
                    {/* Кнопка удаления */}
                    <button
                      className="btn btn-ghost text-red-600 hover:bg-red-50 text-base p-2"
                      onClick={() => handleRemoveFromCart(item.id)}
                      title="Удалить из корзины"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Итоговая сумма */}
          <div className="card p-4 sm:p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-base sm:text-xl font-semibold">Итого к оплате</div>
              <div className="text-lg sm:text-2xl font-bold text-primary">
                {total.toLocaleString('ru-RU')} ₸
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-3">
            <button className="btn btn-primary w-full text-base py-3 font-semibold">
              Оформить заказ
            </button>
            <Link href="/" className="btn btn-ghost w-full text-base py-2">
              Продолжить покупки
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <main className="pt-16 container-page py-8">
          <div className="card p-6">Загрузка…</div>
        </main>
      }
    >
      <BuyInner />
    </Suspense>
  )
}
