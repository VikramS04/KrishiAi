# KrishiAi Frontend

React + Vite frontend for KrishiAi.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Structure

```txt
src/
  App.jsx                 # App state, API handlers, lightweight view switcher
  components/             # Shared shell and form primitives
  data/                   # Translation copy and India state/city data
  pages/                  # Home, Register, Soil, Weather, Community, Disease pages
  services/               # API client
  styles/                 # Theme and shared inline style factory
```

## API

The frontend calls `/api` by default. In development, `vite.config.js` proxies `/api` to:

```txt
http://localhost:5000
```

For deployment, set:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
```

## SEO

SEO metadata lives in `index.html`, including title, description, canonical URL, Open Graph, Twitter card, and JSON-LD WebApplication schema.
