import { useState, useEffect } from 'react'
import { api } from './services/api'

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
  const [weatherLocation, setWeatherLocation] = useState('Delhi')
  const [weatherData, setWeatherData] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)
  const [communityPosts, setCommunityPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' })
  const [diseaseImage, setDiseaseImage] = useState(null)
  const [diseaseCrop, setDiseaseCrop] = useState('Tomato')
  const [diseaseSymptoms, setDiseaseSymptoms] = useState('')
  const [diseaseResults, setDiseaseResults] = useState(null)
  const [userForm, setUserForm] = useState({ username: '', email: '', full_name: '', phone: '', location: '', farm_size: '', primary_crops: '' })

  const t = {
    english: { home: 'Home', soil: 'Soil Analysis', disease: 'Disease Detection', weather: 'Weather', community: 'Community', login: 'Sign In' },
    hindi: { home: 'होम', soil: 'मिट्टी विश्लेषण', disease: 'रोग पहचान', weather: 'मौसम', community: 'समुदाय', login: 'लॉगिन' }
  }[language]

  const nav = [
    { id: 'home', label: t.home, icon: '⌂', accent: theme.colors.leaf },
    { id: 'soil', label: t.soil, icon: '◎', accent: theme.colors.soil },
    { id: 'disease', label: t.disease, icon: '⚕', accent: theme.colors.error },
    { id: 'weather', label: t.weather, icon: '☁', accent: theme.colors.sky },
    { id: 'community', label: t.community, icon: '◈', accent: '#7C3AED' },
  ]

  const requireUserId = () => {
    if (user?._id) return user._id
    alert('Please create your farmer profile first so results can be saved correctly.')
    setCurrentView('register')
    return null
  }

  const runRequest = async (task, errorPrefix = 'Request failed') => {
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
    return rawDate ? new Date(rawDate).toLocaleDateString() : 'Recently'
  }

  const analyzeSoil = async () => {
    const userId = requireUserId()
    if (!userId) return

    const result = await runRequest(
      () => api.analyzeSoil({ user_id: userId, ...soilData }),
      'Soil analysis failed'
    )
    if (result) setSoilResults(result)
  }

  const getWeatherData = async () => {
    const result = await runRequest(async () => {
      const [current, forecast] = await Promise.all([
        api.getCurrentWeather(weatherLocation.trim()),
        api.getWeatherForecast(weatherLocation.trim(), 7),
      ])
      return { current, forecast }
    }, 'Weather error')

    if (result) {
      setWeatherData(result.current.data)
      setWeatherForecast(result.forecast.data)
    }
  }

  const loadCommunityPosts = async () => {
    const result = await runRequest(() => api.getCommunityPosts(language), 'Community load failed')
    if (result) setCommunityPosts(result.data)
  }

  const createCommunityPost = async () => {
    const userId = requireUserId()
    if (!userId) return

    const result = await runRequest(
      () => api.createCommunityPost({ user_id: userId, ...newPost, language }),
      'Post creation failed'
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
      alert('Please enter a crop name before running disease detection.')
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
    }, 'Detection failed')

    if (result) setDiseaseResults(result)
  }

  const createUser = async (userData) => {
    const result = await runRequest(
      () => api.createUser({ ...userData, language_preference: language }),
      'Registration failed'
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

  const FAQ = [
    { q: 'How accurate is the soil analysis?', a: 'Our AI-powered analysis has a 94% accuracy rate, cross-referenced with regional soil databases and expert agronomist knowledge.' },
    { q: 'Which crops does disease detection support?', a: 'Currently we support 50+ crops including wheat, rice, tomato, potato, and maize. We expand our database monthly.' },
    { q: 'Is the weather forecast farming-specific?', a: 'Yes — beyond standard weather, we provide agricultural indices like evapotranspiration, soil moisture forecasts, and sowing window recommendations.' },
    { q: 'How do I get started?', a: 'Create your farmer profile, enter your location and farm details, and immediately access all tools. No subscription required for basic features.' },
  ]

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
              <div style={{ ...styles.badge('#90E0B0'), marginBottom: 20, fontSize: 12 }}>🌱 AI-Powered Agriculture</div>
              <h1 style={styles.h1}>Smart Farming<br />Starts Here</h1>
              <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.82)', marginTop: 20, marginBottom: 36, lineHeight: 1.6, maxWidth: 420 }}>
                Data-driven insights, real-time weather, and community wisdom — everything a modern farmer needs in one platform.
              </p>
              <div style={{ display: 'flex', gap: 14 }}>
                <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: 'auto', padding: '14px 32px', fontSize: 16 }}>Get Started Free</button>
                <button onClick={() => setCurrentView('soil')} style={{ padding: '14px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Analyze Soil →</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Prediction Accuracy', value: '94%', icon: '◎', color: '#90E0B0' },
                { label: 'Soil Parameters', value: '7+', icon: '⬡', color: '#FFD166' },
                { label: 'Crop Diseases', value: '50+', icon: '⚕', color: '#FF6B6B' },
                { label: 'Forecast Days', value: '7-Day', icon: '☁', color: '#74C0FC' },
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
            <h2 style={{ ...styles.h2, textAlign: 'center' }}>Everything Your Farm Needs</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.6 }}>Four powerful tools working in harmony to maximize your harvest</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              { id: 'soil', icon: '◎', title: 'Soil Analysis', desc: 'Input your soil parameters and receive AI-powered fertilizer recommendations, pH correction guidance, and crop suitability scores.', color: theme.colors.soil, metrics: [{ label: 'Parameters Analyzed', val: '7' }, { label: 'Crop Matches', val: '20+' }] },
              { id: 'disease', icon: '⚕', title: 'Disease Detection', desc: 'Upload a crop photo or describe symptoms. Our AI identifies fungal, bacterial, and viral infections with treatment plans.', color: theme.colors.error, metrics: [{ label: 'Diseases Covered', val: '50+' }, { label: 'Confidence Score', val: 'Live' }] },
              { id: 'weather', icon: '☁', title: 'Weather Forecast', desc: '7-day agricultural forecasts including rainfall probability, humidity trends, and optimal sowing or harvesting windows.', color: theme.colors.sky, metrics: [{ label: 'Forecast Window', val: '7 Days' }, { label: 'Update Frequency', val: 'Hourly' }] },
              { id: 'community', icon: '◈', title: 'Farmer Community', desc: 'Share experiences, ask questions, and learn from thousands of farmers across India. Knowledge that grows with every conversation.', color: '#7C3AED', metrics: [{ label: 'Categories', val: '9' }, { label: 'Multilingual', val: 'Yes' }] },
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
                  <button onClick={() => setCurrentView(f.id)} style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${f.color}`, background: 'transparent', color: f.color, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'stretch', whiteSpace: 'nowrap' }}>Open →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...styles.section, background: '#fff' }}>
        <div style={styles.container}>
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 48 }}>How KrishiAi Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Register your farm — size, location, primary crops. This personalizes every recommendation.', icon: '👤' },
              { step: '02', title: 'Input Your Data', desc: 'Enter soil readings, upload crop photos, or select your city for live weather.', icon: '📊' },
              { step: '03', title: 'Get AI Insights', desc: 'Receive targeted recommendations for fertilizers, disease treatment, and optimal harvest timing.', icon: '✨' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Step {s.step}</div>
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
          <h2 style={{ ...styles.h2, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ ...styles.card, cursor: 'pointer', padding: '20px 24px' }} onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{f.q}</span>
                  <span style={{ fontSize: 20, color: theme.colors.leaf, transform: openFAQ === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', marginLeft: 16 }}>+</span>
                </div>
                {openFAQ === i && <p style={{ color: theme.colors.muted, marginTop: 14, lineHeight: 1.65, fontSize: 15 }}>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: `linear-gradient(135deg, ${theme.colors.leafDark}, ${theme.colors.leaf})`, padding: '64px 0' }}>
        <div style={{ ...styles.container, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-1px' }}>Ready to Transform Your Farm?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 32 }}>Join the growing community of data-driven farmers across India.</p>
          <button onClick={() => setCurrentView('register')} style={{ ...styles.primaryBtn('#fff'), color: theme.colors.leafDark, width: 'auto', padding: '16px 40px', fontSize: 17 }}>Create Free Profile</button>
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
            <h2 style={styles.h2}>Create Your Farmer Profile</h2>
            <p style={{ color: theme.colors.muted, fontSize: 16 }}>Your personalized agricultural dashboard awaits</p>
          </div>
          <div style={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { ph: 'Username *', k: 'username', t: 'text' },
                { ph: 'Email address *', k: 'email', t: 'email' },
                { ph: 'Full Name', k: 'full_name', t: 'text' },
                { ph: 'Phone Number', k: 'phone', t: 'tel' },
                { ph: 'Village / District / State', k: 'location', t: 'text' },
                { ph: 'Farm Size (acres)', k: 'farm_size', t: 'number' },
                { ph: 'Primary Crops (e.g. Wheat, Rice)', k: 'primary_crops', t: 'text' },
              ].map(f => (
                <FormInput key={f.k} placeholder={f.ph} type={f.t} value={userForm[f.k]} onChange={e => setUserForm({ ...userForm, [f.k]: e.target.value })} />
              ))}
              <button onClick={() => createUser(userForm)} disabled={loading} style={{ ...styles.primaryBtn(), marginTop: 8, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Creating profile...' : 'Create Profile →'}
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
            <div style={{ ...styles.badge(theme.colors.soil), marginBottom: 12 }}>Soil Science</div>
            <h2 style={styles.h2}>Soil Health Analysis</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17, lineHeight: 1.6 }}>Enter your soil test results and our AI will generate a comprehensive health report with actionable recommendations.</p>
          </div>

          <div style={{ ...styles.card, marginBottom: 24 }}>
            <h3 style={{ ...styles.h3, marginBottom: 20, color: theme.colors.soil }}>Soil Parameters</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { ph: 'Location / District', k: 'location', t: 'text' },
                { ph: 'pH Level (e.g. 6.5)', k: 'ph_level', t: 'number' },
                { ph: 'Nitrogen (mg/kg)', k: 'nitrogen', t: 'number' },
                { ph: 'Phosphorus (mg/kg)', k: 'phosphorus', t: 'number' },
                { ph: 'Potassium (mg/kg)', k: 'potassium', t: 'number' },
                { ph: 'Organic Matter (%)', k: 'organic_matter', t: 'number' },
                { ph: 'Moisture Content (%)', k: 'moisture_content', t: 'number' },
              ].map(f => (
                <FormInput key={f.k} placeholder={f.ph} type={f.t} value={soilData[f.k]} onChange={e => setSoilData({ ...soilData, [f.k]: e.target.value })} style={f.k === 'location' ? { gridColumn: 'span 2' } : {}} />
              ))}
            </div>
            <button onClick={analyzeSoil} disabled={loading} style={{ ...styles.primaryBtn(theme.colors.soil), marginTop: 20, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Analyzing soil...' : 'Run Analysis →'}
            </button>
          </div>

          {!soilResults && (
            <div style={{ ...styles.card, background: `${theme.colors.soil}08`, border: `1px solid ${theme.colors.soil}20` }}>
              <h4 style={{ color: theme.colors.soil, margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>ℹ Why Soil Analysis Matters</h4>
              <p style={{ color: theme.colors.muted, lineHeight: 1.65, margin: 0, fontSize: 15 }}>Precise soil data enables targeted fertilization — avoiding waste, reducing costs, and improving crop quality. Our analysis compares your results to 20+ suitable crops for your soil type.</p>
            </div>
          )}

          {soilResults && (
            <div style={{ ...styles.card }}>
              <h3 style={{ ...styles.h3, color: theme.colors.leaf, marginBottom: 24 }}>Analysis Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div style={{ background: `${theme.colors.leaf}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.leaf, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Health Score</div>
                  <div style={{ fontSize: 48, fontWeight: 700, color: theme.colors.leaf, letterSpacing: '-2px', lineHeight: 1.1 }}>{soilResults.data.health_score}<span style={{ fontSize: 20 }}>/100</span></div>
                </div>
                <div style={{ background: `${theme.colors.soil}10`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: theme.colors.soil, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Soil Type</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.soil, marginTop: 8 }}>{soilResults.data.soil_type}</div>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recommendations</h4>
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
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Suitable Crops</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {soilResults.suitable_crops.map((c, i) => (
                    <div key={i} style={{ background: `${theme.colors.leaf}08`, border: `1px solid ${theme.colors.leaf}20`, borderRadius: 10, padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.crop_name}</div>
                      <div style={{ color: theme.colors.leaf, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{c.suitability_score}% match</div>
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
            <div style={{ ...styles.badge(theme.colors.sky), marginBottom: 12 }}>Weather Intelligence</div>
            <h2 style={styles.h2}>Agricultural Weather Forecast</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>Hyperlocal weather data tailored for farming decisions.</p>
          </div>
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <FormInput placeholder="Enter city or district (e.g. Delhi, Jaipur)" value={weatherLocation} onChange={e => setWeatherLocation(e.target.value)} style={{ flex: 1 }} />
              <button onClick={getWeatherData} disabled={loading} style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: theme.colors.sky, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}>
                {loading ? '...' : 'Get Forecast'}
              </button>
            </div>
          </div>
          {weatherData && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Temperature', value: `${weatherData.temperature}°C`, sub: weatherData.condition, color: theme.colors.sun, icon: '🌡' },
                { label: 'Humidity', value: `${weatherData.humidity}%`, sub: `Wind ${weatherData.wind_speed} km/h`, color: theme.colors.sky, icon: '💧' },
                { label: 'Rainfall', value: `${weatherData.rainfall}mm`, sub: `UV Index: ${weatherData.uv_index}`, color: theme.colors.leaf, icon: '🌧' },
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
              <h3 style={{ ...styles.h3, marginBottom: 20 }}>7-Day Forecast</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
                {weatherForecast.slice(0, 7).map((day, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: i === 0 ? `${theme.colors.sky}10` : '#F9FAFB', borderRadius: 12, border: i === 0 ? `1px solid ${theme.colors.sky}30` : 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.colors.muted, marginBottom: 8 }}>{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
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
              <p style={{ color: theme.colors.muted, margin: 0 }}>Enter your location above to load current conditions and the 7-day forecast.</p>
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
            <div style={{ ...styles.badge('#7C3AED'), marginBottom: 12 }}>Community</div>
            <h2 style={styles.h2}>Farmer Forum</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>Share experiences, ask questions, and learn from thousands of farmers.</p>
          </div>
          <div style={{ ...styles.card, marginBottom: 28 }}>
            <h3 style={{ ...styles.h3, marginBottom: 20, color: '#7C3AED' }}>New Post</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FormInput placeholder="Post title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
              <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} style={{ ...styles.input }}>
                <option value="">Select Category</option>
                {['Crop Management', 'Soil Health', 'Pest Control', 'Weather Discussion', 'Market Prices', 'Technology', 'Success Stories', 'Questions', 'General Discussion'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea placeholder="Share your experience, question, or insight..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} style={{ ...styles.input, height: 120, resize: 'vertical' }} />
              <button onClick={createCommunityPost} disabled={loading} style={{ ...styles.primaryBtn('#7C3AED'), opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Posting...' : 'Publish Post →'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {communityPosts.length === 0 && !loading && (
              <div style={{ ...styles.card, textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◈</div>
                <p style={{ color: theme.colors.muted }}>No posts yet. Be the first to share!</p>
              </div>
            )}
            {communityPosts.map((post, i) => (
              <div key={i} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700 }}>{post.title}</h4>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ ...styles.badge('#7C3AED'), fontSize: 10 }}>{post.category}</span>
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
                  {['Like', 'Comment', 'Share'].map(a => (
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
            <div style={{ ...styles.badge(theme.colors.error), marginBottom: 12 }}>Disease AI</div>
            <h2 style={styles.h2}>Crop Disease Detection</h2>
            <p style={{ color: theme.colors.muted, fontSize: 17 }}>Early detection saves your harvest. Upload an image and get an instant diagnosis.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '🍄', title: 'Fungal', desc: 'Leaf spot, powdery mildew, rust', color: '#92400E' },
              { icon: '🧫', title: 'Bacterial', desc: 'Blight, wilt diseases', color: '#1D4ED8' },
              { icon: '🧪', title: 'Viral', desc: 'Mosaic, leaf curl infections', color: '#6D28D9' },
              { icon: '⚡', title: 'Nutrient Deficiency', desc: 'Yellowing, weak growth', color: '#065F46' },
            ].map((t, i) => (
              <div key={i} style={{ ...styles.card, display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px' }}>
                <div style={{ fontSize: 28 }}>{t.icon}</div>
                <div><div style={{ fontWeight: 700, fontSize: 15, color: t.color }}>{t.title}</div><div style={{ color: theme.colors.muted, fontSize: 13, marginTop: 3 }}>{t.desc}</div></div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.card, marginBottom: 24 }}>
            <h3 style={{ ...styles.h3, color: theme.colors.error, marginBottom: 20 }}>Upload Crop Image</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <FormInput placeholder="Crop type (e.g. Tomato)" value={diseaseCrop} onChange={e => setDiseaseCrop(e.target.value)} />
              <FormInput placeholder="Symptoms (optional)" value={diseaseSymptoms} onChange={e => setDiseaseSymptoms(e.target.value)} />
            </div>
            <div style={{ border: `2px dashed ${theme.colors.error}40`, borderRadius: 12, padding: '40px 24px', textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: `${theme.colors.error}04` }} onClick={() => document.getElementById('disease-upload').click()}>
              <input type="file" accept="image/*" id="disease-upload" style={{ display: 'none' }} onChange={e => setDiseaseImage(e.target.files[0])} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
              <div style={{ fontWeight: 600, color: theme.colors.muted }}>{diseaseImage ? `✓ ${diseaseImage.name}` : 'Click to upload a crop photo'}</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>JPG, PNG up to 10MB</div>
            </div>
            <button onClick={detectDisease} disabled={loading} style={{ ...styles.primaryBtn(theme.colors.error), opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Analyzing image...' : 'Detect Disease →'}
            </button>
          </div>
          {diseaseResults && (
            <div style={styles.card}>
              <h3 style={{ ...styles.h3, color: theme.colors.error, marginBottom: 24 }}>Detection Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Disease', value: diseaseResults.detection_result.disease_name, color: theme.colors.error },
                  { label: 'Confidence', value: `${(diseaseResults.detection_result.confidence_score * 100).toFixed(1)}%`, color: theme.colors.sun },
                  { label: 'Severity', value: diseaseResults.detection_result.severity_level, color: theme.colors.muted },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#F9FAFB', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: s.color }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Treatment Plan</h4>
                {diseaseResults.detection_result.treatment_recommendations.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${theme.colors.error}06`, borderRadius: 8, marginBottom: 8 }}>
                    <span style={{ color: theme.colors.error, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ color: theme.colors.dark, fontSize: 14 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Preventive Measures</h4>
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
                <span style={{ fontSize: 14, color: theme.colors.muted }}>Hello, {user.username}</span>
                <button onClick={() => setUser(null)} style={{ ...styles.outlineBtn(theme.colors.error), padding: '6px 14px', fontSize: 13 }}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setCurrentView('register')} style={styles.signInBtn}>Sign In</button>
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
                Empowering Indian farmers with technology-driven insights for sustainable, profitable agriculture.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Platform</div>
              {['Soil Analysis', 'Disease Detection', 'Weather Forecast', 'Community Forum'].map((l, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Legal</div>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((l, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>© 2025 KrishiAi. All rights reserved.</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Made with 🌱 for Indian farmers</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
