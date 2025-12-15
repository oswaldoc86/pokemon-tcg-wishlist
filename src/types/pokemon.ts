export interface PokemonCard {
  id: string
  localId: string
  name: string
  image: string
}

export interface PokemonCardApiResponse {
  data: PokemonCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

export interface PokemonCardDetail {
  id: string
  name: string
  image: string
  rarity?: string
  set?: {
    id?: string
    name?: string
  }
  hp?: number
  types?: string[]
  description?: string
  attacks?: Array<{
    name: string
    damage?: number
    effect?: string
    cost?: string[]
  }>
  weaknesses?: Array<{
    type: string
    value: string
  }>
  retreat?: number
}
