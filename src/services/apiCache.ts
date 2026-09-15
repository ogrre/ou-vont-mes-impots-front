const CACHE_PREFIX = 'ou-vont-mes-impots:api:v1:'
const inFlight = new Map<string, Promise<unknown>>()

interface CacheEntry<T> {
  expiresAt: number
  value: T
}

function storage() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function read<T>(key: string): T | undefined {
  const store = storage()
  if (!store) return undefined
  try {
    const raw = store.getItem(CACHE_PREFIX + key)
    if (!raw) return undefined
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (entry.expiresAt <= Date.now()) {
      store.removeItem(CACHE_PREFIX + key)
      return undefined
    }
    return entry.value
  } catch {
    return undefined
  }
}

function write<T>(key: string, value: T, ttl: number) {
  const store = storage()
  if (!store) return
  try {
    store.setItem(CACHE_PREFIX + key, JSON.stringify({ value, expiresAt: Date.now() + ttl } satisfies CacheEntry<T>))
  } catch {
    // Le cache est une optimisation : un quota plein ne doit jamais bloquer l’API.
  }
}

export function getCached<T>(key: string): T | undefined {
  return read<T>(key)
}

export function cachedJson<T>(requestUrl: string | URL, ttl: number): Promise<T> {
  const url = requestUrl.toString()
  const cached = read<T>(url)
  if (cached !== undefined) return Promise.resolve(cached)

  const running = inFlight.get(url)
  if (running) return running as Promise<T>

  const request = fetch(requestUrl, { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message ?? `L’API a répondu avec le statut ${response.status}.`)
      }
      const value = (await response.json()) as T
      write(url, value, ttl)
      return value
    })
    .finally(() => inFlight.delete(url))

  inFlight.set(url, request)
  return request
}

export function clearApiSessionCache() {
  const store = storage()
  if (!store) return
  try {
    for (let index = store.length - 1; index >= 0; index -= 1) {
      const key = store.key(index)
      if (key?.startsWith(CACHE_PREFIX)) store.removeItem(key)
    }
  } catch {
    // Ignore les implémentations de stockage indisponibles.
  }
}
