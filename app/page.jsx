'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="py-8">
      {/* HERO — чистый без кнопок */}
      <section className="mb-8">
        <div className="rounded-2xl bg-gradient-to-r from-brand to-blue-500 text-white p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Zakupka+ — просто покупать, приятно получать
          </h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            Небольшой, но отборный ассортимент. Покупайте блоки товаров, копите уровни и открывайте бонусы.
          </p>
        </div>
      </section>

      {/* Каталог */}
      <section id="catalog" className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Каталог</h2>
          <span className="text-sm text-gray-500">{products.length} позиций</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-sm text-gray-500">
            Пока пусто. Загляните позже — скоро добавим больше товаров.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
