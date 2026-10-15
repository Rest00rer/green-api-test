import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, id, className = '', ...props }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(' ', '-')

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field-label">{label}</span>
      <input className={`field-input ${error ? 'field-input-error' : ''} ${className}`} id={inputId} {...props} />
      {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  )
}
