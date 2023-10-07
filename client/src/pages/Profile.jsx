import { useDispatch, useSelector } from "react-redux"
import { getDefaultValue, signUpFormData } from "../utils/helper"
import { useRef, useState, useEffect } from "react"
import { app } from "../firebase.config"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [file, setFile] = useState()
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState()
  const [formData, setFormData] = useState()
  const [updateSuccessfulMessage, setUpdateSuccesfulMessage] = useState(false)
  const fileRef = useRef()
  const { currentUser, error, loading } = useSelector((state => state.user))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const commonInputCss = "w-1/4 border border-gray-200 py-3 indent-3 rounded-md"


  const handleFileUpload = () => {
    const storage = getStorage(app)
    // for unique filename
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    // uploading the image to firebase
    const uploadTask = uploadBytesResumable(storageRef, file)

    // tracking the progress of upload
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFileUploadPercentage(progress)
    },
      // checking for error if any
      (error) => setFileUploadError(error),
      // getting the url of the uploaded image file
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => setFormData({ ...formData, avatar: downloadUrl }))
      }
    )
  }

  useEffect(() => {
    if (file) handleFileUpload(file)
  }, [file])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.errorMessage))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccesfulMessage(true)
    } catch (err) {
      dispatch(updateUserFailure(err.message))
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
        })
      const data = res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.errorMessage))
        return;
      }
      dispatch(deleteUserSuccess(data))

    } catch (err) {
      dispatch(deleteUserFailure(err.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch("/api/auth/signout")
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.errorMessage))
        return;
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  return (
    <div className="bg-blue-50 w-screen h-[calc(100vh-74px)]">
      <h1 className="text-3xl font-bold text-center py-5 text-blue-950">PROFILE</h1>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type='file'
        ref={fileRef}
        hidden accept='image/*' />
      <img onClick={() => fileRef.current.click()}
        src={formData?.avatar || currentUser?.avatar}
        alt={`${currentUser?.username}'s profile`}
        className="w-20 h-20 border mx-auto border-gray-300 rounded-full bg-blue-400" />
      {
        fileUploadError && <p className="text-center pt-1  text-red-500">Error uploading image </p>
      }
      {
        fileUploadPercentage > 0 && fileUploadPercentage < 100 &&
        <p className="text-center text-green-500">{Math.round(fileUploadPercentage) + "%"}</p>
      }
      {/* Yup formik validation for this form */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col place-items-center gap-6">
        {
          signUpFormData.map(({ type, placeholder, id }) => (
            <input key={id} type={type} defaultValue={getDefaultValue(id, currentUser)} placeholder={placeholder} id={id}
              onChange={handleChange} className={commonInputCss} />
          ))
        }
        <button disabled={loading} type="submit" className="w-1/4 rounded-md bg-blue-900 py-3 text-white">
          {loading ? 'Loading' : 'Update'}
        </button>
        {updateSuccessfulMessage && <span className="text-green-500">Updated Successfully</span>}
        <div className="w-1/4 flex gap-3 justify-between">
          <button type="button" onClick={() => navigate('/create-listing')}className="flex-1 rounded-md bg-green-900 py-3 text-white">
            Create Listing
          </button>
          <button type="button" onClick={() => navigate('/create-listing')} className="flex-1 rounded-md bg-green-900 py-3 text-white">
            Show Listings
          </button>
        </div>
        <div className="w-1/4 flex justify-between">
          <button type="button" onClick={handleDelete} className="text-red-500">
            Delete account
          </button>
          <button onClick={handleSignOut} type="button" className="text-red-500">
            Sign out
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile