export function formatAlmaty(dt) {
  const d = typeof dt === 'string' ? new Date(dt) : dt
  return d.toLocaleString('ru-KZ', { timeZone: 'Asia/Almaty' })
}
