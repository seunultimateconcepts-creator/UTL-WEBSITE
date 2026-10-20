/**
 * postAuthRedirect.js
 *
 * Decides where someone lands right after logging in, signing up, or
 * verifying their email. Every auth path calls goAfterAuth() instead of
 * hardcoding navigate('/dashboard').
 *
 * Why this exists: five separate places (email login, Google, Facebook,
 * email verification, complete-profile) all sent EVERYONE to /dashboard,
 * and relied on Dashboard.jsx bouncing brand-new users back to the
 * homepage. That bounce is a backstop, not a plan - it flashes the
 * dashboard first, and the verify-email screen even said "Redirecting to
 * dashboard...". Now new users go straight to the homepage.
 *
 * Rule: dashboard if the person has ordered something (dashboardUnlocked)
 * or has any seller status; homepage otherwise. A redirect saved by a page
 * that required login (e.g. a product they were about to order) always wins.
 *
 * Reads the cached user from localStorage - every auth path stores it
 * before navigating.
 */
export function goAfterAuth(navigate, savedRedirect) {
  if (savedRedirect) {
    navigate(savedRedirect)
    return
  }

  let user = {}
  try {
    user = JSON.parse(localStorage.getItem('utl_current_user') || '{}')
  } catch {
    // unreadable cache - treat as a plain new user
  }

  const hasSellerStatus = user.sellerStatus && user.sellerStatus !== 'none'
  if (user.dashboardUnlocked || hasSellerStatus) {
    navigate('/dashboard')
    return
  }

  navigate('/', {
    state: { message: "You're signed in. Browse U-Come and place your first order to unlock your dashboard." },
  })
}
