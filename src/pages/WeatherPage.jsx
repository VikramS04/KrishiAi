import { FormInput } from '../components/FormInput'
import { indiaLocations } from '../data/indiaLocations'
import { theme } from '../styles/theme'

export function WeatherPage({
  t,
  styles,
  loading,
  language,
  weatherState,
  setWeatherState,
  weatherCity,
  setWeatherCity,
  weatherLocation,
  setWeatherLocation,
  weatherLocationMode,
  setWeatherLocationMode,
  stateCities,
  weatherData,
  weatherForecast,
  getWeatherData,
  getDeviceWeatherData,
}) {
  return (
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
                style={styles.input}
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
                style={styles.input}
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
              <button onClick={getDeviceWeatherData} disabled={loading} style={{ ...styles.outlineBtn(theme.colors.sky), whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1 }}>
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
}
