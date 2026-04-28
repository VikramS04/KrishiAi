import { FormInput } from '../components/FormInput'
import { theme } from '../styles/theme'

export function SoilPage({ t, styles, viewport, loading, soilData, setSoilData, soilResults, analyzeSoil }) {
  const isMobile = viewport?.isMobile

  const fields = [
    { ph: t.soil.fields[0], k: 'location', type: 'text' },
    { ph: t.soil.fields[1], k: 'ph_level', type: 'number' },
    { ph: t.soil.fields[2], k: 'nitrogen', type: 'number' },
    { ph: t.soil.fields[3], k: 'phosphorus', type: 'number' },
    { ph: t.soil.fields[4], k: 'potassium', type: 'number' },
    { ph: t.soil.fields[5], k: 'organic_matter', type: 'number' },
    { ph: t.soil.fields[6], k: 'moisture_content', type: 'number' },
  ]

  return (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...styles.badge(theme.colors.soil), marginBottom: 12 }}>{t.soil.badge}</div>
            <h2 style={styles.h2}>{t.soil.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17, lineHeight: 1.6 }}>{t.soil.subtitle}</p>
          </div>

          <div style={{ ...styles.card, marginBottom: 24 }}>
            <h3 style={{ ...styles.h3, marginBottom: 20, color: theme.colors.soil }}>{t.soil.parameters}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              {fields.map(f => (
                <FormInput
                  key={f.k}
                  placeholder={f.ph}
                  type={f.type}
                  value={soilData[f.k]}
                  onChange={e => setSoilData(current => ({ ...current, [f.k]: e.target.value }))}
                  style={f.k === 'location' && !isMobile ? { gridColumn: 'span 2' } : {}}
                />
              ))}
            </div>
            <button onClick={analyzeSoil} disabled={loading} style={{ ...styles.primaryBtn(theme.colors.soil), marginTop: 20, opacity: loading ? 0.6 : 1 }}>
              {loading ? t.soil.analyzing : `${t.soil.run} →`}
            </button>
          </div>

          {!soilResults && (
            <div style={{ ...styles.card, background: `${theme.colors.soil}08`, border: `1px solid ${theme.colors.soil}20` }}>
              <h4 style={{ color: theme.colors.soil, margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>ℹ {t.soil.whyTitle}</h4>
              <p style={{ color: theme.colors.muted, lineHeight: 1.65, margin: 0, fontSize: 15 }}>{t.soil.whyBody}</p>
            </div>
          )}

          {soilResults && (
            <div style={styles.card}>
              <h3 style={{ ...styles.h3, color: theme.colors.leaf, marginBottom: 24 }}>{t.soil.results}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div style={{ background: `${theme.colors.leaf}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.soil.healthScore}</div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '-2px', lineHeight: 1.1 }}>{soilResults.data.health_score}<span style={{ fontSize: 20 }}>/100</span></div>
                </div>
                <div style={{ background: `${theme.colors.soil}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.soil, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.soil.soilType}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.soil, marginTop: 8 }}>{soilResults.data.soil_type}</div>
                </div>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.soil.recommendations}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {soilResults.recommendations.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, background: '#F9FAFB', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.leaf, marginTop: 6, flexShrink: 0 }} />
                    <div><div style={{ fontWeight: 600, fontSize: 14 }}>{r.type}</div><div style={{ color: theme.colors.muted, fontSize: 14, marginTop: 3 }}>{r.recommendation}</div></div>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.soil.suitableCrops}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 10 }}>
                {soilResults.suitable_crops.map((c, i) => (
                  <div key={i} style={{ background: `${theme.colors.leaf}08`, border: `1px solid ${theme.colors.leaf}20`, borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.crop_name}</div>
                    <div style={{ color: theme.colors.leaf, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{c.suitability_score}% {t.soil.match}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
