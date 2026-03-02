'use client'
import { Suspense, useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCart, updateCartItem, removeFromCart, clearCart } from '@/utils/cart'

// отключаем статическую генерацию, чтобы не было prerender-ошибок
export const dynamic = 'force-dynamic'

const TIPTOP_PUBLIC_ID = 'pk_2feee0eb113f61c95c847a68932b6'

function BuyInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const qty = parseInt(searchParams.get('qty') || '1', 10)

  // Корзина с полной информацией о товарах
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)

  // Данные покупателя
  const [user, setUser] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  // Состояние оплаты
  const [paymentStatus, setPaymentStatus] = useState(null) // null | 'success' | 'error'
  const [paymentMessage, setPaymentMessage] = useState('')
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  // Загружаем скрипт TipTopPay виджета
  useEffect(() => {
    if (document.querySelector('script[src="https://widget.tiptoppay.kz/bundles/widget.js"]')) {
      setIsWidgetLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://widget.tiptoppay.kz/bundles/widget.js'
    script.onload = () => setIsWidgetLoaded(true)
    script.onerror = () => console.error('Не удалось загрузить TipTopPay виджет')
    document.head.appendChild(script)
  }, [])

  // Авторизация и загрузка профиля
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        if (user.email) setCustomerEmail(user.email)

        const { data: profile } = await supabase
          .from('profiles')
          .select('name, phone')
          .eq('id', user.id)
          .single()

        if (profile) {
          if (profile.name) setCustomerName(profile.name)
          if (profile.phone) setCustomerPhone(profile.phone)
        }
      }
    }
    fetchUser()
  }, [])

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

  const handlePayment = () => {
    if (!isWidgetLoaded || typeof window === 'undefined' || !window.tiptop) {
      alert('Платёжный виджет ещё загружается. Попробуйте через секунду.')
      return
    }

    if (!customerName.trim()) {
      alert('Пожалуйста, укажите ваше имя.')
      return
    }
    if (!customerPhone.trim()) {
      alert('Пожалуйста, укажите номер телефона.')
      return
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const intentParams = {
      publicTerminalId: TIPTOP_PUBLIC_ID,
      description: `Заказ на сайте Zakupka — ${cart.length} товар(ов)`,
      currency: 'KZT',
      culture: 'ru-RU',
      amount: total,
      externalId: orderId,
      paymentSchema: 'Single',
      userInfo: {
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail || undefined,
      },
    }

    const widget = new window.tiptop.Widget()

    widget.oncomplete = (result) => {
      console.log('TipTopPay oncomplete:', result)
    }

    widget.start(intentParams)
      .then((widgetResult) => {
        console.log('TipTopPay result:', widgetResult)
        if (widgetResult && (widgetResult.success || widgetResult.status === 'Completed')) {

          // Сохраняем заказ в БД
          const records = cart.map(item => {
            const product = products[item.id]
            const price = product ? Number(product.price || 0) : 0
            return {
              user_id: user?.id || null,
              product_id: item.id,
              qty: item.qty || 1,
              amount: price * (item.qty || 1)
            }
          })

          supabase.from('purchases').insert(records).then(({ error }) => {
            if (error) {
              console.error('Ошибка при сохранении покупок:', error)
            }
          })

          clearCart()
          setCart([])
          setPaymentStatus('success')
          setPaymentMessage('Оплата прошла успешно! Спасибо за заказ.')
        } else if (widgetResult && widgetResult.status === 'Cancelled') {
          // Пользователь закрыл виджет — ничего не делаем
        } else {
          setPaymentStatus('error')
          setPaymentMessage('Оплата не прошла. Попробуйте ещё раз.')
        }
      })
      .catch((error) => {
        console.error('TipTopPay error:', error)
        setPaymentStatus('error')
        setPaymentMessage('Произошла ошибка при оплате. Попробуйте позже.')
      })
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

  // Успешная оплата
  if (paymentStatus === 'success') {
    return (
      <main className="pt-16 container-page py-8 px-4">
        <div className="card p-8 text-center max-w-md mx-auto">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Оплата прошла!</h1>
          <p className="text-gray-600 mb-6">{paymentMessage}</p>
          <Link href="/" className="btn btn-primary w-full py-3">
            Вернуться в каталог
          </Link>
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

          {/* Форма данных покупателя */}
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-semibold">Данные для оформления</h2>
              {!user && (
                <Link href="/login?redirect=/buy" className="text-sm text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Войти для автозаполнения
                </Link>
              )}
            </div>

            <div className="grid gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Иванов Иван"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+7 (777) 000-00-00"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Сообщение об ошибке оплаты */}
          {paymentStatus === 'error' && (
            <div className="card p-4 bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm font-medium">❌ {paymentMessage}</p>
            </div>
          )}

          {/* Тестовый режим */}
          <div className="card p-3 bg-yellow-50 border border-yellow-200">
            <p className="text-yellow-800 text-xs font-medium">
              🧪 <strong>Тестовый режим.</strong> Реальных списаний не будет. Тестовая карта: <strong>4242 4242 4242 4242</strong>, любой срок и CVV.
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col gap-3">
            <button
              className="btn btn-primary w-full text-base py-3 font-semibold flex items-center justify-center gap-2"
              onClick={handlePayment}
              disabled={!isWidgetLoaded}
            >
              {!isWidgetLoaded ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Загрузка виджета...
                </>
              ) : (
                <>
                  💳 Оплатить {total.toLocaleString('ru-RU')} ₸
                </>
              )}
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
