import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.scss'

export default function Header(): JSX.Element {
  const { t, i18n } = useTranslation()

  const setLang = (lng: string) => {
    i18n.changeLanguage(lng)
    try {
      localStorage.setItem('i18nextLng', lng)
    } catch {}
  }

  return (
    <header className="navbar navbar-expand-md navbar-light navbar-pokemon mb-4">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          {t('header.brand')}
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                {t('header.explore')}
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/collection" className="nav-link">
                {t('header.collection')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/wishlist" className="nav-link">
                {t('header.wishlist')}
              </NavLink>
            </li> */}

            <li className="nav-item ms-3">
              <div className="btn-group" role="group" aria-label="Language selector">
                <button
                  type="button"
                  className={`btn btn-sm ${i18n.language === 'en' ? 'btn-dark text-white' : 'btn-outline-dark'}`}
                  onClick={() => setLang('en')}
                >
                  {t('header.language_en')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${i18n.language === 'es' ? 'btn-dark text-white' : 'btn-outline-dark'}`}
                  onClick={() => setLang('es')}
                >
                  {t('header.language_es')}
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
