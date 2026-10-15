import type { ChatSummary } from '../types'

export function Avatar({ chat }: { chat: ChatSummary }) {
  return <div className={`avatar avatar-${chat.color}`}>{chat.initials}{chat.online ? <span className="avatar-online" /> : null}</div>
}
