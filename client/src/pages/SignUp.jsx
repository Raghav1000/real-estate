import { useState } from "react"
import { signUpFormData } from "../utils/helper"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/user/userSlice"
import GoogleAuth from "../components/GoogleAuth"

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const { error, loading } = useSelector(state => state.user)
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
    dispatch(signUpStart())
    const res = await fetch('api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    if (data.success === false) {
      dispatch(signUpFailure(data.errorMessage))
      return;
    }
    dispatch(signUpSuccess())
    navigate('/sign-in')
  }

  return (
    <div className="bg-blue-50 w-screen h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center py-20 text-blue-950">SIGN UP</h1>
        {/* Yup formik validation for this form */}
        <form onSubmit={handleSubmit} className="flex flex-col place-items-center gap-6">
          {
            signUpFormData.map(({ type, placeholder, id }) => (
              <input key={id} type={type} placeholder={placeholder} id={id}
                onChange={handleChange} className={commonInputCss} />
            ))
          }
          <button disabled={loading} type="submit" className="w-1/4 rounded-md bg-blue-900 py-3 text-white">
            {loading ? 'Loading' : 'Sign up'}
          </button>
          {error && <span className="text-red-500">{error}</span>}
          <GoogleAuth />
          <button onClick={() => navigate('/sign-in')} type="button" className="w-1/4 rounded-md border border-blue-900 py-3 text-blue-900 mt-10">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp