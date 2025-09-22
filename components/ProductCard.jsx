import Link from 'next/link'

export default function ProductCard({ product }) {
  const { id, title, price, image_url, description } = product || {}

  return (
    // убираем отступы у обёртки, иначе изображение не выйдет в край
    <div className="card-с overflow-hidden flex flex-col p-0">
      {/* Фото — во всю ширину карточки, без полей */}
      <div className="relative w-full aspect-[4/5] object-cover bg-gray-50 p-0">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-400 text-sm">
            Нет изображения
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Цена — выше заголовка (UX) */}
        <div className="mb-1">
          {typeof price === 'number' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {price.toLocaleString('ru-RU')}
              </span>
              <span className="text-2xl font-bold">₸</span>
            </div>
          ) : (
            <span className="text-gray-400">Цена по запросу</span>
          )}
        </div>

        {/* Заголовок */}
        <Link
          href={`/product/${id}`}
          className="block font-medium line-clamp-2 hover:underline"
        >
          {title}
        </Link>

        {/* Короткое описание (2 строки) */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">
          {description || 'Описание будет добавлено.'}
        </p>

        {/* Действия */}
        <div className="mt-3 flex items-center justify-between">
          <Link href={`/product/${id}`} className="btn btn-ghost">
            Подробнее
          </Link>
          <Link href={`/buy?id=${id}`} className="btn btn-primary">
            Купить
          </Link>
        </div>
      </div>
    </div>
  )
}
