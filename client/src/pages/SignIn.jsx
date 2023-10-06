import { useNavigate } from "react-router-dom"
import { signInFormData } from "../utils/helper"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice"
import GoogleAuth from "../components/GoogleAuth"

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const { error, loading } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const commonInputCss = "w-1/4 border border-gray-200 py-3 indent-3 rounded-md"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStart())
    const res = await fetch('api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    if (data.success === false) {
      dispatch(signInFailure(data.errorMessage))
      return;
    }
    dispatch(signInSuccess(data))
    navigate('/')
  }

  return (
    <div className="bg-blue-50 w-screen h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center py-20 text-blue-950">SIGN IN</h1>
        {/* Yup formik validation for this form */}
        <form onSubmit={handleSubmit} className="flex flex-col place-items-center gap-6">
          {
            signInFormData.map(({ type, placeholder, id }) => (
              <input key={id} type={type} placeholder={placeholder} id={id}
                onChange={handleChange} className={commonInputCss} />
            ))
          }
          <button disabled={loading} type="submit" className="w-1/4 rounded-md bg-blue-900 py-3 text-white">
            {loading ? 'Loading' : 'Sign in'}
          </button>
          <GoogleAuth />
          {error && <span className="text-red-500">{error}</span>}
          <button onClick={() => navigate('/sign-up')} type="button" className="w-1/4 rounded-md border border-blue-900 py-3 text-blue-900 mt-10">
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn