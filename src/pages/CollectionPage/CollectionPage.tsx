import React from 'react'
import { useTranslation } from 'react-i18next'
import './CollectionPage.scss'

export default function CollectionPage(): JSX.Element {
  const { t } = useTranslation()
  return (
    <main>
      <h2>{t('collection.title')}</h2>
    </main>
  )
}
