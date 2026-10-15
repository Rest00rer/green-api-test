import { useCallback, useRef, useState } from 'react'
import type { GreenApiClient } from '../../../lib/green-api'
import { mapIncomingMessage } from '../../../lib/green-api/mappers'
import type { GreenApiNotification } from '../../../lib/green-api/types'
import type { ChatMessage, ChatSummary } from '../types'
import { createChat, formatTime, normalizeChatId } from '../services/chat'
import { toUserError } from '../services/errors'

type ChatStateOptions = {
  client: GreenApiClient | null
  onError: (message: string) => void
}

export function useChatState({ client, onError }: ChatStateOptions) {
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const processedMessagesRef = useRef(new Set<string>())
  const activeChat = chats.find((chat) => chat.id === activeId) ?? null

  const addIncomingMessage = useCallback((notification: GreenApiNotification) => {
    const incoming = mapIncomingMessage(notification)
    if (!incoming || processedMessagesRef.current.has(incoming.id)) return
    processedMessagesRef.current.add(incoming.id)
    const message: ChatMessage = { id: incoming.id, text: incoming.text, time: formatTime(incoming.timestamp ? new Date(incoming.timestamp * 1000) : new Date()), outgoing: false }
    setChats((current) => {
      const existing = current.find((chat) => chat.id === incoming.chatId)
      if (existing) return current.map((chat) => chat.id === incoming.chatId ? { ...chat, lastMessage: incoming.text, lastTime: message.time, messages: [...chat.messages, message] } : chat)
      return [{ ...createChat(incoming.chatId), lastMessage: incoming.text, lastTime: message.time, messages: [message] }, ...current]
    })
    setActiveId((current) => current ?? incoming.chatId)
  }, [])

  const openChat = useCallback((chatId: string) => {
    setChats((current) => current.some((chat) => chat.id === chatId) ? current : [createChat(chatId), ...current])
    setActiveId(chatId)
  }, [])

  const resolveRecipient = useCallback(async (recipient: string) => {
    if (!client) throw new Error('Сначала подключите сервис.')
    const value = recipient.trim()
    if (value.startsWith('@')) {
      const result = await client.checkAccount({ username: value })
      if (!result.exist || !result.chatId) throw new Error('Пользователь с таким username не найден.')
      return result.chatId
    }
    const digits = value.replace(/\D/g, '')
    if (digits.length >= 10) {
      const result = await client.checkAccount({ phoneNumber: Number(digits) })
      if (!result.exist || !result.chatId) throw new Error('Аккаунт по этому номеру не найден или скрыт настройками приватности.')
      return result.chatId
    }
    return normalizeChatId(value)
  }, [client])

  const createRecipientChat = useCallback(async (recipient: string) => {
    try {
      const chatId = await resolveRecipient(recipient)
      openChat(chatId)
      return true
    } catch (error) {
      onError(toUserError(error, 'Не удалось найти получателя. Проверьте номер или username.'))
      return false
    }
  }, [onError, openChat, resolveRecipient])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !activeChat || !client) return false
    const messageText = text.trim()
    const localId = `local-${Date.now()}`
    const message: ChatMessage = { id: localId, text: messageText, time: formatTime(new Date()), outgoing: true, status: 'pending' }
    setChats((current) => current.map((chat) => chat.id === activeChat.id ? { ...chat, lastMessage: messageText, lastTime: message.time, messages: [...chat.messages, message] } : chat))
    try {
      await client.sendMessage({ chatId: activeChat.id, message: messageText })
      setChats((current) => current.map((chat) => chat.id === activeChat.id ? { ...chat, messages: chat.messages.map((item) => item.id === localId ? { ...item, status: 'sent' } : item) } : chat))
      return true
    } catch (error) {
      onError(toUserError(error, 'Сообщение не отправлено. Попробуйте ещё раз.'))
      setChats((current) => current.map((chat) => chat.id === activeChat.id ? { ...chat, messages: chat.messages.filter((item) => item.id !== localId) } : chat))
      return false
    }
  }, [activeChat, client, onError])

  const filterChats = useCallback((search: string) => chats.filter((chat) => `${chat.name} ${chat.phone}`.toLowerCase().includes(search.toLowerCase())), [chats])

  return { chats, activeChat, activeId, setActiveId, openChat, addIncomingMessage, createRecipientChat, sendMessage, filterChats }
}
