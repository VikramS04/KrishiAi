import { useState, useEffect } from 'react'
import { api } from './services/api'
import { defaultWeatherCity, defaultWeatherState, indiaLocations } from './data/indiaLocations'
import { translations } from './data/translations'

const theme = {
  colors: {
    leaf: '#2D6A4F',
    leafLight: '#40916C',
    leafDark: '#1B4332',
    soil: '#8B5E3C',
    soilLight: '#A97C50',
    sky: '#1E6091',
    sun: '#E9A319',
    cream: '#FEFAE0',
    parchment: '#F7F0E6',
    dark: '#1A1A1A',
    muted: '#6B7280',
    error: '#DC2626',
  }
}

export default function App() {
  const [language, setLanguage] = useState('english')
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const [soilData, setSoilData] = useState({ location: '', ph_level: '', nitrogen: '', phosphorus: '', potassium: '', organic_matter: '', moisture_content: '' })
  const [soilResults, setSoilResults] = useState(null)
  const [weatherState, setWeatherState] = useState(defaultWeatherState)
  const [weatherCity, setWeatherCity] = useState(defaultWeatherCity)
  const [weatherLocation, setWeatherLocation] = useState(defaultWeatherCity)
  const [weatherLocationMode, setWeatherLocationMode] = useState('preset')
  const [weatherData, setWeatherData] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)
  const [communityPosts, setCommunityPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' })
  const [diseaseImage, setDiseaseImage] = useState(null)
  const [diseaseCrop, setDiseaseCrop] = useState('Tomato')
  const [diseaseSymptoms, setDiseaseSymptoms] = useState('')
  const [diseaseResults, setDiseaseResults] = useState(null)
  const [userForm, setUserForm] = useState({ username: '', email: '', full_name: '', phone: '', location: '', farm_size: '', primary_crops: '' })

  const t = translations[language]
  const selectedState = indiaLocations.find(item => item.state === weatherState)
  const stateCities = selectedState?.cities || []

  const nav = [
    { id: 'home', label: t.nav.home, icon: '⌂', accent: theme.colors.leaf },
    { id: 'soil', label: t.nav.soil, icon: '◎', accent: theme.colors.soil },
    { id: 'disease', label: t.nav.disease, icon: '⚕', accent: theme.colors.error },
    { id: 'weather', label: t.nav.weather, icon: '☁', accent: theme.colors.sky },
    { id: 'community', label: t.nav.community, icon: '◈', accent: '#7C3AED' },
  ]

  const requireUserId = () => {
    if (user?._id) return user._id
    alert(t.alerts.createProfileFirst)
    setCurrentView('register')
    return null
  }

  const runRequest = async (task, errorPrefix = t.errors.request) => {
    try {
      setLoading(true)
      return await task()
    } catch (e) {
      alert(`${errorPrefix}: ${e.message}`)
      return null
    } finally {
      setLoading(false)
    }
  }

  const formatPostDate = (post) => {
    const rawDate = post.createdAt || post.created_at
    return rawDate ? new Date(rawDate).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-IN') : t.common.recently
  }

  const formatCategory = (category) => {
    const index = translations.english.community.categories.indexOf(category)
    return index >= 0 ? t.community.categories[index] : category
  }

  const analyzeSoil = async () => {
    const userId = requireUserId()
    if (!userId) return

    const result = await runRequest(
      () => api.analyzeSoil({ user_id: userId, ...soilData }),
      t.errors.soil
    )
    if (result) setSoilResults(result)
  }

  const getWeatherData = async () => {
    const location = weatherLocation.trim()
    if (!location) {
      alert(t.alerts.selectLocation)
      return
    }

    const result = await runRequest(async () => {
      const [current, forecast] = await Promise.all([
        api.getCurrentWeather(location),
        api.getWeatherForecast(location, 7),
      ])
      return { current, forecast }
    }, t.errors.weather)

    if (result) {
      setWeatherData(result.current.data)
      setWeatherForecast(result.forecast.data)
    }
  }

  const getDeviceWeatherData = async () => {
    if (!navigator.geolocation) {
      alert(t.alerts.geolocationUnsupported)
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const coordinates = {
            lat: coords.latitude.toFixed(4),
            lon: coords.longitude.toFixed(4),
          }
          const [current, forecast] = await Promise.all([
            api.getCurrentWeatherByCoordinates(coordinates),
            api.getWeatherForecastByCoordinates(coordinates, 7),
          ])

          setWeatherData(current.data)
          setWeatherForecast(forecast.data)
          setWeatherLocation(`${current.data.location}, ${current.data.country}`)
          setWeatherLocationMode('custom')
        } catch (e) {
          alert(`${t.errors.locationWeather}: ${e.message}`)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? t.alerts.geolocationDenied
          : t.alerts.geolocationFailed
        alert(message)
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    )
  }

  const loadCommunityPosts = async () => {
    const result = await runRequest(() => api.getCommunityPosts(language), t.errors.community)
    if (result) setCommunityPosts(result.data)
  }

  const createCommunityPost = async () => {
    const userId = requireUserId()
    if (!userId) return

    const result = await runRequest(
      () => api.createCommunityPost({ user_id: userId, ...newPost, language }),
      t.errors.post
    )

    if (result) {
      setNewPost({ title: '', content: '', category: '' })
      loadCommunityPosts()
    }
  }

  const detectDisease = async () => {
    const userId = requireUserId()
    if (!userId) return

    const cropType = diseaseCrop.trim()
    if (!cropType) {
      alert(t.alerts.cropRequired)
      return
    }

    const result = await runRequest(async () => {
      if (diseaseImage) {
        const formData = new FormData()
        formData.append('user_id', userId)
        formData.append('crop_type', cropType)
        formData.append('symptoms', diseaseSymptoms)
        formData.append('image', diseaseImage)
        return api.uploadDiseaseImage(formData)
      }

      return api.detectDisease({ user_id: userId, crop_type: cropType, symptoms: diseaseSymptoms })
    }, t.errors.detection)

    if (result) setDiseaseResults(result)
  }

  const createUser = async (userData) => {
    const result = await runRequest(
      () => api.createUser({ ...userData, language_preference: language }),
      t.errors.registration
    )

    if (result) {
      setUser(result.data)
      setCurrentView('home')
    }
  }

  useEffect(() => {
    if (currentView === 'community') loadCommunityPosts()
    if (currentView === 'weather') getWeatherData()
  }, [currentView, language])

  const styles = {
    page: { minHeight: '100vh', background: theme.colors.parchment, fontFamily: "'Georgia', 'Times New Roman', serif", color: theme.colors.dark },
    nav: { background: '#fff', borderBottom: `2px solid ${theme.colors.leaf}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(45,106,79,0.08)' },
    navInner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 },
    logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' },
    logoText: { fontSize: 22, fontWeight: 700, color: theme.colors.leafDark, letterSpacing: '-0.5px' },
    logoLeaf: { width: 36, height: 36, background: `linear-gradient(135deg, ${theme.colors.leaf}, ${theme.colors.leafDark})`, borderRadius: '50% 50% 50% 10%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' },
    navLinks: { display: 'flex', gap: 4, alignItems: 'center' },
    navBtn: (active, accent) => ({ padding: '8px 16px', borderRadius: 8, border: 'none', background: active ? `${accent}18` : 'transparent', color: active ? accent : theme.colors.muted, fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', borderBottom: active ? `2px solid ${accent}` : '2px solid transparent' }),
    langBtn: (active) => ({ padding: '4px 10px', borderRadius: 6, border: `1.5px solid ${active ? theme.colors.leaf : '#E5E7EB'}`, background: active ? theme.colors.leaf : '#fff', color: active ? '#fff' : theme.colors.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }),
    signInBtn: { padding: '8px 20px', borderRadius: 8, border: 'none', background: theme.colors.leaf, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
    section: { padding: '64px 0' },
    badge: (color) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: `${color}18`, color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }),
    h1: { fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-2px', margin: 0, color: '#fff' },
    h2: { fontSize: 36, fontWeight: 700, letterSpacing: '-1px', margin: '0 0 8px', color: theme.colors.leafDark },
    h3: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 4px' },
    card: { background: '#fff', borderRadius: 16, border: '1px solid #E9ECEF', padding: 28, transition: 'box-shadow 0.2s' },
    input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: 15, color: theme.colors.dark, background: '#FAFAFA', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s' },
    primaryBtn: (color = theme.colors.leaf) => ({ padding: '13px 28px', borderRadius: 10, border: 'none', background: color, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'opacity 0.15s', letterSpacing: '-0.2px' }),
    outlineBtn: (color = theme.colors.leaf) => ({ padding: '11px 24px', borderRadius: 10, border: `2px solid ${color}`, background: 'transparent', color, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }),
    statCard: { textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.12)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)' },
    footer: { background: theme.colors.leafDark, color: '#fff', padding: '60px 0 32px' },
  }

  const [openFAQ, setOpenFAQ] = useState(null)

  const renderHome = () => (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${theme.colors.leafDark} 0%, ${theme.colors.leaf} 60%, ${theme.colors.leafLight} 100%)`, padding: '80px 0 96px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ ...styles.badge('#90E0B0'), marginBottom: 20, fontSize: 12 }}>🌱 {t.home.badge}</div>
              <h1 style={styles.h1}>{t.home.titleTop}<br />{t.home.titleBottom}</h1>
              <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.82)', marginTop: 20, marginBottom: 36, lineHeight: 1.6, maxWidth: 420 }}>
                {t.home.subtitle}
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: 'auto', padding: '14px 32px', fontSize: 16 }}>{t.home.getStarted}</button>
                <button onClick={() => setCurrentView('soil')} style={{ padding: '14px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t.home.analyzeSoil} →</button>
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

      {/* Feature Cards */}
      <div style={{ ...styles.section, background: theme.colors.parchment }}>
        <div style={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ ...styles.h2, textAlign: 'center' }}>{t.home.farmNeeds}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>{t.home.farmNeedsSubtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              { id: 'soil', icon: '◎', title: t.home.features.soil[0], desc: t.home.features.soil[1], color: theme.colors.soil, metrics: [{ label: t.home.features.soil[2], val: '7' }, { label: t.home.features.soil[3], val: '20+' }] },
              { id: 'disease', icon: '⚕', title: t.home.features.disease[0], desc: t.home.features.disease[1], color: theme.colors.error, metrics: [{ label: t.home.features.disease[2], val: '50+' }, { label: t.home.features.disease[3], val: 'Live' }] },
              { id: 'weather', icon: '☁', title: t.home.features.weather[0], desc: t.home.features.weather[1], color: theme.colors.sky, metrics: [{ label: t.home.features.weather[2], val: '7 Days' }, { label: t.home.features.weather[3], val: 'Hourly' }] },
              { id: 'community', icon: '◈', title: t.home.features.community[0], desc: t.home.features.community[1], color: '#7C3AED', metrics: [{ label: t.home.features.community[2], val: '9' }, { label: t.home.features.community[3], val: 'Yes' }] },
            ].map(f => (
              <div key={f.id} style={{ ...styles.card, borderTop: `4px solid ${f.color}`, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h3 style={{ ...styles.h3, color: f.color }}>{f.title}</h3>
                    <p style={{ color: theme.colors.muted, fontSize: 15, lineHeight: 1.6, margin: '6px 0 0' }}>{f.desc}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                  {f.metrics.map((m, i) => (
                    <div key={i} style={{ flex: 1, background: `${f.color}08`, borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: f.color }}>{m.val}</div>
                      <div style={{ fontSize: 12, color: theme.colors.muted, marginTop: 2 }}>{m.label}</div>
                    </div>
                  ))}
                  <button onClick={() => setCurrentView(f.id)} style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${f.color}`, background: 'transparent', color: f.color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'stretch', whiteSpace: 'nowrap' }}>{t.common.open} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...styles.section, background: '#fff' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 48 }}>{t.home.howItWorks}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: '01', title: t.home.steps[0][0], desc: t.home.steps[0][1], icon: '👤' },
              { step: '02', title: t.home.steps[1][0], desc: t.home.steps[1][1], icon: '📊' },
              { step: '03', title: t.home.steps[2][0], desc: t.home.steps[2][1], icon: '✨' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{t.common.step} {s.step}</div>
                <h3 style={{ ...styles.h3, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: theme.colors.muted, lineHeight: 1.65, fontSize: 15 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ ...styles.section, background: theme.colors.parchment }}>
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
      </div>

      {/* CTA Banner */}
      <div style={{ background: `linear-gradient(135deg, ${theme.colors.leafDark}, ${theme.colors.leaf})`, padding: '64px 0' }}>
        <div style={{ ...styles.container, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-1px' }}>{t.home.ctaTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 32 }}>{t.home.ctaSubtitle}</p>
          <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: 'auto', padding: '16px 40px', fontSize: 17 }}>{t.home.createFreeProfile}</button>
        </div>
      </div>
    </div>
  )

  const FormInput = ({ placeholder, type = 'text', value, onChange, style = {} }) => (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ ...styles.input, ...style }} onFocus={e => e.target.style.borderColor = theme.colors.leaf} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
  )

  const renderRegister = () => (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={styles.h2}>{t.register.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 16 }}>{t.register.subtitle}</p>
          </div>
          <div style={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { ph: t.register.fields[0], k: 'username', t: 'text' },
                { ph: t.register.fields[1], k: 'email', t: 'email' },
                { ph: t.register.fields[2], k: 'full_name', t: 'text' },
                { ph: t.register.fields[3], k: 'phone', t: 'tel' },
                { ph: t.register.fields[4], k: 'location', t: 'text' },
                { ph: t.register.fields[5], k: 'farm_size', t: 'number' },
                { ph: t.register.fields[6], k: 'primary_crops', t: 'text' },
              ].map(f => (
                <FormInput key={f.k} placeholder={f.ph} type={f.t} value={userForm[f.k]} onChange={e => setUserForm({ ...userForm, [f.k]: e.target.value })} />
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

  const renderSoilAnalysis = () => (
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { ph: t.soil.fields[0], k: 'location', t: 'text' },
                { ph: t.soil.fields[1], k: 'ph_level', t: 'number' },
                { ph: t.soil.fields[2], k: 'nitrogen', t: 'number' },
                { ph: t.soil.fields[3], k: 'phosphorus', t: 'number' },
                { ph: t.soil.fields[4], k: 'potassium', t: 'number' },
                { ph: t.soil.fields[5], k: 'organic_matter', t: 'number' },
                { ph: t.soil.fields[6], k: 'moisture_content', t: 'number' },
              ].map(f => (
                <FormInput key={f.k} placeholder={f.ph} type={f.t} value={soilData[f.k]} onChange={e => setSoilData({ ...soilData, [f.k]: e.target.value })} style={f.k === 'location' ? { gridColumn: 'span 2' } : {}} />
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
            <div style={{ ...styles.card }}>
              <h3 style={{ ...styles.h3, color: theme.colors.leaf, marginBottom: 24 }}>{t.soil.results}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div style={{ background: `${theme.colors.leaf}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.soil.healthScore}</div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '-2px', lineHeight: 1.1 }}>{soilResults.data.health_score}<span style={{ fontSize: 20 }}>/100</span></div>
                </div>
                <div style={{ background: `${theme.colors.soil}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.soil, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.soil.soilType}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.soil, marginTop: 8 }}>{soilResults.data.soil_type}</div>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.soil.recommendations}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {soilResults.recommendations.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, background: '#F9FAFB', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.leaf, marginTop: 6, flexShrink: 0 }} />
                      <div><div style={{ fontWeight: 600, fontSize: 14 }}>{r.type}</div><div style={{ color: theme.colors.muted, fontSize: 14, marginTop: 3 }}>{r.recommendation}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.soil.suitableCrops}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {soilResults.suitable_crops.map((c, i) => (
                    <div key={i} style={{ background: `${theme.colors.leaf}08`, border: `1px solid ${theme.colors.leaf}20`, borderRadius: 10, padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.crop_name}</div>
                      <div style={{ color: theme.colors.leaf, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{c.suitability_score}% {t.soil.match}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderWeather = () => (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...styles.badge(theme.colors.sky), marginBottom: 12 }}>{t.weather.badge}</div>
            <h2 style={styles.h2}>{t.weather.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>{t.weather.subtitle}</p>
          </div>
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'center' }}>
              <select
                value={weatherState}
                onChange={e => {
                  const nextState = e.target.value
                  const nextCities = indiaLocations.find(item => item.state === nextState)?.cities || []
                  const nextCity = nextCities[0] || ''
                  setWeatherState(nextState)
                  setWeatherCity(nextCity)
                  setWeatherLocationMode('preset')
                  setWeatherLocation(nextCity)
                }}
                style={{ ...styles.input }}
              >
                <option value="">{t.common.selectState}</option>
                {indiaLocations.map(location => <option key={location.state} value={location.state}>{location.state}</option>)}
              </select>
              <select
                value={weatherLocationMode === 'preset' ? weatherCity : ''}
                onChange={e => {
                  setWeatherCity(e.target.value)
                  setWeatherLocationMode('preset')
                  setWeatherLocation(e.target.value)
                }}
                style={{ ...styles.input }}
                disabled={!weatherState}
              >
                <option value="">{t.common.selectCity}</option>
                {stateCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <button onClick={getWeatherData} disabled={loading} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: theme.colors.sky, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}>
                {loading ? t.weather.loading : t.weather.getForecast}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <FormInput
                placeholder={t.common.customLocation}
                value={weatherLocationMode === 'custom' ? weatherLocation : ''}
                onChange={e => {
                  setWeatherLocationMode('custom')
                  setWeatherLocation(e.target.value)
                }}
              />
              <button
                onClick={getDeviceWeatherData}
                disabled={loading}
                style={{ ...styles.outlineBtn(theme.colors.sky), whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}
              >
                {t.weather.currentLocation}
              </button>
            </div>
          </div>
          {weatherData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: t.weather.temperature, value: `${weatherData.temperature}°C`, sub: weatherData.condition, color: theme.colors.sun, icon: '🌡' },
                { label: t.weather.humidity, value: `${weatherData.humidity}%`, sub: `${t.weather.wind} ${weatherData.wind_speed} km/h`, color: theme.colors.sky, icon: '💧' },
                { label: t.weather.rainfall, value: `${weatherData.rainfall}mm`, sub: `${t.weather.uvIndex}: ${weatherData.uv_index || '-'}`, color: theme.colors.leaf, icon: '🌧' },
              ].map((s, i) => (
                <div key={i} style={{ ...styles.card, textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: s.color, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ fontSize: 38, fontWeight: 700, color: s.color, letterSpacing: '-1.5px', margin: '8px 0 4px' }}>{s.value}</div>
                  <div style={{ color: theme.colors.muted, fontSize: 14 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          )}
          {weatherForecast && (
            <div style={styles.card}>
              <h3 style={{ ...styles.h3, marginBottom: 20 }}>{t.weather.forecast}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
                {weatherForecast.slice(0, 7).map((day, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: i === 0 ? `${theme.colors.sky}10` : '#F9FAFB', borderRadius: 12, border: i === 0 ? `1px solid ${theme.colors.sky}30` : 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.colors.muted, marginBottom: 8 }}>{new Date(day.date).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-IN', { weekday: 'short' })}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.sky }}>{day.temperature}°</div>
                    <div style={{ fontSize: 11, color: theme.colors.muted, marginTop: 4 }}>{day.rainfall}mm</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!weatherData && !loading && (
            <div style={{ ...styles.card, background: `${theme.colors.sky}08`, border: `1px solid ${theme.colors.sky}20`, textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☁</div>
              <p style={{ color: theme.colors.muted, margin: 0 }}>{t.weather.empty}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCommunity = () => (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...styles.badge('#7C3AED'), marginBottom: 12 }}>{t.community.badge}</div>
            <h2 style={styles.h2}>{t.community.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>{t.community.subtitle}</p>
          </div>
          <div style={{ ...styles.card, marginBottom: 28 }}>
            <h3 style={{ ...styles.h3, marginBottom: 20, color: '#7C3AED' }}>{t.community.newPost}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FormInput placeholder={t.community.postTitle} value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
              <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} style={{ ...styles.input }}>
                <option value="">{t.community.selectCategory}</option>
                {translations.english.community.categories.map((category, index) => (
                  <option key={category} value={category}>{t.community.categories[index]}</option>
                ))}
              </select>
              <textarea placeholder={t.community.bodyPlaceholder} value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} style={{ ...styles.input, height: 120, resize: 'vertical' }} />
              <button onClick={createCommunityPost} disabled={loading} style={{ ...styles.primaryBtn('#7C3AED'), opacity: loading ? 0.6 : 1 }}>
                {loading ? t.community.posting : `${t.community.publish} →`}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {communityPosts.length === 0 && !loading && (
              <div style={{ ...styles.card, textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
                <p style={{ color: theme.colors.muted }}>{t.community.empty}</p>
              </div>
            )}
            {communityPosts.map((post, i) => (
              <div key={i} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>{post.title}</h4>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ ...styles.badge('#7C3AED'), fontSize: 10 }}>{formatCategory(post.category)}</span>
                      <span style={{ fontSize: 12, color: theme.colors.muted }}>{formatPostDate(post)}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.muted, textAlign: 'right' }}>
                    <div>♥ {post.likes_count}</div>
                    <div>💬 {post.comments_count}</div>
                  </div>
                </div>
                <p style={{ color: theme.colors.muted, lineHeight: 1.65, margin: '0 0 16px', fontSize: 15 }}>{post.content}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {t.community.actions.map(a => (
                    <button key={a} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'transparent', color: theme.colors.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{a}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDiseaseDetection = () => (
    <div style={{ ...styles.section, background: theme.colors.parchment }}>
      <div style={styles.container}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ ...styles.badge(theme.colors.error), marginBottom: 12 }}>{t.disease.badge}</div>
            <h2 style={styles.h2}>{t.disease.title}</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>{t.disease.subtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '🍄', title: t.disease.types[0][0], desc: t.disease.types[0][1], color: '#92400E' },
              { icon: '🧫', title: t.disease.types[1][0], desc: t.disease.types[1][1], color: '#1D4ED8' },
              { icon: '🧪', title: t.disease.types[2][0], desc: t.disease.types[2][1], color: '#6D28D9' },
              { icon: '⚡', title: t.disease.types[3][0], desc: t.disease.types[3][1], color: '#065F46' },
            ].map((t, i) => (
              <div key={i} style={{ ...styles.card, display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px' }}>
                <div style={{ fontSize: 28 }}>{t.icon}</div>
                <div><div style={{ fontWeight: 700, fontSize: 15, color: t.color }}>{t.title}</div><div style={{ color: theme.colors.muted, fontSize: 13, marginTop: 3 }}>{t.desc}</div></div>
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
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.disease.treatment}</h4>
                {diseaseResults.detection_result.treatment_recommendations.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${theme.colors.error}06`, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ color: theme.colors.error, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ color: theme.colors.dark, fontSize: 14 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{t.disease.prevention}</h4>
                {diseaseResults.detection_result.preventive_measures.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${theme.colors.leaf}06`, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ color: theme.colors.leaf, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: theme.colors.dark, fontSize: 14 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      {/* Navigation */}
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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setLanguage('english')} style={styles.langBtn(language === 'english')}>EN</button>
              <button onClick={() => setLanguage('hindi')} style={styles.langBtn(language === 'hindi')}>हिं</button>
            </div>
            {user ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: theme.colors.muted }}>{t.common.hello}, {user.username}</span>
                <button onClick={() => setUser(null)} style={{ ...styles.outlineBtn(theme.colors.error), padding: '6px 14px', fontSize: 13 }}>{t.common.logout}</button>
              </div>
            ) : (
              <button onClick={() => setCurrentView('register')} style={styles.signInBtn}>{t.common.signIn}</button>
            )}
          </div>
        </div>
      </nav>

      {/* Views */}
      {currentView === 'home' && renderHome()}
      {currentView === 'register' && renderRegister()}
      {currentView === 'soil' && renderSoilAnalysis()}
      {currentView === 'weather' && renderWeather()}
      {currentView === 'community' && renderCommunity()}
      {currentView === 'disease' && renderDiseaseDetection()}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t.footer.rights}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t.footer.made}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
