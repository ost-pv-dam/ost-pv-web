import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { auth } from './firebase.js'
import { allowedEmails } from './firebase.js'
import Sidebar from './components/Sidebar.js'
import { Layout, theme } from 'antd'
import Dashboard from './components/Dashboard.js'
import { Content } from 'antd/es/layout/layout.js'
const { Footer } = Layout

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

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout hasSider>
      <Sidebar user={user} />
      <Layout style={{ marginLeft: 75 }}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer
          }}
        >
          <Router>
            <Routes>
              <Route path="/" exact element={<Dashboard user={user} />} />
            </Routes>
          </Router>
        </Content>
        <Footer style={{ textAlign: 'center' }}>EECS 473 ost-pv-dam</Footer>
      </Layout>
    </Layout>
  )
}

export default App
