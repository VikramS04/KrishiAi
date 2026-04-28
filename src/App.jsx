import { useEffect, useMemo, useState } from 'react'
import { AppLayout } from './components/AppLayout'
import { defaultWeatherCity, defaultWeatherState, indiaLocations } from './data/indiaLocations'
import { translations } from './data/translations'
import { CommunityPage } from './pages/CommunityPage'
import { DiseasePage } from './pages/DiseasePage'
import { HomePage } from './pages/HomePage'
import { RegisterPage } from './pages/RegisterPage'
import { SoilPage } from './pages/SoilPage'
import { WeatherPage } from './pages/WeatherPage'
import { api } from './services/api'
import { createStyles, theme } from './styles/theme'

const initialSoilData = {
  location: '',
  ph_level: '',
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  organic_matter: '',
  moisture_content: '',
}

const initialUserForm = {
  username: '',
  email: '',
  full_name: '',
  phone: '',
  location: '',
  farm_size: '',
  primary_crops: '',
}

const storedUserKey = 'krishiai-user'

export default function App() {
  const styles = useMemo(() => createStyles(), [])
  const [language, setLanguage] = useState('english')
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('register')
  const [loading, setLoading] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)

  const [soilData, setSoilData] = useState(initialSoilData)
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
  const [userForm, setUserForm] = useState(initialUserForm)
  const [loginIdentifier, setLoginIdentifier] = useState('')

  const t = translations[language]
  const selectedState = indiaLocations.find(item => item.state === weatherState)
  const stateCities = selectedState?.cities || []
  const nav = [
    { id: 'home', label: t.nav.home, accent: theme.colors.leaf },
    { id: 'soil', label: t.nav.soil, accent: theme.colors.soil },
    { id: 'disease', label: t.nav.disease, accent: theme.colors.error },
    { id: 'weather', label: t.nav.weather, accent: theme.colors.sky },
    { id: 'community', label: t.nav.community, accent: '#7C3AED' },
  ]

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

  const requireUserId = () => {
    if (user?._id) return user._id
    alert(t.alerts.createProfileFirst)
    setCurrentView('register')
    return null
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
        alert(error.code === error.PERMISSION_DENIED ? t.alerts.geolocationDenied : t.alerts.geolocationFailed)
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
      localStorage.setItem(storedUserKey, JSON.stringify(result.data))
      setCurrentView('home')
      setAuthMode('login')
      setLoginIdentifier(result.data.email || result.data.username || '')
    }
  }

  const loginUser = async (identifier) => {
    const trimmedIdentifier = identifier.trim()
    if (!trimmedIdentifier) {
      alert(t.auth.loginField)
      return
    }

    const result = await runRequest(
      () => api.loginUser(trimmedIdentifier),
      t.errors.login
    )

    if (result) {
      setUser(result.data)
      localStorage.setItem(storedUserKey, JSON.stringify(result.data))
      setCurrentView('home')
    }
  }

  const logoutUser = () => {
    setUser(null)
    localStorage.removeItem(storedUserKey)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem(storedUserKey)
    if (!storedUser) return

    try {
      setUser(JSON.parse(storedUser))
    } catch (_) {
      localStorage.removeItem(storedUserKey)
    }
  }, [])

  useEffect(() => {
    if (currentView === 'community') loadCommunityPosts()
    if (currentView === 'weather') getWeatherData()
  }, [currentView, language])

  const pages = {
    home: <HomePage t={t} styles={styles} setCurrentView={setCurrentView} openFAQ={openFAQ} setOpenFAQ={setOpenFAQ} />,
    register: <RegisterPage t={t} styles={styles} loading={loading} authMode={authMode} setAuthMode={setAuthMode} userForm={userForm} setUserForm={setUserForm} loginIdentifier={loginIdentifier} setLoginIdentifier={setLoginIdentifier} createUser={createUser} loginUser={loginUser} />,
    soil: <SoilPage t={t} styles={styles} loading={loading} soilData={soilData} setSoilData={setSoilData} soilResults={soilResults} analyzeSoil={analyzeSoil} />,
    weather: (
      <WeatherPage
        t={t}
        styles={styles}
        loading={loading}
        language={language}
        weatherState={weatherState}
        setWeatherState={setWeatherState}
        weatherCity={weatherCity}
        setWeatherCity={setWeatherCity}
        weatherLocation={weatherLocation}
        setWeatherLocation={setWeatherLocation}
        weatherLocationMode={weatherLocationMode}
        setWeatherLocationMode={setWeatherLocationMode}
        stateCities={stateCities}
        weatherData={weatherData}
        weatherForecast={weatherForecast}
        getWeatherData={getWeatherData}
        getDeviceWeatherData={getDeviceWeatherData}
      />
    ),
    community: <CommunityPage t={t} styles={styles} loading={loading} newPost={newPost} setNewPost={setNewPost} communityPosts={communityPosts} createCommunityPost={createCommunityPost} formatPostDate={formatPostDate} formatCategory={formatCategory} />,
    disease: <DiseasePage t={t} styles={styles} loading={loading} diseaseCrop={diseaseCrop} setDiseaseCrop={setDiseaseCrop} diseaseSymptoms={diseaseSymptoms} setDiseaseSymptoms={setDiseaseSymptoms} diseaseImage={diseaseImage} setDiseaseImage={setDiseaseImage} diseaseResults={diseaseResults} detectDisease={detectDisease} />,
  }

  return (
    <AppLayout currentView={currentView} setCurrentView={setCurrentView} language={language} setLanguage={setLanguage} nav={nav} user={user} logoutUser={logoutUser} t={t} styles={styles}>
      {pages[currentView] || pages.home}
    </AppLayout>
  )
}
