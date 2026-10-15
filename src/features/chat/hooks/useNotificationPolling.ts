import { useEffect, useRef } from 'react'
import { GreenApiError } from '../../../lib/green-api'
import type { GreenApiClient, GreenApiNotification } from '../../../lib/green-api'
import { toUserError } from '../services/errors'

type PollingOptions = {
  client: GreenApiClient | null
  onNotification: (notification: GreenApiNotification) => void
  onUnauthorized: () => void
  onError: (message: string) => void
}

export function useNotificationPolling({ client, onNotification, onUnauthorized, onError }: PollingOptions) {
  const callbacksRef = useRef({ onNotification, onUnauthorized, onError })
  callbacksRef.current = { onNotification, onUnauthorized, onError }

  useEffect(() => {
    if (!client) return
    const activeClient = client
    const controller = new AbortController()
    let cancelled = false

    async function poll() {
      while (!cancelled) {
        try {
          const notification = await activeClient.receiveNotification(controller.signal)
          if (notification) {
            callbacksRef.current.onNotification(notification)
            const deleted = await activeClient.deleteNotification(notification.receiptId)
            if (!deleted) throw new Error('GREEN-API не подтвердил удаление уведомления.')
          }
          await delay(100, controller.signal)
        } catch (error) {
          if (cancelled || isAbortError(error)) return
          if (error instanceof GreenApiError && error.status === 401) {
            callbacksRef.current.onUnauthorized()
            return
          }
          callbacksRef.current.onError(toUserError(error, 'Не удалось обновить сообщения.'))
          await delay(1000, controller.signal).catch(() => undefined)
        }
      }
    }

    void poll()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [client])
}

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Polling cancelled', 'AbortError'))
    }, { once: true })
  })
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}
