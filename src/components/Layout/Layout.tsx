import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import './Layout.scss'

export default function Layout(): JSX.Element {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
