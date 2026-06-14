import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PublishedPage } from './pages/PublishedPage.tsx'

const path = window.location.pathname;
const publishMatch = path.match(/^\/p\/([^/]+)/);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishMatch ? <PublishedPage siteId={publishMatch[1]} /> : <App />}
  </StrictMode>,
)
