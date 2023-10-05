import React from 'react'
import { Button } from '@mui/material'
import { signInWithGoogle } from '../firebase'

function AuthButton() {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={signInWithGoogle}>
        Sign In with Google
      </Button>
    </div>
  )
}

export default AuthButton
