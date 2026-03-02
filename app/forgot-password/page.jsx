'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getSiteUrl } from '@/utils/url'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg('Введите e-mail')
      return
    }
    setLoading(true)
    setErrorMsg('')
    const baseUrl = getSiteUrl()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback`,
    })
    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      return
    }
    setSent(true)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="card p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Забыли пароль?</h1>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Введите e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            {errorMsg && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Отправляем...' : 'Отправить ссылку для сброса'}
            </button>
          </form>
        ) : (
          <p className="text-center text-green-600">
            Ссылка для сброса пароля отправлена на {email}. Проверьте почту и папку «Спам».
          </p>
        )}
      </div>
    </main>
  )
}
