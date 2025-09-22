'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// отключаем статическую генерацию, чтобы не было prerender-ошибок
export const dynamic = 'force-dynamic'

function BuyInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  // Пример простейшей корзины из localStorage
  const [cart, setCart] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    // если пришёл id в URL — добавим товар, если его еще нет
    if (id && !stored.find((x) => x.id === id)) {
      stored.push({ id, qty: 1 })
      localStorage.setItem('cart', JSON.stringify(stored))
    }
    setCart(stored)
  }, [id])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.amount || 0) * (item.qty || 1), 0),
    [cart]
  )

  return (
    <main className="pt-16 container-page py-8">
      <h1 className="text-2xl font-semibold mb-4">Корзина</h1>

      {cart.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-lg font-medium">Корзина пуста</div>
          <p className="text-gray-500 mt-1">Добавьте товары из каталога.</p>
          <div className="mt-4">
            <Link href="/" className="btn btn-primary">В каталог</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => (
            <div key={item.id} className="card p-4 flex items-center justify-between">
              <div className="text-sm">Товар: <b>{item.id}</b></div>
              <div className="flex items-center gap-3">
                <span className="text-sm">Кол-во: {item.qty || 1}</span>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    const next = cart.filter((x) => x.id !== item.id)
                    localStorage.setItem('cart', JSON.stringify(next))
                    setCart(next)
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          <div className="card p-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Итого</div>
            <div className="text-lg font-semibold">{total.toLocaleString('ru-RU')} ₸</div>
          </div>

          <div className="flex gap-2 justify-end">
            <Link href="/" className="btn btn-ghost">Продолжить покупки</Link>
            <button className="btn btn-primary">Оформить заказ</button>
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
