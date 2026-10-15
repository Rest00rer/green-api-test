import { GreenApiError } from '../../../lib/green-api'

export function toUserError(error: unknown, fallback: string) {
  if (error instanceof GreenApiError) {
    if (error.status === 401) return 'Не удалось подтвердить подключение. Проверьте данные и подключитесь снова.'
    if (error.status === 469) return 'Проверка получателя временно недоступна. Попробуйте позже.'
  }

  return fallback
}
