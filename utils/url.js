// Утилиты для работы с URL

/**
 * Получает базовый URL сайта
 * @returns {string} Базовый URL сайта
 */
export const getSiteUrl = () => {
  // В браузере используем window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // На сервере используем переменную окружения
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
}

/**
 * Получает полный URL для страницы
 * @param {string} path - Путь к странице (например, '/reset-password')
 * @returns {string} Полный URL
 */
export const getFullUrl = (path = '') => {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

/**
 * Получает URL для сброса пароля
 * @returns {string} URL для сброса пароля
 */
export const getResetPasswordUrl = () => {
  return getFullUrl('/reset-password')
}

/**
 * Получает URL для auth callback
 * @returns {string} URL для auth callback
 */
export const getAuthCallbackUrl = () => {
  return getFullUrl('/auth/callback')
}

/**
 * Проверяет, является ли URL локальным
 * @returns {boolean} true если это локальная разработка
 */
export const isLocalDevelopment = () => {
  const url = getSiteUrl()
  return url.includes('localhost') || url.includes('127.0.0.1')
}

/**
 * Получает домен из URL
 * @returns {string} Домен сайта
 */
export const getDomain = () => {
  const url = getSiteUrl()
  try {
    return new URL(url).hostname
  } catch {
    return 'localhost'
  }
}
