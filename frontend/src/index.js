import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // Import your main App component
import { StrictMode } from 'react'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
document.body.style.backgroundColor = '#f5f5f5'

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
