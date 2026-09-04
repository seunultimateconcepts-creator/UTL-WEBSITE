import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * ErrorBoundary
 *
 * ✅ Wraps the whole app (in App.jsx or main.jsx). Without this, ANY
 * uncaught error during render — a bad prop, an extension interfering,
 * a stale-file mismatch — unmounts the entire React tree and leaves a
 * blank white page with zero indication anything went wrong, exactly
 * what happened on /admin. This catches it and shows something
 * recoverable instead.
 *
 * Usage in App.jsx:
 *   <ErrorBoundary>
 *     <YourAppContent />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // ✅ Logged to console so DevTools still shows the real error for
    // debugging — this doesn't hide anything, it just stops the blank
    // white screen on top of it.
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h1 className="text-gray-900 font-black text-lg mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-6">
              This page hit an unexpected error. Try an incognito window if this keeps
              happening — a browser extension may be interfering.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors"
            >
              <RefreshCw size={15} /> Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary