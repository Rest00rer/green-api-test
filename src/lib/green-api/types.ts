export type GreenApiCredentials = {
  idInstance: string
  apiTokenInstance: string
}

export type GreenApiMessage = {
  chatId: string
  message: string
}

export type GreenApiCheckAccountPayload = {
  phoneNumber?: number
  username?: string
  force?: boolean
}

export type GreenApiCheckAccountResponse = {
  exist?: boolean
  chatId?: string
  username?: string
  phoneNumber?: number
  status?: boolean
  reason?: string
}

export type GreenApiNotification = {
  receiptId: number
  body: {
    typeWebhook?: string
    idMessage?: string
    timestamp?: number
    chatId?: string
    textMessage?: string
    caption?: string
    senderData?: { chatId?: string; senderName?: string; senderContactName?: string; chatName?: string; sender?: string }
    messageData?: {
      typeMessage?: string
      textMessageData?: { textMessage?: string }
      extendedTextMessageData?: { text?: string }
    }
  }
}

export type GreenApiJournalMessage = {
  idMessage?: string
  timestamp?: number
  chatId?: string
  textMessage?: string
  caption?: string
  senderData?: { chatId?: string }
  messageData?: {
    textMessageData?: { textMessage?: string }
    extendedTextMessageData?: { text?: string }
  }
}

export type GreenApiInstanceState = {
  stateInstance?: string
}

export type GreenApiClientOptions = GreenApiCredentials & {
  baseUrl?: string
  fetcher?: typeof fetch
}
