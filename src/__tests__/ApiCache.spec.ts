import { afterEach, describe, expect, it, vi } from 'vitest'
import { cachedJson, clearApiSessionCache } from '@/services/apiCache'
import { fetchAvailableYears } from '@/api/publicFinance'

afterEach(() => {
  clearApiSessionCache()
  vi.restoreAllMocks()
})

describe('cache API de session', () => {
  it('réutilise une réponse et déduplique les requêtes simultanées', async () => {
    const fetchMock = vi.fn<() => Promise<{ ok: boolean; json: () => Promise<unknown>; status?: number }>>().mockResolvedValue({ ok: true, json: () => Promise.resolve({ value: 42 }) })
    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([
      cachedJson<{ value: number }>('http://api.test/data', 60_000),
      cachedJson<{ value: number }>('http://api.test/data', 60_000),
    ])
    const third = await cachedJson<{ value: number }>('http://api.test/data', 60_000)

    expect(first.value).toBe(42)
    expect(second).toEqual(first)
    expect(third).toEqual(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('ne met pas les erreurs en cache', async () => {
    const fetchMock = vi.fn<() => Promise<{ ok: boolean; json: () => Promise<unknown>; status?: number }>>()
      .mockResolvedValueOnce({ ok: false, status: 503, json: () => Promise.resolve({ message: 'Indisponible' }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ value: 7 }) })
    vi.stubGlobal('fetch', fetchMock)

    await expect(cachedJson('http://api.test/failure', 60_000)).rejects.toThrow('Indisponible')
    await expect(cachedJson<{ value: number }>('http://api.test/failure', 60_000)).resolves.toEqual({ value: 7 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('ne propose pas les années antérieures à 2017', async () => {
    vi.stubGlobal('fetch', vi.fn<() => Promise<{ ok: boolean; json: () => Promise<unknown>; status?: number }>>().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ years: [2016, 2017, { year: 2024, status: 'complètes' }] }),
    }))

    await expect(fetchAvailableYears()).resolves.toEqual({ years: [2017, { year: 2024, status: 'complètes' }] })
  })
})
