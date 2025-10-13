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
          // Пользователь успешно подтвердил email
          alert('✅ Email успешно подтвержден! Добро пожаловать!')
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
