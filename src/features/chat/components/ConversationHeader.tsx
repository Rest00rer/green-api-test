import { ArrowLeft, DotsThreeVertical, MagnifyingGlass } from '@phosphor-icons/react'
import type { ChatSummary } from '../types'
import { IconButton } from '../../../components/ui/IconButton'
import { Avatar } from './Avatar'

export function ConversationHeader({ chat, onBack }: { chat: ChatSummary | null; onBack: () => void }) {
  return <div className="conversation-head">
    <div className="flex min-w-0 items-center gap-3">
      <IconButton label="Открыть список чатов" variant="ghost" className="chat-mobile-back" onClick={onBack}><ArrowLeft size={19} /></IconButton>
      {chat ? <><Avatar chat={chat} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{chat.name}</p><p className="mt-0.5 truncate text-xs text-muted">{chat.phone}</p></div></> : <div><p className="text-sm font-semibold text-ink">Рабочее пространство</p><p className="mt-0.5 text-xs text-muted">Подключите сервис и создайте чат</p></div>}
    </div>
    <div className="flex items-center gap-1"><IconButton label="Поиск в чате" variant="ghost"><MagnifyingGlass size={18} /></IconButton><IconButton label="Дополнительные действия" variant="ghost"><DotsThreeVertical size={19} weight="bold" /></IconButton></div>
  </div>
}
