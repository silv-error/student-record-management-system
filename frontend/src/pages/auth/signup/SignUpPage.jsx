import React from 'react'
import styles from "../../../styles/SignUp.module.css"
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { useEffect } from 'react';
import { useAuthContext } from '../../../context/authContext';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/LoadingSpinner';

const SignUpPage = () => {

  const { setAuthUser } = useAuthContext();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    gender: "",
    dateOfBirth: "",
    yearLevel: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        localStorage.setItem("student-record-user", JSON.stringify(data.user));
        setAuthUser(data.user);
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    return () => {
      setPasswordVisible(false);
    }
  }, []);

  return (
    <div className={`${styles.myBg} min-h-screen flex flex-col`}>
      {/* <!-- Header with logo --> */}
      <header className="w-full bg-white shadow-sm sticky top-0">
        <div className={`${styles.container} mx-auto flex justify-center`}>
          <img src="/logo.png" alt="Company Logo" className="logo-login h-20" />
        </div>
      </header>

      {/* <!-- Main content with registration form --> */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-4">
          <div className={`${styles.formContainer} rounded-2xl shadow-xl p-8 sm:p-10`}>
            <div>
              <h1 className={`${styles.formTitle}`}>Create Account</h1>

              {/* <!-- Registration Form --> */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* <!-- Name Section --> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="middleName"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Middle Name"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* <!-- Personal Info Section --> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <input
                      type="text"
                      name="email"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="contactNumber"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Contact Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <select
                      id="gender"
                      name="gender"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      defaultValue={""}
                      required
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-2'>
                  <label htmlFor="course" className="block text-white/80 text-sm font-medium">Course</label>
                  <input
                    type='text'
                    id='course'
                    name="course"
                    onChange={handleOnChange}
                    className={`${styles.formInput} w-full px-4 py-3 rounded-lg relative`}
                    placeholder="e.g, BSIT"
                    required
                  />
                </div>

                {/* <!-- Password Section --> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className='relative'>
                    <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">Password</label>
                    <div className="flex">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        onChange={handleOnChange}
                        className={`${styles.formInput} w-full px-4 py-3 rounded-lg relative`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (passwordVisible) {
                            setPasswordVisible(false);
                          } else {
                            setPasswordVisible(true);
                          }
                        }}
                        className=" rounded-r-lg px-4 flex items-center absolute right-0 translate-y-1/2"
                      >
                        {passwordVisible ? <Eye className='text-white' /> : <EyeClosed className='text-white' />}
                      </button>
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      Must be at least 8 characters
                    </div>
                  </div>
                  <div className='relative'>
                    <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
                    <div className="flex">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="confirmPassword"
                        onChange={handleOnChange}
                        className={`${styles.formInput} w-full px-4 py-3 rounded-lg relative`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (passwordVisible) {
                            setPasswordVisible(false);
                          } else {
                            setPasswordVisible(true);
                          }
                        }}
                        className="rounded-r-lg px-4 flex items-center absolute right-0 top-1/2 md:-translate-y-1/2"
                      >
                        {passwordVisible ? <Eye className='text-white' /> : <EyeClosed className='text-white' />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* <!-- Address Section --> */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <input
                      type="text"
                      name="street"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Street Address"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="City"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <input
                      type="text"
                      name="province"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Province"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="country"
                      onChange={handleOnChange}
                      className={`${styles.formInput} w-full px-4 py-3 rounded-lg`}
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>

                {/* <!-- Terms and Submit --> */}
                <div className="flex items-center">
                  <input
                    type="checkbox" id="terms"
                    name="terms"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-white/80">
                    I agree to the <a href="#" className="text-blue-300 hover:text-blue-200">Terms & Conditions</a>
                  </label>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                  {isPending ? <LoadingSpinner size={20}/> : "Register Now" }
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-white/70 text-sm">Already have an account? <Link to={"/login"} className="text-blue-300 hover:text-blue-200 font-medium">Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUpPage