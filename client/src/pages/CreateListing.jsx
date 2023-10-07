import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase.config";

const CreateListing = () => {
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleImageSubmit = (e) => {

    if (files.length > 0 && files.length < 7 && formData.imageUrls.length < 7) {
      setUploading(true)
      setImageUploadError(false)
      const promises = []
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
        setImageUploadError(false)
        setUploading(false)
      }).catch((err) => {
        setImageUploadError('Image upload failed (2 mb max per image')
        setUploading(false)
      })
    }
    else {
      setImageUploadError('You can only upload 6 images per listing')
      setUploading(false)
    }
  }

  const handleRemoveImage = (i) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, index) => i !== index) })
  }


  const storeImage = async (file) => {
    return new Promise((res, rej) => {
      const storage = getStorage(app)
      // for unique filename
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      // uploading the image to firebase
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on("state_changed", (snapshot) => { },
        // checking for error if any
        (error) => reject(error),
        // getting the url of the uploaded image file
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => res(downloadUrl))
        }
      )
    })
  }

  return (
    <div className="bg-blue-50 w-screen pt-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-center py-3 text-blue-950">Create Listing</h1>
        {/* Yup formik validation for this form */}
        <form className='flex flex-col sm:flex-row gap-10 max-w-6xl mt-10  mx-auto'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
              type='text'
              placeholder='Name'
              className='border p-3 rounded-lg'
              id='name'
              maxLength='62'
              minLength='10'
              required
            // onChange={handleChange}
            // value={formData.name}
            />
            <textarea
              type='text'
              placeholder='Description'
              className='border p-3 rounded-lg'
              id='description'
              required
            // onChange={handleChange}
            // value={formData.description}
            />
            <input
              type='text'
              placeholder='Address'
              className='border p-3 rounded-lg'
              id='address'
              required
            // onChange={handleChange}
            // value={formData.address}
            />
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='sale'
                  className='w-5'
                  // onChange={handleChange}
                  checked={formData.type === 'sale'}
                />
                <span>Sell</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-5'
                  // onChange={handleChange}
                  checked={formData.type === 'rent'}
                />
                <span>Rent</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5'
                  // onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5'
                  // onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5'
                  // onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                // onChange={handleChange}
                // value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                // onChange={handleChange}
                // value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='regularPrice'
                  min='50'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                // onChange={handleChange}
                // value={formData.regularPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Regular price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
              {formData.offer && (
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    id='discountPrice'
                    min='0'
                    max='10000000'
                    required
                    className='p-3 border border-gray-300 rounded-lg'
                  // onChange={handleChange}
                  // value={formData.discountPrice}
                  />
                  <div className='flex flex-col items-center'>
                    <p>Discounted price</p>

                    {formData.type === 'rent' && (
                      <span className='text-xs'>($ / month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
              Images:
              <span className='font-normal text-gray-600 ml-2'>
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className='flex justify-between p-3 border items-center'
                >
                  <img
                    src={url}
                    alt='listing image'
                    className='w-20 h-20 object-contain rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => handleRemoveImage(index)}
                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              // disabled={loading || uploading}
              className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            >
              {/* {loading ? 'Creating...' : 'Create listing'} */}
            </button>
            {/* {error && <p className='text-red-700 text-sm'>{error}</p>} */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateListing