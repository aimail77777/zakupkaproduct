'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Подсказываем Next.js не пререндерить страницу на билде
export const dynamic = 'force-dynamic'

function RegisterInner() {
  const router = useRouter()
  const search = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [refCodeFromUrl, setRefCodeFromUrl] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const ref = search.get('ref')
    if (ref) setRefCodeFromUrl(ref.trim())
  }, [search])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Простая валидация пароля - минимум 6 символов
  const isValidPassword = (password) => {
    return password && password.length >= 6
  }

  // Валидация формы
  const validateForm = () => {
    const newErrors = {}
    
    if (!form.name.trim()) {
      newErrors.name = '👤 Имя обязательно для заполнения'
    } else if (form.name.trim().length < 2) {
      newErrors.name = '👤 Имя должно содержать минимум 2 символа'
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = '📱 Телефон обязателен для связи'
    } else if (form.phone.trim().length < 10) {
      newErrors.phone = '📱 Введите корректный номер телефона'
    }
    
    if (!form.email.trim()) {
      newErrors.email = '📧 Email обязателен для регистрации'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '📧 Введите корректный email адрес'
    }
    
    if (!isValidPassword(form.password)) {
      newErrors.password = '🔒 Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Валидация формы
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone,
          ref_code: refCodeFromUrl,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      console.error('Registration error:', error)
      
      // Переводим ошибки на русский
      let errorMessage = 'Произошла ошибка при регистрации'
      
      if (error.message.includes('User already registered')) {
        errorMessage = '👤 Пользователь с таким email уже зарегистрирован'
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = '🔒 Пароль должен содержать минимум 6 символов'
      } else if (error.message.includes('Invalid email')) {
        errorMessage = '📧 Некорректный email адрес'
      } else if (error.message.includes('Signup is disabled')) {
        errorMessage = '🚫 Регистрация временно отключена'
      } else if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = '⏰ Слишком много попыток. Попробуйте позже'
      } else {
        errorMessage = `❌ ${error.message}`
      }
      
      alert(errorMessage)
      return
    }
    
    // Проверяем, нужно ли подтверждение email
    const { data: { user } } = await supabase.auth.getUser()
    if (user && !user.email_confirmed_at) {
      alert('📧 Проверьте email для подтверждения аккаунта. Письмо может прийти в папку "Спам"')
      router.push('/login')
    } else {
      alert('🎉 Регистрация успешна! Добро пожаловать!')
      // Не перенаправляем - Header сам обработает авторизацию
    }
  }

  return (
    <main className="min-h-screen pt-16 container-page py-4 sm:py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Информационная карточка */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-green-800 mb-1">Создайте аккаунт</h3>
              <p className="text-xs text-green-700">
                Регистрация займет всего 2 минуты. Получите доступ к скидкам и бонусам!
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Регистрация</h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Ваше имя
              </label>
              <input 
                className={`input text-sm sm:text-base ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Иван Иванов" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
              <div className="text-xs text-gray-500 mt-1">
                Как к вам обращаться
              </div>
              {errors.name && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input 
                className={`input text-sm sm:text-base ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="+7 (999) 123-45-67" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
              />
              <div className="text-xs text-gray-500 mt-1">
                Для связи по заказам
              </div>
              {errors.phone && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email адрес
              </label>
              <input 
                className={`input text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com" 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />
              <div className="text-xs text-gray-500 mt-1">
                На этот email придет подтверждение
              </div>
              {errors.email && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input 
                className={`input text-sm sm:text-base ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••" 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
              />
              <div className="text-xs text-gray-500 mt-1">
                Минимум 6 символов
              </div>
              {errors.password && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Реферальный код */}
            {refCodeFromUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800">
                    Реферальный код: <span className="font-mono font-semibold">{refCodeFromUrl}</span>
                  </span>
                </div>
              </div>
            )}

                  <button className="btn btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-base" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Регистрируем...</span>
                        <span className="sm:hidden">Регистрация...</span>
                      </div>
                    ) : (
                      'Создать аккаунт'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Уже есть аккаунт?{' '}
                      <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        Войти
                      </Link>
                    </p>
                  </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <RegisterInner />
    </Suspense>
  )
}