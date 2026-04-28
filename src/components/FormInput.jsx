import { theme } from '../styles/theme'

export function FormInput({ placeholder, type = 'text', value, onChange, style = {} }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: 15, color: theme.colors.dark, background: '#FAFAFA', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s', ...style }}
      onFocus={e => e.target.style.borderColor = theme.colors.leaf}
      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
    />
  )
}
