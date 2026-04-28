const normalizeApiBaseUrl = (rawValue) => {
  const value = (rawValue || '/api').trim()

  if (!value) return '/api'

  const withoutTrailingSlash = value.replace(/\/$/, '')

  if (/^https?:\/\//i.test(withoutTrailingSlash) && !withoutTrailingSlash.endsWith('/api')) {
    return `${withoutTrailingSlash}/api`
  }

  return withoutTrailingSlash
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || `Request failed with status ${response.status}`)
  }

  return payload
}

const request = async (path, options = {}) => {
  const headers = options.body instanceof FormData
    ? options.headers
    : { 'Content-Type': 'application/json', ...options.headers }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}

export const api = {
  createUser: (userData) => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  loginUser: ({ identifier, password }) => request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  }),

  analyzeSoil: (soilData) => request('/soil/analyze', {
    method: 'POST',
    body: JSON.stringify(soilData),
  }),

  getCurrentWeather: (location) => request(`/weather/current/${encodeURIComponent(location)}`),

  getWeatherForecast: (location, days = 7) => (
    request(`/weather/forecast/${encodeURIComponent(location)}?days=${days}`)
  ),

  getCurrentWeatherByCoordinates: ({ lat, lon }) => (
    request(`/weather/current?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
  ),

  getWeatherForecastByCoordinates: ({ lat, lon }, days = 7) => (
    request(`/weather/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&days=${days}`)
  ),

  getCommunityPosts: (language) => request(`/community/posts?language=${encodeURIComponent(language)}`),

  createCommunityPost: (postData) => request('/community/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),

  detectDisease: (diseaseData) => request('/disease/detect', {
    method: 'POST',
    body: JSON.stringify(diseaseData),
  }),

  uploadDiseaseImage: (formData) => request('/disease/upload', {
    method: 'POST',
    body: formData,
  }),
}

export { API_BASE_URL }
