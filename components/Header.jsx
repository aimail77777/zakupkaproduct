'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'
import { getCartCount } from '@/utils/cart'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState(null)
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const dropdownRef = useRef(null)

  // Получаем пользователя из Supabase и слушаем изменения авторизации
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    fetchUser()

    // Слушаем изменения авторизации в реальном времени
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUserEmail(session?.user?.email || null)
        
        // Если пользователь вошел, перенаправляем на главную
        if (event === 'SIGNED_IN' && session?.user) {
          router.push('/')
        }
        
        // Если пользователь вышел, перенаправляем на логин
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Загружаем количество товаров в корзине
  useEffect(() => {
    setCartCount(getCartCount())
  }, [pathname])

  // Слушаем события изменения корзины
  useEffect(() => {
    const handleCartChange = () => {
      setCartCount(getCartCount())
    }
    
    // Слушаем кастомное событие cartChanged
    window.addEventListener('cartChanged', handleCartChange)
    
    return () => window.removeEventListener('cartChanged', handleCartChange)
  }, [])

  // Закрываем выпадающее меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    router.push('/login')
  }

  return (
    <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100 sticky top-0 z-50">
      <div className="container-page h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand text-white grid place-items-center font-bold">
            Z+
          </div>
          <span className="font-semibold tracking-tight text-gray-800">
            Zakupka+
          </span>
        </Link>

        {/* Навигация */}
        <nav className="flex items-center gap-3">
          {/* Корзина - только для авторизованных */}
          {userEmail && (
            <Link
              href="/buy"
              className="relative btn btn-ghost hover:text-blue-600 transition"
              title="Корзина"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/>
                <circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Выпадающее меню пользователя */}
          {userEmail ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="btn btn-ghost hover:text-blue-600 transition flex items-center gap-1"
              >
                Профиль
                <svg
                  className={`w-4 h-4 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <Link
                    href="/cabinet"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Кабинет
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Мои данные
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
