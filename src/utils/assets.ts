export type ImageQuality = 'high' | 'low'
export type ImageExtension = 'png' | 'webp' | 'jpg'

/**
 * Construye la URL final de imagen de TCGDex a partir de la base proporcionada por la API.
 * Ejemplo: base = "https://assets.tcgdex.net/en/swsh/swsh3/136"
 * getCardImageUrl(base, 'high', 'webp') -> "https://assets.tcgdex.net/en/swsh/swsh3/136/high.webp"
 */
export function getCardImageUrl(base: string, quality: ImageQuality = 'high', ext: ImageExtension = 'webp'): string {
  if (!base) return ''
  // Trim trailing slashes if any
  const trimmed = base.replace(/\/+$/g, '')
  return `${trimmed}/${quality}.${ext}`
}

export default getCardImageUrl
