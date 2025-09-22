'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }
    router.push('/')
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-semibold text-center">Вход</h1>

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-center sm:text-left mt-2 gap-2">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Забыли пароль?
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline">
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </form>
    </main>
  )
}
