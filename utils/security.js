// Утилиты для проверки безопасности

/**
 * Проверяет, является ли текущая сессия recovery сессией
 * @returns {boolean} true если это recovery сессия
 */
export const isRecoverySession = () => {
  if (typeof window === 'undefined') return false
  
  const urlParams = new URLSearchParams(window.location.search)
  const type = urlParams.get('type')
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  
  // Считаем recovery сессией, если есть type=recovery ИЛИ есть токены
  return type === 'recovery' || !!(accessToken || refreshToken)
}

/**
 * Проверяет валидность recovery сессии
 * @param {Object} session - сессия Supabase
 * @returns {boolean} true если сессия валидна для recovery
 */
export const isValidRecoverySession = (session) => {
  if (!session || !session.user) return false
  
  // Если есть сессия с пользователем, считаем валидной
  // Дополнительные проверки можно добавить здесь
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
  
  // Не показываем профиль на странице сброса пароля
  if (typeof window !== 'undefined' && window.location.pathname === '/reset-password') {
    logSecurityEvent('RESET_PASSWORD_PAGE_BLOCKED', {
      userEmail: session.user?.email
    })
    return false
  }
  
  return true
}
