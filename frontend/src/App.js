import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { auth } from './firebase.js'
import { users } from './firebase.js'
import Sidebar from './components/Sidebar.js'
import { Layout, theme, ConfigProvider } from 'antd'
import Dashboard from './components/Dashboard.js'
import { Content } from 'antd/es/layout/layout.js'
const { Footer } = Layout

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser && users.includes(authUser.email)) {
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

  const { defaultAlgorithm } = theme
  return (
    <ConfigProvider theme={{ algorithm: defaultAlgorithm }}>
      <Layout
        hasSider={true}
        style={{
          marginLeft: 75,
          marginTop: -20,
          marginRight: -10,
          minHeight: '100vh'
        }}
      >
        <Sidebar user={user} />
        <Layout style={{}}>
          <Content
            style={{
              margin: '24px 8px',
              padding: 24
            }}
          >
            <Router>
              <Routes>
                <Route path="/" exact element={<Dashboard user={user} />} />
              </Routes>
            </Router>
          </Content>
          <Footer
            style={{ textAlign: 'center', marginBottom: -10, marginTop: -10 }}
          >
            2023 University of Michigan · EECS 473 ost-pv-dam
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
