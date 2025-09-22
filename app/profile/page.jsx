'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

/* ================== Вспомогательные проверки ================== */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').toLowerCase())
const passwordValid = (p) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(p || '')

/* ================== Блок рефералок ================== */
function ReferralBlock({ profileId, referralCode }) {
  const [refs, setRefs] = useState([])
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    if (!profileId) return
    ;(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, phone, created_at')
        .eq('referrer_id', profileId)
        .order('created_at', { ascending: false })
      if (!error) setRefs(data || [])
    })()
  }, [profileId])

  const inviteLink = referralCode ? `${origin}/register?ref=${referralCode}` : ''

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Реферальная программа</h2>
        <span className="text-sm text-gray-500">Прямые рефералы: <b>{refs.length}</b></span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="text-sm">
          Ваш код: <b>{referralCode || '—'}</b>
        </div>
        <div className="sm:col-span-2 flex gap-2">
          <input className="input flex-1" readOnly value={inviteLink} placeholder="Ссылка появится после генерации кода" />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => inviteLink && navigator.clipboard.writeText(inviteLink)}
          >
            Копировать
          </button>
        </div>
      </div>

      <div>
        <div className="font-medium mb-2">Мои рефералы</div>
        {refs.length === 0 ? (
          <div className="text-sm text-gray-500">Пока никого. Поделитесь ссылкой выше.</div>
        ) : (
          <ul className="divide-y">
            {refs.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0 mr-4">
                  <div className="font-medium truncate">{r.name || 'Без имени'}</div>
                  <div className="text-xs text-gray-500">{r.phone || '—'}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleDateString('ru-RU')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/* ================== Страница профиля ================== */
export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // auth + профиль
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')

  // форма профиля
  const [form, setForm] = useState({ name: '', phone: '' })

  // ошибки под полями
  const [errors, setErrors] = useState({})

  // панели «смена e-mail» и «пароля»
  const [emailOpen, setEmailOpen] = useState(false)
  const [pwdOpen, setPwdOpen] = useState(false)

  // поля смены email
  const [newEmail, setNewEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)

  // поля смены пароля
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)

  // реф. код для блока
  const [referralCode, setReferralCode] = useState(null)

  /* ---------- загрузка пользователя и профиля ---------- */
  useEffect(() => {
    ;(async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
      setEmail(user.email || '')

      const { data: prof } = await supabase
        .from('profiles')
        .select('name, phone, referral_code')
        .eq('id', user.id)
        .maybeSingle()

      setForm({
        name: prof?.name || '',
        phone: prof?.phone || '',
      })
      setReferralCode(prof?.referral_code || null)
      setLoading(false)
    })()
  }, [router])

  /* ---------- валидации ---------- */
  const validateProfile = () => {
    const next = {}
    if (!form.name) next.name = 'Укажите имя'
    const digits = (form.phone.match(/\d/g) || []).length
    if (!form.phone) next.phone = 'Укажите телефон'
    else if (digits < 10) next.phone = 'Не менее 10 цифр'
    if (!email) next.email = 'Укажите e-mail'
    else if (!isValidEmail(email)) next.email = 'Некорректный e-mail'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  /* ---------- сохранить профиль (имя/телефон) ---------- */
  const saveProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: form.name, phone: form.phone })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      console.error(error)
      alert('Не удалось сохранить профиль (проверь политики RLS).')
      return
    }
    alert('Профиль сохранён')
  }

  /* ---------- смена e-mail ---------- */
  const changeEmail = async () => {
    if (!newEmail) return setErrors((e) => ({ ...e, newEmail: 'Укажите новый e-mail' }))
    if (!isValidEmail(newEmail)) return setErrors((e) => ({ ...e, newEmail: 'Некорректный e-mail' }))

    setSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setSavingEmail(false)
    if (error) {
      alert(error.message)
      return
    }
    alert('На новый e-mail отправлено письмо. После подтверждения адрес входа изменится.')
    setEmailOpen(false)
    setEmail(newEmail)
    setNewEmail('')
    setErrors((e) => ({ ...e, newEmail: undefined }))
  }

  /* ---------- смена пароля ---------- */
  const changePassword = async () => {
    if (!pwd) return setErrors((e) => ({ ...e, pwd: 'Введите пароль' }))
    if (!passwordValid(pwd)) return setErrors((e) => ({ ...e, pwd: 'Мин. 8 символов, буква и цифра' }))
    if (pwd !== pwd2) return setErrors((e) => ({ ...e, pwd2: 'Пароли не совпадают' }))

    setSavingPwd(true)
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setSavingPwd(false)
    if (error) {
      alert(error.message)
      return
    }
    alert('Пароль обновлён')
    setPwd(''); setPwd2('')
    setPwdOpen(false)
    setErrors((e) => ({ ...e, pwd: undefined, pwd2: undefined }))
  }

  if (loading) {
    return (
      <main className="pt-16 container-page py-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-6 animate-pulse h-28" />
          <div className="card p-6 animate-pulse h-28" />
          <div className="card p-6 animate-pulse h-28" />
        </div>
        <div className="card p-6 mt-6 animate-pulse h-40" />
      </main>
    )
  }

  return (
    <main className="pt-16 container-page py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Профиль</h1>
        <p className="text-gray-500">Редактируйте данные аккаунта и управляйте безопасностью</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка: профиль */}
        <section className="lg:col-span-2">
          <form onSubmit={saveProfile} className="card p-6 space-y-4">
            {/* Имя */}
            <div>
              <label className="text-sm text-gray-600">Имя</label>
              <input
                className={`input mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Имя"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Телефон */}
            <div>
              <label className="text-sm text-gray-600">Телефон</label>
              <input
                className={`input mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 707 123 45 67"
                type="tel"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Текущий e-mail */}
            <div>
              <label className="text-sm text-gray-600">E-mail (текущий)</label>
              <div className="flex gap-2 mt-1">
                <input
                  className={`input flex-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={email}
                  readOnly
                />
                <button type="button" className="btn btn-ghost" onClick={() => setEmailOpen((s) => !s)}>
                  Сменить
                </button>
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? 'Сохраняем…' : 'Сохранить'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setPwdOpen((s) => !s)}>
                Сменить пароль
              </button>
            </div>
          </form>

          {/* Смена e-mail */}
          {emailOpen && (
            <section className="card p-6 space-y-3 mt-6">
              <h2 className="font-semibold">Смена e-mail</h2>
              <input
                className={`input ${errors.newEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Новый e-mail"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setErrors((er) => ({ ...er, newEmail: undefined })) }}
                type="email"
              />
              {errors.newEmail && <p className="text-sm text-red-600">{errors.newEmail}</p>}
              <div className="text-xs text-gray-500">
                На новый адрес придёт письмо. После подтверждения вход будет по новому e-mail.
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={changeEmail} disabled={savingEmail}>
                  {savingEmail ? 'Отправляем…' : 'Обновить e-mail'}
                </button>
                <button className="btn btn-ghost" onClick={() => setEmailOpen(false)}>Отмена</button>
              </div>
            </section>
          )}

          {/* Смена пароля */}
          {pwdOpen && (
            <section className="card p-6 space-y-3 mt-6">
              <h2 className="font-semibold">Смена пароля</h2>
              <input
                className={`input ${errors.pwd ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Новый пароль"
                type="password"
                value={pwd}
                onChange={(e) => { setPwd(e.target.value); setErrors((er) => ({ ...er, pwd: undefined })) }}
              />
              {errors.pwd && <p className="text-sm text-red-600">{errors.pwd}</p>}

              <input
                className={`input ${errors.pwd2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Повторите пароль"
                type="password"
                value={pwd2}
                onChange={(e) => { setPwd2(e.target.value); setErrors((er) => ({ ...er, pwd2: undefined })) }}
              />
              {errors.pwd2 && <p className="text-sm text-red-600">{errors.pwd2}</p>}

              <div className="text-xs text-gray-500">
                Минимум 8 символов, обязательно буква и цифра.
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={changePassword} disabled={savingPwd}>
                  {savingPwd ? 'Обновляем…' : 'Обновить пароль'}
                </button>
                <button className="btn btn-ghost" onClick={() => setPwdOpen(false)}>Отмена</button>
              </div>
            </section>
          )}
        </section>

        {/* Правая колонка: рефералы */}
        <section className="lg:col-span-1">
          <ReferralBlock profileId={user?.id} referralCode={referralCode} />
        </section>
      </div>
    </main>
  )
}
