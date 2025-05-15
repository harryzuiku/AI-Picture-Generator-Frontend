import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ArtGenerationWebAppContainer from './components/ArtGenerator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <ArtGenerationWebAppContainer />
  </StrictMode>,
)
