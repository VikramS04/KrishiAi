import { useState, useEffect } from 'react'
import './App.css'
import FAQSecion  from './components/ui/FAQSection'
import logo from './assets/KrishiAi.png'

/* const API_BASE_URL = 'http://127.0.0.1:5001/api' */
const API_BASE_URL = 'https://flask-hello-world-lovat-xi.vercel.app/api' 

function App() {
  const [language, setLanguage] = useState('english')
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Soil Analysis State
  const [soilData, setSoilData] = useState({
    location: '',
    ph_level: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organic_matter: 0,
    moisture_content: 0
  })
  const [soilResults, setSoilResults] = useState(null)
  
  // Weather State
  const [weatherLocation, setWeatherLocation] = useState('Delhi')
  const [weatherData, setWeatherData] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState(null)
  
  // Community State
  const [communityPosts, setCommunityPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' })
  
  // Disease Detection State
  const [diseaseImage, setDiseaseImage] = useState(null)
  const [diseaseResults, setDiseaseResults] = useState(null)
  
  // User Registration State
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    location: '',
    farm_size: '',
    primary_crops: ''
  })

  const translations = {
    english: {
      home: 'Home',
      soilAnalysis: 'Soil Analysis',
      cropAdvisory: 'Crop Advisory',
      weather: 'Weather',
      community: 'Community',
      search: 'Search...',
      login: 'Login',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      uploadSample: 'Upload Sample',
      getAdvice: 'Get Advice',
      viewForecast: 'View Forecast',
      joinCommunity: 'Join Community',
      modernAgriculture: 'Modern Agriculture',
      empoweringFarmers: 'Empowering farmers with data-driven insights and community support',
      farmerDashboard: 'Farmer Dashboard',
      realTimeInsights: 'Real-time insights',
      soilAnalysisDesc: 'Comprehensive soil health assessment with AI-powered recommendations',
      cropAdvisoryDesc: 'Expert guidance and personalized crop recommendations',
      weatherForecastDesc: 'Accurate weather predictions for better farming decisions',
      communityForumDesc: 'Connect with fellow farmers and share experiences',
      trustedByFarmers: 'Trusted by Farmers Nationwide',
      joinThousands: 'Join thousands of farmers who are already benefiting from our platform',
      activeFarmers: 'Active Farmers',
      soilAnalyses: 'Soil Analyses',
      predictionAccuracy: 'Prediction Accuracy',
      support247: '24/7 Support',
      website: 'Website',
      services: 'Services',
      support: 'Support',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service'
    },
    hindi: {
      home: 'होम',
      soilAnalysis: 'मिट्टी विश्लेषण',
      cropAdvisory: 'फसल सलाह',
      weather: 'मौसम',
      community: 'समुदाय',
      search: 'खोजें...',
      login: 'लॉगिन',
      getStarted: 'शुरू करें',
      learnMore: 'और जानें',
      uploadSample: 'नमूना अपलोड करें',
      getAdvice: 'सलाह लें',
      viewForecast: 'पूर्वानुमान देखें',
      joinCommunity: 'समुदाय में शामिल हों',
      modernAgriculture: 'आधुनिक कृषि',
      empoweringFarmers: 'डेटा-संचालित अंतर्दृष्टि और सामुदायिक सहायता के साथ किसानों को सशक्त बनाना',
      farmerDashboard: 'Farmer Dashboard',
      realTimeInsights: 'Real-time insights',
      soilAnalysisDesc: 'AI-संचालित सिफारिशों के साथ व्यापक मिट्टी स्वास्थ्य मूल्यांकन',
      cropAdvisoryDesc: 'विशेषज्ञ मार्गदर्शन और व्यक्तिगत फसल सिफारिशें',
      weatherForecastDesc: 'बेहतर कृषि निर्णयों के लिए सटीक मौसम पूर्वानुमान',
      communityForumDesc: 'साथी किसानों से जुड़ें और अनुभव साझा करें',
      trustedByFarmers: 'देशभर के किसानों द्वारा भरोसेमंद',
      joinThousands: 'हजारों किसानों से जुड़ें जो पहले से ही हमारे प्लेटफॉर्म से लाभ उठा रहे हैं',
      activeFarmers: 'सक्रिय किसान',
      soilAnalyses: 'मिट्टी विश्लेषण',
      predictionAccuracy: 'भविष्यवाणी सटीकता',
      support247: '24/7 सहायता',
      website: 'वेबसाइट',
      services: 'सेवाएं',
      support: 'सहायता',
      contactUs: 'संपर्क करें',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें'
    }
  }

  const t = translations[language]

  // API Functions
  const createUser = async (userData) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          language_preference: language
        })
      })
      const result = await response.json()
      if (result.success) {
        setUser(result.data)
        alert('User registered successfully!')
        setCurrentView('home')
      } else {
        alert('Registration failed: ' + result.error)
      }
    } catch (error) {
      alert('Registration error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const analyzeSoil = async () => {
    /*if (!user) {
      alert('Please register first to use soil analysis')
      setCurrentView('register')
      return
    }*/
    
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/soil/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          ...soilData
        })
      })
      const result = await response.json()
      if (result.success) {
        setSoilResults(result)
        alert('Soil analysis completed successfully!')
      } else {
        alert('Soil analysis failed: ' + result.error)
      }
    } catch (error) {
      alert('Soil analysis error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getCropRecommendations = async () => {
    /*if (!user) {
      alert('Please register first to get crop recommendations')
      setCurrentView('register')
      return
    }*/    
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/crops/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('Crop recommendations generated successfully!')
        console.log('Crop recommendations:', result.data)
      } else {
        alert('Failed to get crop recommendations: ' + result.error)
      }
    } catch (error) {
      alert('Crop recommendation error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherData = async () => {
    try {
      setLoading(true)
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/weather/current/${weatherLocation}`),
        fetch(`${API_BASE_URL}/weather/forecast/${weatherLocation}?days=7`)
      ])
      
      const currentResult = await currentResponse.json()
      const forecastResult = await forecastResponse.json()
      
      if (currentResult.success) {
        setWeatherData(currentResult.data)
      }
      if (forecastResult.success) {
        setWeatherForecast(forecastResult.data)
      }
    } catch (error) {
      alert('Weather data error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadCommunityPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/community/posts?language=${language}`)
      const result = await response.json()
      if (result.success) {
        setCommunityPosts(result.data)
      }
    } catch (error) {
      console.error('Failed to load community posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCommunityPost = async () => {
    if (!user) {
      alert('Please register first to create posts')
      setCurrentView('register')
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ...newPost,
          language: language
        })
      })
      const result = await response.json()
      if (result.success) {
        alert('Post created successfully!')
        setNewPost({ title: '', content: '', category: '' })
        loadCommunityPosts()
      } else {
        alert('Failed to create post: ' + result.error)
      }
    } catch (error) {
      alert('Post creation error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const detectDisease = async () => {
    if (!user) {
      alert('Please register first to use disease detection')
      setCurrentView('register')
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/disease/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          crop_type: 'Tomato' // Default for demo
        })
      })
      const result = await response.json()
      if (result.success) {
        setDiseaseResults(result)
        alert('Disease detection completed successfully!')
      } else {
        alert('Disease detection failed: ' + result.error)
      }
    } catch (error) {
      alert('Disease detection error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    if (currentView === 'community') {
      loadCommunityPosts()
    }
    if (currentView === 'weather') {
      getWeatherData()
    }
  }, [currentView, language])

  const renderHome = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">{t.modernAgriculture}</h1>
              <p className="text-xl mb-8">{t.empoweringFarmers}</p>
              <div className="space-x-4">
                <button 
                  onClick={() => setCurrentView('register')}
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {t.getStarted}
                </button>
                <button 
                  onClick={() => setCurrentView('about')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                >
                  {t.learnMore}
                </button>
              </div>
            </div>
            <div className="bg-green-800 bg-opacity-30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t.farmerDashboard}</h3>
              <p className="text-green-100 mb-4">{t.realTimeInsights}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900 bg-opacity-50 rounded p-3">
                  <div className="text-2xl font-bold">22°C</div>
                  <div className="text-sm text-green-200">Temperature</div>
                </div>
                <div className="bg-green-900 bg-opacity-50 rounded p-3">
                  <div className="text-2xl font-bold">65%</div>
                  <div className="text-sm text-green-200">Humidity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="text-4xl font-bold text-green-600 mb-2">7.8</div>
              <div className="text-sm text-gray-500 mb-2">pH Level</div>
              <h3 className="text-xl font-semibold mb-3">{t.soilAnalysis}</h3>
              <p className="text-gray-600 mb-4">{t.soilAnalysisDesc}</p>
              <button 
                onClick={() => setCurrentView('soil')}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
              >
                {t.uploadSample}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-gray-500 mb-2">Success Rate</div>
              <h3 className="text-xl font-semibold mb-3">{t.cropAdvisory}</h3>
              <p className="text-gray-600 mb-4">{t.cropAdvisoryDesc}</p>
              <button 
                onClick={getCropRecommendations}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : t.getAdvice}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
              <div className="text-4xl font-bold text-orange-600 mb-2">22°C</div>
              <div className="text-sm text-gray-500 mb-2">Today</div>
              <h3 className="text-xl font-semibold mb-3">{t.weather}</h3>
              <p className="text-gray-600 mb-4">{t.weatherForecastDesc}</p>
              <button 
                onClick={() => setCurrentView('weather')}
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
              >
                {t.viewForecast}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="text-4xl font-bold text-purple-600 mb-2">Coming Soon...</div>
              <div className="text-sm text-gray-500 mb-2">Farmers</div>
              <h3 className="text-xl font-semibold mb-3">{t.community}</h3>
              <p className="text-gray-600 mb-4">{t.communityForumDesc}</p>
              <button 
                onClick={() => setCurrentView('community')}
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
              >
                {t.joinCommunity}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.trustedByFarmers}</h2>
          <p className="text-center text-xl mb-12">{t.joinThousands}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Coming Soon...</div>
              <div className="text-green-200">{t.activeFarmers}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Coming Soon...</div>
              <div className="text-green-200">{t.soilAnalyses}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">94%</div>
              <div className="text-green-200">{t.predictionAccuracy}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-200">{t.support247}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRegister = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Farmer Profile</h2>
          <form onSubmit={(e) => {
            e.preventDefault()
            createUser(userForm)
          }}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={userForm.username}
                onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={userForm.full_name}
                onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={userForm.phone}
                onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Location"
                value={userForm.location}
                onChange={(e) => setUserForm({...userForm, location: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Farm Size (acres)"
                value={userForm.farm_size}
                onChange={(e) => setUserForm({...userForm, farm_size: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Primary Crops"
                value={userForm.primary_crops}
                onChange={(e) => setUserForm({...userForm, primary_crops: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderSoilAnalysis = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">




        <div className="bg-[#f4d35e]/30 border-l-4 border-[#f95738] text-gray-800 p-6 rounded-xl shadow-sm max-w-4xl mx-auto my-6">
      <h3 className="text-xl font-semibold text-[#0d3b66] mb-2">Why Soil Analysis Matters</h3>
      <p className="leading-relaxed">
        Know your soil like never before. We analyze your soil’s nutrients and type to give you
        precise crop and fertilizer recommendations — helping you reduce input cost and
        increase yield.
      </p>
    </div>

        <h2 className="text-3xl font-bold text-center mb-8">{t.soilAnalysis}</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Soil Sample Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location"
                value={soilData.location}
                onChange={(e) => setSoilData({...soilData, location: e.target.value})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="pH Level"
                value={soilData.ph_level}
                onChange={(e) => setSoilData({...soilData, ph_level: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Nitrogen (mg/kg)"
                value={soilData.nitrogen}
                onChange={(e) => setSoilData({...soilData, nitrogen: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Phosphorus (mg/kg)"
                value={soilData.phosphorus}
                onChange={(e) => setSoilData({...soilData, phosphorus: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Potassium (mg/kg)"
                value={soilData.potassium}
                onChange={(e) => setSoilData({...soilData, potassium: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Organic Matter (%)"
                value={soilData.organic_matter}
                onChange={(e) => setSoilData({...soilData, organic_matter: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Moisture Content (%)"
                value={soilData.moisture_content}
                onChange={(e) => setSoilData({...soilData, moisture_content: parseInt(e.target.value)})}
                className="p-3 border rounded-lg"
              />
            </div>
            <button
              onClick={analyzeSoil}
              disabled={loading}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Soil'}
            </button>
          </div>

          {soilResults && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Analysis Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Health Score:</span>
                  <span className="font-bold text-green-600">{soilResults.data.health_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Soil Type:</span>
                  <span className="font-bold">{soilResults.data.soil_type}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="space-y-2">
                    {soilResults.recommendations.map((rec, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">{rec.type}</div>
                        <div className="text-sm text-gray-600">{rec.recommendation}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Suitable Crops:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {soilResults.suitable_crops.map((crop, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded">
                        <div className="font-medium">{crop.crop_name}</div>
                        <div className="text-sm text-gray-600">Score: {crop.suitability_score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderWeather = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{t.weather}</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="text"
                placeholder="Enter location"
                value={weatherLocation}
                onChange={(e) => setWeatherLocation(e.target.value)}
                className="flex-1 p-3 border rounded-lg"
              />
              <button
                onClick={getWeatherData}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Get Weather'}
              </button>
            </div>

            {weatherData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Current Weather</h3>
                  <div className="text-3xl font-bold text-blue-600">{weatherData.temperature}°C</div>
                  <div className="text-gray-600">{weatherData.condition}</div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>Humidity: {weatherData.humidity}%</div>
                    <div>Wind: {weatherData.wind_speed} km/h</div>
                    <div>Pressure: {weatherData.pressure} hPa</div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Rainfall</h3>
                  <div className="text-3xl font-bold text-green-600">{weatherData.rainfall}mm</div>
                  <div className="text-gray-600">Today</div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">UV Index</h3>
                  <div className="text-3xl font-bold text-orange-600">{weatherData.uv_index}</div>
                  <div className="text-gray-600">Current</div>
                </div>
              </div>
            )}
          </div>

          {weatherForecast && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">7-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weatherForecast.slice(0, 7).map((day, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">{new Date(day.date).toLocaleDateString('en', {weekday: 'short'})}</div>
                    <div className="text-2xl font-bold text-blue-600 my-2">{day.temperature}°C</div>
                    <div className="text-sm text-gray-600">{day.condition}</div>
                    <div className="text-xs text-gray-500 mt-1">{day.rainfall}mm</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCommunity = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{t.community}</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">Create New Post</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="Crop Management">Crop Management</option>
                <option value="Soil Health">Soil Health</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Weather Discussion">Weather Discussion</option>
                <option value="Market Prices">Market Prices</option>
                <option value="Technology">Technology</option>
                <option value="Success Stories">Success Stories</option>
                <option value="Questions">Questions</option>
                <option value="General Discussion">General Discussion</option>
              </select>
              <textarea
                placeholder="Post Content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="w-full p-3 border rounded-lg h-32"
              />
              <button
                onClick={createCommunityPost}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {communityPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <div className="text-sm text-gray-500">
                      {post.category} • {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {post.likes_count} likes • {post.comments_count} comments
                  </div>
                </div>
                <p className="text-gray-700">{post.content}</p>
                <div className="mt-4 flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800">Like</button>
                  <button className="text-green-600 hover:text-green-800">Comment</button>
                  <button className="text-gray-600 hover:text-gray-800">Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderDiseaseDetection = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">




        <div className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500 rounded-xl p-6 max-w-4xl mx-auto mt-8 shadow-md">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">🦠</span>
        <h3 className="text-xl font-bold text-green-700">Disease Detection</h3>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        🌾 <span className="font-semibold">Fight Crop Diseases Before They Spread</span><br />
        Just like humans, crops can get sick — and without early care, even a small infection can destroy an entire season’s work. Most farmers notice the symptoms only when it’s too late. That’s where we come in.
      </p>

      <h4 className="text-lg font-semibold text-green-600 mb-2">🧬 Common Types of Crop Diseases:</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white border border-green-200 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <h5 className="font-semibold text-green-700">🍄 Fungal Diseases</h5>
          <p className="text-sm text-gray-600 italic">e.g., Leaf Spot, Powdery Mildew, Rust</p>
          <p className="text-gray-700 text-sm mt-1">
            Cause yellowing, rotting, or wilting of leaves and stems.
          </p>
        </div>
        <div className="bg-white border border-green-200 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <h5 className="font-semibold text-green-700">🧫 Bacterial Diseases</h5>
          <p className="text-sm text-gray-600 italic">e.g., Bacterial Blight, Wilt</p>
          <p className="text-gray-700 text-sm mt-1">
            Spread quickly in humid conditions, damaging plant tissues.
          </p>
        </div>
        <div className="bg-white border border-green-200 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <h5 className="font-semibold text-green-700">🧪 Viral Diseases</h5>
          <p className="text-sm text-gray-600 italic">e.g., Mosaic Virus, Leaf Curl</p>
          <p className="text-gray-700 text-sm mt-1">
            Usually untreatable, but early detection helps minimize spread.
          </p>
        </div>
        <div className="bg-white border border-green-200 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <h5 className="font-semibold text-green-700">🧯 Nutrient Deficiency</h5>
          <p className="text-sm text-gray-600 italic">Often confused with diseases</p>
          <p className="text-gray-700 text-sm mt-1">
            Shows as yellowing, weak stems, or patchy growth.
          </p>
        </div>
      </div>
    </div>


        <h2 className="text-3xl font-bold text-center mb-8 mt-10">Disease Detection</h2>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Upload Crop Image</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDiseaseImage(e.target.files[0])}
                  className="hidden"
                  id="disease-image"
                />
                <label htmlFor="disease-image" className="cursor-pointer">
                  <div className="text-gray-500">
                    {diseaseImage ? diseaseImage.name : 'Click to upload crop image'}
                  </div>
                </label>
              </div>
              <button
                onClick={detectDisease}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Detect Disease'}
              </button>
            </div>
          </div>

          {diseaseResults && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Detection Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Disease:</span>
                  <span className="font-bold text-red-600">{diseaseResults.detection_result.disease_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold">{(diseaseResults.detection_result.confidence_score * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Severity:</span>
                  <span className="font-bold">{diseaseResults.detection_result.severity_level}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Treatment Recommendations:</h4>
                  <ul className="space-y-2">
                    {diseaseResults.detection_result.treatment_recommendations.map((treatment, index) => (
                      <li key={index} className="bg-red-50 p-3 rounded">
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Preventive Measures:</h4>
                  <ul className="space-y-2">
                    {diseaseResults.detection_result.preventive_measures.map((measure, index) => (
                      <li key={index} className="bg-green-50 p-3 rounded">
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4 space-x-2">
              <img src={logo} alt="KrishiAi logo" draggable='false' className="h-12 w-50" />
            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:text-green-600'}`}
              >
                {t.home}
              </button>
              <button 
                onClick={() => setCurrentView('soil')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'soil' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {t.soilAnalysis}
              </button>
              <button 
                onClick={() => setCurrentView('disease')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'disease' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600'}`}
              >
                Disease Detection
              </button>
              <button 
                onClick={() => setCurrentView('weather')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'weather' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
              >
                {t.weather}
              </button>
              <button 
                onClick={() => setCurrentView('community')}
                className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'community' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
              >
                {t.community}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setLanguage('english')}
                  className={`px-3 py-1 rounded ${language === 'english' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('hindi')}
                  className={`px-3 py-1 rounded ${language === 'hindi' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  हिं
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
              </div>

              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                  <button 
                    onClick={() => setUser(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setCurrentView('register')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === 'home' && renderHome()}
      {currentView === 'register' && renderRegister()}
      {currentView === 'soil' && renderSoilAnalysis()}
      {currentView === 'weather' && renderWeather()}
      {currentView === 'community' && renderCommunity()}
      {currentView === 'disease' && renderDiseaseDetection()}

      {/* FAQ Section*/}
      < FAQSecion/>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">🌱 KrishiAi</div>
              <p className="text-gray-300">
                Empowering farmers with technology-driven solutions for sustainable agriculture.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button onClick={() => setCurrentView('home')} className="block text-gray-300 hover:text-white">
                  {t.home}
                </button>
                <button onClick={() => setCurrentView('soil')} className="block text-gray-300 hover:text-white">
                  {t.services}
                </button>
                <button onClick={() => setCurrentView('community')} className="block text-gray-300 hover:text-white">
                  {t.support}
                </button>
                <button className="block text-gray-300 hover:text-white">
                  {t.contactUs}
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <button className="block text-gray-300 hover:text-white">
                  {t.privacyPolicy}
                </button>
                <button className="block text-gray-300 hover:text-white">
                  {t.termsOfService}
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            © 2025 KrishiAi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

