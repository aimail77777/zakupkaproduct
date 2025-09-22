'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
      <main className="py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-200 h-[60vh] animate-pulse" />
          <div className="rounded-2xl bg-gray-200 h-[60vh] animate-pulse" />
        </div>
      </main>
    )
  }
  if (!product) {
    return (
      <main className="py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Товар не найден</h1>
        <button onClick={() => router.push('/')} className="btn btn-primary">На главную</button>
      </main>
    )
  }

  const { title, price, description, image_url } = product

  return (
    <main className="py-6 sm:py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Фото */}
        <div className="md:sticky md:top-4 self-start">
          <div className="rounded-2xl overflow-hidden bg-black h-[60vh] sm:h-[70vh]">
            {image_url ? (
              <img src={image_url} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-white/70 text-sm">Нет изображения</div>
            )}
          </div>
        </div>

        {/* Инфо */}
        <section className="card p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{title}</h1>

          <div className="mt-5">
            <div className="text-sm text-gray-500">Цена</div>
            <div className="text-3xl font-bold">{price ? `${price} ₸` : '—'}</div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">Количество</div>
            <div className="inline-flex items-center rounded-xl border bg-white overflow-hidden">
              <button className="px-3 py-2 text-lg disabled:opacity-40" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
              <input className="w-16 text-center outline-none py-2" type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))} />
              <button className="px-3 py-2 text-lg" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Передаём id и qty в корзину */}
            <button
              onClick={() => { window.location.href = `/buy?id=${product.id}&qty=${qty}` }}
              className="btn btn-primary px-5"
            >
              В корзину
            </button>
            <button onClick={() => router.push('/')} className="btn btn-ghost">В каталог</button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Описание</h2>
            <p className="text-gray-700 leading-relaxed">
              {description || 'Описание будет добавлено.'}
            </p>
          </div>
        </section>
      </div>

      {/* мобильная плашка */}
      <div className="fixed inset-x-0 bottom-0 z-10 sm:hidden">
        <div className="mx-4 mb-4 rounded-2xl shadow-md bg-white border p-3 flex items-center justify-between">
          <div className="font-semibold">{price ? `${price} ₸` : '—'}</div>
          <button
            onClick={() => { window.location.href = `/buy?id=${product.id}&qty=${qty}` }}
            className="btn btn-primary px-5"
          >
            В корзину
          </button>
        </div>
      </div>
    </main>
  )
}
