import { StrictMode, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('React Error:', error, info)
    this.setState({ error: `${error.name}: ${error.message}\n\n${info.componentStack}` })
  }

  static getDerivedStateFromError(error: Error) {
    return { error: `${error.name}: ${error.message}` }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: '#0a0b0f',
          color: '#f0f2f8',
          padding: '40px',
          fontFamily: 'monospace',
          fontSize: '14px',
          minHeight: '100vh',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          <div style={{ color: '#f87171', fontSize: '20px', marginBottom: '16px' }}>
            ❌ Runtime Error
          </div>
          {this.state.error}
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="color:red;padding:40px;font-family:monospace">ERROR: No #root element found!</div>'
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
