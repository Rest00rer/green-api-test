import type { ChatSummary } from '../types'

export function createChat(id: string, name = formatChatName(id)): ChatSummary {
  return { id, name, phone: id, initials: name.slice(0, 2).toUpperCase(), color: 'green', lastMessage: 'Новый диалог', lastTime: '', messages: [] }
}

export function normalizeChatId(value: string) {
  const trimmed = value.trim()
  if (trimmed.includes('@') || trimmed.startsWith('id')) return trimmed
  return trimmed.replace(/^\+/, '')
}

export function formatChatName(chatId: string) {
  return `ID ${chatId.includes('@') ? chatId.split('@')[0] : chatId}`
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(date)
}
