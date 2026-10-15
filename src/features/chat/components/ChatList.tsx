import { MagnifyingGlass, Plus, X } from '@phosphor-icons/react'
import type { ChatSummary } from '../types'
import { IconButton } from '../../../components/ui/IconButton'
import { ChatRow } from './ChatRow'

type ChatListProps = { chats: ChatSummary[]; activeId: string | null; search: string; mobileOpen: boolean; onSearchChange: (value: string) => void; onSelect: (id: string) => void; onNewChat: () => void }

export function ChatList({ chats, activeId, search, mobileOpen, onSearchChange, onSelect, onNewChat }: ChatListProps) {
  return <aside className={`chat-sidebar ${mobileOpen ? 'chat-sidebar-mobile-open' : ''}`}>
    <div className="chat-sidebar-head"><div><p className="text-lg font-semibold tracking-[-0.03em]">Чаты</p></div><IconButton label="Новый чат" variant="ghost" onClick={onNewChat}><Plus size={19} weight="bold" /></IconButton></div>
    <label className="chat-search"><MagnifyingGlass size={17} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Поиск чатов" aria-label="Поиск чатов" />{search ? <button type="button" onClick={() => onSearchChange('')} aria-label="Очистить поиск"><X size={15} /></button> : null}</label>
    <div className="chat-list" aria-label="Список чатов">
      {chats.map((chat) => <ChatRow key={chat.id} chat={chat} active={chat.id === activeId} onClick={() => onSelect(chat.id)} />)}
      {!chats.length ? <div className="px-4 py-8 text-center text-sm text-muted">Добавьте чат по номеру получателя</div> : null}
    </div>
  </aside>
}
