'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState(null)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Получаем пользователя из Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    fetchUser()
  }, [pathname])

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
          {/* Показываем "Кабинет" только если пользователь вошёл */}
          {userEmail && (
            <Link
              href="/cabinet"
              className="btn btn-ghost hover:text-blue-600 transition"
            >
              Кабинет
            </Link>
          )}

          {/* Выпадающее меню пользователя */}
          {userEmail ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1"
              >
                {userEmail.split('@')[0]}
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
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Профиль
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
