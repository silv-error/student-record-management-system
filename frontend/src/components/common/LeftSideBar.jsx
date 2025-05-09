import { Book, Settings, User } from "lucide-react"
import styles from "../../styles/Profile.module.css"

import { Link, useLocation } from "react-router-dom"
import { useAuthContext } from "../../context/authContext"

const LeftSideBar = () => {

  const {authUser} = useAuthContext();
  const location = useLocation();

  return (
    <div className="p-0 m-0 bg-[#102E50] flex flex-col justify-start items-center">
      <div className={`${styles.formCotainer} shadow-xl p-6 w-full h-full`}>
        <div className="flex flex-col items-center">
          <img src={authUser?.profileImg} sizes={8} alt="Profile Picture" className={`${styles.profilePic} rounded-full mb-4 object-cover`} />
          <h2 className="text-white text-lg font-bold text-center">{authUser.firstName} {authUser.middleName} {authUser.lastName}</h2>
          <p className="text-blue-300 mb-6 text-center">{authUser.course} - {authUser.yearLevel}</p>
          <div className="w-full space-y-2">
            <Link 
              to={"/profile"}  
              className={`${location.pathname === "/profile" && "border-l-2 border-blue-500 bg-blue-500 bg-opacity-25"} 
              gap-2 active w-full text-white py-3 px-4 rounded-lg text-left flex items-center transition-all duration-200
              hover:bg-blue-500 hover:bg-opacity-25`}
            >
              <User /> Profile
            </Link>
            <Link 
              to={"/"} 
              id={styles.coursesBtn} 
              className={`${location.pathname === "/" && "border-l-2 border-blue-500 bg-blue-500 bg-opacity-25"} 
              gap-2 w-full text-white py-3 px-4 rounded-lg text-left flex items-center transition-all duration-200
              hover:bg-blue-500 hover:bg-opacity-25`}
            >
              <Book /> Subjects
            </Link>
            <Link 
              to={"/settings"} 
              id={styles.settingsBtn} 
              className={`${location.pathname === "/settings" && "border-l-2 border-blue-500 bg-blue-500 bg-opacity-25"}
              gap-2 w-full text-white py-3 px-4 rounded-lg text-left flex items-center transition-all duration-200
              hover:bg-blue-500 hover:bg-opacity-25`}
            >
              <Settings />  {`Settings`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar