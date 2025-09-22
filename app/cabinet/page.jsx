'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LEVELS = [
  { level: 1, threshold: 3, label: 'Новичок' },
  { level: 2, threshold: 10, label: 'Опытный покупатель' },
  { level: 3, threshold: Infinity, label: 'Постоянный покупатель' },
]

function getUserLevel(count) {
  for (let i = 0; i < LEVELS.length; i++) {
    if (count < LEVELS[i].threshold) {
      return {
        level: LEVELS[i].level,
        label: LEVELS[i].label,
        next: LEVELS[i].threshold,
      }
    }
  }
  return LEVELS[LEVELS.length - 1]
}

export default function CabinetPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])

  // 1) Авторизация
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [router])

  // 2) Данные покупок
  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('id, amount, qty, created_at, products(title, price, image_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setPurchases(data || [])
      setLoading(false)
    })()
  }, [user])

  // 3) Агрегаты
  const stats = useMemo(() => {
    const blocks = purchases.reduce((acc, p) => acc + (p.qty || 1), 0)
    const total = purchases.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)
    const { level, label, next } = getUserLevel(blocks)
    const progress = next === Infinity ? 100 : Math.min(100, Math.round((blocks / next) * 100))
    return {
      blocks,
      total,
      level,
      label,
      next,
      progress,
      count: purchases.length,
      last: purchases[0]?.created_at ? new Date(purchases[0].created_at) : null,
    }
  }, [purchases])

  if (loading) {
    return (
      <main className="pt-16 container-page py-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-6 animate-pulse h-28" />
          <div className="card p-6 animate-pulse h-28" />
          <div className="card p-6 animate-pulse h-28" />
        </div>
        <div className="card p-6 mt-6 animate-pulse h-40" />
      </main>
    )
  }

  return (
    <main className="pt-16 container-page py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Личный кабинет</h1>
        <p className="text-gray-500">Ваши покупки и статус лояльности</p>
      </header>

      {/* Верхние карточки со статусом */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Уровень и прогресс */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Ваш уровень</div>
              <div className="text-lg font-semibold">
                {stats.label} <span className="text-gray-500">(уровень {stats.level})</span>
              </div>
            </div>
            <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-100">
              Блоков: {stats.blocks}
            </span>
          </div>

          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {stats.next === Infinity ? (
                <>Максимальный уровень достигнут 🎉</>
              ) : (
                <>До следующего уровня: <b>{Math.max(0, stats.next - stats.blocks)}</b> блок(а/ов)</>
              )}
            </div>
          </div>
        </div>

        {/* Всего потрачено */}
        <div className="card p-5">
          <div className="text-sm text-gray-500">Всего потрачено</div>
          <div className="text-2xl font-bold mt-1">
            {stats.total.toLocaleString('ru-RU')} <span className="text-lg text-gray-600">₸</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Покупок: <b>{stats.count}</b>
            {stats.last && (
              <> • Последняя: {stats.last.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</>
            )}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-500">Быстрые действия</div>
            <div className="text-lg font-semibold mt-1">Продолжить покупки</div>
            <p className="text-sm text-gray-500 mt-1">Вернитесь в каталог и добавьте новые товары.</p>
          </div>
          <div className="mt-3">
            <Link href="/" className="btn btn-primary w-full">В каталог</Link>
          </div>
        </div>
      </section>

      {/* Покупки */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Мои покупки</h2>
          {purchases.length > 0 && (
            <div className="text-sm text-gray-500">{purchases.length} шт.</div>
          )}
        </div>

        {purchases.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-lg font-medium">Пока нет покупок</div>
            <p className="text-gray-500 mt-1">Начните с каталога — выберите первый товар и получите уровень.</p>
            <div className="mt-4">
              <Link href="/" className="btn btn-primary">Перейти в каталог</Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {purchases.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex items-center gap-4">
                  {/* превью товара */}
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                    {p.products?.image_url ? (
                      <img
                        src={p.products.image_url}
                        alt={p.products?.title || 'Товар'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-xs text-gray-400">
                        Нет фото
                      </div>
                    )}
                  </div>

                  {/* описание */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{p.products?.title || 'Товар'}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(p.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      {' • '}
                      Кол-во: <b>{p.qty || 1}</b>
                    </div>
                  </div>

                  {/* сумма */}
                  <div className="text-right">
                    <div className="font-semibold">
                      {(Number(p.amount) || 0).toLocaleString('ru-RU')} ₸
                    </div>
                    {p.products?.price ? (
                      <div className="text-xs text-gray-500">
                        Цена за шт: {Number(p.products.price).toLocaleString('ru-RU')} ₸
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
