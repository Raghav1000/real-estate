import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.config'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice'

const GoogleAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const { displayName, email, photo } = result.user
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: displayName, email, photo })
            })
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log('Could not login with google', error)
        }
    }

    return (
        <button onClick={handleClick} type="button" className="w-1/4 rounded-md py-3 bg-[#DB4437] text-white">
            Google
        </button>
    )
}

export default GoogleAuth