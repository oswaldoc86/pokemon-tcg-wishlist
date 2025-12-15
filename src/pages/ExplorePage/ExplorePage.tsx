import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PokemonCard } from '../../types/pokemon'
import { getCards } from '../../api/pokemonApi'
import './ExplorePage.scss'
import CardList from '../../components/CardList/CardList'
import Filter from '../../components/Filter/Filter'
import getCardImageUrl from '../../utils/assets'

export default function ExplorePage(): JSX.Element {
  const { t } = useTranslation()
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number | null>(null)
  const [returnedCount, setReturnedCount] = useState<number | null>(null)
  const pageSize = 20
  const [search, setSearch] = useState<string | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
  const [setFilter, setSetFilter] = useState<string | undefined>(undefined)
  // `search` contiene el texto de filtrado por nombre que viene de `Filter`.
  // Cuando `search` cambia, el `useEffect` que realiza la petición se volverá a ejecutar.

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    // fetchCards: realiza la petición al API usando `search` y paginación.
    // Si `search` está definido, `getCards` añadirá el parámetro `name`.
    const fetchCards = async () => {
      try {
        setLoading(true)
        setError(null)
        // Pasamos `search` como primer argumento. Si es `undefined` no se aplicará filtro por nombre.
        const res = await getCards(search ?? undefined, typeFilter ?? undefined, setFilter ?? undefined, page, pageSize, signal)
        setCards(res.cards)
        setTotal(res.total ?? null)
        setReturnedCount(typeof res.returned === 'number' ? res.returned : null)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar las cartas')
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchCards()

    return () => controller.abort()
  }, [page, search, typeFilter, setFilter]) // Re-ejecuta cuando cambia la página o el término de búsqueda, el tipo o el set

  return (
    <main>
      <div className="container">
      <h2 className='mb-4'>{t('explore.title')}</h2>

      {/* Insertamos el componente Filter y le pasamos `onFilter`.
        Cuando se filtra, reiniciamos la paginación a la página 1
        y actualizamos `search` para que `useEffect` vuelva a solicitar datos. */}
      {/* onFilter now receives an object { name?, type? } */}
      <Filter onFilter={(filters) => { setPage(1); setSearch(filters.name); setTypeFilter(filters.type); setSetFilter(filters.setId) }} />

      {loading && <p>{t('explore.loading')}</p>}

      {error && <p style={{ color: 'red' }}>{t('explore.error')}: {error}</p>}

      {!loading && !error && cards.length > 0 && (
        <CardList cards={cards} />
      )}
      </div>
      
      <div className="container mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-pokemon-secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            {t('explore.prev')}
          </button>

          <div>
            <strong>{t('explore.page')}: {page}</strong>
            {total ? (
              <span className="ms-2">({Math.ceil(total / pageSize)} {t('explore.pages')})</span>
            ) : null}
          </div>

          <button
            className="btn btn-pokemon-primary"
            onClick={() => setPage(p => p + 1)}
            disabled={
              loading ||
              // Deshabilitar si la respuesta trae menos de pageSize elementos (p. ej. < 20)
              (returnedCount !== null && returnedCount < pageSize) ||
              // También deshabilitar si alcanzamos la última página según `total` cuando esté disponible
              (total !== null && page >= Math.ceil(total / pageSize))
            }
          >
            {t('explore.next')}
          </button>
        </div>
      </div>

      {!loading && !error && cards.length === 0 && <p>{t('explore.noResults')}</p>}
    </main>
  )
}
