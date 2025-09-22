'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { generateReferralCode } from '@/utils/referral'

export default function RegisterPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [refCodeFromUrl, setRefCodeFromUrl] = useState(null)

  useEffect(() => {
    const ref = search.get('ref')
    if (ref) setRefCodeFromUrl(ref.trim())
  }, [search])

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').toLowerCase())
  const isValidPassword = (p) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(p||'')

  // генерируем уникальный referral_code (проверяем в БД)
  const createUniqueReferralCode = async () => {
    // до 10 попыток с разными кодами
    for (let i = 0; i < 10; i++) {
      const code = generateReferralCode()
      const { data } = await supabase.from('profiles')
        .select('id').eq('referral_code', code).limit(1)
      if (!data || data.length === 0) return code
    }
    // fallback
    return generateReferralCode(8)
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.phone || !form.email || !form.password) {
      alert('Заполните все поля!')
      return
    }
    if (!isValidEmail(form.email)) {
      alert('Некорректный e-mail')
      return
    }
    if (!isValidPassword(form.password)) {
      alert('Пароль: минимум 8 символов, буква и цифра')
      return
    }

    setLoading(true)

    // 1) создаём пользователя
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (error) {
      setLoading(false)
      alert(error.message)
      return
    }

    // 2) ищем пригласителя по коду (если пришли по ссылке)
    let referrerId = null
    if (refCodeFromUrl) {
      const { data: parent } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', refCodeFromUrl)
        .maybeSingle()
      if (parent?.id) referrerId = parent.id
    }

    // 3) генерим свой реф.код
    const myCode = await createUniqueReferralCode()

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
    alert('Регистрация успешна! Подтвердите e-mail.')
    router.push('/login')
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Регистрация</h1>
        <input className="input" placeholder="Имя" name="name" value={form.name} onChange={handleChange} required />
        <input className="input" placeholder="Телефон" name="phone" value={form.phone} onChange={handleChange} required />
        <input className="input" placeholder="E-mail" type="email" name="email" value={form.email} onChange={handleChange} required />
        <input className="input" placeholder="Пароль" type="password" name="password" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Загрузка…' : 'Зарегистрироваться'}
        </button>
      </form>
    </main>
  )
}
