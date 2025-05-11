import React, { useState } from 'react'
import styles from "../../styles/Profile.module.css"
import { Eye, EyeClosed } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../context/authContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {

  const {setAuthUser} = useAuthContext();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {mutate:logout, isPending:isPendingLogout} = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        localStorage.removeItem("student-record-user");
        setAuthUser(null);

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const {mutateAsync:changePassword, isPending:isPendingChangePassword} = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/change-password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();

        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await changePassword();
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return (
    <>
      <div id="settingsContent" className="hidden-section w-full p-4 md:p-6" style={{backgroundImage: "/bg_login.jpg"}}>
        <div className="max-w-7x1 mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Account Settings</h2>
          <div className="bg-gray-100 rounded-lg p-4 md:p-6 max-w-2xl mx-auto">
            <h3 className="text-blue-600 font-medium mb-4">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Current Password</label>
                <div className="flex">
                  <input 
                    type={passwordVisible ? "text" : "password"}
                    name='oldPassword'
                    onChange={handleOnChange}
                    value={formData.oldPassword}
                    className="form-input w-full px-4 py-2 rounded-l-lg border border-gray-300" 
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if(passwordVisible) {
                        setPasswordVisible(false);
                      } else {
                        setPasswordVisible(true);
                      }
                    }}  
                    className="togglePassword rounded-r-lg px-3 flex items-center bg-gray-200 border border-l-0 border-gray-300"
                  >
                    {passwordVisible ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">New Password</label>
                <div className="flex">
                  <input 
                    type={passwordVisible ? "text" : "password"}
                    name='newPassword'
                    onChange={handleOnChange}
                    value={formData.newPassword}
                    className="togglePassword form-input w-full px-4 py-2 border border-gray-300 rounded-l-lg" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if(passwordVisible) {
                        setPasswordVisible(false);
                      } else {
                        setPasswordVisible(true);
                      }
                    }}  
                    className="togglePassword rounded-r-lg px-3 flex items-center bg-gray-200 border border-l-0 border-gray-300"
                  >
                    {passwordVisible ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Confirm New Password</label>
                <div className="flex">
                  <input 
                    type={passwordVisible ? "text" : "password"}
                    name='confirmPassword'
                    onChange={handleOnChange}
                    value={formData.confirmPassword}
                    className="togglePassword form-input w-full px-4 py-2 border border-gray-300 rounded-l-lg" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if(passwordVisible) {
                        setPasswordVisible(false);
                      } else {
                        setPasswordVisible(true);
                      }
                    }} 
                    className="togglePassword rounded-r-lg px-3 flex items-center bg-gray-200 border border-l-0 border-gray-300"
                  >
                    {passwordVisible ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg mt-4 w-48"
              >
                {isPendingChangePassword ? (
                  <>
                    <div className='flex gap-2 items-center justify-center'>
                      <LoadingSpinner size={20}/>
                      {`Updating`}
                    </div>
                  </>
                ) : "Update Password"}
              </button>
            </form>
            <div className="border-t border-gray-300 flex justify-center mt-8 pt-6">
              <button 
                id="logoutBtn"
                onClick={() => logout()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                {isPendingLogout ? (
                  <div className='flex items-center justify-center'>
                    <LoadingSpinner size={20}/>
                  </div>
                ) : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings