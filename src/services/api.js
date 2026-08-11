// ✅ Base URL — switches automatically between dev and production
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ✅ Helper function for all API calls
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('utl_token')

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong')
  }

  return result
}

// ✅ Auth API calls
export const authAPI = {
  signup: (data) => apiRequest('/auth/signup', 'POST', data),
  login: (data) => apiRequest('/auth/login', 'POST', data),
  getMe: () => apiRequest('/auth/me'),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', 'POST', { email }),
  resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, 'POST', { password }),
  verifyEmail: (token) => apiRequest(`/auth/verify-email/${token}`),
}

export default apiRequest