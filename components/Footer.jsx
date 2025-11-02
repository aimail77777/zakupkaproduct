import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="container-page py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} lvlmart. Все права защищены.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/online-payment" className="hover:text-gray-700 transition">
            Информация об оплате
          </Link>
          <Link href="/offer" className="hover:text-gray-700 transition">
            Договор оферты
          </Link>
          <Link href="/privacy" className="hover:text-gray-700 transition">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  )
}
