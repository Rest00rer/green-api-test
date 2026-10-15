import type { GreenApiCheckAccountPayload, GreenApiCheckAccountResponse, GreenApiClientOptions, GreenApiInstanceState, GreenApiMessage, GreenApiNotification } from './types'

const DEFAULT_BASE_URL = 'https://api.green-api.com'

export class GreenApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'GreenApiError'
  }
}

export function createGreenApiClient({
  idInstance,
  apiTokenInstance,
  baseUrl = DEFAULT_BASE_URL,
  fetcher = fetch,
}: GreenApiClientOptions) {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const endpoint = (method: string, suffix = '') => `${cleanBaseUrl}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}${suffix}`

  async function request<T>(method: string, init?: RequestInit, suffix = ''): Promise<T> {
    const response = await fetcher(endpoint(method, suffix), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new GreenApiError(detail || `GREEN-API request failed with ${response.status}`, response.status)
    }

    return response.json() as Promise<T>
  }

  return {
    getStateInstance() {
      return request<GreenApiInstanceState>('getStateInstance')
    },
    sendMessage(payload: GreenApiMessage) {
      return request<{ idMessage: string }>('sendMessage', { method: 'POST', body: JSON.stringify(payload) })
    },
    checkAccount(payload: GreenApiCheckAccountPayload) {
      return request<GreenApiCheckAccountResponse>('checkAccount', { method: 'POST', body: JSON.stringify(payload) })
    },
    receiveNotification(signal?: AbortSignal) {
      return request<GreenApiNotification | null>('receiveNotification', { signal })
    },
    deleteNotification(receiptId: number) {
      return request<{ result: boolean }>('deleteNotification', { method: 'DELETE' }, `/${encodeURIComponent(String(receiptId))}`).then((response) => response.result)
    },
  }
}

export type GreenApiClient = ReturnType<typeof createGreenApiClient>
