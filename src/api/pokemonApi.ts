import { PokemonCard } from '../types/pokemon'

// Use Vite environment variable when available. Falls back to the public TCGDex URL.
const API_BASE_URL: string = String(import.meta.env.VITE_TCGDEX_API_BASE_URL)

/**
 * Fetch cards from TCGDex with optional filtering and pagination.
 * Uses TCGDex pagination params: `pagination:page` and `pagination:itemsPerPage`.
 */
export async function getCards(
  searchText?: string,
  type?: string,
  setId?: string,
  page = 1,
  pageSize = 20,
  signal?: AbortSignal
): Promise<{ cards: PokemonCard[]; total?: number; page?: number; pageSize?: number; returned?: number }> {
  try {
    const url = `${API_BASE_URL}/cards`

    const params = new URLSearchParams()
    // TCGDex expects pagination:page and pagination:itemsPerPage
    params.set('pagination:page', String(page))
    params.set('pagination:itemsPerPage', String(pageSize))

    if (searchText && searchText.trim()) {
      // TCGDex supports `name` filter (lax match by default)
      params.set('name', searchText.trim())
    }

    if (type && type.trim()) {
      // API supports filtering by `types` (array/pipe or single value)
      params.set('types', type.trim())
    }

    if (setId && setId.trim()) {
      // Filter by set id using strict equality for accuracy
      params.set('set.id', `eq:${setId.trim()}`)
    }

    const fullUrl = `${url}?${params.toString()}`
    const response = await fetch(fullUrl, signal ? { signal } : undefined)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // The API commonly returns an array of items for these endpoints.
    // Some endpoints may include pagination metadata; attempt to read it when present.
    let raw: any[] = []
    let total: number | undefined

    if (Array.isArray(data)) {
      raw = data
    } else if (Array.isArray(data.data)) {
      raw = data.data
      total = (data.total || data.totalCount || data.count) as number | undefined
    } else if (Array.isArray(data.results)) {
      raw = data.results
      total = (data.total || data.totalCount || data.count) as number | undefined
    }

    const returned = Array.isArray(raw) ? raw.length : 0

    const cards: PokemonCard[] = raw
      .filter((c: any) => c && c.image)
      .map((c: any) => ({
        id: c.id,
        localId: c.localId || c.number || '',
        name: c.name || c.title || 'Unknown',
        image: c.image,
      }))

    return { cards, total, page, pageSize, returned }
  } catch (error) {
    console.error('Error fetching cards:', error)
    throw error
  }
}

export async function getTypes(signal?: AbortSignal): Promise<string[]> {
  try {
    const url = `${API_BASE_URL}/types`
    const response = await fetch(url, signal ? { signal } : undefined)

    if (!response.ok) {
      throw new Error(`Types request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Expecting an array of strings; fall back to empty array on unexpected shape
    if (Array.isArray(data)) {
      return data.map((d: any) => String(d))
    }

    // Some APIs wrap under { data: [...] }
    if (Array.isArray(data.data)) {
      return data.data.map((d: any) => String(d))
    }

    return []
  } catch (error) {
    console.error('Error fetching types:', error)
    return []
  }
}

export type CardSet = { id: string; name: string }

export async function getSets(signal?: AbortSignal): Promise<CardSet[]> {
  try {
    const url = `${API_BASE_URL}/sets`
    const response = await fetch(url, signal ? { signal } : undefined)

    if (!response.ok) {
      throw new Error(`Sets request failed with status ${response.status}`)
    }

    const data = await response.json()

    let raw: any[] = []
    if (Array.isArray(data)) raw = data
    else if (Array.isArray(data.data)) raw = data.data
    else if (Array.isArray(data.results)) raw = data.results

    return raw
      .filter((s: any) => s && (s.id || s.code) && (s.name || s.title))
      .map((s: any) => ({ id: s.id || s.code, name: s.name || s.title }))
  } catch (error) {
    console.error('Error fetching sets:', error)
    return []
  }
}

export async function getCardDetail(id: string, signal?: AbortSignal) {
  try {
    const url = `${API_BASE_URL}/cards/${encodeURIComponent(id)}`
    const response = await fetch(url, signal ? { signal } : undefined)

    if (!response.ok) {
      throw new Error(`Card detail request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Map to a reasonable shape; the API returns the card object directly
    const detail = {
      id: data.id,
      name: data.name,
      image: data.image,
      rarity: data.rarity,
      set: data.set ? { id: data.set.id, name: data.set.name } : undefined,
      hp: data.hp,
      types: data.types,
      description: data.description,
      attacks: Array.isArray(data.attacks)
        ? data.attacks.map((a: any) => ({ name: a.name, damage: a.damage, effect: a.effect, cost: a.cost }))
        : undefined,
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.map((w: any) => ({ type: w.type, value: w.value })) : undefined,
      retreat: data.retreat,
    }

    return detail
  } catch (error) {
    console.error('Error fetching card detail:', error)
    throw error
  }
}
