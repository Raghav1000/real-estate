import { useState } from "react"
import { signUpFormData } from "../utils/helper"
import { useNavigate } from "react-router-dom"

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(null)
  const navigate = useNavigate()

  const commonInputCss = "w-1/4 border border-gray-200 py-3 indent-3 rounded-md"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data  = await res.json()
    if(data.success === false) {
      setError(data.errorMessage)
      setLoading(false)
      return;
    }
    setLoading(false)
    setError(null)
    navigate('/')
  }

  return (
    <div className="bg-blue-50 w-screen h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center py-20 text-blue-950">SIGN UP</h1>
        {/* Yup formik validation for this form */}
        <form onSubmit={handleSubmit} className="flex flex-col place-items-center gap-6">
        {
           signUpFormData.map(({type,placeholder,id})=>(
            <input key={id} type={type} placeholder={placeholder} id={id}
             onChange={handleChange} className={commonInputCss} />
          ))
        }
          <button disabled={loading} type="submit" className="w-1/4 rounded-md bg-blue-900 py-3 text-white">
            {loading ? 'Loading' : 'Sign up'}
          </button>
          {error && <span className="text-red-500">{error}</span>}
          <button onClick={() =>navigate('/sign-in')} type="button" className="w-1/4 rounded-md border border-blue-900 py-3 text-blue-900">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp