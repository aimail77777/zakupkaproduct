export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="container-page py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Zakupka+. Все права защищены.</p>
        <p>Политика конфиденциальности</p>
      </div>
    </footer>
  )
}
