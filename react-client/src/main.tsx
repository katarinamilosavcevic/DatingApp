import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './app/AuthContext.tsx'
import { PresenceProvider } from './app/PresenceContext.tsx'
import { ErrorBoundary } from './app/ErrorBoundary.tsx'


createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AuthProvider>
      <PresenceProvider>
        <App />
      </PresenceProvider>
    </AuthProvider>
  </ErrorBoundary>
)
