import type { ChatSummary } from '../types'
import { Avatar } from './Avatar'

export function ChatRow({ chat, active, onClick }: { chat: ChatSummary; active: boolean; onClick: () => void }) {
  return <button className={`chat-row ${active ? 'chat-row-active' : ''}`} type="button" onClick={onClick}>
    <Avatar chat={chat} />
    <div className="min-w-0 flex-1 text-left">
      <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-ink">{chat.name}</p><span className="shrink-0 text-[10px] text-muted">{chat.lastTime}</span></div>
      <div className="mt-1 flex items-center justify-between gap-2"><p className="truncate text-xs text-muted">{chat.lastMessage}</p>{chat.unread ? <span className="grid size-4 shrink-0 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">{chat.unread}</span> : null}</div>
    </div>
  </button>
}
