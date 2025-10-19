import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'lvlmart',
  description: 'Мини-маркетплейс на Next.js + Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="h-full">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container-page">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
