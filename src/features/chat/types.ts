export type MessageStatus = 'sent' | 'delivered' | 'pending'

export type ChatMessage = {
  id: string
  text: string
  time: string
  outgoing?: boolean
  status?: MessageStatus
}

export type ChatSummary = {
  id: string
  name: string
  phone: string
  initials: string
  color: 'green' | 'blue' | 'orange'
  lastMessage: string
  lastTime: string
  unread?: number
  online?: boolean
  messages: ChatMessage[]
}

export type ConnectionForm = {
  baseUrl: string
  idInstance: string
  apiTokenInstance: string
  recipient: string
}
