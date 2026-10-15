import { PaperPlaneTilt, Plus } from '@phosphor-icons/react'
import { Button } from '../../../components/ui/Button'

export function EmptyConversation({ connected, onCreateChat }: { connected: boolean; onCreateChat: () => void }) {
  return <div className="empty-conversation"><div className="empty-icon"><PaperPlaneTilt size={23} weight="fill" /></div><p className="text-sm font-semibold text-ink">{connected ? 'Создайте первый чат' : 'Подключите сервис'}</p>{connected ? <><p className="mt-1 max-w-xs text-center text-xs leading-5 text-muted">Добавьте получателя, чтобы начать переписку.</p><Button className="mt-4" onClick={onCreateChat} leadingIcon={<Plus size={16} />}>Создать чат</Button></> : null}</div>
}
