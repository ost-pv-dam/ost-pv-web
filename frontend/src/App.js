import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { auth } from './firebase.js'
import Sidebar from './components/Sidebar.js'
import { Layout, theme, ConfigProvider } from 'antd'
import Dashboard from './components/Dashboard.js'
import { Content } from 'antd/es/layout/layout.js'
import instance from './api.js'

const { Footer } = Layout

function App() {
  const [user, setUser] = useState(null)

  // Check for valid user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          // User is signed in, check authorization
          const isAuthorized = await await instance.get(
            '/api/v1/users/isAuthorized/' + authUser.email
          )
          setUser(isAuthorized.data ? authUser : 'unauthorized')
        } else {
          // User is signed out
          setUser('signed_out')
        }
      } catch (error) {
        console.error(error)
      }
    })

    return () => {
      // Unsubscribe listener on component unmount
      unsubscribe()
    }
  }, [])

  const { defaultAlgorithm } = theme
  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm
      }}
    >
      <Layout
        hasSider
        style={{
          marginLeft: 70,
          marginTop: -20,
          marginRight: -10,
          minHeight: '100vh'
        }}
      >
        <Sidebar user={user} />
        <Layout>
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
            2023 University of Michigan · EECS 473 st-opv-dam
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
