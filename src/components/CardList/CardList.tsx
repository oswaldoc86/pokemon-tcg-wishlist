import React from 'react'
import { PokemonCard } from '../../types/pokemon'
import CardItem from '../CardItem/CardItem'
import './CardList.scss'

interface CardListProps {
  cards: PokemonCard[]
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  return (
    <ul className="card-list row list-unstyled">
      {cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </ul>
  )
}

export default CardList
