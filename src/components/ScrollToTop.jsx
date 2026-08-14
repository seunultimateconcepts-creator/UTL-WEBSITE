import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ✅ React Router doesn't reset scroll position on navigation (it's not
// a real page reload). This fixes that — mount it once near the top
// of App.jsx and every route change scrolls back to the top.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop