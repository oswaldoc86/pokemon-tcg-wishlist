import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import ExplorePage from '../pages/ExplorePage/ExplorePage'
import CollectionPage from '../pages/CollectionPage/CollectionPage'
import WishlistPage from '../pages/WishlistPage/WishlistPage'

export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
