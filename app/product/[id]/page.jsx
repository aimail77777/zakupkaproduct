'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { addToCart } from '@/utils/cart'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, description, image_url')
        .eq('id', id)
        .maybeSingle()
      if (!mounted) return
      if (error) console.error(error)
      setProduct(data || null)
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <main className="py-4 sm:py-6 lg:py-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
          {/* Фото скелетон */}
          <div className="md:sticky md:top-4 self-start">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] animate-pulse">
              <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
            </div>
          </div>
          
          {/* Контент скелетон */}
          <section className="card p-4 sm:p-6 min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]">
            {/* Заголовок */}
            <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-2/3 animate-pulse mb-6 sm:mb-8"></div>

            {/* Цена */}
            <div className="mt-4 sm:mt-5 mb-4 sm:mb-6">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16 animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-32 sm:w-40 animate-pulse"></div>
            </div>

            {/* Количество */}
            <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 animate-pulse mb-2 sm:mb-3"></div>
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-32 sm:w-40 animate-pulse"></div>
            </div>

            {/* Кнопки */}
            <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-full sm:w-32 animate-pulse"></div>
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-full sm:w-28 animate-pulse"></div>
            </div>

            {/* Описание */}
            <div className="mt-6 sm:mt-8">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-20 sm:w-24 animate-pulse mb-3 sm:mb-4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }
  if (!product) {
    return (
      <main className="py-8 sm:py-16 text-center px-4">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Товар не найден</h1>
        <button onClick={() => router.push('/')} className="btn btn-primary">На главную</button>
      </main>
    )
  }

  const { title, price, description, image_url } = product

  return (
    <main className="py-4 sm:py-6 lg:py-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
        {/* Фото */}
        <div className="md:sticky md:top-4 self-start">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-black h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh]">
            {image_url ? (
              <img src={image_url} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-white/70 text-xs sm:text-sm">Нет изображения</div>
            )}
          </div>
        </div>

        {/* Инфо */}
        <section className="card p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight">{title}</h1>

          <div className="mt-4 sm:mt-5">
            <div className="text-xs sm:text-sm text-gray-500">Цена</div>
            <div className="text-2xl sm:text-3xl font-bold">{price ? `${price} ₸` : '—'}</div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="text-xs sm:text-sm text-gray-600 mb-2">Количество</div>
            <div className="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
              <button 
                className="px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 flex items-center justify-center min-w-[44px] sm:min-w-[48px]" 
                onClick={() => setQty(q => Math.max(1, q - 1))} 
                disabled={qty <= 1}
                title="Уменьшить количество"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              
              <input 
                className="w-16 sm:w-20 text-center outline-none py-2 sm:py-3 text-base sm:text-lg font-semibold bg-white border-x border-gray-200 focus:border-blue-300 transition-colors" 
                type="number" 
                min="1" 
                value={qty} 
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))} 
              />
              
              <button 
                className="px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center min-w-[44px] sm:min-w-[48px]" 
                onClick={() => setQty(q => q + 1)}
                title="Увеличить количество"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Передаём id и qty в корзину */}
            <button
              onClick={() => { 
                addToCart(product.id, qty)
                router.push('/buy')
              }}
              className="btn btn-primary px-4 sm:px-5 py-2 text-sm sm:text-base flex-1 sm:flex-none"
            >
              В корзину
            </button>
            <button onClick={() => router.push('/')} className="btn btn-ghost px-4 sm:px-5 py-2 text-sm sm:text-base flex-1 sm:flex-none">В каталог</button>
          </div>

          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Описание</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {description || 'Описание будет добавлено.'}
            </p>
          </div>
        </section>
      </div>

      {/* мобильная плашка */}
      <div className="fixed inset-x-0 bottom-0 z-10 sm:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="mx-4 mb-4 rounded-xl shadow-lg bg-white border p-3 flex items-center justify-between">
          <div className="font-semibold text-sm">{price ? `${price} ₸` : '—'}</div>
          <button
            onClick={() => { 
              addToCart(product.id, qty)
              router.push('/buy')
            }}
            className="btn btn-primary px-4 py-2 text-sm"
          >
            В корзину
          </button>
        </div>
      </div>
    </main>
  )
}
