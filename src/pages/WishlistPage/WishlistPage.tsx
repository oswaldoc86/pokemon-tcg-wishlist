import React from 'react'
import { useTranslation } from 'react-i18next'
import './WishlistPage.scss'

export default function WishlistPage(): JSX.Element {
  const { t } = useTranslation()
  return (
    <main>
      <h2>{t('wishlist.title')}</h2>
    </main>
  )
}
