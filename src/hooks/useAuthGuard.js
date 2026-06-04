import { useNavigate } from 'react-router-dom'

function useAuthGuard() {
  const navigate = useNavigate()

  // ✅ Call this before any protected action
  const requireAuth = (callback) => {
    const user = localStorage.getItem('utl_current_user')
    if (!user) {
      // Save where they were trying to go
      localStorage.setItem('utl_redirect_after_login', window.location.pathname)
      navigate('/signup')
      return false
    }
    if (callback) callback()
    return true
  }

  const getUser = () => {
    const user = localStorage.getItem('utl_current_user')
    return user ? JSON.parse(user) : null
  }

  const isLoggedIn = () => {
    return !!localStorage.getItem('utl_current_user')
  }

  return { requireAuth, getUser, isLoggedIn }
}

export default useAuthGuard