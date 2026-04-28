import { FormInput } from '../components/FormInput'
import { theme } from '../styles/theme'

export function DiseasePage({ t, styles, loading, diseaseCrop, setDiseaseCrop, diseaseSymptoms, setDiseaseSymptoms, diseaseImage, setDiseaseImage, diseaseResults, detectDisease }) {
  const typeColors = ['#92400E', '#1D4ED8', '#6D28D9', '#065F46']
  const typeIcons = ['🍄', '🧫', '🧪', '⚡']

  return (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...styles.badge(theme.colors.error), marginBottom: 12 }}>{t.disease.badge}</div>
            <h2 style={styles.h2}>{t.disease.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>{t.disease.subtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
            {t.disease.types.map((type, i) => (
              <div key={type[0]} style={{ ...styles.card, display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px' }}>
                <div style={{ fontSize: 28 }}>{typeIcons[i]}</div>
                <div><div style={{ fontWeight: 700, fontSize: 15, color: typeColors[i] }}>{type[0]}</div><div style={{ color: theme.colors.muted, fontSize: 13, marginTop: 3 }}>{type[1]}</div></div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <h3 style={{ ...styles.h3, color: theme.colors.error, marginBottom: 20 }}>{t.disease.uploadTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <FormInput placeholder={t.disease.cropPlaceholder} value={diseaseCrop} onChange={e => setDiseaseCrop(e.target.value)} />
              <FormInput placeholder={t.disease.symptomsPlaceholder} value={diseaseSymptoms} onChange={e => setDiseaseSymptoms(e.target.value)} />
            </div>
            <div style={{ border: `2px dashed ${theme.colors.error}40`, borderRadius: 12, padding: '40px 24px', textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: `${theme.colors.error}04` }} onClick={() => document.getElementById('disease-upload').click()}>
              <input type="file" accept="image/*" id="disease-upload" style={{ display: 'none' }} onChange={e => setDiseaseImage(e.target.files[0])} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
              <div style={{ fontWeight: 600, color: theme.colors.muted }}>{diseaseImage ? `✓ ${diseaseImage.name}` : t.disease.uploadPrompt}</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>{t.disease.uploadHelp}</div>
            </div>
            <button onClick={detectDisease} disabled={loading} style={{ ...styles.primaryBtn(theme.colors.error), opacity: loading ? 0.6 : 1 }}>
              {loading ? t.disease.analyzing : `${t.disease.detect} →`}
            </button>
          </div>
          {diseaseResults && (
            <div style={styles.card}>
              <h3 style={{ ...styles.h3, color: theme.colors.error, marginBottom: 24 }}>{t.disease.results}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: t.disease.disease, value: diseaseResults.detection_result.disease_name, color: theme.colors.error },
                  { label: t.disease.confidence, value: `${(diseaseResults.detection_result.confidence_score * 100).toFixed(1)}%`, color: theme.colors.sun },
                  { label: t.disease.severity, value: diseaseResults.detection_result.severity_level, color: theme.colors.muted },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#F9FAFB', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: s.color }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.disease.treatment}</h4>
              {diseaseResults.detection_result.treatment_recommendations.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${theme.colors.error}06`, borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ color: theme.colors.error, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: theme.colors.dark, fontSize: 14 }}>{item}</span>
                </div>
              ))}
              <h4 style={{ fontSize: 15, fontWeight: 700, margin: '20px 0 12px' }}>{t.disease.prevention}</h4>
              {diseaseResults.detection_result.preventive_measures.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${theme.colors.leaf}06`, borderRadius: 8, marginBottom: 8 }}>
                  <span style={{ color: theme.colors.leaf, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: theme.colors.dark, fontSize: 14 }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
