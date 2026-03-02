'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

// Force dynamic rendering (uses searchParams)
export const dynamic = 'force-dynamic'

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        // auth/callback passes tokens as query params after stripping hash
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const type = searchParams.get('type')

        if (accessToken && refreshToken && type === 'recovery') {
          // Re-establish session so updateUser() works
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) {
            console.error('setSession error:', error)
            alert('⚠️ Ссылка для сброса пароля недействительна или истекла')
            router.push('/forgot-password')
            return
          }
          setIsValidSession(true)
          setCheckingSession(false)
          return
        }

        // Fallback: check if there's already an active session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          alert('⚠️ Ссылка для сброса пароля недействительна или истекла')
          router.push('/forgot-password')
          return
        }
        setIsValidSession(true)
      } catch (err) {
        console.error('Session check error:', err)
        alert('❌ Ошибка проверки ссылки')
        router.push('/forgot-password')
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router, searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirm) {
      alert('Введите новый пароль дважды')
      return
    }
    if (password.length < 6) {
      alert('Пароль должен содержать минимум 6 символов')
      return
    }
    if (password !== confirm) {
      alert('Пароли не совпадают')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        console.error('Password update error:', error)
        alert(`Ошибка обновления пароля: ${error.message}`)
        setLoading(false)
        return
      }

      // Sign out so user logs in fresh with new password
      await supabase.auth.signOut()
      setLoading(false)
      alert('✅ Пароль успешно обновлён! Войдите с новым паролем.')
      router.push('/login')
    } catch (err) {
      setLoading(false)
      console.error('Password update exception:', err)
      alert(`Ошибка: ${err.message}`)
    }
  }

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

  if (!isValidSession) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ссылка недействительна или истекла</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/forgot-password')}
          >
            Запросить новую ссылку
          </button>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
          <input
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Обновляем…' : 'Обновить пароль'}
        </button>
      </form>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </main>
    }>
      <ResetPasswordInner />
    </Suspense>
  )
}
