import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB5nPkv8svGCnbjEGcAvoyouAxs1D45dCc',
  authDomain: 'ost-pv-web.firebaseapp.com',
  projectId: 'ost-pv-web',
  storageBucket: 'ost-pv-web.appspot.com',
  messagingSenderId: '361069477067',
  appId: '1:361069477067:web:46d05e11afc1d942c86f4e'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
}
