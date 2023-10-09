import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // Import your main App component
import { StrictMode } from 'react'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
