const PRODUCTION_API = 'https://kenetic-pulse-api.onrender.com'

function resolveMediaBaseUrl() {
  const fromEnv =
    import.meta.env.VITE_MEDIA_URL ||
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
    (import.meta.env.PROD ? PRODUCTION_API : 'http://127.0.0.1:8000')

  let url = fromEnv.trim().replace(/\/+$/, '')

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
    url = `https://${url.slice('http://'.length)}`
  }

  return url
}

export function mediaUrl(path) {
  if (!path) return ''

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && path.startsWith('http://')) {
      return `https://${path.slice('http://'.length)}`
    }
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${resolveMediaBaseUrl()}${normalizedPath}`
}
