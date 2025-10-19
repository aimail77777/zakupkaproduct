// Утилиты для проверки безопасности

/**
 * Проверяет, является ли текущая сессия recovery сессией
 * @returns {boolean} true если это recovery сессия
 */
export const isRecoverySession = () => {
  if (typeof window === 'undefined') return false
  
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('type') === 'recovery'
}

/**
 * Проверяет валидность recovery сессии
 * @param {Object} session - сессия Supabase
 * @returns {boolean} true если сессия валидна для recovery
 */
export const isValidRecoverySession = (session) => {
  if (!session) return false
  
  // Проверяем, что это recovery сессия
  if (!isRecoverySession()) return false
  
  // Дополнительные проверки можно добавить здесь
  // Например, проверка времени создания сессии, IP адреса и т.д.
  
  return true
}

/**
 * Логирует события безопасности
 * @param {string} event - тип события
 * @param {Object} data - данные события
 */
export const logSecurityEvent = (event, data = {}) => {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    event,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    ...data
  }
  
  console.log(`[SECURITY] ${event}:`, logData)
  
  // Здесь можно добавить отправку логов на сервер
  // sendSecurityLog(logData)
}

/**
 * Проверяет, можно ли показать профиль пользователя
 * @param {Object} session - сессия Supabase
 * @returns {boolean} true если можно показать профиль
 */
export const canShowUserProfile = (session) => {
  if (!session) return false
  
  // Не показываем профиль для recovery сессий
  if (isRecoverySession()) {
    logSecurityEvent('RECOVERY_SESSION_BLOCKED', {
      userEmail: session.user?.email
    })
    return false
  }
  
  return true
}
