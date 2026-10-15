import { useCallback, useEffect, useRef, useState } from 'react'
import { GearSix, PaperPlaneTilt, WarningCircle, X } from '@phosphor-icons/react'
import { greenApiDefaults } from '../../config'
import { Badge } from '../../components/ui/Badge'
import { IconButton } from '../../components/ui/IconButton'
import { useChatState } from './hooks/useChatState'
import { useGreenApiConnection } from './hooks/useGreenApiConnection'
import { useNotificationPolling } from './hooks/useNotificationPolling'
import type { ConnectionForm } from './types'
import { ChatList } from './components/ChatList'
import { ConnectionDialog } from './components/ConnectionDialog'
import { ConversationHeader } from './components/ConversationHeader'
import { EmptyConversation } from './components/EmptyConversation'
import { MessageBubble } from './components/MessageBubble'
import { MessageComposer } from './components/MessageComposer'

export function ChatWorkspace() {
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [connectionOpen, setConnectionOpen] = useState(true)
  const [uiError, setUiError] = useState('')
  const [isResolvingRecipient, setIsResolvingRecipient] = useState(false)
  const [form, setForm] = useState<ConnectionForm>({ ...greenApiDefaults, recipient: '' })
  const pendingRecipientRef = useRef('')
  const connection = useGreenApiConnection()
  const handleError = useCallback((message: string) => setUiError(message), [])
  const chatState = useChatState({ client: connection.client, onError: handleError })
  const { createRecipientChat } = chatState
  const visibleChats = chatState.filterChats(search)
  const error = uiError || connection.error

  useEffect(() => {
    if (!connection.client || !pendingRecipientRef.current) return
    const recipient = pendingRecipientRef.current
    pendingRecipientRef.current = ''
    void createRecipientChat(recipient)
  }, [connection.client, createRecipientChat])

  useNotificationPolling({
    client: connection.client,
    onNotification: chatState.addIncomingMessage,
    onUnauthorized: () => {
      connection.disconnect('Не удалось подтвердить подключение. Проверьте данные и подключитесь снова.')
      setConnectionOpen(true)
    },
    onError: handleError,
  })

  async function handleConnect() {
    setUiError('')
    const recipient = form.recipient.trim()
    const connected = await connection.connect(form)
    if (!connected) return
    setConnectionOpen(false)
    if (recipient) {
      pendingRecipientRef.current = recipient
      setForm((current) => ({ ...current, recipient: '' }))
    }
  }

  async function handleCreateChat() {
    const recipient = form.recipient.trim()
    if (!recipient) return
    setIsResolvingRecipient(true)
    setUiError('')
    const created = await chatState.createRecipientChat(recipient)
    setIsResolvingRecipient(false)
    if (created) {
      setForm((current) => ({ ...current, recipient: '' }))
      setConnectionOpen(false)
      setShowSidebar(false)
    }
  }

  function updateForm(key: keyof ConnectionForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return <div className="min-h-dvh bg-chat-canvas text-ink">
    <header className="chat-topbar"><div className="chat-topbar-inner"><div className="flex items-center gap-3"><div className="brand-mark"><PaperPlaneTilt size={18} weight="fill" /></div><p className="font-semibold tracking-[-0.02em]">Green Chat</p></div><div className="flex items-center gap-2"><Badge tone={connection.connected ? 'success' : 'neutral'}><span className={`mr-1.5 inline-block size-1.5 rounded-full ${connection.connected ? 'bg-accent' : 'bg-[#e2a83f]'}`} />{connection.connected ? connection.instanceState : 'Не подключено'}</Badge><IconButton label="Настройки" variant="ghost"><GearSix size={18} /></IconButton></div></div></header>
    <main className="chat-stage"><div className="chat-frame">
      <ChatList chats={visibleChats} activeId={chatState.activeId} search={search} mobileOpen={showSidebar} onSearchChange={setSearch} onSelect={(id) => { chatState.setActiveId(id); setShowSidebar(false) }} onNewChat={() => setConnectionOpen(true)} />
      <section className={`chat-conversation ${showSidebar ? 'chat-conversation-mobile-hidden' : ''}`}>
        <ConversationHeader chat={chatState.activeChat} onBack={() => setShowSidebar(true)} />
        {error ? <div className="error-banner"><WarningCircle size={16} weight="fill" /><span>{error}</span><button type="button" onClick={() => { setUiError(''); connection.setError('') }} aria-label="Скрыть ошибку"><X size={14} /></button></div> : null}
        {!connection.connected ? <div className="connection-banner"><div className="connection-icon"><WarningCircle size={18} weight="fill" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-ink">Подключите GREEN-API, чтобы отправлять сообщения</p><p className="mt-0.5 hidden text-[11px] text-muted sm:block">Нужны apiUrl, idInstance и apiTokenInstance из консоли.</p></div><button className="connection-action" type="button" onClick={() => setConnectionOpen(true)}>Настроить</button></div> : null}
        <div className="conversation-body">{chatState.activeChat ? <><div className="conversation-date"><span>Сегодня</span></div>{chatState.activeChat.messages.map((message) => <MessageBubble key={message.id} message={message} />)}</> : <EmptyConversation connected={connection.connected} onCreateChat={() => setConnectionOpen(true)} />}</div>
        <MessageComposer value={draft} disabled={!connection.connected || !chatState.activeChat} onChange={setDraft} onSend={() => { void chatState.sendMessage(draft); setDraft('') }} />
      </section>
    </div></main>
    {connectionOpen ? <ConnectionDialog form={form} connected={connection.connected} isConnecting={connection.isConnecting} isResolvingRecipient={isResolvingRecipient} error={error} onChange={updateForm} onConnect={() => void handleConnect()} onCreateChat={() => void handleCreateChat()} onClose={() => setConnectionOpen(false)} /> : null}
  </div>
}
