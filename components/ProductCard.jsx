import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/utils/cart'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function ProductCard({ product, onAddToCart }) {
  const { id, title, price, image_url, description } = product || {}
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Если пользователь не авторизован, перенаправляем на логин
    if (!user) {
      router.push('/login')
      return
    }
    
    addToCart(id, 1)
    if (onAddToCart) {
      onAddToCart()
    }
  }

  return (
    // убираем отступы у обёртки, иначе изображение не выйдет в край
    <div className="card-с overflow-hidden flex flex-col p-0 h-full">
      {/* Фото — во всю ширину карточки, без полей */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] object-cover bg-gray-50 p-0">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400 text-xs sm:text-sm">
            Нет изображения
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Цена — выше заголовка (UX) */}
        <div className="mb-1">
          {typeof price === 'number' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-bold">
                {price.toLocaleString('ru-RU')}
              </span>
              <span className="text-lg sm:text-2xl font-bold">₸</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm sm:text-base">Цена по запросу</span>
          )}
        </div>

        {/* Заголовок */}
        <Link
          href={`/product/${id}`}
          className="block font-medium line-clamp-2 hover:underline text-sm sm:text-base"
        >
          {title}
        </Link>

        {/* Короткое описание (2 строки) */}
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1 flex-1">
          {description || 'Описание будет добавлено.'}
        </p>

        {/* Действия */}
        <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row gap-1.5 sm:gap-0 sm:justify-between">
          <Link 
            href={`/product/${id}`} 
            className="btn btn-ghost text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4 flex-1 sm:flex-none text-center"
          >
            Подробнее
          </Link>
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4 flex-1 sm:flex-none"
          >
            Купить
          </button>
        </div>
      </div>
    </div>
  )
}
