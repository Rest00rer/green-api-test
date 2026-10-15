import { Check } from '@phosphor-icons/react'
import type { ChatMessage } from '../types'

export function MessageBubble({ message }: { message: ChatMessage }) {
  return <div className={`message-row ${message.outgoing ? 'message-row-outgoing' : ''}`}><div className={`message-bubble ${message.outgoing ? 'message-bubble-outgoing' : ''}`}><p>{message.text}</p><div className="message-meta"><span>{message.time}</span>{message.outgoing ? message.status === 'pending' ? <span className="message-pending">отправляется</span> : <span className="message-checks"><Check size={13} weight="bold" /></span> : null}</div></div></div>
}
