'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

/** =========================
 *  Общие утилиты/компоненты
 *  ========================= */
function Loading({ text = 'Загрузка…' }) {
  return <div className="p-6 text-sm text-gray-600">{text}</div>
}
function ErrorBox({ error }) {
  if (!error) return null
  return (
    <div className="p-3 mb-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
      {typeof error === 'string' ? error : error.message}
    </div>
  )
}
function Section({ title, children, right }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      <div className="rounded-lg border p-4 bg-white">{children}</div>
    </div>
  )
}

/** =========================
 *  Вкладка "Товары" (с описанием и изображением)
 *  ========================= */
function ProductsTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image_url: '',
  })
  const [saving, setSaving] = useState(false)

  const [editId, setEditId] = useState(null)
  const [edit, setEdit] = useState({
    title: '',
    price: '',
    description: '',
    image_url: '',
  })
  const [editSaving, setEditSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('products')
      .select('id, title, price, description, image_url')
      .order('title', { ascending: true })
    if (error) setError(error)
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createItem(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const title = form.title?.trim()
    const price = form.price === '' ? null : Number(form.price)
    const desc = form.description?.trim() || null
    const img = form.image_url?.trim() || null

    if (!title) {
      setError('Заполните название товара')
      setSaving(false)
      return
    }
    if (price === null || isNaN(price) || price < 0) {
      setError('Цена должна быть числом ≥ 0')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('products')
      .insert([{ title, price, description: desc, image_url: img }])

    if (error) setError(error)
    setForm({ title: '', price: '', description: '', image_url: '' })
    setSaving(false)
    await load()
  }

  function startEdit(row) {
    setEditId(row.id)
    setEdit({
      title: row.title ?? '',
      price: String(row.price ?? ''),
      description: row.description ?? '',
      image_url: row.image_url ?? '',
    })
  }

  async function saveEdit(e) {
    e.preventDefault()
    setEditSaving(true)
    setError(null)

    const title = edit.title?.trim()
    const price = edit.price === '' ? null : Number(edit.price)
    const desc = edit.description?.trim() || null
    const img = edit.image_url?.trim() || null

    if (!title) {
      setError('Заполните название товара')
      setEditSaving(false)
      return
    }
    if (price === null || isNaN(price) || price < 0) {
      setError('Цена должна быть числом ≥ 0')
      setEditSaving(false)
      return
    }

    const { error } = await supabase
      .from('products')
      .update({ title, price, description: desc, image_url: img })
      .eq('id', editId)

    if (error) setError(error)
    setEditSaving(false)
    setEditId(null)
    await load()
  }

  async function del(id) {
    if (!confirm('Удалить товар?')) return
    setError(null)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) setError(error)
    await load()
  }

  return (
    <div>
      <Section title="Создать товар">
        <ErrorBox error={error} />
        <form onSubmit={createItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            type="number"
            step="0.01"
            min="0"
            placeholder="Цена, ₸"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2 sm:col-span-3"
            placeholder="URL изображения"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <textarea
            className="border rounded px-3 py-2 sm:col-span-3"
            rows={3}
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            disabled={saving}
            className="rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-60 sm:col-span-3"
          >
            {saving ? 'Сохранение…' : 'Добавить'}
          </button>
        </form>
      </Section>

      <Section title="Список товаров">
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-600">Товаров нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm align-top">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Изобр.</th>
                  <th className="py-2 pr-3">Название</th>
                  <th className="py-2 pr-3">Описание</th>
                  <th className="py-2 pr-3">Цена, ₸</th>
                  <th className="py-2 pr-3 w-56">Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) =>
                  editId === row.id ? (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 pr-3">
                        <input
                          className="border rounded px-2 py-1 w-36"
                          placeholder="URL"
                          value={edit.image_url}
                          onChange={(e) => setEdit({ ...edit, image_url: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="border rounded px-2 py-1 w-56"
                          value={edit.title}
                          onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <textarea
                          className="border rounded px-2 py-1 w-80"
                          rows={2}
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="border rounded px-2 py-1 w-28"
                          type="number"
                          step="0.01"
                          min="0"
                          value={edit.price}
                          onChange={(e) => setEdit({ ...edit, price: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3 space-x-2">
                        <button
                          onClick={saveEdit}
                          disabled={editSaving}
                          className="rounded px-3 py-1 bg-green-600 text-white disabled:opacity-60"
                        >
                          {editSaving ? 'Сохр…' : 'Сохранить'}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded px-3 py-1 bg-gray-200"
                        >
                          Отмена
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 pr-3">
                        {row.image_url ? (
                          <img src={row.image_url} alt="" className="h-12 w-12 object-cover rounded" />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 pr-3">{row.title}</td>
                      <td className="py-2 pr-3 max-w-xs">
                        <div className="truncate" title={row.description || ''}>
                          {row.description || '—'}
                        </div>
                      </td>
                      <td className="py-2 pr-3">{row.price}</td>
                      <td className="py-2 pr-3 space-x-2">
                        <button
                          onClick={() => startEdit(row)}
                          className="rounded px-3 py-1 bg-blue-600 text-white"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => del(row.id)}
                          className="rounded px-3 py-1 bg-red-600 text-white"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

/** =========================
 *  Вкладка "Уровни"
 *  ========================= */
function LevelsTab() {
  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ label: '', min_qty: '' })
  const [saving, setSaving] = useState(false)

  const [editId, setEditId] = useState(null)
  const [edit, setEdit] = useState({ label: '', min_qty: '' })
  const [editSaving, setEditSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('levels')
      .select('id, label, min_qty')
      .order('min_qty', { ascending: true })
    if (error) setError(error)
    setLevels(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createLevel(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const label = form.label?.trim()
    const min_qty = form.min_qty === '' ? null : parseInt(form.min_qty, 10)

    if (!label) {
      setError('Заполните название уровня')
      setSaving(false)
      return
    }
    if (min_qty === null || Number.isNaN(min_qty) || min_qty < 0) {
      setError('min_qty должен быть целым числом ≥ 0')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('levels').insert([{ label, min_qty }])
    if (error) setError(error)
    setForm({ label: '', min_qty: '' })
    setSaving(false)
    await load()
  }

  function startEdit(row) {
    setEditId(row.id)
    setEdit({ label: row.label ?? '', min_qty: String(row.min_qty ?? '') })
  }

  async function saveEdit(e) {
    e.preventDefault()
    setEditSaving(true)
    setError(null)

    const label = edit.label?.trim()
    const min_qty = edit.min_qty === '' ? null : parseInt(edit.min_qty, 10)

    if (!label) {
      setError('Заполните название уровня')
      setEditSaving(false)
      return
    }
    if (min_qty === null || Number.isNaN(min_qty) || min_qty < 0) {
      setError('min_qty должен быть целым числом ≥ 0')
      setEditSaving(false)
      return
    }

    const { error } = await supabase.from('levels').update({ label, min_qty }).eq('id', editId)
    if (error) setError(error)
    setEditSaving(false)
    setEditId(null)
    await load()
  }

  async function del(id) {
    if (!confirm('Удалить уровень?')) return
    setError(null)
    const { error } = await supabase.from('levels').delete().eq('id', id)
    if (error) setError(error)
    await load()
  }

  return (
    <div>
      <Section title="Создать уровень">
        <ErrorBox error={error} />
        <form onSubmit={createLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Название (например, Новичок)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            type="number"
            min="0"
            placeholder="min_qty (порог по блокам)"
            value={form.min_qty}
            onChange={(e) => setForm({ ...form, min_qty: e.target.value })}
          />
          <button
            disabled={saving}
            className="rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-60"
          >
            {saving ? 'Сохранение…' : 'Добавить'}
          </button>
        </form>
      </Section>

      <Section title="Список уровней">
        {loading ? (
          <Loading />
        ) : levels.length === 0 ? (
          <div className="text-sm text-gray-600">Уровней нет</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Название</th>
                  <th className="py-2 pr-3">min_qty</th>
                  <th className="py-2 pr-3 w-48">Действия</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((row) =>
                  editId === row.id ? (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 pr-3">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={edit.label}
                          onChange={(e) => setEdit({ ...edit, label: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          type="number"
                          min="0"
                          value={edit.min_qty}
                          onChange={(e) => setEdit({ ...edit, min_qty: e.target.value })}
                        />
                      </td>
                      <td className="py-2 pr-3 space-x-2">
                        <button
                          onClick={saveEdit}
                          disabled={editSaving}
                          className="rounded px-3 py-1 bg-green-600 text-white disabled:opacity-60"
                        >
                          {editSaving ? 'Сохр…' : 'Сохранить'}
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded px-3 py-1 bg-gray-200"
                        >
                          Отмена
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.id} className="border-b">
                      <td className="py-2 pr-3">{row.label}</td>
                      <td className="py-2 pr-3">{row.min_qty}</td>
                      <td className="py-2 pr-3 space-x-2">
                        <button
                          onClick={() => setEditId(row.id) || setEdit({ label: row.label ?? '', min_qty: String(row.min_qty ?? '') })}
                          className="rounded px-3 py-1 bg-blue-600 text-white"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => del(row.id)}
                          className="rounded px-3 py-1 bg-red-600 text-white"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

/** =========================
 *  Корневая страница админки с проверкой e-mail
 *  ========================= */
export default function AdminPage() {
  const router = useRouter()
  const [state, setState] = useState({ checking: true, allowed: false })
  const [tab, setTab] = useState('products') // 'products' | 'levels'
  const [who, setWho] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (user?.email === adminEmail) {
        setState({ checking: false, allowed: true })
        setWho(user.email)
      } else {
        setState({ checking: false, allowed: false })
        router.replace('/') // или '/login'
      }
    })()
  }, [router])

  if (state.checking) return <Loading text="Проверка доступа…" />
  if (!state.allowed) return null

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">Админ-панель</h1>
      <p className="text-sm text-gray-500 mb-4">Вы вошли как: {who}</p>

      <div className="mb-4 inline-flex rounded-lg border overflow-hidden">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 ${tab === 'products' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Товары
        </button>
        <button
          onClick={() => setTab('levels')}
          className={`px-4 py-2 ${tab === 'levels' ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Уровни
        </button>
      </div>

      {tab === 'products' ? <ProductsTab /> : <LevelsTab />}
    </main>
  )
}
