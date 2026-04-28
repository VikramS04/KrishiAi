import { theme } from '../styles/theme'

export function AppLayout({ children, currentView, setCurrentView, language, setLanguage, nav, user, logoutUser, t, styles, viewport }) {
  const isMobile = viewport?.isMobile

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => setCurrentView('home')}>
            <div style={styles.logoLeaf}>🌱</div>
            <span style={styles.logoText}>KrishiAi</span>
          </div>
          <div style={styles.navLinks}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setCurrentView(n.id)} style={styles.navBtn(currentView === n.id, n.accent)}>
                {n.label}
              </button>
            ))}
          </div>
          <div style={styles.navActions}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setLanguage('english')} style={styles.langBtn(language === 'english')}>EN</button>
              <button onClick={() => setLanguage('hindi')} style={styles.langBtn(language === 'hindi')}>हिं</button>
            </div>
            {user ? (
              <div style={styles.userActions}>
                <span style={{ fontSize: 14, color: theme.colors.muted, textAlign: isMobile ? 'center' : 'left' }}>{t.common.hello}, {user.username}</span>
                <button onClick={logoutUser} style={{ ...styles.outlineBtn(theme.colors.error), padding: '6px 14px', fontSize: 13, width: isMobile ? '100%' : 'auto' }}>{t.common.logout}</button>
              </div>
            ) : (
              <button onClick={() => setCurrentView('register')} style={styles.signInBtn}>{t.common.signIn}</button>
            )}
          </div>
        </div>
      </nav>

      {children}

      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ ...styles.logoLeaf, background: 'rgba(255,255,255,0.15)' }}>🌱</div>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>KrishiAi</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: 15, maxWidth: 320, margin: 0 }}>
                {t.footer.body}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{t.footer.platform}</div>
              {t.footer.platformLinks.map((l, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{t.footer.legal}</div>
              {t.footer.legalLinks.map((l, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          </div>
          <div style={styles.footerBottom}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t.footer.rights}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t.footer.made}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
