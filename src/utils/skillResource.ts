export const getPlatform = (url: string) => {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    if (host.includes('youtube.com') || host === 'youtu.be') return 'YouTube'
    if (host.includes('github.com')) return 'GitHub'
    if (host.includes('devdocs.io')) return 'DevDocs'
    if (host.includes('udemy.com')) return 'Udemy'
    if (host.includes('coursera.org')) return 'Coursera'
    if (host.includes('pluralsight.com')) return 'Pluralsight'
    return host
  } catch {
    return 'Web'
  }
}

export const getPriceLabel = (cost: number) => (cost === 0 ? 'Free' : `$${cost}`)

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  DOCUMENTATION: 'Documentation',
  INTERACTIVE_LAB: 'Interactive lab',
  VIDEO_COURSE: 'Video course',
  ARTICLE: 'Article',
}

export const getResourceTypeLabel = (type: string) => RESOURCE_TYPE_LABEL[type] ?? type

// Bỏ hashtag trong tiêu đề, vd: "Node JS Advanced #nodejs #nodejsadvanced"
export const cleanTitle = (title: string) => title.replace(/\s#\S+/g, '').trim()

// Lấy videoId từ các dạng link: watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID
export const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    if (host === 'youtu.be') return u.pathname.slice(1) || null
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const match = u.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)
      return match ? match[1] : null
    }
    return null
  } catch {
    return null
  }
}

// hqdefault luôn tồn tại với mọi video (maxresdefault thì không)
export const getYouTubeThumbnail = (url: string) => {
  const id = getYouTubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

// Logo nhỏ của website (dùng cho card không có ảnh)
export const getFaviconUrl = (url: string) => {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
  } catch {
    return null
  }
}
