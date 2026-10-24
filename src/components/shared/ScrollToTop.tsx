import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router SPA navigations don't reset scroll position like traditional
 * page loads do. This scrolls to the top of the page on every route change
 * so a new page (e.g. a related product) always opens from the top.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}