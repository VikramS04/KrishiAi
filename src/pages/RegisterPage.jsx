import { FormInput } from '../components/FormInput'
import { theme } from '../styles/theme'

export function RegisterPage({ t, styles, loading, userForm, setUserForm, createUser }) {
  const fields = [
    { ph: t.register.fields[0], k: 'username', type: 'text' },
    { ph: t.register.fields[1], k: 'email', type: 'email' },
    { ph: t.register.fields[2], k: 'full_name', type: 'text' },
    { ph: t.register.fields[3], k: 'phone', type: 'tel' },
    { ph: t.register.fields[4], k: 'location', type: 'text' },
    { ph: t.register.fields[5], k: 'farm_size', type: 'number' },
    { ph: t.register.fields[6], k: 'primary_crops', type: 'text' },
  ]

  return (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={styles.h2}>{t.register.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 16 }}>{t.register.subtitle}</p>
          </div>
          <div style={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fields.map(f => (
                <FormInput
                  key={f.k}
                  placeholder={f.ph}
                  type={f.type}
                  value={userForm[f.k]}
                  onChange={e => setUserForm(current => ({ ...current, [f.k]: e.target.value }))}
                />
              ))}
              <button onClick={() => createUser(userForm)} disabled={loading} style={{ ...styles.primaryBtn(), marginTop: 8, opacity: loading ? 0.6 : 1 }}>
                {loading ? t.register.creating : `${t.register.create} →`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
