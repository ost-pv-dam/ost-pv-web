import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import Home from './components/Home.js'
import { auth } from './firebase.js'
import { allowedEmails } from './firebase.js'

// Component imports
import Header from './components/Header.js'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser && allowedEmails.includes(authUser.email)) {
        // User is signed in and email is allowed
        setUser(authUser)
      } else {
        // User is signed out
        setUser(null)
      }
    })

    return () => {
      // Unsubscribe listener on component unmount
      unsubscribe()
    }
  }, [])

  return (
    <Router>
      <CssBaseline />
      <Header user={user} />

      <Container>
        <Routes>
          <Route path="/" exact element={<Home user={user} />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
