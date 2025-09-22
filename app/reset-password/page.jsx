'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

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
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Пароль успешно обновлён!')
    router.push('/login')
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Сброс пароля</h1>

        <input
          type="password"
          placeholder="Новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="input"
          required
        />

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Обновляем…' : 'Обновить пароль'}
        </button>
      </form>
    </main>
  )
}
