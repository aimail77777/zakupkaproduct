'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          alert('❌ Ошибка подтверждения email. Попробуйте войти вручную')
          router.push('/login')
          return
        }

        if (data.session) {
          // Проверяем тип события из URL параметров
          const urlParams = new URLSearchParams(window.location.search)
          const type = urlParams.get('type')
          
          if (type === 'recovery') {
            // Это сброс пароля - НЕ авторизуем автоматически
            // Сначала принудительно выходим из сессии
            console.log('Recovery callback detected, signing out to prevent auto-login...')
            await supabase.auth.signOut()
            
            // Перенаправляем на reset-password с токенами из URL
            const urlParams = new URLSearchParams(window.location.search)
            const accessToken = urlParams.get('access_token')
            const refreshToken = urlParams.get('refresh_token')
            
            if (accessToken && refreshToken) {
              // Перенаправляем с токенами
              router.push(`/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}&type=recovery`)
            } else {
              // Если нет токенов, просто перенаправляем
              router.push('/reset-password')
            }
            return
          }
          
          if (type === 'signup') {
            // Это подтверждение регистрации
            alert('✅ Email успешно подтвержден! Добро пожаловать в lvlmart!')
            router.push('/')
            return
          }
          
          // Обычное подтверждение email или вход
          alert('✅ Авторизация успешна! Добро пожаловать!')
          router.push('/')
        } else {
          // Нет сессии, перенаправляем на логин
          alert('⚠️ Сессия истекла. Войдите в аккаунт заново')
          router.push('/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        alert('❌ Произошла неожиданная ошибка. Попробуйте войти в аккаунт')
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Обрабатываем подтверждение email...</p>
      </div>
    </div>
  )
}
