export const theme = {
  breakpoints: {
    mobile: 640,
    tablet: 960,
  },
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
  },
}

export const createStyles = (viewport) => {
  const isMobile = viewport?.isMobile
  const isTablet = viewport?.isTablet

  return {
  page: { minHeight: '100vh', background: theme.colors.parchment, fontFamily: "'Georgia', 'Times New Roman', serif", color: theme.colors.dark },
  nav: { background: '#fff', borderBottom: `2px solid ${theme.colors.leaf}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(45,106,79,0.08)' },
  navInner: { maxWidth: 1200, margin: '0 auto', padding: isMobile ? '12px 16px' : '0 24px', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 0, minHeight: isMobile ? 'auto' : 68 },
  navTopRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: isMobile ? 'auto' : 68 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer', justifyContent: 'flex-start', minWidth: 0 },
  logoText: { fontSize: isMobile ? 20 : 22, fontWeight: 700, color: theme.colors.leafDark, letterSpacing: '-0.5px' },
  logoLeaf: { width: 36, height: 36, background: `linear-gradient(135deg, ${theme.colors.leaf}, ${theme.colors.leafDark})`, borderRadius: '50% 50% 50% 10%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' },
  navLinks: { display: 'flex', gap: 6, alignItems: 'center', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 4 : 0, width: '100%' },
  navBtn: (active, accent) => ({ padding: isMobile ? '10px 12px' : '8px 16px', borderRadius: 8, border: 'none', background: active ? `${accent}18` : 'transparent', color: active ? accent : theme.colors.muted, fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', borderBottom: active ? `2px solid ${accent}` : '2px solid transparent', whiteSpace: 'nowrap', flexShrink: 0 }),
  langBtn: (active) => ({ padding: '4px 10px', borderRadius: 6, border: `1.5px solid ${active ? theme.colors.leaf : '#E5E7EB'}`, background: active ? theme.colors.leaf : '#fff', color: active ? '#fff' : theme.colors.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }),
  signInBtn: { padding: '8px 20px', borderRadius: 8, border: 'none', background: theme.colors.leaf, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: 'auto', whiteSpace: 'nowrap', flexShrink: 0 },
  navActions: { display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto', flexShrink: 0 },
  userActions: { display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center', maxWidth: isMobile ? '52vw' : 'none' },
  container: { maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' },
  section: { padding: isMobile ? '40px 0' : isTablet ? '52px 0' : '64px 0' },
  badge: (color) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: `${color}18`, color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }),
  h1: { fontSize: isMobile ? 38 : isTablet ? 46 : 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: isMobile ? '-1px' : '-2px', margin: 0, color: '#fff' },
  h2: { fontSize: isMobile ? 28 : isTablet ? 32 : 36, fontWeight: 700, letterSpacing: '-1px', margin: '0 0 8px', color: theme.colors.leafDark },
  h3: { fontSize: isMobile ? 20 : 22, fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 4px' },
  card: { background: '#fff', borderRadius: 16, border: '1px solid #E9ECEF', padding: isMobile ? 20 : 28, transition: 'box-shadow 0.2s' },
  input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: 15, color: theme.colors.dark, background: '#FAFAFA', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s' },
  primaryBtn: (color = theme.colors.leaf) => ({ padding: '13px 28px', borderRadius: 10, border: 'none', background: color, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'opacity 0.15s', letterSpacing: '-0.2px' }),
  outlineBtn: (color = theme.colors.leaf) => ({ padding: '11px 24px', borderRadius: 10, border: `2px solid ${color}`, background: 'transparent', color, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }),
  statCard: { textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.12)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)' },
  footer: { background: theme.colors.leafDark, color: '#fff', padding: '60px 0 32px' },
  footerGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1.3fr 1fr' : '2fr 1fr 1fr', gap: isMobile ? 28 : 48, marginBottom: 48 },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 8 : 16 },
}
}
