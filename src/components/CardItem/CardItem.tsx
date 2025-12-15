import React from 'react'
import { PokemonCard } from '../../types/pokemon'
import getCardImageUrl from '../../utils/assets'
import './CardItem.scss'
import PokemonCardDetail from '../PokemonCardDetail/PokemonCardDetail'

interface CardItemProps {
  card: PokemonCard
}

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  // prefer modern images.small if present, otherwise fallback to legacy `image`
  const src = (card as any).images?.small ?? (card as any).image ? getCardImageUrl((card as any).image, 'low', 'webp') : ''

  return (
    <li className="card-item col-6 col-md-2 mb-4" aria-label={card.name}>
      <PokemonCardDetail cardId={card.id} frontImageUrl={src} name={card.name} />
    </li>
  )
}

export default CardItem
