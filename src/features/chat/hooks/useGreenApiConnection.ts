import { useCallback, useRef, useState } from 'react'
import { createGreenApiClient } from '../../../lib/green-api'
import type { GreenApiClient, GreenApiCredentials } from '../../../lib/green-api'
import { toUserError } from '../services/errors'

type ConnectionOptions = GreenApiCredentials & { baseUrl: string }

export function useGreenApiConnection() {
  const clientRef = useRef<GreenApiClient | null>(null)
  const [client, setClient] = useState<GreenApiClient | null>(null)
  const [instanceState, setInstanceState] = useState('Не подключено')
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async ({ baseUrl, idInstance, apiTokenInstance }: ConnectionOptions) => {
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, '')
    const credentials = { idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() }
    if (!cleanBaseUrl || !credentials.idInstance || !credentials.apiTokenInstance) {
      setError('Заполните API URL, idInstance и apiTokenInstance.')
      return false
    }

    setIsConnecting(true)
    setError('')
    try {
      const nextClient = createGreenApiClient({ ...credentials, baseUrl: cleanBaseUrl })
      const result = await nextClient.getStateInstance()
      const state = result.stateInstance ?? 'unknown'
      setInstanceState(state)
      if (state.toLowerCase() !== 'authorized') throw new Error(`Инстанс пока не авторизован: ${state}`)
      clientRef.current = nextClient
      setClient(nextClient)
      setInstanceState('Авторизован')
      return true
    } catch (nextError) {
      setError(toUserError(nextError, 'Не удалось подключиться. Проверьте данные и попробуйте снова.'))
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback((message = '') => {
    clientRef.current = null
    setClient(null)
    setInstanceState('Не подключено')
    setError(message)
  }, [])

  return { client, connected: Boolean(client), instanceState, error, setError, isConnecting, connect, disconnect }
}
