import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import AuthButton from './AuthButton'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

function Header({ user }) {
  return (
    <AppBar position="static" className={'appBar'}>
      <Toolbar>
        <Typography variant="h4" className={'title'}>
          ost-pv-web
        </Typography>
        {user ? (
          <div>
            <Typography
              variant="body1"
              color="inherit"
              style={{ marginRight: '16px' }}
            >
              Welcome, {user.displayName.split(' ')[0]}!
            </Typography>
            <Button color="inherit" onClick={() => signOut(auth)}>
              Sign Out
            </Button>
          </div>
        ) : (
          <AuthButton />
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
