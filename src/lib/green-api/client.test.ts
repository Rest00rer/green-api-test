import { describe, expect, it } from 'vitest'
import { createGreenApiClient } from './client'

describe('createGreenApiClient', () => {
  it('builds deleteNotification with token before receipt id', async () => {
    let requestedUrl = ''
    const client = createGreenApiClient({ idInstance: '123', apiTokenInstance: 'test-token', baseUrl: 'https://api.example.test', fetcher: async (input) => {
      requestedUrl = String(input)
      return new Response(JSON.stringify({ result: true }), { status: 200 })
    } })

    await client.deleteNotification(42)

    expect(requestedUrl).toBe('https://api.example.test/waInstance123/deleteNotification/test-token/42')
  })

  it('sends a message as JSON', async () => {
    let requestInit: RequestInit | undefined
    const client = createGreenApiClient({ idInstance: '123', apiTokenInstance: 'test-token', baseUrl: 'https://api.example.test', fetcher: async (_input, init) => {
      requestInit = init
      return new Response(JSON.stringify({ idMessage: 'sent-1' }), { status: 200 })
    } })

    await client.sendMessage({ chatId: '127187549', message: 'Привет' })

    expect(requestInit?.method).toBe('POST')
    expect(requestInit?.body).toBe(JSON.stringify({ chatId: '127187549', message: 'Привет' }))
  })
})
