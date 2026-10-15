import { Paperclip, PaperPlaneTilt, Smiley } from '@phosphor-icons/react'
import { IconButton } from '../../../components/ui/IconButton'

export function MessageComposer({ value, disabled, onChange, onSend }: { value: string; disabled: boolean; onChange: (value: string) => void; onSend: () => void }) {
  return <div className="composer-wrap"><div className="composer"><IconButton label="Прикрепить файл" variant="ghost"><Paperclip size={19} /></IconButton><input value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSend() }} placeholder={disabled ? 'Сначала создайте чат' : 'Напишите сообщение'} aria-label="Сообщение" disabled={disabled} /><IconButton label="Добавить эмодзи" variant="ghost"><Smiley size={19} /></IconButton><button className="send-button" type="button" onClick={onSend} disabled={!value.trim() || disabled} aria-label="Отправить сообщение"><PaperPlaneTilt size={18} weight="fill" /></button></div></div>
}
