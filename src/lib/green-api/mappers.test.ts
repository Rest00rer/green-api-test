import { describe, expect, it } from 'vitest'
import { mapIncomingMessage } from './mappers'

describe('mapIncomingMessage', () => {
  it('maps the nested ReceiveNotification format', () => {
    expect(mapIncomingMessage({ receiptId: 7, body: { idMessage: 'nested-1', timestamp: 100, senderData: { chatId: '127187549' }, messageData: { textMessageData: { textMessage: 'Привет' } } } })).toEqual({ id: 'nested-1', chatId: '127187549', text: 'Привет', timestamp: 100 })
  })

  it('maps the flat journal format', () => {
    expect(mapIncomingMessage({ idMessage: 'flat-1', timestamp: 200, chatId: '127187549', textMessage: 'Ответ' })).toEqual({ id: 'flat-1', chatId: '127187549', text: 'Ответ', timestamp: 200 })
  })

  it('ignores unsupported notifications', () => {
    expect(mapIncomingMessage({ receiptId: 8, body: { senderData: { chatId: '127187549' } } })).toBeNull()
  })
})
