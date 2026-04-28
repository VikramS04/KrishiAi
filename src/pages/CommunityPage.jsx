import { FormInput } from '../components/FormInput'
import { translations } from '../data/translations'
import { theme } from '../styles/theme'

export function CommunityPage({ t, styles, loading, newPost, setNewPost, communityPosts, createCommunityPost, formatPostDate, formatCategory }) {
  return (
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
              <FormInput
                placeholder={t.community.postTitle}
                value={newPost.title}
                onChange={e => setNewPost(current => ({ ...current, title: e.target.value }))}
              />
              <select value={newPost.category} onChange={e => setNewPost(current => ({ ...current, category: e.target.value }))} style={styles.input}>
                <option value="">{t.community.selectCategory}</option>
                {translations.english.community.categories.map((category, index) => (
                  <option key={category} value={category}>{t.community.categories[index]}</option>
                ))}
              </select>
              <textarea
                placeholder={t.community.bodyPlaceholder}
                value={newPost.content}
                onChange={e => setNewPost(current => ({ ...current, content: e.target.value }))}
                style={{ ...styles.input, height: 120, resize: 'vertical' }}
              />
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
}
