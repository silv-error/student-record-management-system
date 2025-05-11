import React, { useEffect, useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react';
import { Link } from 'react-router-dom';

import styles from '../../../styles/Login.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../../context/authContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/LoadingSpinner';

const LoginPage = () => {
  
  const {setAuthUser} = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {mutate, isPending} = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();

        
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        localStorage.setItem("student-record-user", JSON.stringify(data.user || []));
        setAuthUser(data.user);
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Login successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value});
  }

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    return () => {
      setPasswordVisible(false);
    }
  }, [])

  return (
    <div className={`${styles.myBg} min-h-screen flex flex-col`}>

      {/* <!-- Header with logo --> */}
      <header className="w-full bg-white shadow-sm">
        <div className="">
          <img src="/logo.png" alt="Company Logo" className="logo-login h-20" />
        </div>
      </header>

      {/* <!-- Main content with login form --> */}
      <main className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md mx-4">
          <div className={`${styles.formContainer} rounded-2xl shadow-xl p-8 sm:p-10`}>
            <div>
              <h1 className={`${styles.formTitle}`}>Login</h1>

              {/* <!-- Login Form --> */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    onChange={handleOnChange}
                    className={`${styles.formInput} w-full px-4 py-3 rounded-lg`} 
                    placeholder="Email Address" 
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <div className="flex relative">
                    <input 
                      type={passwordVisible ? "text" : "password"} 
                      name="password"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`} 
                      placeholder="••••••••" 
                      required
                    />
                    <button
                      type="button"
                      className="rounded-r-lg px-4 flex items-center absolute right-0 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        if(passwordVisible) {
                          setPasswordVisible(false);
                        } else {
                          setPasswordVisible(true);
                        }
                      }}
                    >
                      {passwordVisible ? <Eye className='text-white'/> : <EyeClosed className='text-white'/>}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <a href="#ForDemo" className="form-link">Forgot password?</a>
                  </div>
                </div>

                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isPending ? (
                    <div className='flex items-center justify-center'>
                      <LoadingSpinner size={"20"} />
                    </div>
                  ) : "Log In"}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-white/70 text-sm">Don't have an account? 
                  <Link 
                    to={"/signup"} 
                    className={`${styles.formLink} font-medium`}
                  >
                    {` Sign Up`}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage