import { useEffect, useRef } from 'react'
import EditProfile from './EditProfile'
import styles from "../../styles/Profile.module.css"
import { useState } from 'react'
import { useAuthContext } from '../../context/authContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import useUpdateProfile from '../../hooks/useUpdateProfile'
import { formattedBirthDate } from '../utils/date'
import { Pencil } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toTitleFormat } from '../utils/text'

const ProfilePage = () => {

  const [editMode, setEditMode] = useState(true);

  const [profileImg, setProfileImg] = useState(null);
  const imgRef = useRef(null);
  const { mutateAsync, isPending } = useUpdateProfile();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const newProfileImg = reader.result;
        setProfileImg(newProfileImg);
        await mutateAsync({ profileImg: newProfileImg });
        setProfileImg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      setEditMode(false);
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    email: "",
    dateOfBirth: "",
    contactNumber: "",
    street: "",
    province: "",
    city: "",
    postalCode: "",
    country: "",
    course: "",
    yearLevel: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateAsync(formData);
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const { id } = useParams();
  const { data: profile, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data.user;
      } catch (error) {
        throw new Error(error);
      }
    }
  });
  
  useEffect(() => {
    refetch();
  }, [id, refetch])

  const { authUser } = useAuthContext();
  const myProfile = authUser?._id === id;

  if (isLoading || isRefetching) {
    return (
      <div className='relative inset-0 h-full flex justify-center items-center'>
        <LoadingSpinner size={50} />
      </div>
    )
  }

  return (
    <>
      {/* <!-- Right content area --> */}
      <div className="w-full md:w-1000 p-0 m-0 bg-gray-400 flex flex-col justify-start items-center overflow-y-auto">
        {/* <!-- Profile Section (shown by default) --> */}
        <div id="profileContent" className={`${styles.profileSection} w-full m-0 p-0`}>
          {/* <!-- Profile Header with Cover Image --> */}
          <div className={`w-full relative ${styles.coverImageContainer} bg-cover bg-no-repeat bg-center h-[480px]`}>
            {/* <!-- Profile Picture centered on cover --> */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
              <div className='relative group'>
                {myProfile && (
                  <div
                    className='absolute w-full h-full rounded-full bg-black opacity-0 group-hover:opacity-35'
                    onClick={() => imgRef.current.click()}
                  />
                )}
                <img
                  src={profileImg || profile?.profileImg || "https://avatar.iran.liara.run/public/30"}
                  alt="Profile Picture"
                  className={`border-4 border-white ${styles.profilePicc} rounded-full object-cover size-40 bg-gray-900`}
                />
                {myProfile && (
                  <Pencil size={30} className='absolute hidden group-hover:block top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white' />
                )}
              </div>

              <input ref={imgRef} type='file' accept='image/*' onChange={handleImageChange} hidden />
              <h2 className="text-white text-2xl font-bold mt-2 mb-2 text-center">
                {toTitleFormat(`${profile?.firstName} ${profile?.middleName} ${profile?.lastName}`)}
              </h2>
              <p className='font-medium text-yellow-500'>{profile?.role} </p>
              <p className="text-blue-300 mb-10 text-center">{toTitleFormat(profile?.course)}</p>
            </div>
          </div>
          {/* <!-- Personal Information Section with Edit --> */}
          <div className={`${styles.persosec} bg-white shadow-md space-x-2 h-fit relative`}>
            {/* <!-- Header with "Personal Information" title and Edit/Cancel buttons --> */}
            <div className={`${styles.profconte} flex flex-col md:flex-row bg-gray-100 shadow-md px-4 py-2`}>
              <div className="flex gap-4 space-x-2 items-center relative -translate-x-1/2 left-1/2">
                <button
                  onClick={() => setEditMode(false)}
                  className={`${!editMode && "border-b-2 border-blue-600"} text-xl font-semibold text-gray-800 px-4 py-2 mb-2 md:mb-0`}
                >
                  <span id={styles.personalInfoText} className="active-underline">Personal Info</span>
                </button>
                {myProfile && (
                  <button
                    onClick={() => setEditMode(true)}
                    className={`${editMode && "border-b-2 border-blue-600"} text-xl font-semibold text-gray-800 px-4 py-2`}
                  >
                    Edit
                  </button>
                )}
              </div>
              {(editMode || profileImg) && (
                <div className="flex ml-auto space-x-4 right-0 relative">
                  {(
                    <button
                      type="button" id="saveBtn"
                      onClick={handleSubmit}
                      className=" bg-blue-600 hover:bg-blue-700 w-40 text-white font-medium py-2 px-6 rounded-lg"
                    >
                      {(isPending && authUser) ? (
                        <>
                          <div className='flex justify-center items-center gap-2'>
                            <LoadingSpinner size={20} /> {`Loading`}
                          </div>
                        </>
                      ) : "Save Changes"}
                    </button>
                  )}
                </div>
              )}
            </div>
            {!editMode && (
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mt-5 mb-5 px-4 md:px-10 py-1">
                  Personal Info
                </h2>
              </div>
            )}
            {/* <!-- View Mode --> */}
            {!editMode ? (
              <div id="viewMode" className={`${styles.viewMode} px-4 md:px-10 pt-10 md:pt-20 w-full relative `}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Gender</p>
                        <p className="text-gray-800 text-lg">{profile?.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Date of Birth</p>
                        <p className="text-gray-800 text-lg">{formattedBirthDate(profile?.dateOfBirth)} </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-gray-800 text-lg">{profile?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Student ID</p>
                        <p className="text-gray-800 text-lg">{profile?._id}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p className="text-gray-800 text-lg">{profile?.contactNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-gray-500 text-sm">Address</p>
                        <p className="text-gray-800 text-lg">{profile?.address?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : <EditProfile formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handleOnChange={handleOnChange} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage