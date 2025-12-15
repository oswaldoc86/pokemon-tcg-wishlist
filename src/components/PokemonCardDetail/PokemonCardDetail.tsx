import React, { useState, useEffect } from 'react'
import { PokemonCardDetail as PokemonCardDetailType } from '../../types/pokemon'
import { getCardDetail } from '../../api/pokemonApi'
import './PokemonCardDetail.scss'

interface PokemonCardDetailProps {
  cardId: string
  frontImageUrl: string
  name: string
}

export default function PokemonCardDetail({ cardId, frontImageUrl, name }: PokemonCardDetailProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [detail, setDetail] = useState<PokemonCardDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // no auto-fetch: only fetch when flipped
  }, [])

  const rotateCard = () => {
    if (!isFlipped && !detail) {
      // fetch details
      const controller = new AbortController()
      const { signal } = controller
      setLoading(true)
      setError(null)
      getCardDetail(cardId, signal)
        .then((d) => setDetail(d))
        .catch((err: any) => {
          if (err.name === 'AbortError') return
          setError(err.message || 'Error loading details')
        })
        .finally(() => setLoading(false))

      // we don't keep controller ref; if unmounting while loading, it's ok — user likely navigates
    }

    setIsFlipped(value => !value)
  }

  return (
    <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={rotateCard} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={frontImageUrl} alt={name} className="card-front-img" />
          <div className="card-front-name">{name}</div>
        </div>
        <div className="flip-card-back">
          {loading && <div className="p-3">Loading...</div>}
          {error && <div className="p-3 text-danger">{error}</div>}
          {!loading && !error && detail && (
            <div className="p-3">
              <h5>{detail.name}</h5>
              <p><strong>HP:</strong> {detail.hp ?? '—'}</p>
              <p><strong>Types:</strong> {detail.types ? detail.types.join(', ') : '—'}</p>
              <p><strong>Rarity:</strong> {detail.rarity ?? '—'}</p>
              <p><strong>Set:</strong> {detail.set?.name ?? '—'}</p>
              <img src={frontImageUrl} alt={name} className="card-back-img" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
