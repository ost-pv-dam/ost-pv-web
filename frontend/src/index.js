import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App' // Import your main App component
import { StrictMode } from 'react'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
)
