'use client'
import { Suspense, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParams = searchParams.get('redirect') || '/'

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Валидация полей
    if (!form.email.trim()) {
      alert('⚠️ Пожалуйста, введите email адрес')
      return
    }

    if (!form.password.trim()) {
      alert('⚠️ Пожалуйста, введите пароль')
      return
    }

    if (form.password.length < 6) {
      alert('⚠️ Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)

    if (error) {
      // Переводим ошибки на русский
      let errorMessage = 'Произошла ошибка при входе'

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = '❌ Неверный email или пароль'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '📧 Email не подтвержден. Проверьте почту и перейдите по ссылке'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = '⏰ Слишком много попыток. Попробуйте позже'
      } else if (error.message.includes('User not found')) {
        errorMessage = '👤 Пользователь не найден. Проверьте email'
      } else {
        errorMessage = `❌ ${error.message}`
      }

      alert(errorMessage)
      return
    }

    // Перенаправляем на главную страницу после успешного входа
    alert('✅ Успешный вход! Добро пожаловать!')
    router.push(redirectParams)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Информационная карточка */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">Добро пожаловать!</h3>
              <p className="text-xs text-blue-700">
                Войдите в свой аккаунт, чтобы получить доступ к персональным скидкам и отслеживать заказы.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5"
        >
          <h1 className="text-xl sm:text-2xl font-semibold text-center">Вход</h1>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Email адрес
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className="input text-sm sm:text-base"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Введите email, который использовали при регистрации
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="input text-sm sm:text-base"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              Минимум 6 символов
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="hidden sm:inline">Входим...</span>
                <span className="sm:hidden">Вход...</span>
              </div>
            ) : (
              'Войти'
            )}
          </button>

          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between text-xs sm:text-sm text-center sm:text-left mt-2">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Забыли пароль?
            </Link>
            <Link href={`/register${redirectParams !== '/' ? '?redirect=' + redirectParams : ''}`} className="text-blue-600 hover:underline">
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <LoginInner />
    </Suspense>
  )
}
