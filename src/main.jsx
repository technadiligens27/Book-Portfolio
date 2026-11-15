import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AnimationProvider } from './Contexts/AnimationContext.jsx'
import { ModelProvider } from './Contexts/ModelContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimationProvider>
      <ModelProvider>
          <App />
      </ModelProvider>
    </AnimationProvider>
  </StrictMode>,
)
