import type { GreenApiJournalMessage, GreenApiNotification } from './types'

export type IncomingChatMessage = {
  id: string
  chatId: string
  text: string
  timestamp?: number
}

export function mapIncomingMessage(input: GreenApiNotification | GreenApiJournalMessage): IncomingChatMessage | null {
  const body = 'body' in input ? input.body : input
  const chatId = body.senderData?.chatId ?? body.chatId
  const text = body.messageData?.textMessageData?.textMessage
    ?? body.messageData?.extendedTextMessageData?.text
    ?? body.textMessage
    ?? body.caption

  if (!chatId || !text) return null

  return {
    id: body.idMessage ?? `incoming-${'receiptId' in input ? input.receiptId : body.idMessage ?? `${chatId}-${body.timestamp ?? Date.now()}`}`,
    chatId,
    text,
    timestamp: body.timestamp,
  }
}
