import { theme } from '../styles/theme'

export function HomePage({ t, styles, viewport, setCurrentView, openFAQ, setOpenFAQ }) {
  const isMobile = viewport?.isMobile
  const isTablet = viewport?.isTablet

  const features = [
    { id: 'soil', icon: '◎', title: t.home.features.soil[0], desc: t.home.features.soil[1], color: theme.colors.soil, metrics: [{ label: t.home.features.soil[2], val: '7' }, { label: t.home.features.soil[3], val: '20+' }] },
    { id: 'disease', icon: '⚕', title: t.home.features.disease[0], desc: t.home.features.disease[1], color: theme.colors.error, metrics: [{ label: t.home.features.disease[2], val: '50+' }, { label: t.home.features.disease[3], val: 'Live' }] },
    { id: 'weather', icon: '☁', title: t.home.features.weather[0], desc: t.home.features.weather[1], color: theme.colors.sky, metrics: [{ label: t.home.features.weather[2], val: '7 Days' }, { label: t.home.features.weather[3], val: 'Hourly' }] },
    { id: 'community', icon: '◈', title: t.home.features.community[0], desc: t.home.features.community[1], color: '#7C3AED', metrics: [{ label: t.home.features.community[2], val: '9' }, { label: t.home.features.community[3], val: 'Yes' }] },
  ]

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${theme.colors.leafDark} 0%, ${theme.colors.leaf} 60%, ${theme.colors.leafLight} 100%)`, padding: isMobile ? '48px 0 56px' : '80px 0 96px', position: 'relative', overflow: 'hidden' }}>
        <div style={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{ ...styles.badge('#90E0B0'), marginBottom: 20, fontSize: 12 }}>🌱 {t.home.badge}</div>
              <h1 style={styles.h1}>{t.home.titleTop}<br />{t.home.titleBottom}</h1>
              <p style={{ fontSize: isMobile ? 17 : 19, color: 'rgba(255,255,255,0.82)', marginTop: 20, marginBottom: 36, lineHeight: 1.6, maxWidth: isMobile ? '100%' : 420, marginLeft: isMobile ? 'auto' : 0, marginRight: isMobile ? 'auto' : 0 }}>{t.home.subtitle}</p>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 14 }}>
                <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: isMobile ? '100%' : 'auto', padding: '14px 32px', fontSize: 16 }}>{t.home.getStarted}</button>
                <button onClick={() => setCurrentView('soil')} style={{ padding: '14px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: isMobile ? '100%' : 'auto' }}>{t.home.analyzeSoil} →</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: t.home.stats[0], value: '94%', icon: '◎', color: '#90E0B0' },
                { label: t.home.stats[1], value: '7+', icon: '⬡', color: '#FFD166' },
                { label: t.home.stats[2], value: '50+', icon: '⚕', color: '#FF6B6B' },
                { label: t.home.stats[3], value: '7-Day', icon: '☁', color: '#74C0FC' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section style={{ ...styles.section, background: theme.colors.parchment }}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ ...styles.h2, textAlign: 'center' }}>{t.home.farmNeeds}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>{t.home.farmNeedsSubtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 24 }}>
            {features.map(f => (
              <div key={f.id} style={{ ...styles.card, borderTop: `4px solid ${f.color}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h3 style={{ ...styles.h3, color: f.color }}>{f.title}</h3>
                    <p style={{ color: theme.colors.muted, fontSize: 15, lineHeight: 1.6, margin: '6px 0 0' }}>{f.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                  {f.metrics.map((m, i) => (
                    <div key={i} style={{ flex: 1, background: `${f.color}08`, borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: f.color }}>{m.val}</div>
                      <div style={{ fontSize: 12, color: theme.colors.muted, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                  <button onClick={() => setCurrentView(f.id)} style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${f.color}`, background: 'transparent', color: f.color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'stretch', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>{t.common.open} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: '#fff' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 48 }}>{t.home.howItWorks}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 32 }}>
            {t.home.steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{['👤', '📊', '✨'][i]}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{t.common.step} 0{i + 1}</div>
                <h3 style={{ ...styles.h3, marginBottom: 10 }}>{step[0]}</h3>
                <p style={{ color: theme.colors.muted, lineHeight: 1.65, fontSize: 15 }}>{step[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.section, background: theme.colors.parchment }}>
        <div style={{ ...styles.container, maxWidth: 720 }}>
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 40 }}>{t.home.faqTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {t.home.faq.map((f, i) => (
              <div key={i} style={{ ...styles.card, cursor: 'pointer', padding: '20px 24px' }} onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{f[0]}</span>
                  <span style={{ fontSize: 20, color: theme.colors.leaf, transform: openFAQ === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', marginLeft: 16 }}>+</span>
                </div>
                {openFAQ === i && <p style={{ color: theme.colors.muted, marginTop: 14, lineHeight: 1.65, fontSize: 15 }}>{f[1]}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `linear-gradient(135deg, ${theme.colors.leafDark}, ${theme.colors.leaf})`, padding: '64px 0' }}>
        <div style={{ ...styles.container, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: isMobile ? 28 : 36, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-1px' }}>{t.home.ctaTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 18, marginBottom: 32 }}>{t.home.ctaSubtitle}</p>
          <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: isMobile ? '100%' : 'auto', padding: '16px 40px', fontSize: 17 }}>{t.home.createFreeProfile}</button>
        </div>
      </section>
    </div>
  )
}
