'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const fmt = (n) => (n == null ? '—' : `${(+n).toLocaleString('ru-RU')} ₸`)

function readCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
}
function writeCart(items) {
  localStorage.setItem('cart', JSON.stringify(items))
}

export default function CartPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [items, setItems] = useState([])
  const [checkingOut, setCheckingOut] = useState(false)
  const [userEmail, setUserEmail] = useState(null)

  // init + добавление через URL (?id=...&qty=...)
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      let cart = readCart()

      const id = search.get('id')
      const qty = Math.max(1, parseInt(search.get('qty') || '1', 10))
      if (id) {
        const { data } = await supabase
          .from('products')
          .select('id, title, price, image_url')
          .eq('id', id)
          .maybeSingle()
        if (data) {
          const prev = cart.find((x) => x.id === id)
          if (prev) prev.qty += qty
          else cart.push({ id: data.id, title: data.title, price: data.price, image_url: data.image_url, qty })
          writeCart(cart)
          // очистим query
          const url = new URL(window.location.href)
          url.searchParams.delete('id'); url.searchParams.delete('qty')
          window.history.replaceState({}, '', url.toString())
        }
      }

      if (isMounted) setItems(cart)

      const { data: { user } } = await supabase.auth.getUser()
      if (isMounted) setUserEmail(user?.email || null)
    })()
    return () => { isMounted = false }
  }, [search])

  const total = useMemo(
    () => items.reduce((sum, x) => sum + (x.price ?? 0) * (x.qty ?? 1), 0),
    [items]
  )

  const changeQty = (id, dir) => {
    const next = items.map((it) =>
      it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + dir) } : it
    )
    setItems(next); writeCart(next)
  }
  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id)
    setItems(next); writeCart(next)
  }
  const clearCart = () => { setItems([]); writeCart([]) }

  const checkout = async () => {
    setCheckingOut(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Войдите, чтобы оформить покупку')
        router.push('/login')
        return
      }
      if (items.length === 0) {
        alert('Корзина пуста')
        return
      }
      const rows = items.map((it) => ({
        user_id: user.id,
        product_id: it.id,
        qty: it.qty,
        amount: (it.price || 0) * (it.qty || 1),
        created_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('purchases').insert(rows)
      if (error) {
        console.error(error)
        alert('Не удалось оформить покупку. Проверь RLS-политики.')
        return
      }
      clearCart()
      alert('Спасибо! Покупка оформлена.')
      router.push('/cabinet')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <main className="py-6 sm:py-8">
      <h1 className="text-2xl font-semibold mb-4">Корзина</h1>

      {items.length === 0 ? (
        <div className="card p-6">
          <p className="text-gray-600">В вашей корзине пока пусто.</p>
          <button className="btn btn-primary mt-4" onClick={() => router.push('/')}>
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          {/* список */}
          <div className="card p-4 sm:p-6">
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-4">
                  <div className="w-28 h-28 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                    {it.image_url
                      ? <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
                      : <span className="text-gray-400 text-sm">Нет фото</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="mt-1 text-gray-500">{fmt(it.price)}</div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border bg-white overflow-hidden">
                        <button className="px-3 py-2" onClick={() => changeQty(it.id, -1)} disabled={it.qty <= 1}>−</button>
                        <div className="w-10 text-center">{it.qty}</div>
                        <button className="px-3 py-2" onClick={() => changeQty(it.id, +1)}>+</button>
                      </div>
                      <button className="text-red-600 text-sm" onClick={() => removeItem(it.id)}>Удалить</button>
                    </div>
                  </div>
                  <div className="font-semibold whitespace-nowrap">{fmt((it.price || 0) * (it.qty || 1))}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* итог */}
          <aside className="card p-6 h-fit sticky top-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-500">Итого</div>
              <div className="text-2xl font-bold">{fmt(total)}</div>
            </div>
            {userEmail
              ? <p className="mt-2 text-xs text-gray-500">Оформим на: {userEmail}</p>
              : <p className="mt-2 text-xs text-gray-500">Для оформления войдите в аккаунт</p>
            }
            <button
              className="btn btn-primary w-full mt-4"
              onClick={checkout}
              disabled={checkingOut}
            >
              {checkingOut ? 'Оформляем…' : 'Оформить покупку'}
            </button>
            <button className="btn btn-ghost w-full mt-2" onClick={clearCart}>
              Очистить корзину
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}
