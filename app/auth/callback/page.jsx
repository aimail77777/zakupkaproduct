'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const handleAuthCallback = async () => {
      try {
        // Supabase email links deliver tokens in the URL hash (#access_token=...&type=...)
        const hash = window.location.hash.slice(1) // remove leading '#'
        const params = new URLSearchParams(hash)

        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        if (accessToken && refreshToken) {
          // Establish session from the hash tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('setSession error:', error)
            alert('❌ Ошибка подтверждения. Попробуйте войти вручную')
            router.push('/login')
            return
          }

          if (type === 'recovery') {
            // Password reset — session is already active via setSession() above,
            // just redirect to reset-password page (it will use getSession())
            router.push('/reset-password')
            return
          }

          if (type === 'signup') {
            alert('✅ Email успешно подтверждён! Добро пожаловать в lvlmart!')
            router.push('/')
            return
          }

          // email_change or other — just go home
          alert('✅ Авторизация успешна!')
          router.push('/')
          return
        }

        // No hash tokens — check if there's already an active session (e.g. OTP flow)
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          alert('⚠️ Ссылка недействительна или истекла. Попробуйте войти вручную')
          router.push('/login')
          return
        }

        alert('✅ Авторизация успешна! Добро пожаловать!')
        router.push('/')
      } catch (err) {
        console.error('Auth callback unexpected error:', err)
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
        <p>Обрабатываем подтверждение...</p>
      </div>
    </div>
  )
}
