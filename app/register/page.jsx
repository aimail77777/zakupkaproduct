'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
// если у тебя есть утилита генерации кода — подключи, иначе опусти
// import { generateReferralCode } from '@/utils/referral'

// Подсказываем Next.js не пререндерить страницу на билде
export const dynamic = 'force-dynamic'

function RegisterInner() {
  const router = useRouter()
  const search = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [refCodeFromUrl, setRefCodeFromUrl] = useState(null)

  useEffect(() => {
    const ref = search.get('ref')
    if (ref) setRefCodeFromUrl(ref.trim())
  }, [search])

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').toLowerCase())
  const isValidPassword = (p) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(p || '')

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.email || !form.password) {
      alert('Заполните все поля'); return
    }
    if (!isValidEmail(form.email)) {
      alert('Некорректный e-mail'); return
    }
    if (!isValidPassword(form.password)) {
      alert('Пароль: минимум 8 символов, буква и цифра'); return
    }

    setLoading(true)

    // 1) создаём пользователя
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (error) { setLoading(false); alert(error.message); return }

    // 2) ищем пригласителя по коду, если пришли по ссылке
    let referrerId = null
    if (refCodeFromUrl) {
      const { data: parent } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', refCodeFromUrl)
        .maybeSingle()
      if (parent?.id) referrerId = parent.id
    }

    // 3) генерируем свой реф.код (простой вариант)
    const myCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    // если у тебя есть функция generateReferralCode() и проверка уникальности — замени на неё

    // 4) вставляем профиль
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name: form.name,
        phone: form.phone,
        referrer_id: referrerId,
        referral_code: myCode,
      })
    }

    setLoading(false)
    alert('Регистрация успешна! Подтвердите e-mail и войдите.')
    router.push('/login')
  }

  return (
    <main className="min-h-screen pt-16 container-page py-8">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Регистрация</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" placeholder="Имя" name="name" value={form.name} onChange={handleChange} required />
          <input className="input" placeholder="Телефон" name="phone" value={form.phone} onChange={handleChange} required />
          <input className="input" placeholder="E-mail" type="email" name="email" value={form.email} onChange={handleChange} required />
          <input className="input" placeholder="Пароль" type="password" name="password" value={form.password} onChange={handleChange} required />

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Загрузка…' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen pt-16 container-page py-8">
          <div className="max-w-md mx-auto card p-8">Загрузка…</div>
        </main>
      }
    >
      <RegisterInner />
    </Suspense>
  )
}
