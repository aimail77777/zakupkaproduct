'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { logSecurityEvent } from '@/utils/security'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Проверяем валидность сессии для сброса пароля
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          logSecurityEvent('PASSWORD_RESET_SESSION_ERROR', { error: error.message })
          alert('⚠️ Ссылка для сброса пароля недействительна или истекла')
          router.push('/forgot-password')
          return
        }
        
        if (!session) {
          logSecurityEvent('PASSWORD_RESET_NO_SESSION')
          alert('⚠️ Ссылка для сброса пароля недействительна или истекла')
          router.push('/forgot-password')
          return
        }
        
        // Проверяем, что у пользователя есть email (базовая валидация)
        if (!session.user?.email) {
          logSecurityEvent('PASSWORD_RESET_NO_EMAIL')
          alert('⚠️ Недостаточно данных для сброса пароля')
          router.push('/login')
          return
        }
        
        // Дополнительная проверка: есть ли в URL параметры recovery
        const urlParams = new URLSearchParams(window.location.search)
        const type = urlParams.get('type')
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        
        // Если есть токены в URL, это точно recovery сессия
        if (accessToken || refreshToken) {
          logSecurityEvent('PASSWORD_RESET_VALID_SESSION', { 
            userEmail: session.user.email,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            type: type
          })
          setIsValidSession(true)
          return
        }
        
        // Если нет токенов в URL, но есть сессия - тоже разрешаем
        // (на случай, если пользователь уже прошел через auth callback)
        if (session.user) {
          logSecurityEvent('PASSWORD_RESET_SESSION_FOUND', { 
            userEmail: session.user.email,
            type: type
          })
          setIsValidSession(true)
          return
        }
        
        // Если ничего не подошло
        logSecurityEvent('PASSWORD_RESET_INVALID_SESSION', { 
          userEmail: session.user?.email,
          type: type
        })
        alert('⚠️ Недостаточно прав для сброса пароля')
        router.push('/login')
        
      } catch (error) {
        console.error('Session check error:', error)
        logSecurityEvent('PASSWORD_RESET_CHECK_ERROR', { error: error.message })
        alert('❌ Ошибка проверки сессии')
        router.push('/forgot-password')
      } finally {
        setCheckingSession(false)
      }
    }
    
    checkSession()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirm) {
      alert('Введите новый пароль дважды')
      return
    }
    if (password !== confirm) {
      alert('Пароли не совпадают')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.updateUser({ password })
    
    if (error) {
      setLoading(false)
      logSecurityEvent('PASSWORD_RESET_UPDATE_ERROR', { error: error.message })
      alert(error.message)
      return
    }

    // ВАЖНО: Принудительно выходим из сессии после сброса пароля
    await supabase.auth.signOut()
    setLoading(false)
    
    // Логируем успешный сброс пароля
    logSecurityEvent('PASSWORD_RESET_SUCCESS', {
      userEmail: data.user?.email
    })
    
    alert('Пароль успешно обновлён! Войдите с новым паролем.')
    router.push('/login')
  }

  // Показываем загрузку при проверке сессии
  if (checkingSession) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Проверяем ссылку для сброса пароля...</p>
        </div>
      </main>
    )
  }

  // Если сессия невалидна, не показываем форму
  if (!isValidSession) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Ссылка недействительна</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Сброс пароля</h1>
        <p className="text-sm text-gray-600 text-center">
          Введите новый пароль для вашего аккаунта
        </p>

        <input
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input"
          required
          minLength={6}
        />

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Обновляем…' : 'Обновить пароль'}
        </button>
      </form>
    </main>
  )
}
