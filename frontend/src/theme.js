// Create a theme instance
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    h1: {
      fontSize: '4rem'
    },
    h2: {
      fontSize: '2.5rem'
    },
    h3: {
      fontSize: '1.875rem'
    },
    h4: {
      fontSize: '1.25rem'
    },
    h5: {
      fontSize: '1rem'
    },
    h6: {
      fontSize: '0.875rem'
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    }
  },
  palette: {
    primary: {
      main: '#1565c0'
    },
    secondary: {
      main: '#fbc02d'
    }
  }
})

export default theme
