import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useAuthContext } from '../../context/authContext'

const DashboardPage = () => {

  const {setAuthUser} = useAuthContext();

  const {mutate, isPending, isError, error} = useMutation({
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
      } catch (error) {
        throw new Error(error);
      }
    }
  })
  return (
    <div>
      DashboardPage
      <button 
        className='btn'
        onClick={() => mutate()}
      >Logout</button>
    </div>
  )
}

export default DashboardPage